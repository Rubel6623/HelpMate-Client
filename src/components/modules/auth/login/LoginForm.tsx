"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import { motion } from "motion/react";
import { Lock, Phone } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";
import { loginUser } from "@/src/services/auth";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>();

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginUser(data);
      if (res.success) {
        // Default redirect based on role could be handled here or in a wrapper
        // Wait for cookie to be set, redirect
        router.push("/dashboard");
      } else {
        setError(res.message || "Failed to login");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-300 ml-1">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
            <Input
              id="phone"
              placeholder="01XXXXXXXXX"
              className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
              {...register("phone", { required: "Phone number is required" })}
            />
          </div>
          {errors.phone && <span className="text-red-500 text-xs ml-1">{errors.phone.message as string}</span>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
              {...register("password", { required: "Password is required" })}
            />
          </div>
          {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password.message as string}</span>}
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-white font-bold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
