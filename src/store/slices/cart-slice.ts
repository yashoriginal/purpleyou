import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  clearCart,
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart.service";

import type { CartData, CartItemVariant } from "@/types/cart";

interface AddCartItemPayload {
  productId: string;
  quantity: number;
  priceEach: number;
  currency?: string;
  variant?: CartItemVariant;
}

interface CartState {
  data: CartData | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

const initialState: CartState = {
  data: null,
  isLoading: false,
  isMutating: false,
  error: null,
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export const fetchCart = createAsyncThunk<
  CartData,
  void,
  {
    rejectValue: string;
  }
>("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    return await getCart();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

interface UpdateCartQuantityPayload {
  productId: string;
  quantity: number;
  variant?: CartItemVariant;
}

export const updateCartQuantity = createAsyncThunk<
  CartData,
  UpdateCartQuantityPayload,
  {
    rejectValue: string;
  }
>("cart/updateQuantity", async (payload, { rejectWithValue }) => {
  try {
    return await updateCartItem(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addItemToCart = createAsyncThunk<
  CartData,
  AddCartItemPayload,
  {
    rejectValue: string;
  }
>("cart/addItem", async (payload, { rejectWithValue }) => {
  try {
    return await addCartItem(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

interface RemoveCartItemPayload {
  productId: string;
  variant?: CartItemVariant;
}

export const removeItemFromCart = createAsyncThunk<
  CartData,
  RemoveCartItemPayload,
  {
    rejectValue: string;
  }
>("cart/removeItem", async (payload, { rejectWithValue }) => {
  try {
    return await removeCartItem(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const clearEntireCart = createAsyncThunk<
  void,
  void,
  {
    rejectValue: string;
  }
>("cart/clear", async (_, { rejectWithValue }) => {
  try {
    await clearCart();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    setCart(state, action: PayloadAction<CartData>) {
      state.data = action.payload;
      state.error = null;
    },

    resetCart(state) {
      state.data = null;
      state.isLoading = false;
      state.isMutating = false;
      state.error = null;
    },

    clearCartError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unable to load cart";
      })

      .addCase(updateCartQuantity.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })

      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isMutating = false;
        state.data = action.payload;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })

      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.isMutating = false;
        state.data = action.payload;
        state.error = null;
      })

      .addCase(addItemToCart.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload ?? "Unable to add item to cart";
      })

      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload ?? "Unable to update cart";
      })

      .addCase(removeItemFromCart.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })

      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.isMutating = false;
        state.data = action.payload;
      })

      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload ?? "Unable to remove item";
      })

      .addCase(clearEntireCart.pending, (state) => {
        state.isMutating = true;
        state.error = null;
      })

      .addCase(clearEntireCart.fulfilled, (state) => {
        state.isMutating = false;

        if (state.data) {
          state.data.items = [];
          state.data.totalItems = 0;
          state.data.totalQuantity = 0;
          state.data.subtotal = 0;
        }
      })

      .addCase(clearEntireCart.rejected, (state, action) => {
        state.isMutating = false;
        state.error = action.payload ?? "Unable to clear cart";
      });
  },
});

export const { setCart, resetCart, clearCartError } = cartSlice.actions;

export default cartSlice.reducer;
