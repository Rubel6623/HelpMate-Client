"use client";

import { motion } from "motion/react";
import {
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Eye,
  Flame,
} from "lucide-react";

const featuredTasks = [
  {
    id: 1,
    title: "Grocery pickup from Shwapno",
    category: "Grocery & Shopping",
    budget: "৳250 - ৳400",
    location: "Dhanmondi, Dhaka",
    postedAgo: "5 min ago",
    offers: 3,
    urgent: true,
  },
  {
    id: 2,
    title: "Stand in queue at Passport Office",
    category: "Queue & Waiting",
    budget: "৳500 - ৳800",
    location: "Agargaon, Dhaka",
    postedAgo: "12 min ago",
    offers: 7,
    urgent: false,
  },
  {
    id: 3,
    title: "Deliver important documents to bank",
    category: "Document Handling",
    budget: "৳150 - ৳250",
    location: "Gulshan, Dhaka",
    postedAgo: "22 min ago",
    offers: 5,
    urgent: true,
  },
  {
    id: 4,
    title: "Help with moving furniture to new apartment",
    category: "Household Assistance",
    budget: "৳1000 - ৳1500",
    location: "Mirpur, Dhaka",
    postedAgo: "35 min ago",
    offers: 2,
    urgent: false,
  },
  {
    id: 5,
    title: "Dog walking for 1 hour in the evening",
    category: "Pet Care",
    budget: "৳200 - ৳300",
    location: "Banani, Dhaka",
    postedAgo: "45 min ago",
    offers: 4,
    urgent: false,
  },
  {
    id: 6,
    title: "Setup and configure new laptop",
    category: "Tech Help",
    budget: "৳300 - ৳500",
    location: "Uttara, Dhaka",
    postedAgo: "1 hr ago",
    offers: 6,
    urgent: false,
  },
];

export const FeaturedTasks = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-primary/5 blur-[10rem] rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6"
            >
              <Flame className="w-4 h-4" />
              <span>Live Marketplace</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
            >
              Recently Posted{" "}
              <span className="text-primary">Tasks</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg"
            >
              See real tasks being posted right now. Jump in and start helping or
              post your own.
            </motion.p>
          </div>

          <motion.a
            href="/tasks"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-primary font-bold text-lg hover:gap-3 transition-all group"
          >
            View All Tasks
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-primary/30 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-gray-300">
                  {task.category}
                </span>
                {task.urgent && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">
                    <Flame className="w-3 h-3" />
                    Urgent
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-4 group-hover:text-primary transition-colors line-clamp-2">
                {task.title}
              </h3>

              {/* Meta Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">
                    {task.budget}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>{task.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span>{task.postedAgo}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-sm text-gray-500">
                  <span className="text-primary font-bold">{task.offers}</span>{" "}
                  offers
                </span>
                <button className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4" />
                  View Task
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
