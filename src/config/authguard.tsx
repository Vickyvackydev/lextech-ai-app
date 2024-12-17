"use client";

import { useAppSelector } from "@/hooks";
import { selectToken } from "@/states/slices/authReducer";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAppSelector(selectToken);
  useEffect(() => {
    if (!token) {
      router.replace("/sign-in");
    }
  }, []);

  return <>{children}</>;
}

export default AuthGuard;
