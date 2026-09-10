"use client";

import { useEffect, useRef } from "react";

import { fetchCart, resetCart } from "@/store/slices/cart-slice";

import { mergeGuestCart } from "@/services/cart.service";

import {
  selectAuthStatus,
  selectAuthUser,
} from "@/store/selectors/auth-selectors";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

/* =========================================================
   CART INITIALIZER
========================================================= */

export function CartInitializer() {
  const dispatch = useAppDispatch();

  const authStatus = useAppSelector(selectAuthStatus);

  const user = useAppSelector(selectAuthUser);

  /*
   * Tracks the authenticated user whose cart has
   * already been initialized.
   */
  const loadedUserIdRef = useRef<string | null>(null);

  /*
   * Prevents repeatedly initializing the guest cart
   * on every auth-related render.
   */
  const guestCartLoadedRef = useRef(false);

  /*
   * Prevents the guest-cart merge from being triggered
   * multiple times during the same login transition.
   */
  const mergingGuestCartRef = useRef(false);

  /* =======================================================
     AUTHENTICATED USER
  ======================================================= */

  useEffect(() => {
    if (authStatus !== "authenticated" || !user?.userId) {
      return;
    }

    /*
     * Don't initialize the same user's cart repeatedly.
     */
    if (loadedUserIdRef.current === user.userId) {
      return;
    }

    /*
     * Prevent duplicate merge/fetch operations.
     */
    if (mergingGuestCartRef.current) {
      return;
    }

    mergingGuestCartRef.current = true;

    void mergeGuestCart()
      .then(() => {
        /*
         * mergeGuestCart() returns the authenticated
         * backend cart after the guest cart has been
         * transferred.
         *
         * Fetching again here keeps Redux synchronized
         * with the backend regardless of whether the
         * guest cart contained items.
         */
        return dispatch(fetchCart()).unwrap();
      })
      .then(() => {
        loadedUserIdRef.current = user.userId ?? null;

        /*
         * The user is now authenticated, so the guest
         * cart no longer needs to be loaded separately.
         */
        guestCartLoadedRef.current = false;
      })
      .catch(() => {
        /*
         * If either the merge or cart fetch fails,
         * allow another attempt later.
         */
        loadedUserIdRef.current = null;
      })
      .finally(() => {
        mergingGuestCartRef.current = false;
      });
  }, [authStatus, user?.userId, dispatch]);

  /* =======================================================
     GUEST USER
  ======================================================= */

  useEffect(() => {
    if (authStatus !== "guest") {
      return;
    }

    /*
     * If we already restored the guest cart,
     * don't repeatedly fetch it.
     */
    if (guestCartLoadedRef.current) {
      return;
    }

    /*
     * No authenticated user is currently loaded.
     */
    loadedUserIdRef.current = null;

    guestCartLoadedRef.current = true;

    /*
     * fetchCart() now automatically uses:
     *
     *   authenticated user → backend cart
     *   guest user         → localStorage cart
     *
     * This restores the guest cart into Redux.
     */
    void dispatch(fetchCart())
      .unwrap()
      .catch(() => {
        /*
         * Allow another attempt if restoring the
         * guest cart failed.
         */
        guestCartLoadedRef.current = false;
      });
  }, [authStatus, dispatch]);

  /* =======================================================
     AUTH STATE RESET
  ======================================================= */

  useEffect(() => {
    /*
     * During auth restoration/loading, don't clear
     * the existing Redux cart.
     *
     * Clearing here could make the cart disappear
     * temporarily while authentication is being restored.
     */
    if (authStatus === "idle" || authStatus === "restoring") {
      return;
    }

    /*
     * If the auth system explicitly returns to a state
     * other than guest/authenticated, clear the
     * authenticated Redux cart state.
     */
    if (authStatus !== "guest" && authStatus !== "authenticated") {
      loadedUserIdRef.current = null;
      guestCartLoadedRef.current = false;

      dispatch(resetCart());
    }
  }, [authStatus, dispatch]);

  return null;
}
