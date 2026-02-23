/**
 * Utilities for handling pending cart actions during unauthenticated states
 * Used when user tries to add to cart but isn't logged in
 */

export interface PendingCartAction {
  productId: string;
  productName: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

const PENDING_ACTION_KEY = "pendingCartAction";

/**
 * Store a pending cart action for later execution after login
 */
export function setPendingCartAction(action: PendingCartAction): void {
  try {
    sessionStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(action));
  } catch (err) {
    console.error("Failed to save pending cart action:", err);
  }
}

/**
 * Get the pending cart action if one exists
 */
export function getPendingCartAction(): PendingCartAction | null {
  try {
    const stored = sessionStorage.getItem(PENDING_ACTION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("Failed to get pending cart action:", err);
    return null;
  }
}

/**
 * Clear the pending cart action after it's been executed
 */
export function clearPendingCartAction(): void {
  try {
    sessionStorage.removeItem(PENDING_ACTION_KEY);
  } catch (err) {
    console.error("Failed to clear pending cart action:", err);
  }
}
