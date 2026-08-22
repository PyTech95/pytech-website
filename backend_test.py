#!/usr/bin/env python3
"""
Backend API Test Suite for PyTech Digital
Tests lead scoring functionality with hot/warm/cold classification
"""

import requests
import time
import json

# Configuration
BASE_URL = "https://pytech-scale.preview.emergentagent.com/api"
ADMIN_PASSWORD = "PyTech@2026"

def print_section(title):
    """Print a formatted section header"""
    print(f"\n{'='*80}")
    print(f"  {title}")
    print(f"{'='*80}\n")

def test_lead_scoring():
    """Test lead scoring with hot and cold conversations"""
    print_section("LEAD SCORING TEST")
    
    results = {
        "hot_session": None,
        "cold_session": None,
        "errors": []
    }
    
    try:
        # ============================================================
        # TEST 1: Create HOT lead conversation
        # ============================================================
        print("📊 TEST 1: Creating HOT lead conversation...")
        print("Message: 'I need a WhatsApp automation system for my ecommerce store, budget is 5 lakh and we want to launch next month'")
        
        hot_payload = {
            "message": "I need a WhatsApp automation system for my ecommerce store, budget is 5 lakh and we want to launch next month"
        }
        
        response = requests.post(f"{BASE_URL}/chat", json=hot_payload, timeout=60)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            error_msg = f"❌ HOT lead creation failed with status {response.status_code}"
            print(error_msg)
            print(f"Response: {response.text}")
            results["errors"].append(error_msg)
            return results
        
        hot_data = response.json()
        hot_session_id = hot_data.get("sessionId")
        print(f"✅ HOT lead conversation created")
        print(f"Session ID: {hot_session_id}")
        print(f"Assistant response: {hot_data.get('message', '')[:100]}...")
        results["hot_session"] = {"sessionId": hot_session_id}
        
        # Wait for scoring to complete
        time.sleep(2)
        
        # ============================================================
        # TEST 2: Add follow-up to HOT lead
        # ============================================================
        print("\n📊 TEST 2: Adding follow-up to HOT lead...")
        print("Message: 'Yes ready to start immediately'")
        
        followup_payload = {
            "message": "Yes ready to start immediately",
            "sessionId": hot_session_id
        }
        
        response = requests.post(f"{BASE_URL}/chat", json=followup_payload, timeout=60)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            error_msg = f"❌ Follow-up failed with status {response.status_code}"
            print(error_msg)
            print(f"Response: {response.text}")
            results["errors"].append(error_msg)
        else:
            followup_data = response.json()
            print(f"✅ Follow-up added successfully")
            print(f"Assistant response: {followup_data.get('message', '')[:100]}...")
        
        # Wait for scoring to complete
        time.sleep(2)
        
        # ============================================================
        # TEST 3: Create COLD lead conversation
        # ============================================================
        print("\n📊 TEST 3: Creating COLD lead conversation...")
        print("Message: 'just browsing, not sure what I need yet'")
        
        cold_payload = {
            "message": "just browsing, not sure what I need yet"
        }
        
        response = requests.post(f"{BASE_URL}/chat", json=cold_payload, timeout=60)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            error_msg = f"❌ COLD lead creation failed with status {response.status_code}"
            print(error_msg)
            print(f"Response: {response.text}")
            results["errors"].append(error_msg)
            return results
        
        cold_data = response.json()
        cold_session_id = cold_data.get("sessionId")
        print(f"✅ COLD lead conversation created")
        print(f"Session ID: {cold_session_id}")
        print(f"Assistant response: {cold_data.get('message', '')[:100]}...")
        results["cold_session"] = {"sessionId": cold_session_id}
        
        # Wait for scoring to complete
        time.sleep(2)
        
        # ============================================================
        # TEST 4: Get all sessions with admin auth
        # ============================================================
        print("\n📊 TEST 4: Fetching all sessions with admin auth...")
        
        headers = {"x-admin-key": ADMIN_PASSWORD}
        response = requests.get(f"{BASE_URL}/chat/sessions", headers=headers, timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            error_msg = f"❌ Failed to fetch sessions with status {response.status_code}"
            print(error_msg)
            print(f"Response: {response.text}")
            results["errors"].append(error_msg)
            return results
        
        sessions_data = response.json()
        sessions = sessions_data.get("sessions", [])
        print(f"✅ Fetched {len(sessions)} total sessions")
        
        # ============================================================
        # TEST 5: Verify HOT lead scoring
        # ============================================================
        print("\n📊 TEST 5: Verifying HOT lead scoring...")
        
        hot_session = next((s for s in sessions if s["sessionId"] == hot_session_id), None)
        
        if not hot_session:
            error_msg = f"❌ HOT session {hot_session_id} not found in sessions list"
            print(error_msg)
            results["errors"].append(error_msg)
        else:
            print(f"✅ Found HOT session in sessions list")
            print(f"   Session ID: {hot_session['sessionId']}")
            print(f"   Tier: {hot_session.get('tier', 'MISSING')}")
            print(f"   Reason: {hot_session.get('reason', 'MISSING')}")
            print(f"   Message count: {hot_session.get('count', 0)}")
            print(f"   Preview: {hot_session.get('preview', '')[:80]}...")
            
            results["hot_session"]["tier"] = hot_session.get("tier")
            results["hot_session"]["reason"] = hot_session.get("reason")
            
            # Verify tier is not "unscored"
            if hot_session.get("tier") == "unscored":
                error_msg = "❌ CRITICAL: HOT session tier is 'unscored'"
                print(f"\n{error_msg}")
                results["errors"].append(error_msg)
            else:
                print(f"   ✅ Tier is NOT 'unscored'")
            
            # Verify reason is not empty
            if not hot_session.get("reason") or hot_session.get("reason").strip() == "":
                error_msg = "❌ CRITICAL: HOT session reason is EMPTY"
                print(f"\n{error_msg}")
                results["errors"].append(error_msg)
            else:
                print(f"   ✅ Reason is NOT empty")
            
            # Verify tier is hot or warm (should be hot based on signals)
            tier = hot_session.get("tier")
            if tier not in ["hot", "warm"]:
                error_msg = f"❌ WARNING: HOT session tier is '{tier}' (expected 'hot' or 'warm')"
                print(f"\n{error_msg}")
                results["errors"].append(error_msg)
            else:
                print(f"   ✅ Tier is '{tier}' (hot or warm as expected)")
        
        # ============================================================
        # TEST 6: Verify COLD lead scoring
        # ============================================================
        print("\n📊 TEST 6: Verifying COLD lead scoring...")
        
        cold_session = next((s for s in sessions if s["sessionId"] == cold_session_id), None)
        
        if not cold_session:
            error_msg = f"❌ COLD session {cold_session_id} not found in sessions list"
            print(error_msg)
            results["errors"].append(error_msg)
        else:
            print(f"✅ Found COLD session in sessions list")
            print(f"   Session ID: {cold_session['sessionId']}")
            print(f"   Tier: {cold_session.get('tier', 'MISSING')}")
            print(f"   Reason: {cold_session.get('reason', 'MISSING')}")
            print(f"   Message count: {cold_session.get('count', 0)}")
            print(f"   Preview: {cold_session.get('preview', '')[:80]}...")
            
            results["cold_session"]["tier"] = cold_session.get("tier")
            results["cold_session"]["reason"] = cold_session.get("reason")
            
            # Verify tier is not "unscored"
            if cold_session.get("tier") == "unscored":
                error_msg = "❌ CRITICAL: COLD session tier is 'unscored'"
                print(f"\n{error_msg}")
                results["errors"].append(error_msg)
            else:
                print(f"   ✅ Tier is NOT 'unscored'")
            
            # Verify reason is not empty
            if not cold_session.get("reason") or cold_session.get("reason").strip() == "":
                error_msg = "❌ CRITICAL: COLD session reason is EMPTY"
                print(f"\n{error_msg}")
                results["errors"].append(error_msg)
            else:
                print(f"   ✅ Reason is NOT empty")
            
            # Verify tier is cold or warm
            tier = cold_session.get("tier")
            if tier not in ["cold", "warm"]:
                error_msg = f"❌ WARNING: COLD session tier is '{tier}' (expected 'cold' or 'warm')"
                print(f"\n{error_msg}")
                results["errors"].append(error_msg)
            else:
                print(f"   ✅ Tier is '{tier}' (cold or warm as expected)")
        
    except requests.exceptions.Timeout:
        error_msg = "❌ Request timeout - API took too long to respond"
        print(error_msg)
        results["errors"].append(error_msg)
    except requests.exceptions.RequestException as e:
        error_msg = f"❌ Request failed: {str(e)}"
        print(error_msg)
        results["errors"].append(error_msg)
    except Exception as e:
        error_msg = f"❌ Unexpected error: {str(e)}"
        print(error_msg)
        results["errors"].append(error_msg)
    
    return results

def print_summary(results):
    """Print test summary"""
    print_section("TEST SUMMARY")
    
    if results["errors"]:
        print(f"❌ TESTS FAILED - {len(results['errors'])} error(s) found:\n")
        for i, error in enumerate(results["errors"], 1):
            print(f"{i}. {error}")
    else:
        print("✅ ALL TESTS PASSED")
    
    print("\n" + "="*80)
    print("DETAILED RESULTS:")
    print("="*80)
    
    if results["hot_session"]:
        print(f"\n🔥 HOT Lead Session:")
        print(f"   Session ID: {results['hot_session'].get('sessionId', 'N/A')}")
        print(f"   Tier: {results['hot_session'].get('tier', 'N/A')}")
        print(f"   Reason: {results['hot_session'].get('reason', 'N/A')}")
    
    if results["cold_session"]:
        print(f"\n❄️  COLD Lead Session:")
        print(f"   Session ID: {results['cold_session'].get('sessionId', 'N/A')}")
        print(f"   Tier: {results['cold_session'].get('tier', 'N/A')}")
        print(f"   Reason: {results['cold_session'].get('reason', 'N/A')}")
    
    print("\n" + "="*80)
    
    # Return exit code
    return 0 if not results["errors"] else 1

if __name__ == "__main__":
    print("="*80)
    print("  PyTech Digital - Lead Scoring Backend Test")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin Password: {ADMIN_PASSWORD}")
    
    results = test_lead_scoring()
    exit_code = print_summary(results)
    
    exit(exit_code)
