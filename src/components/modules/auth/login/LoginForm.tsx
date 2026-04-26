"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import { motion } from "motion/react";
import { Lock, User, AtSign, Phone } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";
import { loginUser } from "@/src/services/auth";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FieldValues>();
  
  const identifier = watch("identifier", "");

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    setError(null);

    // Logic to determine if identifier is email or phone
    const isEmail = identifier.includes("@");
    const loginPayload: any = {
      password: data.password,
    };

    if (isEmail) {
      loginPayload.email = identifier;
    } else {
      loginPayload.phone = identifier;
    }

    try {
      const res = await loginUser(loginPayload);
      if (res.success) {
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="identifier" className="text-gray-700 dark:text-gray-300 ml-1">Email or Phone Number</Label>
          <div className="relative">
            <div className="absolute left-4 top-3 h-5 w-5 text-gray-400">
              {identifier.includes("@") ? <AtSign className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
            <Input
              id="identifier"
              placeholder="email@example.com or 015XXXXXXXX"
              className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-black dark:text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
              {...register("identifier", { required: "Email or Phone number is required" })}
            />
          </div>
          {errors.identifier && <span className="text-red-500 text-xs ml-1">{errors.identifier.message as string}</span>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
            <Link href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-black dark:text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
              {...register("password", { required: "Password is required" })}
            />
          </div>
          {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password.message as string}</span>}
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 text-white transition-all shadow-xl shadow-primary/20"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-black dark:text-white font-bold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
