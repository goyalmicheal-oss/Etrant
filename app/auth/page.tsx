import type React from "react";
import AuthLayout from "@/components/auth/auth-layout";
import { Metadata } from "next";
import { authMetadata } from "@/lib/config/site";

export const metadata: Metadata = authMetadata;

export default async function SignUpPage() {
  return <AuthLayout />;
}
