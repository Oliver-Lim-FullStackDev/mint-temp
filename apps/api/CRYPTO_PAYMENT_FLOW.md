# Crypto Payment Flow (New Payments API)

## 🎯 Overview

This document explains how the payment flow works in the new **Payments API** structure. Users can deposit cryptocurrency (USDT, TON, etc.) or fiat currency (USD, EUR, TRY) through multiple providers (TXN.pro, STON.fi, ePocket) with automatic provider routing based on currency.

### **Provider Routing:**
- **Crypto:** USDT/BTC/ETH/SOL → TXN.pro
- **Crypto:** TON/STARS → STON.fi
- **Fiat:** USD/EUR/TRY → ePocket
- **Dynamic:** Configure via Railway environment variables

## 🔄 Complete Flow

### **📊 High-Level Flow Diagram**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │   Your API  │    │   txn.pro   │    │ Blockchain  │
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ 1. Request        │                   │                   │
       ├──────────────────▶│                   │                   │
       │                   │ 2. Create Invoice │                   │
       │                   ├──────────────────▶│                   │
       │                   │                   │ 3. Generate Addr │
       │                   │                   ├──────────────────▶│
       │                   │ 4. Return Address│                   │
       │                   ◀──────────────────┤                   │
       │ 5. Show Address   │                   │                   │
       ◀──────────────────┤                   │                   │
       │                   │                   │                   │
       │ 6. Send Crypto   │                   │                   │
       ├──────────────────────────────────────────────────────────▶│
       │                   │                   │                   │
       │                   │                   │ 7. Detect Payment │
       │                   │                   ◀──────────────────┤
       │                   │ 8. Send Webhook   │                   │
       │                   ◀──────────────────┤                   │
       │ 9. Credit Balance│                   │                   │
       ◀──────────────────┤                   │                   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### **1. User Initiates Deposit**
```
User clicks "Deposit 100 USDT" in your app
```

### **2. Create Invoice**
```
Your API → txn.pro → Generate deposit address
```

**API Call:**
```bash
POST /api/payments/on-ramp/crypto/invoice
{
  "userId": "user123",
  "amount": 100,
  "currency": "USDT",
  "network": "ttrx:usdt"
}
```

**Response:**
```json
{
  "success": true,
  "invoice": {
    "id": "invoice_abc123",
    "attributes": {
      "reference": "crypto-invoice-user123-uuid",
      "amountBilled": "100",
      "billedCurrency": "USDT",
      "status": "pending"
    }
  }
}
```

### **3. User Sees Deposit Instructions**
```
┌─────────────────────────────────────┐
│  💰 Deposit 100 USDT                │
├─────────────────────────────────────┤
│  Send exactly 100 USDT to:          │
│  TTbGTMwUwA3mncLP7xqCZei1ekaNSgeAJe │
│                                     │
│  ⏰ Payment expires in 30 minutes   │
│  📱 Copy address to your wallet     │
└─────────────────────────────────────┘
```

### **4. User Sends Crypto**
```
User opens TronLink wallet → Sends 100 USDT to the address → Waits for confirmation
```

### **5. txn.pro Detects Payment**
```
txn.pro monitors blockchain → Detects USDT transfer → Validates amount → Prepares webhook
```

### **6. txn.pro Sends Webhook**
```
txn.pro → Your API webhook endpoint → Payment confirmed
```

**Webhook Payload:**
```json
{
  "event": "invoice.completed",
  "data": {
    "type": "invoices",
    "id": "invoice_abc123",
    "attributes": {
      "reference": "crypto-invoice-user123-uuid",
      "amountBilled": "100",
      "billedCurrency": "USDT",
      "status": "completed",
      "txHash": "0x1234567890abcdef"
    }
  }
}
```

### **7. Your API Processes Webhook**
```typescript
// Your API automatically credits user's balance
await this.creditUserCryptoBalance({
  userId: "user123",
  amount: 100,
  currency: "USDT",
  reference: "crypto-invoice-user123-uuid",
  txHash: "0x1234567890abcdef"
});
```

### **8. User Gets Confirmation**
```
┌─────────────────────────────────────┐
│  ✅ Payment Confirmed!              │
├─────────────────────────────────────┤
│  💰 +100 USDT added to your balance │
│  📊 New balance: 150 USDT           │
│  🔗 Transaction: 0x1234567890...    │
└─────────────────────────────────────┘
```

---

## 🏗️ Architecture

### **📊 Data Flow Diagram**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │    │   Your API  │    │   txn.pro   │
│             │    │             │    │             │
│ 1. Request  │───▶│ 2. Create   │───▶│ 3. Generate │
│   Deposit   │    │   Invoice   │    │   Address   │
│             │    │             │    │             │
│ 4. Show     │◀───│ 5. Return   │◀───│ 6. Address  │
│   Address   │    │   Address   │    │   Ready     │
│             │    │             │    │             │
│ 7. Send     │───▶│             │    │ 8. Monitor  │
│   Crypto    │    │             │    │   Payment   │
│             │    │             │    │             │
│ 9. Get      │◀───│ 10. Credit  │◀───│ 11. Send    │
│   Balance   │    │   Balance   │    │   Webhook   │
└─────────────┘    └─────────────┘    └─────────────┘
```

### **Components:**
- **Frontend:** User interface for initiating deposits
- **API:** Your NestJS API with crypto deposit endpoints
- **txn.pro:** Third-party service for crypto transactions
- **Blockchain:** Tron network for USDT transactions
- **Database:** User balance storage (in-memory for demo)

### **API Endpoints:**
- `POST /api/payments/on-ramp/crypto/invoice` - Create deposit invoice
- `POST /api/payments/on-ramp/crypto/webhook` - Receive payment notifications
- `GET /api/payments/on-ramp/crypto/balance/:userId` - Check user balance
- `GET /api/payments/on-ramp/crypto/invoice/:id` - Get invoice details

---

## 🔧 Configuration

### **Environment Variables:**
```bash
TXN_ENVIRONMENT=sandbox  # or production
TXN_API_KEY=your_api_key_here
TXN_WEBHOOK_SECRET=your_webhook_secret_here
```

### **Webhook Configuration:**
1. **Development:** Use ngrok to create public tunnel
2. **Production:** Deploy API to public server
3. **Configure in txn.pro:** Set webhook URL and events

---

## 🎮 User Experience

### **Channel-Based (Recurring Users):**
```
┌─────────────────────────────────────────────────────────────────┐
│                    CHANNEL-BASED FLOW                          │
│                                                                 │
│  User clicks "Deposit USDT"                                    │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  💰 Your Permanent Deposit Address                         │ │
│  │                                                             │ │
│  │  TTbGTMwUwA3mncLP7xqCZei1ekaNSgeAJe                       │ │
│  │                                                             │ │
│  │  💡 Save this address in your wallet                       │ │
│  │  📱 Send any amount of USDT to this address anytime        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│         │                                                       │
│         ▼                                                       │
│  User sends USDT from wallet                                    │
│         │                                                       │
│         ▼                                                       │
│  System detects payment via webhook                            │
│         │                                                       │
│         ▼                                                       │
│  User's USDT balance is credited automatically                 │
└─────────────────────────────────────────────────────────────────┘
```

### **Invoice-Based (One-Time Payments):**
```
┌─────────────────────────────────────────────────────────────────┐
│                    INVOICE-BASED FLOW                          │
│                                                                 │
│  User wants to deposit 100 USDT                                │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  🛒 Deposit 100 USDT                                       │ │
│  │                                                             │ │
│  │  Send exactly 100 USDT to:                                 │ │
│  │  TTbGTMwUwA3mncLP7xqCZei1ekaNSgeAJe                       │ │
│  │                                                             │ │
│  │  ⚠️  Send exact amount only                                 │ │
│  │  ⏰  Expires in 30 minutes                                 │ │
│  │  📱 Copy address to your wallet                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│         │                                                       │
│         ▼                                                       │
│  User sends exactly 100 USDT                                   │
│         │                                                       │
│         ▼                                                       │
│  System detects payment via webhook                            │
│         │                                                       │
│         ▼                                                       │
│  User's USDT balance is credited automatically                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security

### **Webhook Verification:**
- HMAC SHA256 signature verification
- Timestamp validation
- Payload integrity checks

### **User Balance Management:**
- In-memory storage (replace with database)
- Transaction history tracking
- Balance validation

---

## 🚀 Production Deployment

### **1. Deploy API:**
```bash
# Build and deploy
npm run build
# Deploy to your server
```

### **2. Configure Webhooks:**
- Set webhook URL in txn.pro dashboard
- Configure events: `invoice.completed`, `channel.deposit`
- Set webhook secret

### **3. Database Integration:**
- Replace in-memory storage with database
- Add transaction logging
- Implement user authentication

---

## 📊 Monitoring

### **Key Metrics:**
- Invoice creation success rate
- Webhook processing time
- Balance crediting accuracy
- Transaction completion rate

### **Logging:**
- All webhook events
- Balance changes
- Error tracking
- Performance metrics

---

## 🎯 Summary

The crypto payment flow enables users to deposit cryptocurrency and receive cryptocurrency balance in your system. The complete flow is automated through webhooks, providing a seamless user experience while maintaining security and reliability.

**Key Features:**
- ✅ **Crypto-to-crypto deposits**
- ✅ **Automatic balance crediting**
- ✅ **Real-time webhook processing**
- ✅ **Multiple payment support**
- ✅ **Secure transaction handling**
