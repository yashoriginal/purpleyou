# Cart API Integration - Complete Guide

## Overview

The cart functionality has been fully integrated with the backend API at:
```
https://purpleoneservice.onrender.com/api/v1/cart
```

## API Endpoints Integrated

### 1. **Get Cart Items**
```
GET /api/v1/cart?userId={userId}
```
- **Location**: `src/services/cart.service.ts` → `getCart(userId)`
- **Used in**: `CartContext.tsx` → `loadCart()` function
- **Trigger**: When user logs in or cart page loads
- **Response**: Full cart data with items, totals, quantities

### 2. **Add Item to Cart**
```
POST /api/v1/cart/items
```
- **Location**: `src/services/cart.service.ts` → `addToCart()`
- **Used in**: `CartContext.tsx` → `addToCart()` context method
- **Trigger**: When user clicks "Add to Cart" button
- **Payload**: 
  ```json
  {
    "userId": "user-id",
    "productId": "product-id",
    "quantity": 1,
    "variant": { "color": "gold", "size": "M" },
    "priceEach": 1499.99,
    "currency": "INR"
  }
  ```

### 3. **Update Item Quantity**
```
PATCH /api/v1/cart/items/{productId}
```
- **Location**: `src/services/cart.service.ts` → `updateCartItem()`
- **Used in**: `CartContext.tsx` → `updateQuantity()` context method
- **Trigger**: When user changes quantity in cart page
- **Payload**:
  ```json
  {
    "userId": "user-id",
    "quantity": 5,
    "variant": { "color": "gold", "size": "M" }
  }
  ```

### 4. **Remove Item from Cart**
```
DELETE /api/v1/cart/items/{productId}?userId={userId}
```
- **Location**: `src/services/cart.service.ts` → `removeFromCart()`
- **Used in**: `CartContext.tsx` → `removeFromCart()` context method
- **Trigger**: When user clicks remove button on cart item
- **Payload** (optional):
  ```json
  {
    "variant": { "color": "gold", "size": "M" }
  }
  ```

### 5. **Clear Cart**
```
DELETE /api/v1/cart?userId={userId}
```
- **Location**: `src/services/cart.service.ts` → `clearCart()`
- **Used in**: `CartContext.tsx` → `clearCart()` context method
- **Trigger**: When user clears entire cart or after successful checkout

## Architecture

### Service Layer
**File**: `src/services/cart.service.ts`
- Handles all HTTP requests to cart API
- Manages authentication headers
- Provides type-safe function signatures
- Handles error responses gracefully

### Context Layer
**File**: `src/context/CartContext.tsx`
- Manages local cart state
- Syncs with backend API
- Provides React hooks for components
- Handles loading states and errors
- Manages user authentication via `useAuth()`

### Authentication
- Uses auth token from localStorage
- Authorization header: `Bearer {token}`
- UserId retrieved from stored user data
- Passed as query parameter or in request body

## Component Integration Points

### 1. **Product Page** (`src/app/products/[slug]/page.tsx`)
```typescript
import { useCart } from "@/context/CartContext";

// In component:
const { addToCart, isLoading, error } = useCart();

const handleAddToCart = async (product: Product) => {
  try {
    await addToCart(product, selectedVariants, quantity);
    // Show success message
  } catch (error) {
    // Show error message
  }
};
```

### 2. **Cart Page** (`src/app/cart/page.tsx`)
```typescript
import { useCart } from "@/context/CartContext";

// In component:
const { items, removeFromCart, updateQuantity, totalPrice, isLoading } = useCart();

// Remove item
const handleRemove = async (itemId: string) => {
  await removeFromCart(itemId);
};

// Update quantity
const handleUpdateQuantity = async (itemId: string, newQty: number) => {
  await updateQuantity(itemId, newQty);
};
```

### 3. **Checkout Page** (`src/app/checkout/page.tsx`)
```typescript
import { useCart } from "@/context/CartContext";

// After successful payment:
const { clearCart } = useCart();
await clearCart();
```

### 4. **AddToCartButton Component** (`src/components/product/AddToCartButton.tsx`)
```typescript
import { useCart } from "@/context/CartContext";

const handleClick = async () => {
  const { addToCart } = useCart();
  await addToCart(product, selectedVariants, quantity);
};
```

## Data Flow

### Adding an Item
```
User clicks "Add to Cart"
     ↓
Component calls addToCart()
     ↓
CartContext.addToCart() executes
     ↓
cartService.addToCart() makes API call
     ↓
API response received
     ↓
Local state updated
     ↓
Component re-renders
```

### Loading Cart
```
User logs in / Page loads
     ↓
CartProvider initializes
     ↓
userId from localStorage extracted
     ↓
loadCart() function called
     ↓
cartService.getCart(userId) makes API call
     ↓
Cart items loaded into state
     ↓
Components can access cart via useCart()
```

## Error Handling

All errors are caught and stored in the context:
```typescript
const { error, isLoading } = useCart();

if (error) {
  // Display error message to user
  // Example: "Please log in to add items to cart"
}
```

Common error scenarios:
- **User not logged in**: "Please log in to add items to cart"
- **Network error**: "Failed to add item to cart"
- **Server error**: Specific error message from backend

## Type Safety

All cart operations are fully typed:

```typescript
// CartItem type
interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

// API types
interface CartItemData {
  productId: string;
  quantity: number;
  priceEach: number;
  currency: string;
  variant?: Variant;
}

interface CartData {
  userId: string;
  items: CartItemData[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
```

## Testing the Integration

### Manual Testing
1. **Login** → Navigate to product page
2. **Add to cart** → Verify item appears in cart page
3. **Update quantity** → Verify subtotal updates
4. **Remove item** → Verify cart updates
5. **Clear cart** → Verify all items removed
6. **Refresh page** → Verify cart persists

### API Testing with curl
```bash
# Get cart
curl -X GET "https://purpleoneservice.onrender.com/api/v1/cart?userId=USER_ID" \
  -H "Authorization: Bearer TOKEN"

# Add item
curl -X POST "https://purpleoneservice.onrender.com/api/v1/cart/items" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "productId": "PRODUCT_ID",
    "quantity": 1,
    "variant": {"color": "gold"},
    "priceEach": 1499.99,
    "currency": "INR"
  }'
```

## Production Considerations

1. **Authentication**: Ensure auth token is always included in headers
2. **Error Recovery**: Implement retry logic for failed requests
3. **Caching**: Consider caching cart locally to reduce API calls
4. **Offline Support**: May need fallback mechanism for offline users
5. **Performance**: Monitor API response times for cart operations

## Future Enhancements

1. **Persistent Cart**
   - Save cart to localStorage as backup
   - Sync on app load

2. **Cart Sync**
   - Sync local cart with server on user login
   - Handle conflicts when offline

3. **Real-time Updates**
   - WebSocket for live cart updates across devices
   - Price update notifications

4. **Analytics**
   - Track add-to-cart events
   - Monitor cart abandonment

## Troubleshooting

### Cart shows empty despite items
- Check if user is logged in (`localStorage.auth_token`)
- Check browser console for API errors
- Verify userId is being extracted correctly

### "Please log in" error appears
- Ensure auth token exists in localStorage
- Token format should be valid JWT
- Check if session has expired

### API 404 errors
- Verify productId format matches backend expectations
- Check if product exists in database
- Ensure userId is valid

### API 401 errors
- Check auth token validity
- Verify Authorization header is being sent
- Token may have expired

## Files Modified/Created

- ✅ `src/services/cart.service.ts` - New service layer
- ✅ `src/context/CartContext.tsx` - Updated with API integration
- ✅ `src/context/AuthContext.tsx` - Added userId to User interface
- ✅ `src/services/auth.service.ts` - Updated AuthUser interface
