#!/usr/bin/env python3
"""
Enquiry Tagging Test - PyTech Digital Backend
Tests the NEW pageSource field functionality in leads
"""

import requests
import json
import sys

# Configuration
BASE_URL = "https://pytech-scale.preview.emergentagent.com/api"
ADMIN_PASSWORD = "PyTech@2026"

def print_section(title):
    """Print a formatted section header"""
    print(f"\n{'='*80}")
    print(f"  {title}")
    print(f"{'='*80}\n")

def test_enquiry_tagging():
    """Test enquiry tagging with pageSource field"""
    print_section("ENQUIRY TAGGING TEST - pageSource Field")
    
    test_results = {
        "test1_post_with_pageSource": False,
        "test2_get_leads_with_pageSource": False,
        "test3_post_without_pageSource": False,
        "errors": []
    }
    
    created_lead_id = None
    
    try:
        # ============================================================
        # TEST 1: POST /api/leads WITH pageSource
        # ============================================================
        print("📊 TEST 1: POST /api/leads WITH pageSource field")
        print("Expected: 200 { ok:true, lead:{...} } with pageSource and id (no _id)")
        
        payload = {
            "name": "Tag Test",
            "email": "tag@example.com",
            "service": "Web Development",
            "budget": "₹1L – ₹5L",
            "timeline": "ASAP",
            "source": "lead-form",
            "pageSource": "service:web-development"
        }
        
        print(f"\nPayload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(f"{BASE_URL}/leads", json=payload, timeout=30)
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code != 200:
            error_msg = f"❌ TEST 1 FAILED: Expected 200, got {response.status_code}"
            print(error_msg)
            print(f"Response: {response.text}")
            test_results["errors"].append(error_msg)
        else:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            # Verify response structure
            if not data.get("ok"):
                error_msg = "❌ TEST 1 FAILED: Response missing 'ok: true'"
                print(error_msg)
                test_results["errors"].append(error_msg)
            elif not data.get("lead"):
                error_msg = "❌ TEST 1 FAILED: Response missing 'lead' object"
                print(error_msg)
                test_results["errors"].append(error_msg)
            else:
                lead = data["lead"]
                
                # Check for 'id' field
                if "id" not in lead:
                    error_msg = "❌ TEST 1 FAILED: Lead missing 'id' field"
                    print(error_msg)
                    test_results["errors"].append(error_msg)
                else:
                    print(f"✅ Lead has 'id' field: {lead['id']}")
                    created_lead_id = lead["id"]
                
                # Check for NO '_id' field
                if "_id" in lead:
                    error_msg = "❌ TEST 1 FAILED: Lead contains '_id' field (should be removed)"
                    print(error_msg)
                    test_results["errors"].append(error_msg)
                else:
                    print("✅ Lead does NOT contain '_id' field")
                
                # Check pageSource field
                if "pageSource" not in lead:
                    error_msg = "❌ TEST 1 FAILED: Lead missing 'pageSource' field"
                    print(error_msg)
                    test_results["errors"].append(error_msg)
                elif lead["pageSource"] != "service:web-development":
                    error_msg = f"❌ TEST 1 FAILED: pageSource is '{lead['pageSource']}', expected 'service:web-development'"
                    print(error_msg)
                    test_results["errors"].append(error_msg)
                else:
                    print(f"✅ Lead has correct pageSource: '{lead['pageSource']}'")
                
                # If all checks passed
                if "id" in lead and "_id" not in lead and lead.get("pageSource") == "service:web-development":
                    test_results["test1_post_with_pageSource"] = True
                    print("\n✅ TEST 1 PASSED")
        
        # ============================================================
        # TEST 2: GET /api/leads WITH admin header
        # ============================================================
        print("\n" + "="*80)
        print("📊 TEST 2: GET /api/leads WITH admin header")
        print("Expected: 200 array with the created lead including pageSource field")
        
        headers = {"x-admin-key": ADMIN_PASSWORD}
        response = requests.get(f"{BASE_URL}/leads", headers=headers, timeout=30)
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code != 200:
            error_msg = f"❌ TEST 2 FAILED: Expected 200, got {response.status_code}"
            print(error_msg)
            print(f"Response: {response.text}")
            test_results["errors"].append(error_msg)
        else:
            leads = response.json()
            print(f"Response: Array with {len(leads)} lead(s)")
            
            if not isinstance(leads, list):
                error_msg = "❌ TEST 2 FAILED: Response is not an array"
                print(error_msg)
                test_results["errors"].append(error_msg)
            else:
                # Find the lead we just created
                found_lead = None
                if created_lead_id:
                    found_lead = next((l for l in leads if l.get("id") == created_lead_id), None)
                else:
                    # Try to find by email
                    found_lead = next((l for l in leads if l.get("email") == "tag@example.com"), None)
                
                if not found_lead:
                    error_msg = "❌ TEST 2 FAILED: Created lead not found in GET /api/leads response"
                    print(error_msg)
                    test_results["errors"].append(error_msg)
                else:
                    print(f"\n✅ Found created lead in response")
                    print(f"Lead: {json.dumps(found_lead, indent=2)}")
                    
                    # Verify pageSource field
                    if "pageSource" not in found_lead:
                        error_msg = "❌ TEST 2 FAILED: Lead missing 'pageSource' field in GET response"
                        print(error_msg)
                        test_results["errors"].append(error_msg)
                    elif found_lead["pageSource"] != "service:web-development":
                        error_msg = f"❌ TEST 2 FAILED: pageSource is '{found_lead['pageSource']}', expected 'service:web-development'"
                        print(error_msg)
                        test_results["errors"].append(error_msg)
                    else:
                        print(f"✅ Lead has correct pageSource: '{found_lead['pageSource']}'")
                        test_results["test2_get_leads_with_pageSource"] = True
                        print("\n✅ TEST 2 PASSED")
        
        # ============================================================
        # TEST 3: POST /api/leads WITHOUT pageSource (regression)
        # ============================================================
        print("\n" + "="*80)
        print("📊 TEST 3: POST /api/leads WITHOUT pageSource (regression test)")
        print("Expected: 200 and pageSource should default to empty string ''")
        
        payload_no_source = {
            "name": "NoTag",
            "email": "n@example.com",
            "service": "Deep SEO",
            "budget": "₹5L – ₹15L",
            "timeline": "1–3 months"
        }
        
        print(f"\nPayload (no pageSource): {json.dumps(payload_no_source, indent=2)}")
        
        response = requests.post(f"{BASE_URL}/leads", json=payload_no_source, timeout=30)
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code != 200:
            error_msg = f"❌ TEST 3 FAILED: Expected 200, got {response.status_code}"
            print(error_msg)
            print(f"Response: {response.text}")
            test_results["errors"].append(error_msg)
        else:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            if not data.get("ok") or not data.get("lead"):
                error_msg = "❌ TEST 3 FAILED: Invalid response structure"
                print(error_msg)
                test_results["errors"].append(error_msg)
            else:
                lead = data["lead"]
                
                # Check pageSource defaults to empty string
                if "pageSource" not in lead:
                    error_msg = "❌ TEST 3 FAILED: Lead missing 'pageSource' field"
                    print(error_msg)
                    test_results["errors"].append(error_msg)
                elif lead["pageSource"] != "":
                    error_msg = f"❌ TEST 3 FAILED: pageSource is '{lead['pageSource']}', expected empty string ''"
                    print(error_msg)
                    test_results["errors"].append(error_msg)
                else:
                    print(f"✅ Lead has pageSource defaulting to empty string: '{lead['pageSource']}'")
                    test_results["test3_post_without_pageSource"] = True
                    print("\n✅ TEST 3 PASSED")
        
    except requests.exceptions.Timeout:
        error_msg = "❌ Request timeout - API took too long to respond"
        print(error_msg)
        test_results["errors"].append(error_msg)
    except requests.exceptions.RequestException as e:
        error_msg = f"❌ Request failed: {str(e)}"
        print(error_msg)
        test_results["errors"].append(error_msg)
    except Exception as e:
        error_msg = f"❌ Unexpected error: {str(e)}"
        print(error_msg)
        test_results["errors"].append(error_msg)
    
    return test_results

def print_summary(results):
    """Print test summary"""
    print_section("TEST SUMMARY")
    
    total_tests = 3
    passed_tests = sum([
        results["test1_post_with_pageSource"],
        results["test2_get_leads_with_pageSource"],
        results["test3_post_without_pageSource"]
    ])
    
    print(f"Tests Passed: {passed_tests}/{total_tests}")
    print(f"\n  Test 1 (POST with pageSource): {'✅ PASS' if results['test1_post_with_pageSource'] else '❌ FAIL'}")
    print(f"  Test 2 (GET with admin header): {'✅ PASS' if results['test2_get_leads_with_pageSource'] else '❌ FAIL'}")
    print(f"  Test 3 (POST without pageSource): {'✅ PASS' if results['test3_post_without_pageSource'] else '❌ FAIL'}")
    
    if results["errors"]:
        print(f"\n❌ ERRORS FOUND ({len(results['errors'])}):")
        for i, error in enumerate(results["errors"], 1):
            print(f"  {i}. {error}")
    
    print("\n" + "="*80)
    
    if passed_tests == total_tests:
        print("✅ ALL TESTS PASSED - Enquiry tagging is working correctly!")
    else:
        print(f"❌ TESTS FAILED - {total_tests - passed_tests} test(s) failed")
    
    print("="*80)
    
    return 0 if passed_tests == total_tests else 1

if __name__ == "__main__":
    print("="*80)
    print("  PyTech Digital - Enquiry Tagging Test (pageSource)")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin Password: {ADMIN_PASSWORD}")
    
    results = test_enquiry_tagging()
    exit_code = print_summary(results)
    
    sys.exit(exit_code)
