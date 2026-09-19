"""Backend tests for /api/offerings — GET seed, POST/PUT/DELETE admin gating."""
import os
import pytest
import requests

BASE_URL = "https://verified-build-6.preview.emergentagent.com"
ADMIN_KEY = "pytech-admin-2026"

EXPECTED_SLUGS = {"app-development", "web-development", "erp-software", "ai-automation", "digital-marketing", "branding"}


@pytest.fixture(scope="module")
def s():
    return requests.Session()


def _get(s):
    r = s.get(f"{BASE_URL}/api/offerings", timeout=30)
    assert r.status_code == 200
    return r.json()["offerings"]


def test_offerings_seed_and_idempotent(s):
    off1 = _get(s)
    assert len(off1) == 6, f"expected 6 got {len(off1)}"
    slugs = {o["slug"] for o in off1}
    assert slugs == EXPECTED_SLUGS, f"slug mismatch: {slugs}"
    # web-development pricing
    web = next(o for o in off1 if o["slug"] == "web-development")
    assert web["priceInr"] == 20000
    assert web["priceUsd"] == 250
    # app-development pricing
    app = next(o for o in off1 if o["slug"] == "app-development")
    assert app["priceInr"] == 99999
    assert app["priceUsd"] == 1999
    # idempotent
    off2 = _get(s)
    assert len(off2) == 6
    # required fields
    for o in off1:
        assert "id" in o and "points" in o and "image" in o and "blurb" in o


def test_post_offering_requires_admin(s):
    r = s.post(f"{BASE_URL}/api/offerings", json={"title": "TEST_Unauth"}, timeout=15)
    assert r.status_code == 401


def test_delete_offering_requires_admin(s):
    r = s.delete(f"{BASE_URL}/api/offerings?id=doesnotmatter", timeout=15)
    assert r.status_code == 401


def test_offerings_crud_admin(s):
    h = {"x-admin-key": ADMIN_KEY, "Content-Type": "application/json"}
    # CREATE
    payload = {"title": "TEST_Offering", "blurb": "tmp", "priceInr": 111, "priceUsd": 2, "points": ["a", "b"]}
    r = s.post(f"{BASE_URL}/api/offerings", json=payload, headers=h, timeout=15)
    assert r.status_code == 200, r.text
    created = r.json()["offering"]
    oid = created["id"]
    assert created["priceInr"] == 111
    # verify via GET
    off = _get(s)
    assert any(o["id"] == oid for o in off)
    # UPDATE
    r = s.put(f"{BASE_URL}/api/offerings", json={"id": oid, "priceInr": 222, "featured": False}, headers=h, timeout=15)
    assert r.status_code == 200
    off = _get(s)
    updated = next(o for o in off if o["id"] == oid)
    assert updated["priceInr"] == 222
    assert updated["featured"] is False
    # DELETE
    r = s.delete(f"{BASE_URL}/api/offerings?id={oid}", headers=h, timeout=15)
    assert r.status_code == 200
    off = _get(s)
    assert not any(o["id"] == oid for o in off)
    # cleanup verified: 6 defaults remain
    assert len(off) == 6


def test_regression_smoke(s):
    for path in ["/", "/services", "/services/web-development", "/work", "/careers", "/admin", "/pricing", "/sitemap.xml"]:
        r = s.get(f"{BASE_URL}{path}", timeout=30)
        assert r.status_code == 200, f"{path} -> {r.status_code}"
    r = s.get(f"{BASE_URL}/sitemap.xml", timeout=30)
    assert "/pricing" in r.text
