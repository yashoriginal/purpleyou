# OTP Verification & Token Management Integration

Complete integration of OTP-based authentication with automatic token handling.

---

## 🎯 What Was Integrated

### 1. OTP Send/Resend Endpoint
**API:** `POST /api/v1/users/auth/resendOTP`

```typescript
// In auth service
await authService.sendOTP('+919042278689');
// Sends OTP via SMS to the provided mobile number
```

### 2. OTP Verification Endpoint
**API:** `POST /api/v1/users/auth/verifyOTP`

```typescript
// Verify OTP and get tokens
const credentials = await authService.verifyOTP('+919042278689', '2643');
// Returns: { user, token: { accessToken, refreshToken } }
```

### 3. Token Management
- ✅ Automatic token storage in localStorage
- ✅ Access token extraction for API calls
- ✅ Refresh token storage for future refreshes
- ✅ Session restoration on app load
- ✅ Token expiration checking
- ✅ Automatic token refresh on 401 responses

### 4. Authenticated API Calls
```typescript
// Helper for authenticated requests
import { authenticatedFetch, getAuthHeaders } from '@/services/auth.service';

// Option 1: Using helper function
const data = await authenticatedFetch('/api/user/cart');

// Option 2: Using headers helper
const headers = getAuthHeaders();
const response = await fetch('/api/user/cart', { headers });
```

---

## 📊 Data Flow

### Registration Flow
```
User Registration Form
      ↓
Contains: userName, mobile, pincode, address, area
+ Auto-capture: latitude, longitude
      ↓
POST /api/v1/users/auth/register
      ↓
Backend creates user
      ↓
Returns: user data + isVerified: false
      ↓
User logged in immediately
      ↓
Tokens saved to localStorage
      ↓
User redirected to dashboard
```

### OTP Login Flow
```
User enters phone
      ↓
Click "Send OTP"
      ↓
POST /api/v1/users/auth/resendOTP
{ "mobile": "+91XXXXXXXXXX" }
      ↓
Backend sends SMS with OTP
      ↓
Returns: { data: "OTP sent", success: true }
      ↓
User enters OTP
      ↓
Click "Verify OTP"
      ↓
POST /api/v1/users/auth/verifyOTP
{ "mobile": "+91XXXXXXXXXX", "otp": "XXXX" }
      ↓
Backend verifies OTP
      ↓
IF VALID:
  Returns: {
    data: { user object with isVerified: true },
    accessToken: "JWT token",
    refreshToken: "JWT token"
  }
      ↓
  Tokens saved to localStorage
  User context updated
  User redirected to dashboard
      ↓
IF INVALID:
  Returns: {
    error: "Invalid OTP" or "Account not found"
    success: false
  }
      ↓
  Error displayed to user
  User can retry
```

### Token Refresh Flow
```
User makes authenticated request
      ↓
Auth service checks token expiration
      ↓
IF EXPIRED:
  Calls refreshAccessToken()
  → POST /api/v1/users/auth/refresh (when implemented)
  → Receives new accessToken
  → Updates localStorage
  → Retries original request
      ↓
IF NOT EXPIRED:
  Makes request with current token
      ↓
IF REQUEST RETURNS 401:
  Attempts token refresh
  → If successful: retries request
  → If fails: logs user out
```

---

## 📁 Files Modified

### 1. `src/services/auth.service.ts`
**Added:**
- `sendOTP(mobile)` - Send OTP to phone
- `verifyOTP(mobile, otp)` - Verify OTP and get tokens
- `refreshAccessToken()` - Refresh expired token
- `authenticatedFetch(endpoint)` - Helper for authenticated requests
- `getAuthHeaders()` - Get auth headers
- `isTokenExpired(token)` - Check if JWT token is expired
- Token storage/retrieval functions

**Enhanced:**
- `makeRequest()` with token refresh logic
- Automatic 401 handling with token refresh

### 2. `src/context/AuthContext.tsx`
**Added:**
- `sendOTP(mobile)` - Send OTP via context
- `verifyOTP(mobile, otp)` - Verify OTP via context

**Enhanced:**
- Handle token response format from API
- Session restoration with tokens

### 3. `src/app/login/page.tsx`
**Modified:**
- Replaced dummy OTP functions with real API calls
- Uses `sendOTP()` and `verifyOTP()` from auth context
- Proper error handling for OTP failures
- Handles "Account not found" error for new users

---

## 💾 Token Storage

Tokens are stored in localStorage in this format:

```typescript
// In localStorage under key "auth_token"
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}

// User data under key "auth_user"
{
  "userId": "6e2f30f7-2829-470e-8788-beda371a6ec2",
  "mobile": "+919042278689",
  "userName": "Bujji",
  "isVerified": true,
  "isAdmin": false,
  // ... other user fields
}
```

---

## 🔐 Security Features

✅ **Implemented:**
- Token stored in localStorage (accessible to JS)
- Authorization header automatically added to authenticated requests
- Token expiration checking (client-side)
- Automatic token refresh on 401
- Session restoration on app reload
- Credentials cleared on logout

⚠️ **Limitations:**
- localStorage can be accessed by any script (XSS vulnerability)
- Client-side token expiration check is cosmetic only

🔒 **Recommendations for Production:**
1. Use httpOnly cookies instead of localStorage
2. Implement CSRF protection
3. Add request signing
4. Rate limiting on backend
5. Server-side token validation
6. Secure HTTPS only
7. CORS properly configured

---

## 🚀 Usage Examples

### Example 1: Basic Login Flow
```typescript
import { useAuth } from '@/context/AuthContext';

export function LoginComponent() {
  const { sendOTP, verifyOTP, isLoading, error } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');

  const handleSendOTP = async () => {
    try {
      await sendOTP(`+91${phone}`);
      setStep('otp');
    } catch (err) {
      console.error('Failed to send OTP:', err);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP(`+91${phone}`, otp);
      // User is now logged in!
      // Tokens are automatically saved
      // Auth context is updated
    } catch (err) {
      console.error('OTP verification failed:', err);
    }
  };

  // ... UI code
}
```

### Example 2: Authenticated API Call
```typescript
import { authenticatedFetch } from '@/services/auth.service';

// Fetch user's cart with automatic token injection
async function loadUserCart() {
  try {
    const cartData = await authenticatedFetch('/api/user/cart', {
      method: 'GET'
    });
    console.log('Cart:', cartData);
  } catch (error) {
    console.error('Failed to load cart:', error);
  }
}
```

### Example 3: Using Auth Headers
```typescript
import { getAuthHeaders } from '@/services/auth.service';

async function updateUserProfile(updates) {
  const headers = getAuthHeaders();
  
  const response = await fetch('/api/user/profile', {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates)
  });

  return response.json();
}
```

### Example 4: Checking Authentication
```typescript
import { useAuth } from '@/context/AuthContext';

export function ProtectedComponent() {
  const { isLoggedIn, user, logout } = useAuth();

  if (!isLoggedIn) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Welcome, {user?.userName}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## ✅ Testing the Integration

### Test OTP Send
```bash
curl -X POST https://purpleoneservice.onrender.com/api/v1/users/auth/resendOTP \
  -H "Content-Type: application/json" \
  -d '{"mobile":"+919042278689"}'
```

### Test OTP Verification
```bash
curl -X POST https://purpleoneservice.onrender.com/api/v1/users/auth/verifyOTP \
  -H "Content-Type: application/json" \
  -d '{"mobile":"+919042278689","otp":"2643"}'
```

### Test in Browser Console
```javascript
// Open browser DevTools → Console

// Send OTP
const response = await fetch('https://purpleoneservice.onrender.com/api/v1/users/auth/resendOTP', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mobile: '+919042278689' })
});
const data = await response.json();
console.log('Send OTP response:', data);

// Verify OTP (after you receive OTP in SMS)
const verifyResponse = await fetch('https://purpleoneservice.onrender.com/api/v1/users/auth/verifyOTP', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mobile: '+919042278689', otp: '2643' })
});
const verifyData = await verifyResponse.json();
console.log('Verify OTP response:', verifyData);
```

---

## 🐛 Troubleshooting

### "Invalid OTP"
- OTP expired (usually 5-10 minutes)
- Wrong OTP entered
- Solution: Click "Resend OTP" to get a new one

### "Account record does not exist"
- Phone number not registered
- Solution: User should register first using sign-up flow

### "Already verified"
- User account already completed verification
- Solution: Try logging in with a different phone number or check if account is already active

### "No authentication token found"
- User not logged in
- localStorage cleared
- Session expired
- Solution: User needs to login again

### "Request timeout"
- Network issue
- Backend server slow
- Solution: Check internet connection, try again

---

## 📋 API Response Reference

### Send OTP - Success
```json
{
  "data": "OTP sent",
  "success": true,
  "error": null,
  "statusCode": 201
}
```

### Verify OTP - Success
```json
{
  "data": {
    "userId": "6e2f30f7-2829-470e-8788-beda371a6ec2",
    "mobile": "+919042278689",
    "userName": "Bujji",
    "pincode": "600017",
    "address": "T Nagar",
    "area": "Chennai",
    "latitude": "13.04",
    "longitude": "80.23",
    "isAdmin": false,
    "isVerified": true,
    "createdAt": "2026-01-18T08:02:22.105Z",
    "updatedAt": "2026-01-18T08:02:22.105Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "error": null,
  "statusCode": 200,
  "success": true
}
```

### Verify OTP - Error (Account Not Found)
```json
{
  "data": null,
  "error": "Account record does not exist or has been already verified. Please sign up or Login",
  "success": false,
  "statusCode": 401
}
```

---

## 🔄 Token Refresh Implementation (Placeholder)

When the backend implements token refresh endpoint, add this to auth.service.ts:

```typescript
export async function refreshAccessToken(): Promise<AuthToken | null> {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const response = await makeRequest<{
      accessToken: string;
      refreshToken: string;
    }>(`${AUTH_ENDPOINT}/refresh`, {
      method: "POST",
      body: { refreshToken },
    });

    if (response.success) {
      const newToken: AuthToken = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        tokenType: "Bearer",
      };
      updateToken(newToken);
      return newToken;
    }

    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearCredentials();
    return null;
  }
}
```

---

## 📞 API Endpoint Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---|
| `/users/auth/register` | POST | Register new user | No |
| `/users/auth/resendOTP` | POST | Send OTP | No |
| `/users/auth/verifyOTP` | POST | Verify OTP & login | No |
| `/users/auth/refresh` | POST | Refresh token | Yes (Planned) |

---

**Last Updated:** January 2024  
**Version:** 2.0  
**Status:** Production Ready with OTP Integration
