"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Lock, Phone } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt", { phone, password });
    // Implementation for login logic will go here
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-primary/20 blur-[10rem] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-purple-600/10 blur-[10rem] rounded-full -translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black shadow-2xl">
              <span className="text-2xl font-bold italic">Q</span>
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">
              QuickStep
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-gray-400">Please enter your details to login.</p>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300 ml-1">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
                <Input
                  id="phone"
                  placeholder="01XXXXXXXXX"
                  className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button className="w-full h-12 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-white font-bold hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold">!</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Logging in as a <strong>Runner</strong>? Ensure you use the phone number registered with your university student ID.
          </p>
        </div>
      </motion.div>
    </div>
  );
}