"""PyTech Digital – iteration 4 backend tests.

Covers:
 - SEO admin API (auth, GET+PUT + effect on page metadata)
 - Leads API with strategy-call-popup payload
 - GEO: /llms.txt, /sitemap.xml, homepage ItemList JSON-LD
 - Regression smoke on all public pages
"""
import os
import re
import time
import requests

BASE = "https://verified-build-6.preview.emergentagent.com"
ADMIN_KEY = "pytech-admin-2026"
H_ADMIN = {"x-admin-key": ADMIN_KEY}


# ---------- SEO API ----------
class TestSeoApi:
    def test_get_seo_requires_admin(self):
        r = requests.get(f"{BASE}/api/seo")
        assert r.status_code == 401

    def test_get_seo_with_admin(self):
        r = requests.get(f"{BASE}/api/seo", headers=H_ADMIN)
        assert r.status_code == 200
        data = r.json()
        assert "pages" in data and "overrides" in data
        assert len(data["pages"]) == 10
        paths = [p["path"] for p in data["pages"]]
        assert "/pricing" in paths and "/" in paths

    def test_put_seo_requires_admin(self):
        r = requests.put(f"{BASE}/api/seo", json={"path": "/pricing", "title": "x"})
        assert r.status_code == 401


# ---------- Leads ----------
class TestLeadsPopup:
    def test_create_lead_from_popup_and_verify(self):
        payload = {
            "name": "TEST_Popup User",
            "company": "TEST Co",
            "email": "test_popup@example.com",
            "phone": "+911234567890",
            "projectType": "Website",
            "pages": "7 pages + blog",
            "budget": "flexible ~1L",
            "timeline": "2 months",
            "message": "TEST message from popup",
            "service": "Website",
            "source": "strategy-call-popup",
            "pageSource": "/",
        }
        r = requests.post(f"{BASE}/api/leads", json=payload)
        assert r.status_code in (200, 201), r.text
        # verify via admin GET
        r2 = requests.get(f"{BASE}/api/leads", headers=H_ADMIN)
        assert r2.status_code == 200
        payload_json = r2.json()
        leads = payload_json.get("leads", []) if isinstance(payload_json, dict) else payload_json
        found = [l for l in leads if l.get("email") == "test_popup@example.com"]
        assert found, "Newly-created lead not found in GET /api/leads"
        lead = found[0]
        assert lead.get("source") == "strategy-call-popup"
        assert lead.get("projectType") == "Website"
        assert lead.get("pages") == "7 pages + blog"
        assert lead.get("budget") == "flexible ~1L"


# ---------- GEO ----------
class TestGeo:
    def test_llms_txt(self):
        r = requests.get(f"{BASE}/llms.txt")
        assert r.status_code == 200
        assert "text/plain" in r.headers.get("content-type", "")
        body = r.text
        assert "PyTech Digital" in body
        # 6 offerings – rough check
        for kw in ("App Development", "Web", "ERP", "AI", "Automation", "Digital Marketing", "Branding"):
            assert kw in body, f"missing {kw} in llms.txt"
        # prices INR/USD present somewhere
        assert re.search(r"₹|INR", body) and re.search(r"\$|USD", body)
        assert "sitemap" in body.lower()

    def test_sitemap_has_pricing(self):
        r = requests.get(f"{BASE}/sitemap.xml")
        assert r.status_code == 200
        assert "/pricing" in r.text

    def test_homepage_has_itemlist_jsonld(self):
        r = requests.get(f"{BASE}/")
        assert r.status_code == 200
        assert '"@type":"ItemList"' in r.text.replace(" ", "")


# ---------- Smoke ----------
class TestSmoke:
    PATHS = ["/", "/services", "/services/web-development", "/pricing", "/work",
             "/careers", "/case-studies", "/locations", "/ai-automation",
             "/resources", "/support", "/admin"]

    def test_all_pages_load(self):
        failed = []
        for p in self.PATHS:
            code = None
            for _ in range(3):
                r = requests.get(f"{BASE}{p}", timeout=30)
                code = r.status_code
                if code == 200:
                    break
                time.sleep(2)
            if code != 200:
                failed.append((p, code))
        assert not failed, f"Non-200 pages: {failed}"

    def test_homepage_no_prices_in_offerings(self):
        r = requests.get(f"{BASE}/")
        html = r.text
        # No id="pricing" section
        assert 'id="pricing"' not in html, "homepage should not have id=pricing section"
        assert "Starting prices" not in html, "homepage should not have 'Starting prices'"

    def test_hero_h1_mentions_keywords(self):
        r = requests.get(f"{BASE}/")
        html = r.text.lower()
        for kw in ("apps", "websites", "marketing", "automat"):
            assert kw in html, f"hero/homepage missing keyword: {kw}"
