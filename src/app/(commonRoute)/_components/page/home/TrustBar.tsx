"use client";

import { motion } from "motion/react";
import { Users, CheckCircle, Star, Zap } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "12,500+",
    label: "Active Users",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: CheckCircle,
    value: "48,000+",
    label: "Tasks Completed",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Average Rating",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: Zap,
    value: "< 5 min",
    label: "Avg. Match Time",
    color: "from-purple-500 to-pink-500",
  },
];

const partners = [
  "BUET", "DU", "NSU", "BRAC University", "IUT", "KUET"
];

export const TrustBar = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center hover:bg-white/10 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold mb-8">
            Trusted by students from top universities
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold text-lg hover:text-white hover:border-primary/30 hover:bg-white/10 transition-all duration-300 cursor-default"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
