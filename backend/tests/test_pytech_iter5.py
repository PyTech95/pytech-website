"""PyTech Digital iteration 5 API regression + feature tests.

Modules covered:
- Admin auth and CMS CRUD (posts, services, cases)
- Project service-tag enforcement and filtering
- Media upload/serve validation
- Public redirects/sitemap/resource visibility checks
"""

import base64
import os
import re
import uuid

import pytest
import requests


def _read_env_value(path: str, key: str) -> str:
    if not os.path.exists(path):
        return ""
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            if k.strip() == key:
                return v.strip().strip('"').strip("'")
    return ""


BASE_URL = _read_env_value("/app/frontend/.env", "REACT_APP_BACKEND_URL").rstrip("/")
ADMIN_PASSWORD = _read_env_value("/app/frontend/.env.local", "ADMIN_PASSWORD")


@pytest.fixture(scope="session")
def api_client():
    assert BASE_URL, "Missing REACT_APP_BACKEND_URL in /app/frontend/.env"
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="session")
def admin_key(api_client):
    if not ADMIN_PASSWORD:
        pytest.skip("ADMIN_PASSWORD missing in /app/frontend/.env.local")
    r = api_client.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return ADMIN_PASSWORD


@pytest.fixture(scope="session")
def admin_headers(admin_key):
    return {"x-admin-key": admin_key, "Content-Type": "application/json"}


@pytest.fixture(scope="session")
def created_items():
    return {
        "posts": [],
        "services": [],
        "cases": [],
        "projects": [],
        "offerings": [],
        "media_ids": [],
    }


@pytest.fixture(scope="session", autouse=True)
def cleanup(admin_headers, api_client, created_items):
    yield
    for proj_id in created_items["projects"]:
        api_client.delete(f"{BASE_URL}/api/projects?id={proj_id}", headers=admin_headers)
    for typ in ["posts", "cases", "services"]:
        for item_id in created_items[typ]:
            api_client.delete(f"{BASE_URL}/api/cms/{typ}?id={item_id}", headers=admin_headers)
    for off_id in created_items["offerings"]:
        api_client.delete(f"{BASE_URL}/api/offerings?id={off_id}", headers=admin_headers)
    # Soft-delete test media metadata only (no storage delete endpoint available).
    for media_id in created_items["media_ids"]:
        try:
            # no direct API delete; keep as tracked context only
            _ = media_id
        except Exception:
            pass


def _must_json(resp):
    try:
        return resp.json()
    except Exception:
        pytest.fail(f"Non-JSON response: {resp.status_code} {resp.text[:500]}")


class TestAdminAuthAndRegressionRoutes:
    """Admin auth and core route regression checks."""

    def test_admin_login_success_and_failure(self, api_client):
        ok = api_client.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        assert ok.status_code == 200
        assert _must_json(ok).get("ok") is True

        bad = api_client.post(f"{BASE_URL}/api/admin/login", json={"password": "wrong-pass"})
        assert bad.status_code == 401
        assert "Invalid password" in _must_json(bad).get("error", "")

    @pytest.mark.parametrize(
        "path",
        ["/", "/pricing", "/careers", "/work", "/services", "/case-studies", "/blog", "/locations", "/sitemap.xml", "/llms.txt", "/admin"],
    )
    def test_public_pages_respond(self, api_client, path):
        r = api_client.get(f"{BASE_URL}{path}")
        assert r.status_code == 200, f"{path} returned {r.status_code}"

    def test_resources_redirects_are_permanent(self, api_client):
        r1 = api_client.get(f"{BASE_URL}/resources", allow_redirects=False)
        assert r1.status_code in (301, 308)
        assert r1.headers.get("location", "").endswith("/blog")

        r2 = api_client.get(
            f"{BASE_URL}/resources/choosing-the-right-tech-stack",
            allow_redirects=False,
        )
        assert r2.status_code in (301, 308)
        assert "/blog/choosing-the-right-tech-stack" in r2.headers.get("location", "")


class TestCmsPostsAndSanitization:
    """Blog/news CRUD, publish state, sanitization, SEO metadata visibility."""

    def test_post_create_draft_publish_unpublish_flow(self, api_client, admin_headers, created_items):
        slug = f"test-cms5-post-{uuid.uuid4().hex[:8]}"
        raw_html = (
            "<h2>Intro</h2><p><strong>Bold</strong></p><ul><li>Item</li></ul>"
            "<script>alert('x')</script>"
            "<img src='https://example.com/p.png' onerror='alert(1)'/>"
            "<a href='javascript:alert(1)'>bad</a>"
            "<a href='https://example.com'>good</a>"
        )

        draft_payload = {
            "slug": slug,
            "status": "draft",
            "pillar": "build",
            "kind": "blog",
            "author": "TEST_CMS5",
            "title": f"TEST_CMS5 Post {slug}",
            "excerpt": "TEST_CMS5 excerpt",
            "body": raw_html,
            "image": "",
            "imageAlt": "",
            "seoTitle": "TEST_CMS5 SEO TITLE",
            "seoDescription": "TEST_CMS5 SEO Description",
            "keywords": "test,cms5",
        }
        create = api_client.post(f"{BASE_URL}/api/cms/posts", headers=admin_headers, json=draft_payload)
        assert create.status_code == 201, create.text
        item = _must_json(create)["item"]
        created_items["posts"].append(item["id"])
        assert item["slug"] == slug
        assert item["status"] == "draft"

        public_list = api_client.get(f"{BASE_URL}/api/cms/posts")
        assert public_list.status_code == 200
        assert slug not in [x["slug"] for x in _must_json(public_list).get("items", [])]

        admin_list = api_client.get(f"{BASE_URL}/api/cms/posts?admin=1", headers=admin_headers)
        assert admin_list.status_code == 200
        admin_item = next((x for x in _must_json(admin_list)["items"] if x["id"] == item["id"]), None)
        assert admin_item is not None

        publish_payload = {**admin_item, "status": "published"}
        pub = api_client.put(f"{BASE_URL}/api/cms/posts", headers=admin_headers, json=publish_payload)
        assert pub.status_code == 200, pub.text
        assert _must_json(pub)["item"]["status"] == "published"

        detail = api_client.get(f"{BASE_URL}/blog/{slug}")
        assert detail.status_code == 200
        html = detail.text
        # Next.js legitimately includes hydration and JSON-LD scripts outside article content.
        body_match = re.search(r'<div data-testid="article-body"[^>]*>(.*?)</div>', html, re.S)
        assert body_match, 'Article body missing'
        article_body = body_match.group(1)
        assert "<script" not in article_body.lower()
        assert "onerror=" not in article_body.lower()
        assert "javascript:alert" not in article_body.lower()
        assert "<strong>Bold</strong>" in html

        assert "rel=\"canonical\"" in html
        assert 'property="og:type" content="article"' in html or '"@type":"BlogPosting"' in html or '"@type":"NewsArticle"' in html

        dup = api_client.post(f"{BASE_URL}/api/cms/posts", headers=admin_headers, json=draft_payload)
        assert dup.status_code == 409
        assert "already" in _must_json(dup).get("error", "").lower()

        bad_slug_update = {**_must_json(pub)["item"], "slug": f"{slug}-new"}
        imm = api_client.put(f"{BASE_URL}/api/cms/posts", headers=admin_headers, json=bad_slug_update)
        assert imm.status_code == 400
        assert "cannot be changed" in _must_json(imm).get("error", "").lower()

        to_draft = {**_must_json(pub)["item"], "status": "draft"}
        down = api_client.put(f"{BASE_URL}/api/cms/posts", headers=admin_headers, json=to_draft)
        assert down.status_code == 200

        public_after = api_client.get(f"{BASE_URL}/api/cms/posts")
        assert public_after.status_code == 200
        assert slug not in [x["slug"] for x in _must_json(public_after).get("items", [])]

        sitemap = api_client.get(f"{BASE_URL}/sitemap.xml")
        assert sitemap.status_code == 200
        assert f"/blog/{slug}" not in sitemap.text


class TestServicesProjectsAndCases:
    """Service CRUD, project validation/filtering, and case-study publishing behavior."""

    def test_service_publish_project_rules_and_case_visibility(self, api_client, admin_headers, created_items):
        service_a_slug = f"test-cms5-svc-a-{uuid.uuid4().hex[:6]}"
        service_b_slug = f"test-cms5-svc-b-{uuid.uuid4().hex[:6]}"
        draft_service_slug = f"test-cms5-svc-d-{uuid.uuid4().hex[:6]}"

        def make_service_payload(slug, name, status="published"):
            return {
                "slug": slug,
                "status": status,
                "pillar": "build",
                "name": name,
                "tagline": "TEST tagline",
                "summary": "TEST summary",
                "icon": "Globe",
                "features": "Feature 1\nFeature 2",
                "outcomes": "Outcome 1\nOutcome 2",
                "image": "",
                "imageAlt": "",
                "seoTitle": "",
                "seoDescription": "",
                "keywords": "",
            }

        svc_a = api_client.post(f"{BASE_URL}/api/cms/services", headers=admin_headers, json=make_service_payload(service_a_slug, "TEST_CMS5 Service A"))
        assert svc_a.status_code == 201, svc_a.text
        item_a = _must_json(svc_a)["item"]
        created_items["services"].append(item_a["id"])

        svc_b = api_client.post(f"{BASE_URL}/api/cms/services", headers=admin_headers, json=make_service_payload(service_b_slug, "TEST_CMS5 Service B"))
        assert svc_b.status_code == 201, svc_b.text
        item_b = _must_json(svc_b)["item"]
        created_items["services"].append(item_b["id"])

        svc_d = api_client.post(f"{BASE_URL}/api/cms/services", headers=admin_headers, json=make_service_payload(draft_service_slug, "TEST_CMS5 Draft Service", status="draft"))
        assert svc_d.status_code == 201, svc_d.text
        item_d = _must_json(svc_d)["item"]
        created_items["services"].append(item_d["id"])

        pub_services = api_client.get(f"{BASE_URL}/api/services")
        assert pub_services.status_code == 200
        pub_slugs = [s["slug"] for s in _must_json(pub_services).get("services", [])]
        assert service_a_slug in pub_slugs and service_b_slug in pub_slugs
        assert draft_service_slug not in pub_slugs

        svc_page = api_client.get(f"{BASE_URL}/services/{service_a_slug}")
        assert svc_page.status_code == 200
        loc_page = api_client.get(f"{BASE_URL}/services/{service_a_slug}/gurugram")
        assert loc_page.status_code == 200

        bad_missing = api_client.post(
            f"{BASE_URL}/api/projects",
            headers=admin_headers,
            json={"name": "TEST_CMS5 Missing Service"},
        )
        assert bad_missing.status_code == 400

        bad_unknown = api_client.post(
            f"{BASE_URL}/api/projects",
            headers=admin_headers,
            json={"name": "TEST_CMS5 Unknown Service", "serviceSlug": "non-existent-service"},
        )
        assert bad_unknown.status_code == 400

        bad_array = api_client.post(
            f"{BASE_URL}/api/projects",
            headers=admin_headers,
            json={"name": "TEST_CMS5 Array Service", "serviceSlug": [service_a_slug]},
        )
        assert bad_array.status_code == 400

        bad_draft = api_client.post(
            f"{BASE_URL}/api/projects",
            headers=admin_headers,
            json={"name": "TEST_CMS5 Draft Service", "serviceSlug": draft_service_slug},
        )
        assert bad_draft.status_code == 400

        p1 = api_client.post(
            f"{BASE_URL}/api/projects",
            headers=admin_headers,
            json={
                "name": "TEST_CMS5 Mobile Project",
                "serviceSlug": service_a_slug,
                "description": "TEST mobile desc",
                "category": "Mobile",
            },
        )
        assert p1.status_code == 200
        pr1 = _must_json(p1)["project"]
        created_items["projects"].append(pr1["id"])
        assert pr1["serviceSlug"] == service_a_slug

        p2 = api_client.post(
            f"{BASE_URL}/api/projects",
            headers=admin_headers,
            json={
                "name": "TEST_CMS5 Web Project",
                "serviceSlug": service_b_slug,
                "description": "TEST web desc",
                "category": "Web",
            },
        )
        assert p2.status_code == 200
        pr2 = _must_json(p2)["project"]
        created_items["projects"].append(pr2["id"])
        assert pr2["serviceSlug"] == service_b_slug

        all_projects = api_client.get(f"{BASE_URL}/api/projects")
        assert all_projects.status_code == 200
        all_names = [x["name"] for x in _must_json(all_projects).get("projects", [])]
        assert "TEST_CMS5 Mobile Project" in all_names and "TEST_CMS5 Web Project" in all_names

        filt_a = api_client.get(f"{BASE_URL}/api/projects?service={service_a_slug}")
        assert filt_a.status_code == 200
        names_a = [x["name"] for x in _must_json(filt_a).get("projects", [])]
        assert "TEST_CMS5 Mobile Project" in names_a
        assert "TEST_CMS5 Web Project" not in names_a

        filt_b = api_client.get(f"{BASE_URL}/api/projects?service={service_b_slug}")
        assert filt_b.status_code == 200
        names_b = [x["name"] for x in _must_json(filt_b).get("projects", [])]
        assert "TEST_CMS5 Web Project" in names_b
        assert "TEST_CMS5 Mobile Project" not in names_b

        reassigned = api_client.put(
            f"{BASE_URL}/api/projects",
            headers=admin_headers,
            json={"id": pr2["id"], "serviceSlug": service_a_slug},
        )
        assert reassigned.status_code == 200
        filt_b_after = api_client.get(f"{BASE_URL}/api/projects?service={service_b_slug}")
        assert "TEST_CMS5 Web Project" not in [x["name"] for x in _must_json(filt_b_after).get("projects", [])]

        linked_offering = api_client.post(
            f"{BASE_URL}/api/offerings",
            headers=admin_headers,
            json={
                "title": "TEST_CMS5 linked offering",
                "slug": f"test-cms5-off-{uuid.uuid4().hex[:6]}",
                "serviceSlug": service_a_slug,
                "blurb": "test",
                "points": ["p1"],
            },
        )
        assert linked_offering.status_code == 200
        created_items["offerings"].append(_must_json(linked_offering)["offering"]["id"])

        unpublish_a = api_client.put(
            f"{BASE_URL}/api/cms/services",
            headers=admin_headers,
            json={**item_a, "status": "draft", "features": ["Feature 1"], "outcomes": ["Outcome 1"]},
        )
        assert unpublish_a.status_code == 409

        delete_a = api_client.delete(f"{BASE_URL}/api/cms/services?id={item_a['id']}", headers=admin_headers)
        assert delete_a.status_code == 409

        case_slug = f"test-cms5-case-{uuid.uuid4().hex[:8]}"
        case_payload = {
            "slug": case_slug,
            "status": "draft",
            "pillar": "build",
            "title": f"TEST_CMS5 Case {case_slug}",
            "excerpt": "TEST case excerpt",
            "body": "<h2>Case Body</h2><p>body</p>",
            "client": "TEST Client",
            "industry": "Fintech",
            "challenge": "TEST challenge",
            "solution": "TEST solution",
            "techStack": "Next.js\nMongoDB",
            "metrics": "Revenue | +10% | YoY",
            "image": "",
            "imageAlt": "",
            "seoTitle": "",
            "seoDescription": "",
            "keywords": "",
        }
        cs = api_client.post(f"{BASE_URL}/api/cms/cases", headers=admin_headers, json=case_payload)
        assert cs.status_code == 201
        case_item = _must_json(cs)["item"]
        created_items["cases"].append(case_item["id"])

        public_cases_before = api_client.get(f"{BASE_URL}/api/cms/cases")
        assert case_slug not in [x["slug"] for x in _must_json(public_cases_before).get("items", [])]

        case_pub = api_client.put(
            f"{BASE_URL}/api/cms/cases",
            headers=admin_headers,
            json={**case_item, "status": "published"},
        )
        assert case_pub.status_code == 200

        public_cases_after = api_client.get(f"{BASE_URL}/api/cms/cases")
        assert case_slug in [x["slug"] for x in _must_json(public_cases_after).get("items", [])]

        case_page = api_client.get(f"{BASE_URL}/case-studies/{case_slug}")
        assert case_page.status_code == 200

        case_down = api_client.put(
            f"{BASE_URL}/api/cms/cases",
            headers=admin_headers,
            json={**_must_json(case_pub)["item"], "status": "draft"},
        )
        assert case_down.status_code == 200
        public_cases_final = api_client.get(f"{BASE_URL}/api/cms/cases")
        assert case_slug not in [x["slug"] for x in _must_json(public_cases_final).get("items", [])]


class TestMediaApi:
    """Media upload strictness and retrieval behavior."""

    def test_media_admin_upload_and_validation(self, api_client, admin_headers, created_items):
        unauthorized = requests.post(f"{BASE_URL}/api/media", files={"file": ("x.png", b"abc", "image/png")})
        assert unauthorized.status_code == 401

        png_1x1 = base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Zx0kAAAAASUVORK5CYII="
        )
        good = requests.post(
            f"{BASE_URL}/api/media",
            headers={"x-admin-key": admin_headers["x-admin-key"]},
            files={"file": ("test-cms5.png", png_1x1, "image/png")},
        )
        assert good.status_code == 201, good.text
        good_json = _must_json(good)
        assert good_json.get("url", "").startswith("/api/media/")
        media_id = good_json.get("id")
        assert isinstance(media_id, str) and len(media_id) > 10
        created_items["media_ids"].append(media_id)

        fetch = api_client.get(f"{BASE_URL}{good_json['url']}")
        assert fetch.status_code == 200
        assert fetch.headers.get("content-type", "").startswith("image/webp")
        assert len(fetch.content) > 20

        fake = requests.post(
            f"{BASE_URL}/api/media",
            headers={"x-admin-key": admin_headers["x-admin-key"]},
            files={"file": ("fake.png", b"not-an-image", "image/png")},
        )
        assert fake.status_code == 400

        svg = requests.post(
            f"{BASE_URL}/api/media",
            headers={"x-admin-key": admin_headers["x-admin-key"]},
            files={"file": ("bad.svg", b"<svg xmlns='http://www.w3.org/2000/svg'></svg>", "image/svg+xml")},
        )
        assert svg.status_code == 400

        too_big = requests.post(
            f"{BASE_URL}/api/media",
            headers={"x-admin-key": admin_headers["x-admin-key"]},
            files={"file": ("big.jpg", b"a" * (5 * 1024 * 1024 + 5), "image/jpeg")},
        )
        assert too_big.status_code == 400

        missing = api_client.get(f"{BASE_URL}/api/media/{uuid.uuid4()}")
        assert missing.status_code == 404
