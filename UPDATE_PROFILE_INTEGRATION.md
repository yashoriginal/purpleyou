# Update User Profile Integration

Complete integration of the update user profile endpoint with authenticated API calls.

---

## 🎯 Overview

The update profile feature allows authenticated users to modify their personal information including:

- Full name
- Street address
- Postal code (pincode)
- Geographic coordinates (latitude/longitude)
- Mobile number (can be updated)

**API Endpoint:** `POST /api/v1/users/update-user-details`

---

## 📊 Data Flow

```
User navigates to Account → Profile tab
         ↓
EditProfileForm displays current user data
         ↓
User edits fields:
  - userName (full name)
  - address (street address)
  - pincode (postal code)
  - latitude & longitude (auto-detect via geolocation or manual)
         ↓
User clicks "Save Changes"
         ↓
Form validation:
  ✓ Required fields
  ✓ Pincode minimum 6 digits
  ✓ Valid latitude/longitude coordinates
         ↓
POST to /api/v1/users/update-user-details
Headers: { Authorization: Bearer {token} }
Body: {
  mobile: "+919042278689",
  userName: "Bujji",
  address: "T Nagar",
  pincode: "600017",
  latitude: "13.04",
  longitude: "80.23"
}
         ↓
Backend validates & updates user record
         ↓
Returns: {
  data: "6e2f30f7-2829-470e-8788-beda371a6ec2",
  success: true,
  statusCode: 201
}
         ↓
Frontend:
  - Saves updated user to localStorage
  - Updates auth context with new data
  - Shows success message
  - User profile now reflects changes
```

---

## 🔧 Implementation Details

### 1. Auth Service Functions

**File:** `src/services/auth.service.ts`

#### `updateUserDetails(data: UpdateUserDetailsRequest)`

Updates user profile information.

```typescript
import { authService, UpdateUserDetailsRequest } from "@/services/auth.service";

const userId = await authService.updateUserDetails({
  mobile: "+919042278689",
  userName: "Bujji",
  address: "T Nagar",
  pincode: "600017",
  latitude: "13.04",
  longitude: "80.23",
});

console.log("Updated user ID:", userId);
```

**Parameters:**

```typescript
interface UpdateUserDetailsRequest {
  mobile: string; // Phone number (+91XXXXXXXXXX or 10 digits)
  userName: string; // Full name
  address: string; // Street address
  pincode: string; // Postal code (minimum 6 digits)
  latitude: string; // Latitude coordinate
  longitude: string; // Longitude coordinate
}
```

**Returns:** `string` (User ID from backend)

**Throws:** `AuthServiceError` if update fails

---

### 2. React Context Hook

**File:** `src/context/AuthContext.tsx`

#### `useAuth().updateUserDetails()`

Call from React components to update user profile.

```typescript
import { useAuth } from '@/context/AuthContext';

export function MyComponent() {
  const { updateUserDetails, isLoading, error } = useAuth();

  const handleUpdate = async () => {
    try {
      const userId = await updateUserDetails({
        mobile: "+919042278689",
        userName: "New Name",
        address: "New Address",
        pincode: "600018",
        latitude: "13.05",
        longitude: "80.24"
      });
      console.log('Updated user:', userId);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <button onClick={handleUpdate} disabled={isLoading}>
      {isLoading ? 'Saving...' : 'Update Profile'}
    </button>
  );
}
```

**Hook returns:**

```typescript
{
  updateUserDetails,      // Async function to call
  isLoading,             // Boolean: request in progress
  error,                 // String | null: error message
  user,                  // Updated user object
  isLoggedIn,           // Boolean: auth status
  clearError,           // Function: clear error
  // ... other auth methods
}
```

---

### 3. Edit Profile Form Component

**File:** `src/components/profile/EditProfileForm.tsx`

A complete form component with:

- Form validation
- Auto-geolocation detection
- Manual coordinate entry
- Success/error messages
- Loading states

```typescript
import EditProfileForm from '@/components/profile/EditProfileForm';

export function MyPage() {
  return (
    <EditProfileForm
      onSuccess={() => console.log('Profile updated!')}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```

**Props:**

```typescript
interface EditProfileFormProps {
  onSuccess?: () => void; // Called after successful update
  onCancel?: () => void; // Called when user cancels
}
```

**Features:**

- ✅ Pre-fills with current user data
- ✅ Auto-detect location with button
- ✅ Manual coordinate entry
- ✅ Real-time validation
- ✅ Loading indicators
- ✅ Success/error messages
- ✅ Cancel option

---

### 4. Account Page Integration

**File:** `src/app/account/page.tsx`

The Profile tab has been added to the account page navigation:

```
Account Page Tabs:
├── Profile (NEW) ← EditProfileForm component
├── Orders
├── Addresses
└── Wishlist
```

**Usage in Account Page:**

```typescript
import EditProfileForm from '@/components/profile/EditProfileForm';

{activeTab === "profile" && (
  <div className="bg-white rounded-lg border border-[#e6e0da] p-6 sm:p-8">
    <EditProfileForm onCancel={() => setActiveTab("orders")} />
  </div>
)}
```

---

## 🔐 Authentication & Authorization

### Token Requirement

- ✅ **Requires Authentication:** Yes
- ✅ **Token Location:** `Authorization: Bearer {accessToken}`
- ✅ **Token Source:** Automatically injected by auth service

The auth service automatically:

1. Checks if token exists
2. Verifies token not expired
3. Refreshes token if needed
4. Injects `Authorization` header
5. Retries on 401 after token refresh

---

## 📋 API Specification

### Request

**Endpoint:** `POST /api/v1/users/update-user-details`

**Headers:**

```http
Content-Type: application/json
Authorization: Bearer {accessToken}
```

**Body:**

```json
{
  "mobile": "+919042278689",
  "userName": "Bujji",
  "address": "T Nagar, Chennai",
  "pincode": "600017",
  "latitude": "13.04",
  "longitude": "80.23"
}
```

### Response - Success (201)

```json
{
  "data": "6e2f30f7-2829-470e-8788-beda371a6ec2",
  "success": true,
  "error": null,
  "statusCode": 201
}
```

### Response - Validation Error (400)

```json
{
  "data": null,
  "success": false,
  "error": "Invalid pincode format",
  "statusCode": 400
}
```

### Response - Unauthorized (401)

```json
{
  "data": null,
  "success": false,
  "error": "Invalid or expired token",
  "statusCode": 401
}
```

---

## 🧪 Testing the Integration

### Option 1: Using Browser Console

```javascript
// Step 1: Make sure you're logged in
// (should have token from previous OTP verification)

// Step 2: Import auth service
import { authService } from "@/services/auth.service";

// Step 3: Update profile
const result = await authService.updateUserDetails({
  mobile: "+919042278689",
  userName: "Test User",
  address: "Test Address",
  pincode: "600017",
  latitude: "13.04",
  longitude: "80.23",
});

console.log("Success! Updated user:", result);
```

### Option 2: Using the UI

1. Log in to the application
2. Navigate to `/account`
3. Click on "Profile" tab
4. Edit your information
5. Click "Auto-detect Location" or enter coordinates manually
6. Click "Save Changes"
7. See success message

### Option 3: Using cURL

```bash
# First, get a valid token by logging in via OTP
# Then use that token in the request:

curl -X POST https://purpleoneservice.onrender.com/api/v1/users/update-user-details \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "mobile": "+919042278689",
    "userName": "Bujji",
    "address": "T Nagar",
    "pincode": "600017",
    "latitude": "13.04",
    "longitude": "80.23"
  }'
```

---

## ✅ Form Validation

The form validates:

| Field       | Validation                                  |
| ----------- | ------------------------------------------- |
| `userName`  | Required, non-empty                         |
| `address`   | Required, non-empty                         |
| `pincode`   | Required, minimum 6 digits                  |
| `latitude`  | Required, valid number between -90 and 90   |
| `longitude` | Required, valid number between -180 and 180 |
| `mobile`    | Required, valid phone format                |

**Validation happens both:**

1. Client-side (instant feedback)
2. Server-side (security)

---

## 🗺️ Geolocation Features

### Auto-Detect Location

The form includes a button to automatically detect user's current location:

```typescript
<button
  type="button"
  onClick={handleGetLocation}
  disabled={geoLoading}
>
  📍 Auto-detect Location
</button>
```

**How it works:**

1. User clicks "Auto-detect Location"
2. Browser requests permission to access location
3. Browser uses GPS/WiFi to determine coordinates
4. Latitude and longitude fields auto-fill
5. User can manually adjust if needed

**Fallback:**
If geolocation is not available or denied, user can manually enter coordinates.

---

## 💾 Local State Updates

After successful update:

1. **localStorage:** User object updated with new data
2. **Auth Context:** User state updated in React
3. **UI:** Form shows success message
4. **Persistence:** Changes survive page reload

```typescript
// Automatic updates after successful API call
const updatedUser = {
  ...currentUser,
  userName: data.userName,
  mobile: data.mobile,
  address: data.address,
  pincode: data.pincode,
  latitude: data.latitude,
  longitude: data.longitude,
};
```

---

## 🐛 Error Handling

### Common Errors

| Error                              | Cause               | Solution                            |
| ---------------------------------- | ------------------- | ----------------------------------- |
| "User name is required"            | Empty name field    | Enter full name                     |
| "Address is required"              | Empty address field | Enter complete address              |
| "Valid pincode required"           | Pincode < 6 digits  | Use valid 6+ digit pincode          |
| "Location coordinates required"    | Missing lat/lon     | Click auto-detect or enter manually |
| "Invalid coordinates"              | Out of valid range  | Lat: -90 to 90, Lon: -180 to 180    |
| "No authentication token found"    | Not logged in       | Log in first via OTP                |
| "Token expired and refresh failed" | Session expired     | Log in again                        |
| "Profile updated successfully"     | ✅ Success          | Changes saved                       |

---

## 📁 Files Modified/Created

| File                                         | Type     | Changes                               |
| -------------------------------------------- | -------- | ------------------------------------- |
| `src/services/auth.service.ts`               | Modified | Added `updateUserDetails()` function  |
| `src/context/AuthContext.tsx`                | Modified | Added `updateUserDetails` hook method |
| `src/components/profile/EditProfileForm.tsx` | **NEW**  | Complete profile edit form            |
| `src/app/account/page.tsx`                   | Modified | Added Profile tab with form           |

---

## 🔄 Full Workflow Example

### Step-by-Step User Journey

```
1. User Logs In
   ├── Phone number + OTP
   ├── Tokens saved to localStorage
   └── Auth context updated

2. User Navigates to Account
   ├── Sees Profile tab selected
   └── EditProfileForm displays

3. User Edits Profile
   ├── Changes name, address, pincode
   ├── Clicks "Auto-detect Location"
   └── Coordinates auto-fill

4. User Saves Changes
   ├── Form validates
   ├── API request sent (with token)
   ├── Backend updates database
   └── Response received

5. Success!
   ├── Success message shown
   ├── localStorage updated
   ├── Context state updated
   └── Changes persist on reload
```

---

## 🎨 UI/UX Features

### EditProfileForm Component Includes:

✅ **Form Layout**

- Clear section headers
- Organized field groups
- Responsive grid layout

✅ **Input Validation**

- Real-time character limits
- Number-only fields for coordinates
- Required field indicators

✅ **Geolocation**

- One-click location detection
- Loading state indication
- Fallback for manual entry

✅ **Feedback**

- Error messages in red box
- Success messages in green box
- Loading indicators on buttons

✅ **Accessibility**

- Proper labels for all inputs
- Clear button states (disabled/active)
- Tab navigation support

---

## 🚀 Performance Considerations

✅ **Optimizations Implemented:**

- Token refresh happens before API call
- Automatic retry on network failures (2 attempts)
- Request timeout after 30 seconds
- localStorage caching for immediate UI updates
- No unnecessary re-renders

---

## 📱 Responsive Design

The EditProfileForm is fully responsive:

```
Mobile (< 640px)
├── Single column layout
├── Full-width inputs
└── Stacked buttons

Tablet (640px - 1024px)
├── Two-column coordinate inputs
└── Side-by-side buttons

Desktop (> 1024px)
├── Proper spacing
├── Optimal form width
└── Clean layout
```

---

## 🔒 Security Considerations

✅ **Implemented:**

- Token-based authentication
- Authorization header on every request
- Input validation (client + server)
- Secure token refresh
- XSS protection via sanitization

⚠️ **For Production:**

1. Use HTTPS only (already recommended)
2. Implement CSRF tokens
3. Add request rate limiting
4. Validate all inputs server-side (already done)
5. Log all profile updates for audit
6. Implement IP-based restrictions if needed

---

## 📞 Support & Troubleshooting

### "No authentication token found"

- ✗ User not logged in
- ✓ Solution: Log in via OTP first

### "Unable to get your location"

- ✗ Browser permission denied or geolocation unavailable
- ✓ Solution: Enter coordinates manually

### "Profile updated successfully!" but changes don't appear

- ✗ Cache issue or page not refreshing
- ✓ Solution: Refresh page (F5)

### Form not submitting

- ✗ Validation errors not visible
- ✓ Solution: Check error messages in red box above buttons

### "Invalid coordinates"

- ✗ Values outside valid range
- ✓ Solution: Use valid lat (-90 to 90) and lon (-180 to 180)

---

**Last Updated:** January 2024  
**Version:** 1.0  
**Status:** Production Ready
