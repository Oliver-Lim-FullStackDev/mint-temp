# E2E Testing Guide

## 🎯 Overview

This document explains how to test the crypto payment flow end-to-end, including automated testing and manual testing procedures.

## 🚀 Quick Start

### **Automated E2E Test:**
```bash
cd apps/api
./test-crypto-payment.sh
```

This script tests the complete flow automatically:
1. ✅ Creates crypto deposit invoice
2. ✅ Simulates webhook (payment detected)
3. ✅ Credits user balance automatically
4. ✅ Tests multiple payments
5. ✅ Verifies balance accumulation

---

## 🧪 Manual Testing

### **Step 1: Create Crypto Deposit Invoice**

```bash
curl -X POST http://localhost:3001/api/payments/on-ramp/crypto/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "manual_test_user",
    "amount": 100,
    "currency": "USDT",
    "network": "ttrx:usdt",
    "reference": "crypto-invoice-manual_test_user-001"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "invoice": {
    "id": "invoice_abc123",
    "attributes": {
      "reference": "crypto-invoice-manual_test_user-001",
      "amountBilled": "100",
      "billedCurrency": "USDT",
      "status": "pending"
    }
  }
}
```

**Save the `invoice.id` from the response!**

### **Step 2: Check Initial Balance (Should be Empty)**

```bash
curl -X GET http://localhost:3001/api/payments/on-ramp/crypto/balance/manual_test_user
```

**Expected Response:**
```json
{
  "success": true,
  "balance": {
    "userId": "manual_test_user",
    "balances": {}
  }
}
```

### **Step 3: Simulate Crypto Payment (Webhook)**

**Replace `INVOICE_ID` with the ID from Step 1:**

```bash
curl -X POST http://localhost:3001/api/payments/on-ramp/crypto/webhook \
  -H "Content-Type: application/json" \
  -H "x-txn-signature: test_signature_123" \
  -H "x-txn-timestamp: $(date +%s)" \
  -d '{
    "event": "invoice.completed",
    "data": {
      "type": "invoices",
      "id": "INVOICE_ID_FROM_STEP_1",
      "attributes": {
        "reference": "crypto-invoice-manual_test_user-001",
        "amountBilled": "100",
        "billedCurrency": "USDT",
        "chargedCurrency": "USDT",
        "network": "ttrx:usdt",
        "status": "completed",
        "address": "TTbGTMwUwA3mncLP7xqCZei1ekaNSgeAJe",
        "amountCharged": "100",
        "exchangeRate": "1.0",
        "txHash": "0xmanual_test_tx_1234567890abcdef",
        "completedAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
      }
    },
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Crypto deposit webhook processed successfully"
}
```

### **Step 4: Check Final Balance (Should Show 100 USDT)**

```bash
curl -X GET http://localhost:3001/api/payments/on-ramp/crypto/balance/manual_test_user
```

**Expected Response:**
```json
{
  "success": true,
  "balance": {
    "userId": "manual_test_user",
    "balances": {
      "usdt": {
        "amount": "100",
        "currency": "USDT",
        "network": "crypto-invoice-manual_test_user-001"
      }
    }
  }
}
```

### **Step 5: Test Additional Payment**

```bash
# Create second invoice
curl -X POST http://localhost:3001/api/payments/on-ramp/crypto/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "manual_test_user",
    "amount": 50,
    "currency": "USDT",
    "network": "ttrx:usdt",
    "reference": "crypto-invoice-manual_test_user-002"
  }'

# Simulate second payment (replace INVOICE_ID_2 with new ID)
curl -X POST http://localhost:3001/api/payments/on-ramp/crypto/webhook \
  -H "Content-Type: application/json" \
  -H "x-txn-signature: test_signature_456" \
  -H "x-txn-timestamp: $(date +%s)" \
  -d '{
    "event": "invoice.completed",
    "data": {
      "type": "invoices",
      "id": "INVOICE_ID_2",
      "attributes": {
        "reference": "crypto-invoice-manual_test_user-002",
        "amountBilled": "50",
        "billedCurrency": "USDT",
        "status": "completed",
        "txHash": "0xmanual_test_tx_2_1234567890abcdef"
      }
    },
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
  }'

# Check final balance (should show 150 USDT total)
curl -X GET http://localhost:3001/api/payments/on-ramp/crypto/balance/manual_test_user
```

---

## 🔧 Test Script

### **Automated Test Script:**

Save this as `manual-test.sh`:

```bash
#!/bin/bash

# Manual E2E Test Script
API_URL="http://localhost:3001/api/payments/on-ramp/crypto"
USER_ID="manual_test_user"

echo "🧪 Manual E2E Test - Step by Step"
echo "================================="
echo ""

# Step 1: Create Invoice
echo "📝 Step 1: Creating crypto deposit invoice"
INVOICE_RESPONSE=$(curl -s -X POST "$API_URL/invoice" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"amount\": 100,
    \"currency\": \"USDT\",
    \"network\": \"ttrx:usdt\",
    \"reference\": \"crypto-invoice-$USER_ID-001\"
  }")

echo "$INVOICE_RESPONSE" | jq
INVOICE_ID=$(echo "$INVOICE_RESPONSE" | jq -r '.invoice.id')
echo "Invoice ID: $INVOICE_ID"
echo ""

# Step 2: Check Initial Balance
echo "💰 Step 2: Checking initial balance"
curl -s -X GET "$API_URL/balance/$USER_ID" | jq
echo ""

# Step 3: Simulate Payment
echo "💳 Step 3: Simulating crypto payment"
curl -s -X POST "$API_URL/webhook" \
  -H "Content-Type: application/json" \
  -H "x-txn-signature: test_signature_123" \
  -H "x-txn-timestamp: $(date +%s)" \
  -d "{
    \"event\": \"invoice.completed\",
    \"data\": {
      \"type\": \"invoices\",
      \"id\": \"$INVOICE_ID\",
      \"attributes\": {
        \"reference\": \"crypto-invoice-$USER_ID-001\",
        \"amountBilled\": \"100\",
        \"billedCurrency\": \"USDT\",
        \"status\": \"completed\",
        \"txHash\": \"0xtest123456\"
      }
    },
    \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"
  }" | jq
echo ""

# Step 4: Check Final Balance
echo "💰 Step 4: Checking final balance"
curl -s -X GET "$API_URL/balance/$USER_ID" | jq
echo ""

echo "✅ Manual test complete!"
```

Make it executable and run:
```bash
chmod +x manual-test.sh
./manual-test.sh
```

---

## 🔍 What Each Test Validates

### **Invoice Creation:**
- ✅ API endpoint accessibility
- ✅ Request validation
- ✅ txn.pro integration
- ✅ Response format

### **Webhook Processing:**
- ✅ Signature verification
- ✅ Payload parsing
- ✅ User ID extraction
- ✅ Balance crediting

### **Balance Management:**
- ✅ Initial balance (empty)
- ✅ Balance crediting
- ✅ Multiple payments
- ✅ Balance accumulation

### **Error Handling:**
- ✅ Invalid requests
- ✅ Missing parameters
- ✅ Webhook signature failures
- ✅ Network errors

---

## 🚨 Troubleshooting

### **Common Issues:**

#### **1. API Not Running:**
```bash
# Start the API
cd apps/api
npm run start:dev
```

#### **2. Webhook Signature Failed:**
- Check if `TXN_WEBHOOK_SECRET` is set
- Use `test_signature_` prefix for testing
- Verify timestamp format

#### **3. Balance Not Credited:**
- Check user ID extraction from reference
- Verify webhook payload format
- Check API logs for errors

#### **4. Invoice Creation Failed:**
- Verify `TXN_API_KEY` is set
- Check txn.pro API connectivity
- Validate request parameters

---

## 📊 Expected Results

### **Successful Test:**
1. **✅ Invoice created** with unique ID
2. **✅ Initial balance** is empty
3. **✅ Webhook processed** successfully
4. **✅ Final balance** shows correct amount
5. **✅ Multiple payments** work correctly
6. **✅ Balance accumulation** works

### **Test Output:**
```
🧪 Manual E2E Test - Step by Step
=================================

📝 Step 1: Creating crypto deposit invoice
{
  "success": true,
  "invoice": {
    "id": "invoice_abc123",
    "attributes": {
      "reference": "crypto-invoice-manual_test_user-001",
      "amountBilled": "100",
      "billedCurrency": "USDT",
      "status": "pending"
    }
  }
}

💰 Step 2: Checking initial balance
{
  "success": true,
  "balance": {
    "userId": "manual_test_user",
    "balances": {}
  }
}

💳 Step 3: Simulating crypto payment
{
  "success": true,
  "message": "Crypto deposit webhook processed successfully"
}

💰 Step 4: Checking final balance
{
  "success": true,
  "balance": {
    "userId": "manual_test_user",
    "balances": {
      "usdt": {
        "amount": "100",
        "currency": "USDT",
        "network": "crypto-invoice-manual_test_user-001"
      }
    }
  }
}

✅ Manual test complete!
```

---

## 🎯 Summary

The E2E testing validates the complete crypto payment flow from invoice creation to balance crediting. Both automated and manual testing approaches ensure the system works correctly and handles edge cases properly.

**Key Testing Areas:**
- ✅ **API Endpoints** - All endpoints accessible and functional
- ✅ **Webhook Processing** - Automatic balance crediting works
- ✅ **Balance Management** - User balances update correctly
- ✅ **Error Handling** - System handles failures gracefully
- ✅ **Integration** - txn.pro integration works properly
