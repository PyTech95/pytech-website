"""Tests for new features: Projects CRUD, Careers apply, Email settings, File download."""
import io
import os
import time
import pytest
import requests

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL", "https://verified-build-6.preview.emergentagent.com"
).rstrip("/")
ADMIN_PASSWORD = "pytech-admin-2026"


@pytest.fixture(scope="module")
def api():
    return requests.Session()


@pytest.fixture(scope="module")
def admin_headers():
    return {"x-admin-key": ADMIN_PASSWORD}


# --- Projects CRUD ---
def test_projects_public_list(api):
    r = api.get(f"{BASE_URL}/api/projects")
    assert r.status_code == 200
    data = r.json()
    assert "projects" in data or isinstance(data, list)


def test_projects_admin_crud(api, admin_headers):
    # CREATE
    payload = {
        "name": "TEST_Project_E2E",
        "url": "https://example.com",
        "client": "TEST_Client",
        "category": "Web",
        "delivery": "4 weeks",
        "challenges": "TEST challenges",
        "tech": "Next.js, MongoDB",
        "description": "TEST description",
        "featured": True,
    }
    r = api.post(f"{BASE_URL}/api/projects", json=payload, headers=admin_headers)
    assert r.status_code in (200, 201), f"create: {r.status_code} {r.text}"
    body = r.json()
    proj = body.get("project", body)
    pid = proj.get("id") or proj.get("_id") or body.get("id")
    assert pid, f"no id in {body}"

    # GET list - should include it
    r2 = api.get(f"{BASE_URL}/api/projects")
    assert r2.status_code == 200
    lst = r2.json().get("projects", r2.json())
    assert any((p.get("id") == pid or p.get("name") == payload["name"]) for p in lst)

    # UPDATE
    upd = {"id": pid, "name": "TEST_Project_E2E_Updated", "featured": False}
    r3 = api.put(f"{BASE_URL}/api/projects", json=upd, headers=admin_headers)
    assert r3.status_code in (200, 204), f"update: {r3.status_code} {r3.text}"

    # DELETE
    r4 = api.delete(f"{BASE_URL}/api/projects?id={pid}", headers=admin_headers)
    assert r4.status_code in (200, 204), f"delete: {r4.status_code} {r4.text}"

    # Verify removal
    r5 = api.get(f"{BASE_URL}/api/projects")
    lst5 = r5.json().get("projects", r5.json())
    assert not any(p.get("id") == pid for p in lst5), "project still present after delete"


def test_projects_requires_admin(api):
    r = api.post(f"{BASE_URL}/api/projects", json={"name": "NoAuth"})
    assert r.status_code in (401, 403)


# --- Careers apply ---
def _tiny_pdf_bytes():
    # Minimal PDF signature
    return (
        b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
        b"2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\n"
        b"xref\n0 3\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n"
        b"trailer<</Size 3/Root 1 0 R>>\nstartxref\n95\n%%EOF"
    )


def test_careers_apply_and_admin_list(api, admin_headers):
    files = {
        "resume": ("test_resume.pdf", io.BytesIO(_tiny_pdf_bytes()), "application/pdf"),
    }
    data = {
        "role": "Frontend Engineer",
        "roleSlug": "frontend-engineer",
        "name": "TEST_Applicant",
        "email": "test_applicant@example.com",
        "phone": "+911234567890",
        "experience": "3",
        "company": "TEST_Co",
        "portfolio": "https://example.com/portfolio",
        "coverLetter": "TEST cover letter body",
    }
    r = requests.post(f"{BASE_URL}/api/careers/apply", data=data, files=files, timeout=60)
    assert r.status_code in (200, 201), f"apply: {r.status_code} {r.text}"
    body = r.json()
    assert body.get("ok") or body.get("id"), f"apply body: {body}"

    # Admin fetch
    r2 = api.get(f"{BASE_URL}/api/careers/applications", headers=admin_headers)
    assert r2.status_code == 200, f"admin apps: {r2.status_code} {r2.text}"
    apps_body = r2.json()
    apps = apps_body.get("applications", apps_body) if isinstance(apps_body, dict) else apps_body
    found = next((a for a in apps if a.get("email") == data["email"]), None)
    assert found, "application not visible to admin"
    resume = found.get("resume") or {}
    storage_path = resume.get("storagePath") or resume.get("path")
    assert storage_path, f"no resume storagePath in {found}"

    # File download works
    r3 = api.get(f"{BASE_URL}/api/files/{storage_path}?key={ADMIN_PASSWORD}")
    assert r3.status_code == 200, f"file download: {r3.status_code}"
    assert r3.headers.get("content-type", "").startswith("application/pdf")


def test_careers_applications_requires_admin(api):
    r = api.get(f"{BASE_URL}/api/careers/applications")
    assert r.status_code in (401, 403)


# --- Email settings ---
def test_email_settings_get_and_put(api, admin_headers):
    r = api.get(f"{BASE_URL}/api/settings/email", headers=admin_headers)
    assert r.status_code == 200, f"email get: {r.status_code} {r.text}"
    cur = r.json()
    assert isinstance(cur, dict)

    # Save (do not send real password to avoid leaking — use marker)
    payload = {
        "host": "smtp.gmail.com",
        "port": 587,
        "user": "test-sender@example.com",
        "pass": "TEST_APP_PASSWORD_XXXX",
        "recipient": "test-recipient@example.com",
        "enabled": False,
    }
    r2 = api.put(f"{BASE_URL}/api/settings/email", json=payload, headers=admin_headers)
    assert r2.status_code in (200, 204), f"email put: {r2.status_code} {r2.text}"

    r3 = api.get(f"{BASE_URL}/api/settings/email", headers=admin_headers)
    assert r3.status_code == 200
    saved = r3.json()
    assert saved.get("host") == "smtp.gmail.com"
    assert saved.get("recipient") == "test-recipient@example.com"
    assert saved.get("enabled") is False
    # hasPassword should be true after save
    assert saved.get("hasPassword") is True, f"hasPassword not set: {saved}"


def test_email_settings_requires_admin(api):
    r = api.get(f"{BASE_URL}/api/settings/email")
    assert r.status_code in (401, 403)
