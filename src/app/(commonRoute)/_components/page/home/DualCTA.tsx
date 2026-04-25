"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  ClipboardList,
  Wallet,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export const DualCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Need Help? */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full p-10 md:p-14 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-8 shadow-2xl shadow-primary/30">
                  <ClipboardList className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Need Help?
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                  Post your task in under 60 seconds. Get matched with verified
                  helpers near you and get things done effortlessly.
                </p>
              </div>
              <Link
                href="/dashboard/user/post-task"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20 w-fit group/btn"
              >
                Post a Task
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Want to Earn? */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full p-10 md:p-14 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Want to Earn?
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                  Join as a helper and start earning flexible income. Choose
                  tasks that fit your schedule and skills. It's free to sign up.
                </p>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500 text-white font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 w-fit group/btn"
              >
                Become a Helper
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
