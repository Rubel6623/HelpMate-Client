"use client";

import { motion } from "motion/react";
import {
  ShieldCheck,
  CreditCard,
  Zap,
  BadgeDollarSign,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Helpers",
    description:
      "Every helper goes through identity verification, background checks, and skill assessments before they can accept tasks.",
    highlights: ["ID Verified", "Background Check", "Skill Assessed"],
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Stripe-powered escrow system ensures your money is safe. Funds are only released when you confirm the task is done.",
    highlights: ["Escrow Protection", "Stripe Powered", "Auto Refunds"],
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Zap,
    title: "Fast Matching",
    description:
      "Our smart algorithm connects you with the nearest available helper in under 5 minutes. No more waiting around.",
    highlights: ["< 5 Min Match", "Nearby Helpers", "Smart Algorithm"],
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: BadgeDollarSign,
    title: "Affordable Pricing",
    description:
      "Set your own budget. Helpers compete for your task, so you always get the best value. No hidden fees, ever.",
    highlights: ["You Set Budget", "Competitive Offers", "Zero Hidden Fees"],
    color: "from-purple-500 to-pink-500",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 blur-[10rem] rounded-full translate-x-1/2 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-500/5 blur-[10rem] rounded-full -translate-x-1/2 translate-y-1/4 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Why HelpMate</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            Built on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              Trust & Speed
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl leading-relaxed"
          >
            We've built every feature with your safety and convenience in mind.
            Here's what sets HelpMate apart from the rest.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-primary/30 hover:bg-white/10 transition-all duration-500"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-current/20 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Highlight Pills */}
              <div className="flex flex-wrap gap-2">
                {feature.highlights.map((highlight, hIndex) => (
                  <span
                    key={hIndex}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300"
                  >
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    {highlight}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
