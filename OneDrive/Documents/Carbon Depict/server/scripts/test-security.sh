#!/bin/bash

# Security Testing Script for Phase 1 Week 1
# Tests rate limiting, password validation, and session security

echo "=========================================="
echo "  Security Testing - Phase 1 Week 1"
echo "=========================================="
echo ""

API_URL="${API_URL:-http://localhost:5500/api}"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
pass_test() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((TESTS_PASSED++))
    ((TESTS_RUN++))
}

fail_test() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((TESTS_FAILED++))
    ((TESTS_RUN++))
}

info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Test 1: Health Check
echo "Test 1: Health Check Endpoint"
echo "------------------------------"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)
BODY=$(echo "$HEALTH_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    pass_test "Health check returned 200 OK"
else
    fail_test "Health check returned $HTTP_CODE (expected 200)"
fi

if echo "$BODY" | grep -q '"status":"ok"'; then
    pass_test "Health check status is 'ok'"
else
    fail_test "Health check status is not 'ok'"
fi
echo ""

# Test 2: Auth Rate Limiting
echo "Test 2: Authentication Rate Limiting"
echo "-------------------------------------"
info "Sending 7 login requests (limit is 5)..."

SUCCESS_COUNT=0
RATE_LIMITED=0

for i in {1..7}; do
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"test@test.com","password":"wrongpassword"}')

    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

    if [ $i -le 5 ]; then
        # First 5 should not be rate limited
        if [ "$HTTP_CODE" != "429" ]; then
            ((SUCCESS_COUNT++))
        fi
    else
        # 6th and 7th should be rate limited
        if [ "$HTTP_CODE" = "429" ]; then
            ((RATE_LIMITED++))
        fi
    fi

    # Small delay between requests
    sleep 0.5
done

if [ $SUCCESS_COUNT -eq 5 ]; then
    pass_test "First 5 requests allowed (not rate limited)"
else
    fail_test "Expected 5 requests allowed, got $SUCCESS_COUNT"
fi

if [ $RATE_LIMITED -ge 1 ]; then
    pass_test "Requests after limit were blocked (HTTP 429)"
else
    fail_test "Rate limiting did not block requests after limit"
fi

info "Waiting 5 seconds for rate limit to reset..."
sleep 5
echo ""

# Test 3: Weak Password Validation
echo "Test 3: Password Validation - Weak Password"
echo "--------------------------------------------"
WEAK_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "email":"weakpass'$RANDOM'@test.com",
        "password":"short",
        "firstName":"Test",
        "lastName":"User",
        "companyName":"Test Co"
    }')

HTTP_CODE=$(echo "$WEAK_RESPONSE" | tail -n 1)
BODY=$(echo "$WEAK_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "201" ]; then
    pass_test "Weak password rejected (HTTP $HTTP_CODE)"
else
    fail_test "Weak password was accepted (should be rejected)"
fi

if echo "$BODY" | grep -qi "password"; then
    pass_test "Error message mentions password"
else
    fail_test "Error message doesn't mention password"
fi
echo ""

# Test 4: Common Password Validation
echo "Test 4: Password Validation - Common Password"
echo "----------------------------------------------"
COMMON_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "email":"common'$RANDOM'@test.com",
        "password":"Password123!",
        "firstName":"Test",
        "lastName":"User",
        "companyName":"Test Co"
    }')

HTTP_CODE=$(echo "$COMMON_RESPONSE" | tail -n 1)
BODY=$(echo "$COMMON_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "201" ]; then
    pass_test "Common password rejected (HTTP $HTTP_CODE)"
else
    fail_test "Common password was accepted (should be rejected)"
fi

if echo "$BODY" | grep -qi "common"; then
    pass_test "Error message mentions 'common' password"
else
    info "Warning: Error message doesn't mention 'common'"
fi
echo ""

# Test 5: Strong Password Validation
echo "Test 5: Password Validation - Strong Password"
echo "----------------------------------------------"
STRONG_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "email":"strongpass'$RANDOM'@test.com",
        "password":"MyStr0ng!Unique#Pass2025",
        "firstName":"Test",
        "lastName":"User",
        "companyName":"Test Company Inc"
    }')

HTTP_CODE=$(echo "$STRONG_RESPONSE" | tail -n 1)
BODY=$(echo "$STRONG_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    pass_test "Strong password accepted (HTTP $HTTP_CODE)"
else
    fail_test "Strong password rejected (HTTP $HTTP_CODE, should be accepted)"
    info "Response: $BODY"
fi

if echo "$BODY" | grep -q "token"; then
    pass_test "Response contains auth token"
else
    fail_test "Response doesn't contain auth token"
fi
echo ""

# Test Summary
echo "=========================================="
echo "  Test Summary"
echo "=========================================="
echo "Total Tests: $TESTS_RUN"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All security tests passed!${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the implementation.${NC}"
    echo ""
    exit 1
fi
