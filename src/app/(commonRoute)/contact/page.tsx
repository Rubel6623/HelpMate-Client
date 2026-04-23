"use client";

import { motion } from "motion/react";
import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6">
              Get in <span className="text-primary italic">Touch</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-500 dark:text-gray-400">support@helpmate.com</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-gray-500 dark:text-gray-400">+880 1234-567890</p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-gray-500 dark:text-gray-400">Dhaka, Bangladesh</p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
