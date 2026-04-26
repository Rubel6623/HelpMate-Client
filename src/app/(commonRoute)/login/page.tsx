"use client";

import { motion } from "motion/react";
import Link from "next/link";
import LoginForm from "@/src/components/modules/auth/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden px-4">

      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-2xl">
              <span className="text-2xl font-bold italic">H</span>
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
              HelpMate
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Please enter your details to login.</p>
        </div>

        <LoginForm />

        {/* Info Box */}
        <div className="mt-8 p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold">!</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Logging in as a <strong>Runner</strong>? Ensure you use the phone number registered with your university student ID.
          </p>
        </div>
      </motion.div>
    </div>
  );
}