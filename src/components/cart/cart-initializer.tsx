"use client";

import { useEffect, useRef } from "react";

import { fetchCart, resetCart } from "@/store/slices/cart-slice";

import {
  selectAuthStatus,
  selectAuthUser,
} from "@/store/selectors/auth-selectors";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function CartInitializer() {
  const dispatch = useAppDispatch();

  const authStatus = useAppSelector(selectAuthStatus);

  const user = useAppSelector(selectAuthUser);

  const loadedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (authStatus === "authenticated" && user?.userId) {
      if (loadedUserIdRef.current === user.userId) {
        return;
      }

      loadedUserIdRef.current = user.userId;

      void dispatch(fetchCart())
        .unwrap()
        .catch(() => {
          loadedUserIdRef.current = null;
        });

      return;
    }

    if (authStatus === "guest") {
      loadedUserIdRef.current = null;
      dispatch(resetCart());
    }
  }, [authStatus, user?.userId, dispatch]);

  return null;
}
