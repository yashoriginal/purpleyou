# PurpleYou API Integration Audit

Complete analysis of Postman collection and current implementation status.

**Base URL:** `http://localhost:5000` (local) or `https://purpleoneservice.onrender.com` (production)

---

## 📊 API Inventory & Implementation Status

### ✅ IMPLEMENTED (5 APIs)

#### 1. **User Registration** ✅
- **Endpoint:** `POST /api/v1/users/auth/register`
- **File:** `src/services/auth.service.ts`
- **Status:** ✅ PRODUCTION READY
- **Features:**
  - Full name, phone, address, pincode
  - Geolocation (latitude/longitude)
  - Validates all inputs
  - Stores tokens in localStorage
  - Auto-login after registration

```typescript
await authService.register({
  userName: "Bujji",
  mobile: "+919042278688",
  latitude: "13.04",
  longitude: "80.23",
  pincode: "600017",
  address: "T Nagar",
  area: "Chennai"
});
```

#### 2. **Send OTP** ✅
- **Endpoint:** `POST /api/v1/users/auth/resendOTP`
- **File:** `src/services/auth.service.ts`
- **Status:** ✅ PRODUCTION READY
- **Features:**
  - Sends OTP via SMS
  - Validates phone format
  - Error handling

```typescript
await authService.sendOTP("+919042278689");
```

#### 3. **Verify OTP** ✅
- **Endpoint:** `POST /api/v1/users/auth/verifyOTP`
- **File:** `src/services/auth.service.ts`
- **Status:** ✅ PRODUCTION READY
- **Features:**
  - Validates OTP
  - Returns user + tokens
  - Auto-login on success
  - Handles account not found

```typescript
await authService.verifyOTP("+919042278689", "2643");
```

#### 4. **Update User Details** ✅
- **Endpoint:** `POST /api/v1/users/update-user-details`
- **File:** `src/services/auth.service.ts`
- **Status:** ✅ PRODUCTION READY
- **Features:**
  - Update name, address, pincode, location
  - Geolocation auto-detection
  - Form component included
  - localStorage sync

```typescript
await authService.updateUserDetails({
  mobile: "+919042278689",
  userName: "Bujji",
  address: "T Nagar",
  pincode: "600017",
  latitude: "13.04",
  longitude: "80.23"
});
```

#### 5. **Logout** ✅
- **Endpoint:** `GET /api/v1/users/auth/logout`
- **File:** `src/services/auth.service.ts`
- **Status:** ✅ IMPLEMENTED (local only)
- **Features:**
  - Clears tokens from localStorage
  - Updates auth context
  - Redirects to login

```typescript
authService.logout();
```

---

### ⏳ NOT IMPLEMENTED (Missing Integrations)

#### 1. **Check Existing User** ⏳
- **Endpoint:** `POST /api/v1/users/auth/exiting-user/{mobile}`
- **Purpose:** Check if phone number already registered
- **Priority:** HIGH
- **Use Case:**
  - Prevent duplicate registrations
  - Show different flow for existing users
  - Faster login for returning users

```typescript
// Needed Implementation
async function isExistingUser(mobile: string): Promise<boolean>
```

**Implementation Plan:**
```typescript
// In auth.service.ts
export async function checkExistingUser(mobile: string): Promise<boolean> {
  const formattedMobile = formatMobileNumber(mobile);
  const response = await makeRequest<{ exists: boolean }>(
    `/users/auth/exiting-user/${formattedMobile}`,
    { method: "POST" }
  );
  return response.exists;
}
```

**Usage in Login:**
```typescript
const exists = await authService.checkExistingUser(phone);
if (exists) {
  // Show "Verify OTP" flow
} else {
  // Show "Register" flow
}
```

#### 2. **Login User** ⏳
- **Endpoint:** `POST /api/v1/users/auth/login`
- **Purpose:** Traditional login (alternative to OTP)
- **Priority:** MEDIUM
- **Use Case:**
  - Direct login with phone
  - Alternative to OTP verification
  - Session resumption

```typescript
// Needed Implementation
async function login(mobile: string): Promise<AuthCredentials>
```

**Implementation Plan:**
```typescript
export async function login(mobile: string): Promise<AuthCredentials> {
  const formattedMobile = formatMobileNumber(mobile);
  const response = await makeRequest<VerifyOTPResponse>(
    `${AUTH_ENDPOINT}/login`,
    {
      method: "POST",
      body: { mobile: formattedMobile }
    }
  );
  // Same handling as verifyOTP
}
```

#### 3. **SMS Send API** ⏳
- **Endpoint:** `POST /api/v1/sendsms/`
- **Purpose:** Direct SMS sending (for admin/testing)
- **Priority:** LOW
- **Use Case:**
  - Testing SMS delivery
  - Admin notifications
  - Manual SMS sending

```typescript
// Needed Implementation
async function sendSMS(number: string, otp: string): Promise<void>
```

**Note:** This is likely used internally by OTP endpoint

---

## 📦 Cart API (Not Started)

### Status: ❌ NOT IMPLEMENTED
**Current:** Using React Context (localStorage only)  
**Needed:** Backend persistence

#### Available Endpoints:

1. **Get Cart** 📖
   ```
   GET /api/v1/cart?userId={userId}
   ```
   Returns user's saved cart items

2. **Add to Cart** ➕
   ```
   POST /api/v1/cart/items
   Body: {
     userId, productId, quantity,
     variant, priceEach, currency
   }
   ```

3. **Update Quantity** 🔄
   ```
   PATCH /api/v1/cart/items/{productId}
   Body: { userId, quantity, variant }
   ```

4. **Remove Item** ❌
   ```
   DELETE /api/v1/cart/items/{productId}?userId={userId}
   Body: { variant }
   ```

5. **Clear Cart** 🗑️
   ```
   DELETE /api/v1/cart?userId={userId}
   ```

6. **Replace Cart** 🔄
   ```
   PUT /api/v1/cart
   Body: { userId, items: [...] }
   ```

### Integration Plan (High Priority):
Create `src/services/cart.service.ts`:
```typescript
export async function getCart(userId: string): Promise<CartItem[]>
export async function addToCart(cartItem: CartItem): Promise<void>
export async function updateQuantity(userId: string, productId: string, quantity: number): Promise<void>
export async function removeFromCart(userId: string, productId: string): Promise<void>
export async function clearCart(userId: string): Promise<void>
```

Update `src/context/CartContext.tsx` to:
- Load cart on login
- Sync to backend on changes
- Fallback to localStorage

---

## 🛍️ Products API (Partially Implemented)

### Status: ⚠️ DUMMY DATA ONLY
**Current:** Using hardcoded product data  
**Needed:** Dynamic product fetching

#### Available Endpoints:

1. **Get All Products** 📖
   ```
   GET /api/v1/products
   Query: ?category=X&subCategory=Y&search=Z&isActive=true&limit=10
   ```

2. **Get Product by ID** 📖
   ```
   GET /api/v1/products/{id}
   ```

3. **Create Product** (Admin) ➕
   ```
   POST /api/v1/products
   ```

4. **Update Product** (Admin) ✏️
   ```
   PUT /api/v1/products/{id}
   ```

5. **Delete Product** (Admin) ❌
   ```
   DELETE /api/v1/products/{id}
   ```

### Current Implementation:
- `src/services/product.service.ts` exists
- Uses dummy data from `src/lib/data.ts`
- No backend calls

### Integration Plan (High Priority):
```typescript
// Replace dummy implementation
export async function getProductBySlug(slug: string): Promise<Product>
export async function getProductsByCollection(collection: string): Promise<Product[]>
export async function getAllProducts(filters?: ProductFilters): Promise<Product[]>
```

---

## 📋 Orders API (Not Started)

### Status: ❌ NOT IMPLEMENTED
**Current:** Dummy order data in account page  
**Needed:** Backend order management

#### Available Endpoints:

1. **Create Order** ➕
   ```
   POST /api/v1/orders/
   ```

2. **Get Order by ID** 📖
   ```
   GET /api/v1/orders/{orderId}
   ```

3. **Get Orders by User** 📖
   ```
   GET /api/v1/orders/user/{userId}
   ```

4. **Get Orders by Shop** 📖
   ```
   GET /api/v1/orders/shop/{shopId}
   ```

5. **Update Order Status** ✏️
   ```
   PUT /api/v1/orders/update-status/{orderId}
   Body: { status, userId, shopId }
   ```

### Integration Plan (High Priority):
Create `src/services/orders.service.ts`:
```typescript
export async function createOrder(order: Order): Promise<Order>
export async function getOrder(orderId: string): Promise<Order>
export async function getUserOrders(userId: string): Promise<Order[]>
export async function updateOrderStatus(orderId: string, status: string): Promise<void>
```

---

## 💳 Payment API (Razorpay)

### Status: ✅ PARTIALLY IMPLEMENTED
**Current:** `src/lib/razorpay.ts` has API helpers  
**Missing:** Integration in checkout flow

#### Available Endpoints:

1. **Create Order** ➕
   ```
   POST /api/v1/orders/payment/create-order
   Body: { orderId, userId, shopId, amount, currency, receipt, notes }
   ```

2. **Verify Payment** ✓
   ```
   POST /api/v1/orders/payment/verify-payment
   Body: { orderId, userId, shopId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
   ```

### Integration Plan:
- Hook into checkout component
- Show in RazorpayCheckout.tsx
- Handle payment verification
- Update order status

---

## 📊 Implementation Priority Matrix

```
Priority  │ API                    │ Status     │ Effort  │ Value
──────────┼────────────────────────┼────────────┼─────────┼────────
CRITICAL  │ Check Existing User    │ ⏳ Needed   │ Small   │ High
CRITICAL  │ Products (dynamic)     │ ⚠️ Dummy    │ Medium  │ High
CRITICAL  │ Cart API               │ ❌ None     │ Medium  │ High
CRITICAL  │ Orders API             │ ❌ None     │ Medium  │ High
HIGH      │ Payment Checkout       │ ⚠️ Partial  │ Medium  │ High
MEDIUM    │ Login (alternative)    │ ⏳ Needed   │ Small   │ Medium
LOW       │ SMS Send (admin)       │ ⏳ Needed   │ Small   │ Low
```

---

## 🚀 Recommended Integration Order

### Phase 1: Core User Experience (Week 1)
1. ✅ User Registration & Authentication (DONE)
2. ✅ OTP Verification (DONE)
3. ✅ User Profile (DONE)
4. ⏳ **Check Existing User** (Quick win - prevents duplicate registrations)
5. ⏳ **Products API** (Users can see real products)

### Phase 2: Shopping Cart (Week 2)
6. **Cart API** (Persist cart across sessions)
7. **Products Detail Page** (Connect to backend products)

### Phase 3: Orders & Checkout (Week 3)
8. **Orders API** (Create and track orders)
9. **Payment Integration** (Razorpay checkout flow)

### Phase 4: Polish (Week 4)
10. **Login Endpoint** (Alternative auth method)
11. **SMS API** (Testing/admin)

---

## 📝 Sample Implementation Files to Create

### 1. Check Existing User Service
```typescript
// src/services/user.service.ts
export async function checkExistingUser(mobile: string): Promise<boolean>
```

### 2. Products Service (Replace Dummy)
```typescript
// src/services/product.service.ts (update)
export async function getProductsByCollection(collection: string): Promise<Product[]>
export async function getAllProducts(): Promise<Product[]>
```

### 3. Cart Service
```typescript
// src/services/cart.service.ts (NEW)
export async function getCart(userId: string): Promise<CartItem[]>
export async function addToCart(item: CartItem): Promise<void>
export async function updateQuantity(userId: string, productId: string, qty: number): Promise<void>
export async function removeFromCart(userId: string, productId: string): Promise<void>
```

### 4. Orders Service
```typescript
// src/services/orders.service.ts (NEW)
export async function createOrder(order: Order): Promise<Order>
export async function getUserOrders(userId: string): Promise<Order[]>
export async function getOrder(orderId: string): Promise<Order>
```

---

## 🔒 Authentication Considerations

All API calls (except register/login/OTP) require:
```
Authorization: Bearer {accessToken}
```

This is automatically handled by:
```typescript
import { authenticatedFetch } from '@/services/auth.service';

// All requests auto-inject token
const data = await authenticatedFetch('/api/v1/cart?userId=123');
```

---

## 📱 API Base URL Configuration

### Local Development
```
http://localhost:5000
```

### Production
```
https://purpleoneservice.onrender.com
```

**Set in:**
```typescript
// src/services/auth.service.ts
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
                     process.env.NEXT_PUBLIC_API_BASE_URL ||
                     "https://purpleoneservice.onrender.com/api/v1";
```

---

## 🧪 Testing APIs with Postman

Import the provided `PurpleYou.postman_collection.json`:
1. Open Postman
2. Import → Select JSON file
3. Update `http://localhost:5000` to production URL if needed
4. Use environment variables for tokens

**For authenticated requests:**
1. Run Register or Verify OTP first
2. Copy `accessToken` from response
3. Go to Authorization tab
4. Select "Bearer Token"
5. Paste token

---

## ⚡ Quick Integration Checklist

- [ ] Check Existing User (quick win)
- [ ] Replace Products with dynamic API
- [ ] Sync Cart to backend
- [ ] Create Orders service
- [ ] Complete payment flow
- [ ] Add Login endpoint
- [ ] Test all APIs end-to-end
- [ ] Update documentation
- [ ] Deploy to production

---

**Postman Collection Location:** `/PurpleYou.postman_collection.json`  
**Total APIs in Collection:** 25  
**Implemented:** 5  
**Remaining:** 20 (various priorities)  

---

## 📞 Next Steps

Which API integration would you like to prioritize?

1. **Check Existing User** (prevents duplicate registrations)
2. **Products API** (show real products instead of dummy data)
3. **Cart API** (persist cart to backend)
4. **Orders API** (track user orders)
5. **All of the above** (comprehensive implementation)

Let me know and I'll implement it! 🚀
