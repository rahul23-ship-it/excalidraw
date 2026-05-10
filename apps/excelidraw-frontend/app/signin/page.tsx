"use client";

import Link from "next/link";
import { Button } from "@repo/ui/button";
import { AuthInput } from "../components/AuthInput";
import { AuthLayout } from "../components/AuthLayout";
import { useRef } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";
export default function SignInPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function signin() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const response = await axios.post(`${HTTP_BACKEND}/login`, {
      email,
      password,
    });
    const jwt = response.data.token;
    localStorage.setItem("token", jwt);
    router.push("/joinroom");
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <AuthInput
        label="Email Address"
        type="email"
        ref={emailRef}
        placeholder="you@example.com"
        required
      />

      <AuthInput
        label="Password"
        type="password"
        ref={passwordRef}
        placeholder="••••••••"
        required
      />

      <Button
        variant="primary"
        onClick={signin}
        size="lg"
        className="w-full h-12 rounded-lg text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/30"
      >
        Sign In
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">
            New to our platform?
          </span>
        </div>
      </div>

      <Link href="/signup" className="block">
        <Button
          variant="outline"
          size="lg"
          className="w-full h-12 rounded-lg text-base font-semibold transition-all duration-200"
        >
          Create Account
        </Button>
      </Link>

      <div className="flex justify-center pt-2">
        <button className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
          Forgot your password?
        </button>
      </div>
    </AuthLayout>
  );
}