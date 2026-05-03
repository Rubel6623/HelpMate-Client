"use client";

import { motion } from "motion/react";
import Link from "next/link";
import RegisterForm from "@/src/components/modules/auth/register/RegisterForm";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen py-20 flex items-center justify-center bg-transparent overflow-hidden px-4">

      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link 
          href="/" 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-all font-bold group"
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-white/30 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="hidden sm:block">Back to Home</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black shadow-2xl">
              <span className="text-2xl font-bold italic">H</span>
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">
              HelpMate
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create an account</h1>
          <p className="text-gray-400">Join our community and start getting things done.</p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-gray-500">
          By signing up, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  );
}
