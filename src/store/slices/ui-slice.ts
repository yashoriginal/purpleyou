import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  searchOpen: boolean;
  cartOpen: boolean;
  authOpen: boolean;
}

const initialState: UiState = {
  searchOpen: false,
  cartOpen: false,
  authOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,

  reducers: {
    openSearch(state) {
      state.searchOpen = true;
      state.cartOpen = false;
      state.authOpen = false;
    },

    closeSearch(state) {
      state.searchOpen = false;
    },

    openCart(state) {
      state.cartOpen = true;
      state.searchOpen = false;
      state.authOpen = false;
    },

    closeCart(state) {
      state.cartOpen = false;
    },

    openAuth(state) {
      state.authOpen = true;
      state.searchOpen = false;
      state.cartOpen = false;
    },

    closeAuth(state) {
      state.authOpen = false;
    },

    closeAllDrawers(state) {
      state.searchOpen = false;
      state.cartOpen = false;
      state.authOpen = false;
    },
  },
});

export const {
  openSearch,
  closeSearch,
  openCart,
  closeCart,
  openAuth,
  closeAuth,
  closeAllDrawers,
} = uiSlice.actions;

export default uiSlice.reducer;
