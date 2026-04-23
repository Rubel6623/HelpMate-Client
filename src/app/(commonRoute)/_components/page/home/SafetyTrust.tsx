"use client";

import { motion } from "motion/react";
import {
  Shield,
  ShieldCheck,
  Star,
  Lock,
  Scale,
  UserCheck,
  Eye,
  BadgeCheck,
} from "lucide-react";

const safetyFeatures = [
  {
    icon: UserCheck,
    title: "Identity Verification",
    description:
      "Every user must verify their identity with government-issued ID before they can post or accept tasks on the platform.",
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    description:
      "After every task, both parties rate each other. This transparent system helps you choose trusted helpers with proven track records.",
  },
  {
    icon: Lock,
    title: "Secure Escrow Payments",
    description:
      "Your payment is held securely by Stripe until the task is completed and confirmed. No direct cash transactions needed.",
  },
  {
    icon: Scale,
    title: "Dispute Resolution",
    description:
      "If anything goes wrong, our dedicated support team mediates disputes fairly and ensures a resolution within 48 hours.",
  },
  {
    icon: Eye,
    title: "Task Monitoring",
    description:
      "Real-time task tracking and in-app messaging keep you informed at every step. You're always in control of your task.",
  },
  {
    icon: BadgeCheck,
    title: "Community Standards",
    description:
      "Strict community guidelines and zero-tolerance policy for misconduct keep the platform safe for everyone.",
  },
];

export const SafetyTrust = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-6"
          >
            <Shield className="w-4 h-4" />
            <span>Safety & Trust</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            Your Safety is Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Top Priority
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl leading-relaxed"
          >
            We've implemented multiple layers of security and trust to ensure
            every interaction on HelpMate is safe and reliable.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safetyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-emerald-400 group-hover:text-white transition-colors" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">
                100% Secure Platform
              </h4>
              <p className="text-gray-400 text-sm">
                End-to-end encryption • PCI compliant • GDPR ready
              </p>
            </div>
          </div>
          <button className="px-8 py-3 rounded-full bg-emerald-500 text-white font-bold hover:scale-105 transition-transform shadow-xl shadow-emerald-500/20">
            Learn More About Safety
          </button>
        </motion.div>
      </div>
    </section>
  );
};
