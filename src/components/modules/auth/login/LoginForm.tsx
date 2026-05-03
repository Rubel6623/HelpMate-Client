"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { Lock, AtSign, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";
import { loginUser } from "@/src/services/auth";
import SocialLoginButtons from "@/src/components/modules/auth/SocialLoginButtons";

// ── Validation helpers ──────────────────────────────────────────────────────
const PHONE_REGEX = /^(?:\+88)?01[3-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateIdentifier(value: string) {
  if (!value || !value.trim()) return "Email or Phone number is required";
  const v = value.trim();
  const isEmail = v.includes("@");
  if (isEmail && !EMAIL_REGEX.test(v)) return "Please enter a valid email address";
  if (!isEmail && !PHONE_REGEX.test(v)) return "Enter a valid BD phone number (e.g. 01XXXXXXXXX)";
  return true;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.span
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-1 text-red-500 text-xs ml-1 mt-1"
    >
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {message}
    </motion.span>
  );
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    watch,
  } = useForm<FieldValues>({ mode: "onChange" });

  const identifier = watch("identifier", "");

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    const isEmail = (data.identifier as string).includes("@");
    const loginPayload: Record<string, string> = {
      password: data.password,
    };
    if (isEmail) {
      loginPayload.email = data.identifier.trim();
    } else {
      loginPayload.phone = data.identifier.trim();
    }

    try {
      const res = await loginUser(loginPayload);
      if (res?.success) {
        setSuccessMsg("Login successful! Redirecting…");
        setTimeout(() => router.push("/dashboard"), 800);
      } else {
        const msg = res?.message || "Invalid credentials. Please try again.";
        setError(
          msg.toLowerCase().includes("not found") ||
            msg.toLowerCase().includes("invalid")
            ? "Incorrect email/phone or password. Please check and try again."
            : msg
        );
      }
    } catch (err: any) {
      setError(
        err?.message === "Failed to fetch"
          ? "Unable to reach the server. Please check your connection."
          : err?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl">
      {/* Server / Success Banners */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="mb-5 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 rounded-xl text-sm"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
        {successMsg && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/25 text-green-600 dark:text-green-400 rounded-xl text-sm"
          >
            <span>✅ {successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Identifier */}
        <div className="space-y-1">
          <Label htmlFor="identifier" className="text-gray-700 dark:text-gray-300 ml-1">
            Email or Phone Number
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-3 h-5 w-5 text-gray-400 pointer-events-none">
              {identifier.includes("@") ? (
                <AtSign className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <Input
              id="identifier"
              autoComplete="username"
              placeholder="email@example.com or 01XXXXXXXXX"
              className={`bg-gray-50 dark:bg-white/5 border pl-12 h-12 rounded-xl transition-colors ${
                errors.identifier
                  ? "border-red-400 dark:border-red-500 focus:border-red-400"
                  : "border-gray-200 dark:border-white/10 focus:border-primary"
              } text-black dark:text-white`}
              {...register("identifier", { validate: validateIdentifier })}
            />
          </div>
          <AnimatePresence>
            {errors.identifier && (
              <FieldError message={errors.identifier.message as string} />
            )}
          </AnimatePresence>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <Link
              href="#"
              className="text-xs text-primary hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`bg-gray-50 dark:bg-white/5 border pl-12 pr-12 h-12 rounded-xl transition-colors ${
                errors.password
                  ? "border-red-400 dark:border-red-500"
                  : "border-gray-200 dark:border-white/10 focus:border-primary"
              } text-black dark:text-white`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-4 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {errors.password && (
              <FieldError message={errors.password.message as string} />
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 text-white transition-all shadow-xl shadow-primary/20 mt-1"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in…
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Social Login */}
      <SocialLoginButtons callbackUrl="/dashboard" />

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-black dark:text-white font-bold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
