# Payments API Environment Configuration

## 🌍 Environment Variables

### **Currency-to-Provider Mapping (Railway Variables)**

You can override the default currency-to-provider mapping per environment using these variables:

```bash
# Format: CURRENCY1:PROVIDER1,CURRENCY2:PROVIDER2

# Development
CURRENCY_PROVIDER_MAPPING_DEV=USDT:txn.pro,TON:ston.fi,USD:epocket,EUR:epocket

# Test/Staging (NODE_ENV=test)
CURRENCY_PROVIDER_MAPPING_TEST=USDT:txn.pro,TON:ston.fi,USD:epocket,TRY:epocket

# Production
CURRENCY_PROVIDER_MAPPING_PROD=USDT:txn.pro,BTC:txn.pro,ETH:txn.pro,TON:ston.fi,USD:epocket,EUR:epocket,TRY:epocket
```

### **Provider Configurations**

#### **TXN.pro (Crypto: USDT, BTC, ETH, SOL)**
```bash
TXN_ENVIRONMENT=sandbox  # or 'production'
TXN_API_KEY=txn_cmp_your_api_key_here
TXN_API_URL=https://api.sandbox.txn.pro  # optional, auto-detected
TXN_WEBHOOK_SECRET=your_txn_webhook_secret
```

#### **STON.fi (Crypto: TON, STARS)**
```bash
OMNISTON_API_URL=wss://omni-ws.ston.fi
USDT_ADDRESS=your_usdt_contract_address
TON_ADDRESS=your_ton_contract_address
STON_FI_WEBHOOK_SECRET=your_stonfi_webhook_secret  # optional
```

#### **ePocket (Fiat: USD, EUR, TRY)**
```bash
EPOCKET_API_KEY=your_epocket_api_key
EPOCKET_API_URL=https://api.epocket.com
EPOCKET_WEBHOOK_SECRET=your_epocket_webhook_secret
EPOCKET_ENVIRONMENT=sandbox  # or 'production'
```

#### **Rhino.fi (Future)**
```bash
RHINO_FI_API_KEY=your_rhino_fi_api_key
RHINO_FI_API_URL=https://api.rhino.fi
RHINO_FI_WEBHOOK_SECRET=your_rhino_fi_webhook_secret
```

## 📋 Default Mappings (Fallback)

If environment-specific mappings are not set, these defaults apply:

### **Development**
```
USDT, BTC, ETH, SOL → txn.pro
TON, STARS → ston.fi
USD, EUR, TRY → epocket
```

### **Test (Staging)**
```
Same as development
```

### **Production**
```
Same as development (override with CURRENCY_PROVIDER_MAPPING_PROD)
```

## 🔧 Railway Configuration

### **How to Configure on Railway:**

1. **Go to your Railway project**
2. **Navigate to Variables**
3. **Add environment-specific mappings:**

```
# For staging environment (NODE_ENV=test)
CURRENCY_PROVIDER_MAPPING_TEST=USDT:txn.pro,TON:ston.fi,TRY:epocket

# For production environment (NODE_ENV=production)
CURRENCY_PROVIDER_MAPPING_PROD=USDT:txn.pro,BTC:txn.pro,ETH:txn.pro,SOL:txn.pro,TON:ston.fi,USD:epocket,EUR:epocket,TRY:epocket
```

4. **Add provider API keys:**
```
TXN_API_KEY=your_actual_key
EPOCKET_API_KEY=your_actual_key
STON_FI_WEBHOOK_SECRET=your_secret
```

## 🚀 Adding New Currencies

To add support for a new currency:

### **Option 1: Via Environment Variable (Recommended)**
```bash
# Add to Railway variables
CURRENCY_PROVIDER_MAPPING_PROD=...,NEW_CURRENCY:provider_name
```

### **Option 2: Via Code (Fallback)**
Update `src/modules/payments/shared/payment-config.ts`:
```typescript
const baseMapping: Record<string, Provider> = {
  // ... existing mappings
  'NEW_CURRENCY': 'provider_name',
};
```

## 🔍 Testing Provider Routing

```bash
# Check which provider handles a currency
curl http://localhost:3001/api/payments/on-ramp/crypto/provider/USDT
curl http://localhost:3001/api/payments/on-ramp/crypto/provider/TON
curl http://localhost:3001/api/payments/on-ramp/crypto/provider/TRY
```

## 📝 Notes

- **Currency matching is case-insensitive** (USDT = usdt = Usdt)
- **Environment variables take precedence** over code defaults
- **Each provider must be enabled** (have required API keys)
- **Missing provider configs throw errors** during invoice creation

