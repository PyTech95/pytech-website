"""Backend API tests for PyTech Digital (Next.js via FastAPI proxy)."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL", "https://verified-build-6.preview.emergentagent.com"
).rstrip("/")
ADMIN_PASSWORD = "pytech-admin-2026"


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_key(api):
    r = api.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    data = r.json()
    key = data.get("key") or data.get("token") or ADMIN_PASSWORD
    return key


# --- health / services ---
def test_health(api):
    # /api/ redirects loop via CDN; use /api/services as reachability proxy
    r = api.get(f"{BASE_URL}/api/services", allow_redirects=True)
    assert r.status_code == 200


def test_services_list(api):
    r = api.get(f"{BASE_URL}/api/services")
    assert r.status_code == 200
    data = r.json()
    assert "services" in data and len(data["services"]) > 5
    assert "locations" in data and len(data["locations"]) > 10


# --- admin auth ---
def test_admin_login_wrong_password(api):
    r = api.post(f"{BASE_URL}/api/admin/login", json={"password": "wrong"})
    assert r.status_code == 401


def test_admin_login_correct(api):
    r = api.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    assert r.status_code == 200


# --- leads ---
def test_create_lead_and_admin_fetch(api, admin_key):
    payload = {
        "name": "TEST_User",
        "email": "test_user@example.com",
        "phone": "+911234567890",
        "company": "TEST_Co",
        "service": "web-development",
        "budget": "5k-15k",
        "timeline": "1-3m",
        "message": "Automated test lead",
    }
    r = api.post(f"{BASE_URL}/api/leads", json=payload)
    assert r.status_code in (200, 201), f"lead create: {r.status_code} {r.text}"
    body = r.json()
    assert body.get("ok") or body.get("id") or body.get("success")

    # Admin fetch
    r2 = api.get(f"{BASE_URL}/api/leads", headers={"x-admin-key": admin_key})
    assert r2.status_code == 200, f"admin leads fetch: {r2.status_code} {r2.text}"
    data = r2.json()
    leads = data.get("leads", data) if isinstance(data, dict) else data
    assert isinstance(leads, list)
    assert any(l.get("email") == payload["email"] for l in leads), "Created lead not found in admin list"


def test_admin_leads_requires_key(api):
    r = api.get(f"{BASE_URL}/api/leads")
    assert r.status_code in (401, 403)


# --- chat (Gemini) ---
def test_chat_new_session_and_followup(api):
    r = api.post(f"{BASE_URL}/api/chat", json={"message": "I need a website for my startup"}, timeout=60)
    assert r.status_code == 200, f"chat: {r.status_code} {r.text}"
    data = r.json()
    session_id = data.get("sessionId") or data.get("session_id")
    reply = data.get("message") or data.get("reply")
    assert session_id, f"No sessionId in {data}"
    assert reply and len(str(reply)) > 5, f"empty reply: {data}"

    # follow-up on same session
    r2 = api.post(
        f"{BASE_URL}/api/chat",
        json={"message": "Budget is around $10k, timeline 6 weeks", "sessionId": session_id},
        timeout=60,
    )
    assert r2.status_code == 200
    data2 = r2.json()
    sid2 = data2.get("sessionId") or data2.get("session_id")
    assert sid2 == session_id, f"session not preserved: {sid2} vs {session_id}"


def test_admin_chat_sessions(api, admin_key):
    r = api.get(f"{BASE_URL}/api/chat/sessions", headers={"x-admin-key": admin_key})
    assert r.status_code == 200
    data = r.json()
    sessions = data.get("sessions", data) if isinstance(data, dict) else data
    assert isinstance(sessions, list)


# --- SEO routes (served by Next, not /api) ---
def test_sitemap(api):
    r = api.get(f"{BASE_URL}/sitemap.xml")
    assert r.status_code == 200
    assert "<urlset" in r.text or "<sitemap" in r.text


def test_robots(api):
    r = api.get(f"{BASE_URL}/robots.txt")
    assert r.status_code == 200
    assert "User-agent" in r.text or "user-agent" in r.text.lower()


def test_unknown_route_404(api):
    r = api.get(f"{BASE_URL}/this-route-does-not-exist-xyz")
    assert r.status_code == 404
