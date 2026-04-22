"use client";

import { motion } from "motion/react";
import Link from "next/link";
import RegisterForm from "@/src/components/modules/auth/register/RegisterForm";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen py-20 flex items-center justify-center bg-transparent overflow-hidden px-4">

      
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

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-gray-500">
          By signing up, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  );
}
