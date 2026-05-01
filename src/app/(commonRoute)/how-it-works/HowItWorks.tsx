"use client";

import { motion } from "motion/react";
import { User, Rocket, CheckCircle } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    title: "Post a Task",
    description: "Describe what you need help with, set a price, and choose a time.",
    icon: User,
  },
  {
    title: "Runner Accepts",
    description: "A verified university student nearby accepts your task instantly.",
    icon: Rocket,
  },
  {
    title: "Task Completed",
    description: "Runner completes the errand, you confirm, and payment is released.",
    icon: CheckCircle,
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-black dark:text-white">
            How it <span className="text-primary italic">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            QuickStep is designed to be fast, reliable, and secure for everyone.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-white dark:bg-white/5 shadow-2xl flex items-center justify-center mb-8 relative z-10 border border-primary/10 group-hover:border-primary/50 transition-colors">
                  <div className="absolute inset-0 rounded-full bg-primary/5 scale-0 group-hover:scale-110 transition-transform duration-500" />
                  <step.icon className="w-10 h-10 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
                  {step.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center gap-6">
            <div className="p-1 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20">
                <div className="px-8 py-4 rounded-xl bg-white dark:bg-black/50 backdrop-blur-xl">
                    <p className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">
                        Ready to save some time?
                    </p>
                </div>
            </div>
            <Link href={"/register"}>
                <button className="h-14 rounded-full bg-primary px-10 text-lg font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Get Started Now
            </button>
            </Link>
        </div>
      </div>
    </section>
  );
};
