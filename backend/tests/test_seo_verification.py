"""Backend tests for SEO verification, robots, sitemap, canonical/head tags, and regression."""
import os
import re
import pytest
import requests

BASE = os.environ.get('REACT_APP_BACKEND_URL', 'https://pytech-hardened.preview.emergentagent.com').rstrip('/')
ADMIN_KEY = 'PyTech@Admin2026!'
API = f"{BASE}/api"


@pytest.fixture(scope='module', autouse=True)
def reset_after():
    yield
    # cleanup: reset verification to empty
    try:
        requests.put(f"{API}/seo/verification", headers={'x-admin-key': ADMIN_KEY, 'Content-Type': 'application/json'},
                     json={'google': '', 'bing': ''}, timeout=15)
    except Exception:
        pass


# ---- /api/seo/verification ----
class TestSeoVerification:
    def test_get_public_no_auth(self):
        # Reset first
        requests.put(f"{API}/seo/verification", headers={'x-admin-key': ADMIN_KEY, 'Content-Type': 'application/json'},
                     json={'google': '', 'bing': ''}, timeout=15)
        r = requests.get(f"{API}/seo/verification", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert 'google' in data and 'bing' in data
        assert data['google'] == '' and data['bing'] == ''

    def test_put_without_admin_key_401(self):
        r = requests.put(f"{API}/seo/verification", json={'google': 'X', 'bing': 'Y'}, timeout=15)
        assert r.status_code == 401

    def test_put_with_admin_persists(self):
        r = requests.put(f"{API}/seo/verification",
                         headers={'x-admin-key': ADMIN_KEY, 'Content-Type': 'application/json'},
                         json={'google': 'MYCODE123', 'bing': 'BINGCODE9'}, timeout=15)
        assert r.status_code == 200
        assert r.json().get('ok') is True

        g = requests.get(f"{API}/seo/verification", timeout=15).json()
        assert g['google'] == 'MYCODE123'
        assert g['bing'] == 'BINGCODE9'

    def test_head_contains_meta_tags(self):
        # ensure values are set
        requests.put(f"{API}/seo/verification",
                     headers={'x-admin-key': ADMIN_KEY, 'Content-Type': 'application/json'},
                     json={'google': 'MYCODE123', 'bing': 'BINGCODE9'}, timeout=15)
        r = requests.get(f"{BASE}/", timeout=30)
        assert r.status_code == 200
        html = r.text
        assert 'name="google-site-verification"' in html and 'MYCODE123' in html
        assert 'name="msvalidate.01"' in html and 'BINGCODE9' in html


# ---- robots.txt ----
class TestRobots:
    def test_robots(self):
        r = requests.get(f"{BASE}/robots.txt", timeout=20)
        assert r.status_code == 200
        text = r.text
        assert 'Allow: /' in text
        assert '/admin' in text and 'Disallow' in text
        assert 'Sitemap:' in text
        assert 'https://pytechdigital.com/sitemap.xml' in text


# ---- sitemap.xml ----
class TestSitemap:
    def test_sitemap(self):
        r = requests.get(f"{BASE}/sitemap.xml", timeout=30)
        assert r.status_code == 200
        xml = r.text
        assert '<urlset' in xml
        for p in ['https://pytechdigital.com', 'https://pytechdigital.com/services',
                  'https://pytechdigital.com/pricing', 'https://pytechdigital.com/blog']:
            assert p in xml, f"missing {p} in sitemap"
        # Has a services/<slug> URL
        assert re.search(r'https://pytechdigital\.com/services/[a-z0-9-]+', xml)


# ---- key pages: 200 + canonical + index ----
KEY_PAGES = ['/', '/services', '/pricing', '/blog', '/careers', '/work', '/ai-automation', '/contact', '/locations']


@pytest.mark.parametrize('path', KEY_PAGES)
def test_pages_have_canonical_and_indexable(path):
    r = requests.get(f"{BASE}{path}", timeout=30)
    if r.status_code == 404 and path == '/contact':
        pytest.skip('/contact page not present')
    assert r.status_code == 200, f"{path} returned {r.status_code}"
    html = r.text
    head = html.split('</head>', 1)[0]
    assert 'rel="canonical"' in head, f"no canonical in {path}"
    # noindex should not appear in robots meta
    m = re.search(r'<meta[^>]+name="robots"[^>]*>', head, re.I)
    if m:
        assert 'noindex' not in m.group(0).lower(), f"noindex found on {path}"


# ---- Regression ----
class TestRegression:
    def test_lead_post(self):
        r = requests.post(f"{API}/leads",
                          json={'name': 'TEST_SEO_User', 'email': 'test_seo@example.com', 'message': 'seo test'},
                          timeout=20)
        assert r.status_code == 200
        assert r.json().get('ok') is True

    def test_settings_email_get(self):
        r = requests.get(f"{API}/settings/email", headers={'x-admin-key': ADMIN_KEY}, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert 'recipient' in d and 'enquiryRecipient' in d
        assert 'enabled' in d and 'enabledEnquiries' in d

    def test_admin_login(self):
        r = requests.post(f"{API}/admin/login", json={'password': ADMIN_KEY}, timeout=15)
        assert r.status_code == 200 and r.json().get('ok') is True
        r2 = requests.post(f"{API}/admin/login", json={'password': 'wrong'}, timeout=15)
        assert r2.status_code == 401
