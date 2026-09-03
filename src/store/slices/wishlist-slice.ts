import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  productIds: string[];
  hydrated: boolean;
}

const initialState: WishlistState = {
  productIds: [],
  hydrated: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    hydrateWishlist(state, action: PayloadAction<string[]>) {
      state.productIds = Array.from(
        new Set(
          action.payload.filter(
            (id) => typeof id === "string" && id.trim().length > 0,
          ),
        ),
      );

      state.hydrated = true;
    },

    toggleWishlist(state, action: PayloadAction<string>) {
      const productId = action.payload;

      const exists = state.productIds.includes(productId);

      if (exists) {
        state.productIds = state.productIds.filter((id) => id !== productId);
      } else {
        state.productIds.push(productId);
      }
    },

    removeFromWishlist(state, action: PayloadAction<string>) {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
    },

    clearWishlist(state) {
      state.productIds = [];
    },
  },
});

export const {
  hydrateWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
