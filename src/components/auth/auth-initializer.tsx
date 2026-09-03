"use client";

import { useEffect, useRef } from "react";

import { useAppDispatch } from "@/store/hooks";
import { restoreSession } from "@/store/slices/auth-slice";

export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    void dispatch(restoreSession());
  }, [dispatch]);

  return null;
}
