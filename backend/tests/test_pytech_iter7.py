"""Iteration 7 regression tests: Gmail live, mega-menu related pages, lead + apply flows."""
import os
import time
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "https://pytech-hardened.preview.emergentagent.com").rstrip("/")
ADMIN_KEY = "PyTech@Admin2026!"


def _retry_get(url, **kw):
    last = None
    for _ in range(3):
        try:
            r = requests.get(url, timeout=30, **kw)
            if r.status_code < 500:
                return r
            last = r
        except Exception as e:
            last = e
        time.sleep(2)
    return last


def _retry_post(url, **kw):
    last = None
    for _ in range(3):
        try:
            r = requests.post(url, timeout=30, **kw)
            if r.status_code < 500:
                return r
            last = r
        except Exception as e:
            last = e
        time.sleep(2)
    return last


# --- Page regression ---
def test_home_loads():
    r = _retry_get(f"{BASE}/")
    assert r.status_code == 200


def test_services_loads():
    assert _retry_get(f"{BASE}/services").status_code == 200


def test_pricing_loads():
    assert _retry_get(f"{BASE}/pricing").status_code == 200


def test_careers_loads():
    assert _retry_get(f"{BASE}/careers").status_code == 200


def test_admin_loads():
    assert _retry_get(f"{BASE}/admin").status_code == 200


def test_unknown_route_404():
    assert _retry_get(f"{BASE}/nonexistent-abcxyz-123").status_code == 404


# --- Email settings live ---
def test_email_settings_live():
    r = _retry_get(f"{BASE}/api/settings/email", headers={"x-admin-key": ADMIN_KEY})
    assert r.status_code == 200
    data = r.json()
    assert data["user"] == "rajeev.pytech@gmail.com"
    assert data["recipient"] == "rajeev.pytech@gmail.com"
    assert data["enabled"] is True
    assert data["enabledEnquiries"] is True
    assert data["hasPassword"] is True


# --- Lead flow + emailStatus=sent ---
def test_lead_post_and_email_status_sent():
    unique = f"TEST_Lead_iter7_{int(time.time())}"
    r = _retry_post(
        f"{BASE}/api/leads",
        json={"name": unique, "email": "test_iter7@example.com", "message": "iter7 regression"},
    )
    assert r.status_code == 200, getattr(r, "text", str(r))
    body = r.json()
    assert body.get("ok") is True
    lead_id = body["lead"]["id"]

    # Poll GET /api/leads to see emailStatus flip to 'sent'
    status = None
    for _ in range(10):
        g = _retry_get(f"{BASE}/api/leads", headers={"x-admin-key": ADMIN_KEY})
        assert g.status_code == 200
        for lead in g.json():
            if lead.get("id") == lead_id:
                status = lead.get("emailStatus")
                break
        if status == "sent":
            break
        time.sleep(2)
    assert status == "sent", f"emailStatus was {status!r}, expected 'sent'"


# --- Careers apply flow ---
def test_careers_apply_multipart_ok():
    files = {
        "name": (None, "TEST_Applicant_iter7"),
        "email": (None, "applicant_iter7@example.com"),
        "role": (None, "Engineer"),
    }
    r = _retry_post(f"{BASE}/api/careers/apply", files=files)
    assert r.status_code == 200, getattr(r, "text", str(r))
    body = r.json()
    assert body.get("ok") is True
    assert "id" in body


def test_leads_admin_list():
    r = _retry_get(f"{BASE}/api/leads", headers={"x-admin-key": ADMIN_KEY})
    assert r.status_code == 200
    assert isinstance(r.json(), list)
