"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Rocket,
  Phone,
  Mail,
  Lock,
  Building,
  CreditCard,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";
import { registerUser } from "@/src/services/auth";
import SocialLoginButtons from "@/src/components/modules/auth/SocialLoginButtons";

// ── Validation helpers ────────────────────────────────────────────────────────
const PHONE_REGEX = /^(?:\+88)?01[3-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\u0980-\u09FF\s'-]{2,60}$/;

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

// Password strength meter
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="mt-2 space-y-1.5 px-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : "#e5e7eb" }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {score > 0 && (
          <span className="text-xs font-semibold" style={{ color: colors[score] }}>
            {labels[score]}
          </span>
        )}
        {checks.map((c) => (
          <span
            key={c.label}
            className={`text-xs flex items-center gap-0.5 ${
              c.pass ? "text-green-600 dark:text-green-400" : "text-gray-400"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RegisterForm() {
  const [role, setRole] = useState<"USER" | "RUNNER">("USER");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FieldValues>({ mode: "onChange" });

  const password = watch("password", "");

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...rest } = data;
      const payload = { ...rest, role };
      const res = await registerUser(payload);
      if (res?.success) {
        setSuccessMsg("Account created! Redirecting to login…");
        reset();
        setTimeout(() => router.push("/login"), 1200);
      } else {
        const msg = res?.message || "Registration failed. Please try again.";
        setError(
          msg.toLowerCase().includes("duplicate") ||
            msg.toLowerCase().includes("already")
            ? "An account with this email or phone already exists."
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

  const inputClass = (hasError: boolean) =>
    `bg-white/5 border pl-12 h-12 rounded-xl transition-colors ${
      hasError
        ? "border-red-400 dark:border-red-500"
        : "border-white/10 focus:border-primary"
    } text-white`;

  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl">
      {/* Role Selector */}
      <div className="flex p-1 bg-white/5 rounded-2xl mb-7">
        {(["USER", "RUNNER"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all ${
              role === r
                ? "bg-primary text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {r === "USER" ? <User className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
            {r === "USER" ? "I'm a User" : "I'm a Runner"}
          </button>
        ))}
      </div>

      {/* Banners */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="mb-5 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl text-sm"
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
            className="mb-5 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/25 text-green-400 rounded-xl text-sm"
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1">
            <Label className="text-gray-300 ml-1">Full Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
              <Input
                placeholder="John Doe"
                autoComplete="name"
                className={inputClass(!!errors.name)}
                {...register("name", {
                  required: "Full name is required",
                  pattern: {
                    value: NAME_REGEX,
                    message: "Enter a valid name (2–60 letters)",
                  },
                })}
              />
            </div>
            <AnimatePresence>
              {errors.name && <FieldError message={errors.name.message as string} />}
            </AnimatePresence>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label className="text-gray-300 ml-1">
              Email{" "}
              <span className="text-gray-500 font-normal text-xs">(optional)</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
              <Input
                type="email"
                autoComplete="email"
                placeholder="john@example.com"
                className={inputClass(!!errors.email)}
                {...register("email", {
                  validate: (v) =>
                    !v || EMAIL_REGEX.test(v) || "Please enter a valid email address",
                })}
              />
            </div>
            <AnimatePresence>
              {errors.email && <FieldError message={errors.email.message as string} />}
            </AnimatePresence>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label className="text-gray-300 ml-1">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-4 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
              <Input
                placeholder="01XXXXXXXXX"
                autoComplete="tel"
                className={inputClass(!!errors.phone)}
                {...register("phone", {
                  required: "Phone number is required",
                  validate: (v) =>
                    PHONE_REGEX.test(v) ||
                    "Enter a valid BD phone number (e.g. 01XXXXXXXXX)",
                })}
              />
            </div>
            <AnimatePresence>
              {errors.phone && <FieldError message={errors.phone.message as string} />}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label className="text-gray-300 ml-1">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className={`${inputClass(!!errors.password)} pr-12`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: (v) =>
                    /[A-Z]/.test(v) ||
                    "Include at least one uppercase letter",
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-3 h-5 w-5 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <PasswordStrength password={password} />
            <AnimatePresence>
              {errors.password && (
                <FieldError message={errors.password.message as string} />
              )}
            </AnimatePresence>
          </div>

          {/* Confirm Password – full width */}
          <div className="space-y-1 md:col-span-2">
            <Label className="text-gray-300 ml-1">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
              <Input
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className={`${inputClass(!!errors.confirmPassword)} pr-12`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (v) =>
                    v === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-4 top-3 h-5 w-5 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <AnimatePresence>
              {errors.confirmPassword && (
                <FieldError message={errors.confirmPassword.message as string} />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Runner-only fields */}
        <AnimatePresence mode="wait">
          {role === "RUNNER" && (
            <motion.div
              key="runner-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 border-t border-white/10 overflow-hidden"
            >
              {/* University */}
              <div className="space-y-1">
                <Label className="text-gray-300 ml-1">University</Label>
                <div className="relative">
                  <Building className="absolute left-4 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
                  <Input
                    placeholder="University Name"
                    className={inputClass(!!errors.university)}
                    {...register("university", {
                      required: role === "RUNNER" ? "University name is required" : false,
                      minLength: {
                        value: 3,
                        message: "Enter a valid university name",
                      },
                    })}
                  />
                </div>
                <AnimatePresence>
                  {errors.university && (
                    <FieldError message={errors.university.message as string} />
                  )}
                </AnimatePresence>
              </div>

              {/* Student ID */}
              <div className="space-y-1">
                <Label className="text-gray-300 ml-1">Student ID</Label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
                  <Input
                    placeholder="Student ID Number"
                    className={inputClass(!!errors.studentId)}
                    {...register("studentId", {
                      required: role === "RUNNER" ? "Student ID is required" : false,
                      minLength: {
                        value: 4,
                        message: "Enter a valid student ID",
                      },
                    })}
                  />
                </div>
                <AnimatePresence>
                  {errors.studentId && (
                    <FieldError message={errors.studentId.message as string} />
                  )}
                </AnimatePresence>
              </div>

              {/* NID – full width */}
              <div className="space-y-1 md:col-span-2">
                <Label className="text-gray-300 ml-1">National ID (NID)</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-3 h-5 w-5 text-gray-500 pointer-events-none" />
                  <Input
                    placeholder="NID Number (10 or 17 digits)"
                    className={inputClass(!!errors.nationalId)}
                    {...register("nationalId", {
                      required: role === "RUNNER" ? "National ID is required" : false,
                      pattern: {
                        value: /^\d{10}$|^\d{17}$/,
                        message: "NID must be 10 or 17 digits",
                      },
                    })}
                  />
                </div>
                <AnimatePresence>
                  {errors.nationalId && (
                    <FieldError message={errors.nationalId.message as string} />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 mt-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing…
            </span>
          ) : (
            `Create ${role === "USER" ? "User" : "Runner"} Account`
          )}
        </Button>
      </form>

      {/* Social Login */}
      <SocialLoginButtons callbackUrl="/dashboard" />

      {/* Footer */}
      <div className="mt-6 text-center border-t border-white/10 pt-6">
        <p className="text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
