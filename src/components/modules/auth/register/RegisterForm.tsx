"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { User, Rocket, Phone, Mail, Lock, Building, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";
import { registerUser } from "@/src/services/auth";

export default function RegisterForm() {
  const [role, setRole] = useState<"USER" | "RUNNER">("USER");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>();

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = { ...data, role };
      const res = await registerUser(payload);
      if (res.success) {
        router.push("/login");
      } else {
        setError(res.message || "Failed to register");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl">
      {/* Role Selector */}
      <div className="flex p-1 bg-white/5 rounded-2xl mb-8">
        <button
          type="button"
          onClick={() => setRole("USER")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
            role === "USER" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-white"
          }`}
        >
          <User className="w-5 h-5" />
          I'm a User
        </button>
        <button
          type="button"
          onClick={() => setRole("RUNNER")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
            role === "RUNNER" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-white"
          }`}
        >
          <Rocket className="w-5 h-5" />
          I'm a Runner
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-300 ml-1">Full Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
              <Input
                placeholder="John Doe"
                className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
                {...register("name", { required: "Name is required" })}
              />
            </div>
            {errors.name && <span className="text-red-500 text-xs ml-1">{errors.name.message as string}</span>}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 ml-1">Email (Optional)</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
              <Input
                type="email"
                placeholder="john@example.com"
                className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
                {...register("email")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 ml-1">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
              <Input
                placeholder="01XXXXXXXXX"
                className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
                {...register("phone", { required: "Phone is required" })}
              />
            </div>
            {errors.phone && <span className="text-red-500 text-xs ml-1">{errors.phone.message as string}</span>}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300 ml-1">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
                {...register("password", { required: "Password is required" })}
              />
            </div>
            {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password.message as string}</span>}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {role === "RUNNER" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10"
            >
              <div className="space-y-2">
                <Label className="text-gray-300 ml-1">University</Label>
                <div className="relative">
                  <Building className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
                  <Input
                    placeholder="University Name"
                    className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
                    {...register("university", { required: role === "RUNNER" ? "University is required" : false })}
                  />
                </div>
                {errors.university && <span className="text-red-500 text-xs ml-1">{errors.university.message as string}</span>}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 ml-1">Student ID</Label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
                  <Input
                    placeholder="Student ID Number"
                    className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
                    {...register("studentId", { required: role === "RUNNER" ? "Student ID is required" : false })}
                  />
                </div>
                {errors.studentId && <span className="text-red-500 text-xs ml-1">{errors.studentId.message as string}</span>}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 ml-1">National ID (NID)</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
                  <Input
                    placeholder="NID Number"
                    className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
                    {...register("nationalId", { required: role === "RUNNER" ? "National ID is required" : false })}
                  />
                </div>
                {errors.nationalId && <span className="text-red-500 text-xs ml-1">{errors.nationalId.message as string}</span>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 mt-4"
        >
          {isLoading ? "Processing..." : `Create ${role === "USER" ? "User" : "Runner"} Account`}
        </Button>
      </form>

      <div className="mt-8 text-center border-t border-white/10 pt-8">
        <p className="text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
