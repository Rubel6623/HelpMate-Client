"use client";

import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { MotionRunner } from "./MotionRunner";

const BannerPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-fit overflow-hidden bg-transparent">


      {/* Content container */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto flex items-center justify-between px-4 py-4 mt-6">          

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation Menu with animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex flex-col p-4 bg-black/95 md:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-xl">
                    <span className="text-xl font-bold italic">H</span>
                  </div>
                  <span className="ml-3 text-2xl font-extrabold tracking-tight text-white">
                    HelpMate
                  </span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="mt-8 flex flex-col space-y-6">
                <MobileNavItem label="How It Works" href="#how-it-works" />
                <MobileNavItem label="Services" href="#services" />
                <MobileNavItem label="About Us" href="/about-us" />
                <MobileNavItem label="Pricing" href="#pricing" />
                <div className="pt-4">
                  <Link href="/login" className="block w-full">
                    <button className="w-full justify-start border border-gray-700 text-white p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
                      Log in
                    </button>
                  </Link>
                </div>
                <Link href="/register" className="block w-full">
                  <button className="w-full h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90">
                    Get Started For Free
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge */}
        <Link href="#services" className="mx-auto mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full bg-black/5 dark:bg-white/10 px-4 py-2 backdrop-blur-sm hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
          <span className="text-sm font-medium text-black dark:text-white">
            Join the revolution today!
          </span>
          <ArrowRight className="h-4 w-4 text-black dark:text-white" />
        </Link>

        {/* Hero section */}
        <div className="container mx-auto mt-12 lg:mt-20 px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl font-extrabold leading-[1.1] text-black dark:text-white md:text-7xl lg:text-8xl tracking-tight">
                  Get Anything Done. <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
                    Right Now.
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl text-xl text-gray-600 dark:text-gray-300 font-medium"
              >
                Connect with verified university students for quick, affordable
                errands. Grocery runs, queue standing, or document delivery —
                we've got you covered.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col items-center lg:items-start justify-center lg:justify-start space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0"
              >
                <Link href="/dashboard/user/post-task">
                  <button className="h-14 rounded-full bg-black dark:bg-white px-10 text-lg font-bold text-white dark:text-black transition-all hover:scale-105 hover:bg-black/90 dark:hover:bg-gray-100 active:scale-95 shadow-2xl shadow-black/10 dark:shadow-white/10">
                    Post a Task
                  </button>
                </Link>
                <Link href="/register">
                  <button className="h-14 rounded-full border-2 border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/5 px-10 text-lg font-bold text-black dark:text-white backdrop-blur-md transition-all hover:bg-black/10 dark:hover:bg-white/10 active:scale-95">
                    Become a Helper
                  </button>
                </Link>
              </motion.div>
            </div>


            {/* Motion Runner Illustration */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <MotionRunner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function NavItem({
  label,
  hasDropdown,
}: {
  label: string;
  hasDropdown?: boolean;
}) {
  return (
    <div className="flex items-center text-sm text-gray-300 hover:text-white">
      <span>{label}</span>
      {hasDropdown && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-1"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      )}
    </div>
  );
}

function MobileNavItem({ label, href }: { label: string; href?: string }) {
  return (
    <Link href={href || "#"} className="flex items-center justify-between border-b border-gray-800 pb-2 text-lg text-white">
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 text-gray-400" />
    </Link>
  );
}

export default BannerPage;
