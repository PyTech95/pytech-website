"""Iteration 6 regression tests: transparent glass header, lead + application submission (Gmail disabled), page loads."""
import os
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "https://pytech-hardened.preview.emergentagent.com").rstrip("/")
ADMIN_KEY = "PyTech@Admin2026!"


def test_home_loads():
    r = requests.get(f"{BASE}/", timeout=30)
    assert r.status_code == 200
    assert "PyTech" in r.text or "apps" in r.text


def test_pricing_loads():
    assert requests.get(f"{BASE}/pricing", timeout=30).status_code == 200


def test_careers_loads():
    assert requests.get(f"{BASE}/careers", timeout=30).status_code == 200


def test_admin_loads():
    assert requests.get(f"{BASE}/admin", timeout=30).status_code == 200


def test_services_loads():
    assert requests.get(f"{BASE}/services", timeout=30).status_code == 200


def test_unknown_route_404():
    assert requests.get(f"{BASE}/nonexistent-abcxyz-123", timeout=30).status_code == 404


def test_email_settings_seeded():
    r = requests.get(f"{BASE}/api/settings/email", headers={"x-admin-key": ADMIN_KEY}, timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert data["user"] == "rajeev.pytech@gmail.com"
    assert data["recipient"] == "rajeev.pytech@gmail.com"
    assert data["enabled"] is False
    assert data["hasPassword"] is False


def test_leads_post_stores_without_gmail():
    r = requests.post(
        f"{BASE}/api/leads",
        json={"name": "TEST_Lead_iter6", "email": "test_iter6@example.com", "message": "regression"},
        timeout=30,
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("ok") is True
    assert data["lead"]["name"] == "TEST_Lead_iter6"
    assert "id" in data["lead"]


def test_careers_apply_multipart_ok():
    files = {
        "name": (None, "TEST_Applicant"),
        "email": (None, "applicant_iter6@example.com"),
        "role": (None, "Engineer"),
    }
    r = requests.post(f"{BASE}/api/careers/apply", files=files, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("ok") is True
    assert "id" in data


def test_leads_get_admin():
    r = requests.get(f"{BASE}/api/leads", headers={"x-admin-key": ADMIN_KEY}, timeout=30)
    assert r.status_code == 200
    assert isinstance(r.json(), list)
