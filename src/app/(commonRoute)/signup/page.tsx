"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Rocket, Phone, Mail, Lock, Building, CreditCard } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";

export default function SignupPage() {
  const [role, setRole] = useState<"USER" | "RUNNER">("USER");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    university: "",
    studentId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup attempt", { role, ...formData });
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative min-h-screen py-20 flex items-center justify-center bg-black overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[50rem] h-[50rem] bg-primary/20 blur-[10rem] rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-purple-600/10 blur-[10rem] rounded-full translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl z-10"
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
          <h1 className="text-3xl font-bold text-white mb-2">Create an account</h1>
          <p className="text-gray-400">Join our community and start getting things done.</p>
        </div>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl">
          {/* Role Selector */}
          <div className="flex p-1 bg-white/5 rounded-2xl mb-8">
            <button
              onClick={() => setRole("USER")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${role === "USER" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-white"
                }`}
            >
              <User className="w-5 h-5" />
              I'm a User
            </button>
            <button
              onClick={() => setRole("RUNNER")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${role === "RUNNER" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-white"
                }`}
            >
              <Rocket className="w-5 h-5" />
              I'm a Runner
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-300 ml-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
                  <Input
                    placeholder="John Doe"
                    className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 ml-1">Email (Optional)</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
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
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 ml-1">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    required
                  />
                </div>
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
                        value={formData.university}
                        onChange={(e) => updateFormData("university", e.target.value)}
                        required={role === "RUNNER"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 ml-1">Student ID</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
                      <Input
                        placeholder="Student ID Number"
                        className="bg-white/5 border-white/10 text-white pl-12 h-12 rounded-xl focus:border-primary transition-colors"
                        value={formData.studentId}
                        onChange={(e) => updateFormData("studentId", e.target.value)}
                        required={role === "RUNNER"}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 mt-4">
              Create {role === "USER" ? "User" : "Runner"} Account
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

        <p className="mt-6 text-center text-sm text-gray-500">
          By signing up, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  );
}
