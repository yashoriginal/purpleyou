# Cart API Integration - Quick Reference

## Where APIs Are Plugged In

### 1. **Service Layer** 
**File**: `src/services/cart.service.ts`

All API endpoints are defined here as functions:

```typescript
// GET /api/v1/cart?userId={userId}
export async function getCart(userId: string): Promise<CartData>

// POST /api/v1/cart/items
export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
  priceEach: number,
  variant?: Variant
): Promise<CartData>

// PATCH /api/v1/cart/items/{productId}
export async function updateCartItem(
  userId: string,
  productId: string,
  quantity: number,
  variant?: Variant
): Promise<CartData>

// DELETE /api/v1/cart/items/{productId}?userId={userId}
export async function removeFromCart(
  userId: string,
  productId: string,
  variant?: Variant
): Promise<CartData>

// DELETE /api/v1/cart?userId={userId}
export async function clearCart(userId: string): Promise<CartData>
```

### 2. **Context Layer**
**File**: `src/context/CartContext.tsx`

The context consumes the service and provides React hooks:

```typescript
// Exposed public methods:
export function useCart(): CartContextType {
  return {
    items: CartItem[],
    totalItems: number,
    totalPrice: number,
    isLoading: boolean,
    error: string | null,
    addToCart(product, variants?, quantity?),
    removeFromCart(itemId),
    updateQuantity(itemId, quantity),
    clearCart()
  }
}
```

### 3. **Component Usage Examples**

#### Add to Cart (Product Page)
```typescript
import { useCart } from "@/context/CartContext";

function ProductDetail() {
  const { addToCart, isLoading, error } = useCart();
  
  const handleAddToCart = async () => {
    try {
      await addToCart(product, {color: "gold"}, 1);
      // Success: Item added to backend cart
    } catch (err) {
      // Error handling
    }
  };
}
```

#### Cart Management (Cart Page)
```typescript
import { useCart } from "@/context/CartContext";

function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  
  // Remove item
  const handleRemove = async (itemId) => {
    await removeFromCart(itemId); // Calls DELETE API
  };
  
  // Update quantity
  const handleUpdate = async (itemId, qty) => {
    await updateQuantity(itemId, qty); // Calls PATCH API
  };
}
```

#### Clear Cart (Checkout Success)
```typescript
import { useCart } from "@/context/CartContext";

function CheckoutSuccess() {
  const { clearCart } = useCart();
  
  useEffect(() => {
    // After successful payment
    clearCart(); // Calls DELETE API to clear cart
  }, []);
}
```

## API Call Flow

### When User Adds Item to Cart

```
User clicks "Add to Cart"
        ↓
Component: addToCart(product)
        ↓
CartContext: addToCart() → cartService.addToCart()
        ↓
POST /api/v1/cart/items {
  userId: "user-id",
  productId: "product-id",
  quantity: 1,
  priceEach: 1499.99,
  variant: {color: "gold", size: "M"},
  currency: "INR"
}
        ↓
Backend: Adds item to user's cart
        ↓
Response: CartData with updated items
        ↓
Context: Updates local state with new items
        ↓
Components: Re-render with updated cart
```

## Authentication & UserId

The cart automatically gets userId from:
1. Auth token stored in `localStorage.auth_token`
2. User data stored in `localStorage.current_user`
3. Extracts `_id` or `id` or `userId` field

This happens in `CartContext` initialization:
```typescript
useEffect(() => {
  const userStr = localStorage.getItem("current_user");
  const user = JSON.parse(userStr);
  setUserId(user._id); // Use this userId for all API calls
}, []);
```

## State Management

### Local State (In Context)
```typescript
const [items, setItems] = useState<CartItem[]>();
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [userId, setUserId] = useState<string | null>(null);
```

### Syncing with Backend
- When user logs in → `userId` is set → `loadCart()` is called
- When user adds item → `addToCart()` updates API then local state
- When page refreshes → Cart loads from API on mount
- Items persist across sessions (stored in backend)

## Error Handling

All operations handle errors gracefully:

```typescript
const { error } = useCart();

// Display error to user if exists
if (error) {
  return <div className="error">{error}</div>;
}
```

Common errors:
- "Please log in to add items to cart" (Not authenticated)
- "Failed to add item to cart" (Network error)
- "Item not found in cart" (Item doesn't exist)

## Current Implementation Status

✅ **Completed**
- `src/services/cart.service.ts` - All 5 API endpoints
- `src/context/CartContext.tsx` - Full API integration
- Authentication flow with userId
- Error handling and loading states
- Type-safe operations

✅ **Ready to Use**
- All components can call `useCart()` hook
- All cart operations sync with backend
- Cart persists across sessions

## Next Steps for Components

Update these files to use the new cart integration:
1. `src/app/cart/page.tsx` - Cart listing page
2. `src/app/checkout/page.tsx` - Checkout flow
3. `src/components/product/AddToCartButton.tsx` - Add to cart button
4. Any other component using cart

## Testing

### Quick Test
1. Login to the app
2. Go to product page
3. Click "Add to Cart"
4. Go to cart page - item should appear
5. Update quantity - should sync with API
6. Refresh page - cart should persist
7. Remove item - should update both locally and on API

### API Testing
```bash
# Test cart endpoints
curl -X GET "https://purpleoneservice.onrender.com/api/v1/cart?userId=6e2f30f7-2829-470e-8788-beda371a6ec2" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Files Structure

```
src/
├── services/
│   ├── auth.service.ts (updated - added userId)
│   └── cart.service.ts (new - all API calls)
├── context/
│   ├── AuthContext.tsx (updated - userId in User interface)
│   └── CartContext.tsx (updated - full API integration)
└── app/
    ├── cart/
    │   └── page.tsx (ready to implement)
    ├── checkout/
    │   └── page.tsx (ready to implement)
    └── products/
        └── page.tsx (ready to implement)
```
