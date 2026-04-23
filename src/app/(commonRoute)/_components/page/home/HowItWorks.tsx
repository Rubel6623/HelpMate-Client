"use client";

import { motion } from "motion/react";
import { ClipboardList, Users, UserCheck, PartyPopper, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Post a Task",
    description:
      "Describe what you need done, set your budget, and choose a deadline. It takes less than 60 seconds.",
    icon: ClipboardList,
    color: "from-blue-500 to-cyan-400",
  },
  {
    step: "02",
    title: "Get Offers",
    description:
      "Verified helpers nearby will send you offers with their rates. Compare reviews and pick the best fit.",
    icon: Users,
    color: "from-purple-500 to-pink-500",
  },
  {
    step: "03",
    title: "Choose a Helper",
    description:
      "Select the helper you trust. Chat with them to discuss details. Payment is held securely in escrow.",
    icon: UserCheck,
    color: "from-emerald-500 to-teal-400",
  },
  {
    step: "04",
    title: "Task Completed!",
    description:
      "Once you confirm the task is done, payment is released. Rate your helper to help the community.",
    icon: PartyPopper,
    color: "from-orange-500 to-yellow-400",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] bg-primary/5 blur-[10rem] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Simple Process</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              Works
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl leading-relaxed"
          >
            Getting help has never been easier. Four simple steps to get your
            task done by a verified helper.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-orange-500/30" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative group"
            >
              <div className="text-center">
                {/* Step circle with icon */}
                <div className="relative mx-auto mb-8">
                  <div
                    className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl shadow-current/20 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="w-9 h-9 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-black text-xs font-black flex items-center justify-center shadow-lg">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
