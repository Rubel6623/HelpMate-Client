"use client";

import { motion } from "motion/react";
import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";
import { Search, Loader2 } from "lucide-react";

export default function TasksPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex flex-col items-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6">
            Find <span className="text-primary italic">Tasks</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Browse available tasks in your area and start earning.
          </p>

          <div className="relative mt-10 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            <input 
              placeholder="Search tasks by keyword or location..."
              className="h-14 w-full pl-14 pr-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none focus:border-primary transition-colors font-medium shadow-lg text-black dark:text-white"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400"
        >
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-lg">Loading available tasks near you...</p>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
