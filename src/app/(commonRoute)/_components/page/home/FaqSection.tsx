"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const faqs = [
  {
    question: "How do payments work?",
    answer: "HelpMate uses a secure escrow system. When you award a task, your payment is held safely until the task is marked as completed by both parties. The runner only gets paid once you confirm the job is done to your satisfaction."
  },
  {
    question: "What if the task is not completed?",
    answer: "If a runner fails to complete the task or doesn't meet the agreed-upon requirements, the task can be canceled, and your payment will remain secure. You can also file a dispute for our support team to mediate and resolve the issue quickly."
  },
  {
    question: "What is the refund policy?",
    answer: "You are entitled to a full refund if a task is canceled before the runner begins or if the runner fails to complete the task as agreed. Refunds are automatically processed back to your original payment method within 3-5 business days."
  },
  {
    question: "How are helpers (runners) verified?",
    answer: "Trust and safety are our top priorities. Every runner must pass a strict verification process, which includes identity checks, background screening, and skill assessments before their account is approved to accept tasks on the platform."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6"
          >
            <MessageCircleQuestion className="w-4 h-4" />
            Frequently Asked Questions
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-black dark:text-white mb-6"
          >
            Got Questions? <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">We've Got Answers</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 dark:text-gray-400"
          >
            Everything you need to know about the product and billing.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl border ${
                openIndex === index 
                  ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/5' 
                  : 'border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 hover:bg-gray-50 dark:hover:bg-zinc-800'
              } transition-all duration-300 overflow-hidden backdrop-blur-sm`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between gap-6 text-left"
              >
                <span className="font-bold text-lg text-black dark:text-white">
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'bg-primary text-white rotate-180' : 'bg-gray-100 dark:bg-black/10 text-gray-500'
                }`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-6 text-white dark:text-gray-400 leading-relaxed text-lg">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
