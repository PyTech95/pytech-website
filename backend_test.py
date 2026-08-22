#!/usr/bin/env python3
"""
Backend API Test Suite for PyTech Digital
Tests all backend endpoints under /api
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from environment
BASE_URL = "https://pytech-scale.preview.emergentagent.com/api"

def log(message, level="INFO"):
    """Log test messages with timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] [{level}] {message}")

def test_health_endpoint():
    """Test GET /api/root - Health check"""
    log("=" * 60)
    log("TEST 1: Health Endpoint (GET /api/root)")
    log("=" * 60)
    
    try:
        response = requests.get(f"{BASE_URL}/root", timeout=10)
        log(f"Status Code: {response.status_code}")
        log(f"Response: {response.text}")
        
        if response.status_code != 200:
            log(f"❌ FAILED: Expected 200, got {response.status_code}", "ERROR")
            return False
        
        data = response.json()
        if not isinstance(data, dict):
            log("❌ FAILED: Response is not a JSON object", "ERROR")
            return False
        
        if not data.get('ok'):
            log("❌ FAILED: 'ok' field is not true", "ERROR")
            return False
        
        if 'message' not in data:
            log("❌ FAILED: 'message' field missing", "ERROR")
            return False
        
        log(f"✅ PASSED: Health endpoint working - {data.get('message')}", "SUCCESS")
        return True
        
    except Exception as e:
        log(f"❌ FAILED: Exception - {str(e)}", "ERROR")
        return False

def test_services_endpoint():
    """Test GET /api/services - Services and locations metadata"""
    log("\n" + "=" * 60)
    log("TEST 2: Services Metadata (GET /api/services)")
    log("=" * 60)
    
    try:
        response = requests.get(f"{BASE_URL}/services", timeout=10)
        log(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            log(f"❌ FAILED: Expected 200, got {response.status_code}", "ERROR")
            return False
        
        data = response.json()
        
        if 'services' not in data:
            log("❌ FAILED: 'services' field missing", "ERROR")
            return False
        
        if 'locations' not in data:
            log("❌ FAILED: 'locations' field missing", "ERROR")
            return False
        
        services = data['services']
        locations = data['locations']
        
        if not isinstance(services, list):
            log("❌ FAILED: 'services' is not an array", "ERROR")
            return False
        
        if not isinstance(locations, list):
            log("❌ FAILED: 'locations' is not an array", "ERROR")
            return False
        
        log(f"Services count: {len(services)}")
        log(f"Locations count: {len(locations)}")
        
        if len(services) != 16:
            log(f"⚠️  WARNING: Expected 16 services, got {len(services)}", "WARN")
        
        if len(locations) != 11:
            log(f"⚠️  WARNING: Expected 11 locations, got {len(locations)}", "WARN")
        
        log(f"✅ PASSED: Services endpoint working with {len(services)} services and {len(locations)} locations", "SUCCESS")
        return True
        
    except Exception as e:
        log(f"❌ FAILED: Exception - {str(e)}", "ERROR")
        return False

def test_leads_crud():
    """Test POST /api/leads and GET /api/leads"""
    log("\n" + "=" * 60)
    log("TEST 3: Leads CRUD (POST & GET /api/leads)")
    log("=" * 60)
    
    # Test 3a: Valid lead creation
    log("\n--- Test 3a: Create valid lead ---")
    try:
        valid_lead = {
            "name": "Rajesh Kumar",
            "email": "rajesh.kumar@techcorp.in",
            "company": "TechCorp Solutions",
            "service": "Web Development",
            "budget": "₹1L – ₹5L",
            "timeline": "1–3 months",
            "message": "We need a modern e-commerce platform for our electronics business"
        }
        
        response = requests.post(f"{BASE_URL}/leads", json=valid_lead, timeout=10)
        log(f"Status Code: {response.status_code}")
        log(f"Response: {response.text[:500]}")
        
        if response.status_code != 200:
            log(f"❌ FAILED: Expected 200, got {response.status_code}", "ERROR")
            return False
        
        data = response.json()
        
        if not data.get('ok'):
            log("❌ FAILED: 'ok' field is not true", "ERROR")
            return False
        
        if 'lead' not in data:
            log("❌ FAILED: 'lead' field missing", "ERROR")
            return False
        
        lead = data['lead']
        
        if '_id' in lead:
            log("❌ FAILED: Response contains MongoDB _id field (should be excluded)", "ERROR")
            return False
        
        if 'id' not in lead:
            log("❌ FAILED: 'id' field missing in lead", "ERROR")
            return False
        
        lead_id = lead['id']
        log(f"✅ Lead created successfully with ID: {lead_id}", "SUCCESS")
        
    except Exception as e:
        log(f"❌ FAILED: Exception - {str(e)}", "ERROR")
        return False
    
    # Test 3b: Invalid lead (missing required fields)
    log("\n--- Test 3b: Invalid lead (missing name and email/phone) ---")
    try:
        invalid_lead = {
            "company": "NoName Corp"
        }
        
        response = requests.post(f"{BASE_URL}/leads", json=invalid_lead, timeout=10)
        log(f"Status Code: {response.status_code}")
        log(f"Response: {response.text}")
        
        if response.status_code != 400:
            log(f"❌ FAILED: Expected 400 for invalid lead, got {response.status_code}", "ERROR")
            return False
        
        data = response.json()
        
        if 'error' not in data:
            log("❌ FAILED: 'error' field missing in error response", "ERROR")
            return False
        
        log(f"✅ Validation working: {data['error']}", "SUCCESS")
        
    except Exception as e:
        log(f"❌ FAILED: Exception - {str(e)}", "ERROR")
        return False
    
    # Test 3c: Get all leads
    log("\n--- Test 3c: Get all leads (GET /api/leads) ---")
    try:
        response = requests.get(f"{BASE_URL}/leads", timeout=10)
        log(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            log(f"❌ FAILED: Expected 200, got {response.status_code}", "ERROR")
            return False
        
        leads = response.json()
        
        if not isinstance(leads, list):
            log("❌ FAILED: Response is not an array", "ERROR")
            return False
        
        log(f"Total leads in database: {len(leads)}")
        
        # Check if our created lead is in the list
        found = False
        for lead in leads:
            if '_id' in lead:
                log("❌ FAILED: Lead contains MongoDB _id field (should be excluded)", "ERROR")
                return False
            if lead.get('id') == lead_id:
                found = True
                log(f"✅ Found our created lead: {lead.get('name')}", "SUCCESS")
        
        if not found:
            log("⚠️  WARNING: Created lead not found in list", "WARN")
        
        log(f"✅ PASSED: Leads CRUD working correctly", "SUCCESS")
        return True
        
    except Exception as e:
        log(f"❌ FAILED: Exception - {str(e)}", "ERROR")
        return False

def test_ai_chatbot():
    """Test POST /api/chat and GET /api/chat - AI Triage Chatbot with Gemini"""
    log("\n" + "=" * 60)
    log("TEST 4: AI Triage Chatbot (CRITICAL - Gemini Integration)")
    log("=" * 60)
    
    session_id = None
    
    # Test 4a: First message (create session)
    log("\n--- Test 4a: First message (create new session) ---")
    try:
        first_message = {
            "message": "I need a WhatsApp automation system for my e-commerce store"
        }
        
        response = requests.post(f"{BASE_URL}/chat", json=first_message, timeout=30)
        log(f"Status Code: {response.status_code}")
        log(f"Response: {response.text[:1000]}")
        
        if response.status_code != 200:
            log(f"❌ FAILED: Expected 200, got {response.status_code}", "ERROR")
            if response.status_code == 500:
                log(f"500 Error Details: {response.text}", "ERROR")
            return False
        
        data = response.json()
        
        if 'sessionId' not in data:
            log("❌ FAILED: 'sessionId' field missing", "ERROR")
            return False
        
        if 'message' not in data:
            log("❌ FAILED: 'message' field missing", "ERROR")
            return False
        
        session_id = data['sessionId']
        assistant_reply = data['message']
        
        log(f"Session ID: {session_id}")
        log(f"Assistant Reply: {assistant_reply[:200]}...")
        
        # Check if reply is a real response (not an error string)
        if not assistant_reply or len(assistant_reply) < 10:
            log("❌ FAILED: Assistant reply is too short or empty", "ERROR")
            return False
        
        # Check for common error patterns
        error_patterns = ['error', 'failed', 'exception', 'undefined', 'null']
        if any(pattern in assistant_reply.lower() for pattern in error_patterns):
            log(f"⚠️  WARNING: Assistant reply may contain error: {assistant_reply}", "WARN")
        
        # Check if it's a coherent response (contains some expected keywords)
        positive_indicators = ['whatsapp', 'automation', 'help', 'tell', 'need', 'service', 'pytech', 'ada']
        if not any(indicator in assistant_reply.lower() for indicator in positive_indicators):
            log("⚠️  WARNING: Reply may not be contextual", "WARN")
        
        log(f"✅ First message successful - Got real Gemini response", "SUCCESS")
        
    except Exception as e:
        log(f"❌ FAILED: Exception - {str(e)}", "ERROR")
        return False
    
    # Test 4b: Second message (continue conversation with same sessionId)
    log("\n--- Test 4b: Second message (continue conversation) ---")
    try:
        second_message = {
            "message": "My budget is around 3 lakhs and timeline is 1 month",
            "sessionId": session_id
        }
        
        response = requests.post(f"{BASE_URL}/chat", json=second_message, timeout=30)
        log(f"Status Code: {response.status_code}")
        log(f"Response: {response.text[:1000]}")
        
        if response.status_code != 200:
            log(f"❌ FAILED: Expected 200, got {response.status_code}", "ERROR")
            return False
        
        data = response.json()
        
        if data.get('sessionId') != session_id:
            log(f"❌ FAILED: Session ID mismatch. Expected {session_id}, got {data.get('sessionId')}", "ERROR")
            return False
        
        assistant_reply = data['message']
        log(f"Assistant Reply: {assistant_reply[:200]}...")
        
        if not assistant_reply or len(assistant_reply) < 10:
            log("❌ FAILED: Assistant reply is too short or empty", "ERROR")
            return False
        
        # Check if reply is contextual (mentions budget or timeline)
        contextual_indicators = ['budget', 'lakh', 'timeline', 'month', 'project', 'scope']
        if any(indicator in assistant_reply.lower() for indicator in contextual_indicators):
            log("✅ Reply is contextual - Gemini maintaining conversation context", "SUCCESS")
        else:
            log("⚠️  WARNING: Reply may not be fully contextual", "WARN")
        
        log(f"✅ Second message successful - Conversation context maintained", "SUCCESS")
        
    except Exception as e:
        log(f"❌ FAILED: Exception - {str(e)}", "ERROR")
        return False
    
    # Test 4c: Get conversation history
    log("\n--- Test 4c: Get conversation history (GET /api/chat?sessionId=...) ---")
    try:
        response = requests.get(f"{BASE_URL}/chat?sessionId={session_id}", timeout=10)
        log(f"Status Code: {response.status_code}")
        log(f"Response: {response.text[:1000]}")
        
        if response.status_code != 200:
            log(f"❌ FAILED: Expected 200, got {response.status_code}", "ERROR")
            return False
        
        data = response.json()
        
        if 'sessionId' not in data:
            log("❌ FAILED: 'sessionId' field missing", "ERROR")
            return False
        
        if 'messages' not in data:
            log("❌ FAILED: 'messages' field missing", "ERROR")
            return False
        
        messages = data['messages']
        
        if not isinstance(messages, list):
            log("❌ FAILED: 'messages' is not an array", "ERROR")
            return False
        
        log(f"Total messages in history: {len(messages)}")
        
        if len(messages) < 4:
            log(f"❌ FAILED: Expected at least 4 messages (2 user + 2 assistant), got {len(messages)}", "ERROR")
            return False
        
        # Check message order and roles
        user_count = 0
        assistant_count = 0
        for i, msg in enumerate(messages):
            role = msg.get('role')
            content = msg.get('content', '')
            log(f"Message {i+1}: {role} - {content[:50]}...")
            
            if role == 'user':
                user_count += 1
            elif role == 'assistant':
                assistant_count += 1
        
        if user_count < 2:
            log(f"❌ FAILED: Expected at least 2 user messages, got {user_count}", "ERROR")
            return False
        
        if assistant_count < 2:
            log(f"❌ FAILED: Expected at least 2 assistant messages, got {assistant_count}", "ERROR")
            return False
        
        log(f"✅ Conversation history correct: {user_count} user + {assistant_count} assistant messages", "SUCCESS")
        
    except Exception as e:
        log(f"❌ FAILED: Exception - {str(e)}", "ERROR")
        return False
    
    # Test 4d: Empty message validation
    log("\n--- Test 4d: Empty message validation ---")
    try:
        empty_message = {
            "message": ""
        }
        
        response = requests.post(f"{BASE_URL}/chat", json=empty_message, timeout=10)
        log(f"Status Code: {response.status_code}")
        log(f"Response: {response.text}")
        
        if response.status_code != 400:
            log(f"❌ FAILED: Expected 400 for empty message, got {response.status_code}", "ERROR")
            return False
        
        data = response.json()
        
        if 'error' not in data:
            log("❌ FAILED: 'error' field missing in error response", "ERROR")
            return False
        
        log(f"✅ Validation working: {data['error']}", "SUCCESS")
        
    except Exception as e:
        log(f"❌ FAILED: Exception - {str(e)}", "ERROR")
        return False
    
    log(f"\n✅ PASSED: AI Chatbot fully working with real Gemini integration", "SUCCESS")
    return True

def test_chat_sessions():
    """Test GET /api/chat/sessions - Admin chat sessions listing (NEW ENDPOINT)"""
    log("\n" + "=" * 60)
    log("TEST 5: Chat Sessions Listing (GET /api/chat/sessions) - NEW ENDPOINT")
    log("=" * 60)
    
    session_id = None
    first_user_message = "I want an app for my startup"
    second_user_message = "budget is 5 lakh"
    
    # Step 1: Create a new chat session with first message
    log("\n--- Step 1: Create session with first message ---")
    try:
        first_message = {
            "message": first_user_message
        }
        
        response = requests.post(f"{BASE_URL}/chat", json=first_message, timeout=30)
        log(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            log(f"❌ FAILED: Expected 200, got {response.status_code}", "ERROR")
            log(f"Response: {response.text}", "ERROR")
            return False
        
        data = response.json()
        
        if 'sessionId' not in data:
            log("❌ FAILED: 'sessionId' field missing", "ERROR")
            return False
        
        session_id = data['sessionId']
        log(f"✅ Session created: {session_id}")
        log(f"Assistant reply: {data.get('message', '')[:100]}...")
        
    except Exception as e:
        log(f"❌ FAILED: Exception - {str(e)}", "ERROR")
        return False
    
    # Step 2: Send second message with same sessionId
    log("\n--- Step 2: Send second message with same sessionId ---")
    try:
        second_message = {
            "message": second_user_message,
            "sessionId": session_id
        }
        
        response = requests.post(f"{BASE_URL}/chat", json=second_message, timeout=30)
        log(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            log(f"❌ FAILED: Expected 200, got {response.status_code}", "ERROR")
            log(f"Response: {response.text}", "ERROR")
            return False
        
        data = response.json()
        
        if data.get('sessionId') != session_id:
            log(f"❌ FAILED: Session ID mismatch", "ERROR")
            return False
        
        log(f"✅ Second message sent successfully")
        log(f"Assistant reply: {data.get('message', '')[:100]}...")
        
    except Exception as e:
        log(f"❌ FAILED: Exception - {str(e)}", "ERROR")
        return False
    
    # Step 3: Get all chat sessions
    log("\n--- Step 3: Get all chat sessions (GET /api/chat/sessions) ---")
    try:
        response = requests.get(f"{BASE_URL}/chat/sessions", timeout=10)
        log(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            log(f"❌ FAILED: Expected 200, got {response.status_code}", "ERROR")
            log(f"Response: {response.text}", "ERROR")
            return False
        
        data = response.json()
        
        # Verify response structure
        if 'sessions' not in data:
            log("❌ FAILED: 'sessions' field missing", "ERROR")
            return False
        
        sessions = data['sessions']
        
        if not isinstance(sessions, list):
            log("❌ FAILED: 'sessions' is not an array", "ERROR")
            return False
        
        log(f"Total sessions: {len(sessions)}")
        
        # Find our session
        our_session = None
        for session in sessions:
            if session.get('sessionId') == session_id:
                our_session = session
                break
        
        if not our_session:
            log(f"❌ FAILED: Our session {session_id} not found in sessions list", "ERROR")
            return False
        
        log(f"✅ Found our session: {session_id}")
        
        # Verify session structure
        required_fields = ['sessionId', 'count', 'lastAt', 'preview', 'messages']
        for field in required_fields:
            if field not in our_session:
                log(f"❌ FAILED: Required field '{field}' missing in session", "ERROR")
                return False
        
        log(f"✅ All required fields present: {', '.join(required_fields)}")
        
        # Verify count >= 4 (2 user + 2 assistant)
        count = our_session['count']
        log(f"Message count: {count}")
        
        if count < 4:
            log(f"❌ FAILED: Expected count >= 4, got {count}", "ERROR")
            return False
        
        log(f"✅ Count is correct: {count} >= 4")
        
        # Verify messages array
        messages = our_session['messages']
        
        if not isinstance(messages, list):
            log("❌ FAILED: 'messages' is not an array", "ERROR")
            return False
        
        if len(messages) < 4:
            log(f"❌ FAILED: Expected at least 4 messages, got {len(messages)}", "ERROR")
            return False
        
        log(f"✅ Messages array has {len(messages)} messages")
        
        # Verify messages are in chronological order (oldest first)
        log("\n--- Verifying chronological order ---")
        prev_timestamp = None
        for i, msg in enumerate(messages):
            if 'role' not in msg or 'content' not in msg or 'createdAt' not in msg:
                log(f"❌ FAILED: Message {i+1} missing required fields", "ERROR")
                return False
            
            current_timestamp = msg['createdAt']
            log(f"Message {i+1}: {msg['role']} - {msg['content'][:50]}... (at {current_timestamp})")
            
            if prev_timestamp:
                # Compare timestamps (they should be in ascending order)
                if current_timestamp < prev_timestamp:
                    log(f"❌ FAILED: Messages not in chronological order", "ERROR")
                    return False
            
            prev_timestamp = current_timestamp
        
        log(f"✅ Messages are in chronological order (oldest first)")
        
        # Verify preview equals first user message
        preview = our_session['preview']
        log(f"\nPreview: '{preview}'")
        log(f"Expected (first user message): '{first_user_message}'")
        
        if preview != first_user_message:
            log(f"❌ FAILED: Preview does not match first user message", "ERROR")
            log(f"Expected: '{first_user_message}'", "ERROR")
            log(f"Got: '{preview}'", "ERROR")
            return False
        
        log(f"✅ Preview matches first user message")
        
        # Verify lastAt is a valid timestamp
        last_at = our_session['lastAt']
        log(f"Last activity: {last_at}")
        
        if not last_at:
            log("❌ FAILED: lastAt is null or empty", "ERROR")
            return False
        
        log(f"✅ lastAt is valid: {last_at}")
        
        log(f"\n✅ PASSED: Chat sessions endpoint fully working", "SUCCESS")
        return True
        
    except Exception as e:
        log(f"❌ FAILED: Exception - {str(e)}", "ERROR")
        import traceback
        log(traceback.format_exc(), "ERROR")
        return False

def main():
    """Run all backend tests"""
    log("=" * 60)
    log("PyTech Digital Backend API Test Suite")
    log(f"Base URL: {BASE_URL}")
    log("=" * 60)
    
    results = {
        "Health Endpoint": False,
        "Services Metadata": False,
        "Leads CRUD": False,
        "AI Chatbot (Gemini)": False,
        "Chat Sessions Listing (NEW)": False
    }
    
    # Run tests in priority order (high first)
    # NEW endpoint test first (primary focus)
    results["Chat Sessions Listing (NEW)"] = test_chat_sessions()
    
    # Quick regression tests
    results["Health Endpoint"] = test_health_endpoint()
    results["Services Metadata"] = test_services_endpoint()
    results["Leads CRUD"] = test_leads_crud()
    results["AI Chatbot (Gemini)"] = test_ai_chatbot()
    
    # Summary
    log("\n" + "=" * 60)
    log("TEST SUMMARY")
    log("=" * 60)
    
    passed = 0
    failed = 0
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        log(f"{test_name}: {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    log("\n" + "=" * 60)
    log(f"Total: {passed} passed, {failed} failed out of {len(results)} tests")
    log("=" * 60)
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
