"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeDollarSign,
  CircleDollarSign,
  ShieldCheck,
  Wallet,
  CheckCircle2,
} from "lucide-react";

const paymentSteps = [
  {
    step: "1",
    title: "Post & Set Budget",
    description: "You decide the price. Helpers send you competitive offers.",
    icon: BadgeDollarSign,
  },
  {
    step: "2",
    title: "Secure Escrow Hold",
    description:
      "Once you accept an offer, the agreed amount is held securely by Stripe.",
    icon: ShieldCheck,
  },
  {
    step: "3",
    title: "Payment Released",
    description:
      "After you confirm the task is done, funds are instantly released to the helper.",
    icon: Wallet,
  },
];

const highlights = [
  "No sign-up fees",
  "No hidden charges",
  "No subscription required",
  "Only pay when you're satisfied",
  "Transparent 5% platform fee",
  "Automatic refunds for failed tasks",
];

export const PricingFees = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] bg-blue-500/5 blur-[10rem] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6"
          >
            <CircleDollarSign className="w-4 h-4" />
            <span>Simple & Transparent</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            Pricing That's{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Crystal Clear
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl leading-relaxed"
          >
            No complicated pricing tiers. You set the budget, we take a small
            platform fee, and your money is always protected.
          </motion.p>
        </div>

        {/* Payment Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {paymentSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connector arrow (desktop) */}
              {index < paymentSteps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 z-20 -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-white/10" />
                </div>
              )}

              <div className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm text-center hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-300">
                  <step.icon className="w-8 h-8 text-blue-400 group-hover:text-white transition-colors" />
                </div>

                <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-3">
                  Step {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fee Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Fee display */}
              <div className="text-center md:text-left md:border-r md:border-white/10 md:pr-10">
                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">
                  Platform Fee
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    5
                  </span>
                  <span className="text-3xl font-black text-white">%</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">per completed task</p>
              </div>

              {/* Highlights */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
