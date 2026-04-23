"use client";

import { motion } from "motion/react";
import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl text-center space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white">
            About <span className="text-primary italic">HelpMate</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
            HelpMate was founded to bridge the gap between busy individuals who need an extra pair of hands and university students looking for flexible earning opportunities. 
          </p>
          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
            By connecting communities with verified student runners, we aim to make everyday life easier while empowering the next generation with financial independence.
          </p>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
