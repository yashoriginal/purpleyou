import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/slices/auth-slice";
import cartReducer from "@/store/slices/cart-slice";
import uiReducer from "@/store/slices/ui-slice";
import wishlistReducer from "@/store/slices/wishlist-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      auth: authReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
    },

    devTools: process.env.NODE_ENV !== "production",
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];
