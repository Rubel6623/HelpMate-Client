"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Home, Search, ArrowLeft, Ghost, MapPinOff } from "lucide-react";
import { PageBackground } from "@/src/components/shared/PageBackground";
import { Button } from "@/src/components/ui/button";

import { Navbar } from "@/src/app/(commonRoute)/_components/shared/navbar/Navbar";
import { Footer } from "@/src/app/(commonRoute)/_components/shared/footer/Footer";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow relative flex flex-col items-center justify-center overflow-hidden p-6 text-white">
        {/* Background with the global gradient style */}
        <PageBackground />

        <div className="z-10 flex max-w-2xl flex-col items-center text-center">
          {/* Animated Icon/Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: -10 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              duration: 0.8,
            }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 -z-10 animate-pulse blur-3xl opacity-50 bg-primary/40 rounded-full" />
            <div className="flex h-40 w-40 items-center justify-center rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
              <MapPinOff className="h-20 w-20 text-primary" />
            </div>
            
            {/* Floating small icons */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 h-12 w-12 rounded-xl bg-purple-500/20 border border-purple-500/30 backdrop-blur-sm flex items-center justify-center"
            >
              <Ghost className="h-6 w-6 text-purple-300" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-2 -left-6 h-10 w-10 rounded-lg bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm flex items-center justify-center"
            >
              <Search className="h-5 w-5 text-blue-300" />
            </motion.div>
          </motion.div>

          {/* 404 Text */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-2 text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20"
          >
            404
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-extrabold md:text-4xl lg:text-5xl">
              Oops! You've strayed off the <span className="text-primary italic">map.</span>
            </h2>
            <p className="mx-auto max-w-md text-lg font-medium text-gray-400">
              The task or page you're looking for doesn't exist or has been completed and moved to the archives.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="h-14 rounded-2xl bg-white px-8 text-lg font-bold text-black hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Back to Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 rounded-2xl border-white/10 bg-white/5 px-8 text-lg font-bold text-white backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/tasks" className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Tasks
              </Link>
            </Button>
          </motion.div>

          {/* Footer info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1 }}
            className="mt-20 flex items-center gap-2 text-sm font-medium text-gray-500"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>If you think this is a bug, please contact support.</span>
          </motion.div>
        </div>

        {/* Decorative Blur Blobs */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
      </main>

      <Footer />
    </div>
  );
}

