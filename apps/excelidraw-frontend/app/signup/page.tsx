"use client";

import Link from "next/link";
import { Button } from "@repo/ui/button";
import { AuthInput } from "../components/AuthInput";
import { AuthLayout } from "../components/AuthLayout";
import { useRef } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";


export default  function SignUpPage() {
    const NameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null) ;
    const passwordRef = useRef<HTMLInputElement>(null) ;
    const router = useRouter() ;
    async function signup() {
        const name = NameRef.current?.value ;
        const email = emailRef.current?.value  ;
        const password = passwordRef.current?.value ;
        await axios.post(`${HTTP_BACKEND}/register` , {
            name ,
            email ,
            password
        })  
        alert("You have Signed UP ")
        router.push("/signin")
    }
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us and start collaborating"
    >
      {/* Name Input */}
      <AuthInput
        label="Full Name"
        ref={NameRef}
        type="text"
        placeholder="John Doe"
        required
      />

      {/* Email Input */}
      <AuthInput
        label="Email Address"
        ref={emailRef}
        type="email"
        placeholder="you@example.com"
        required
      />

      {/* Password Input */}
      <AuthInput
        label="Password" 
        ref={passwordRef}
        type="password"
        placeholder="••••••••"
        required
      />

      {/* Create Account Button */}
      <Button
        variant="primary"
        onClick={signup}
        size="lg"
        className="w-full h-12 rounded-lg text-base font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/30"
      >
        Create Account
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">
            Already have an account?
          </span>
        </div>
      </div>

      {/* Sign In Link */}
      <Link href="/signin" className="block">
        <Button
          variant="outline"
          size="lg"
          className="w-full h-12 rounded-lg text-base font-semibold transition-all duration-200"
        >
          Sign In
        </Button>
      </Link>

      {/* Terms (UI only - no functionality) */}
      <p className="text-xs text-center text-muted-foreground">
        By creating an account, you agree to our{" "}
        <button className="text-primary hover:underline transition-colors duration-200">
          Terms of Service
        </button>
        {" "}and{" "}
        <button className="text-primary hover:underline transition-colors duration-200">
          Privacy Policy
        </button>
      </p>
    </AuthLayout>
  );
}