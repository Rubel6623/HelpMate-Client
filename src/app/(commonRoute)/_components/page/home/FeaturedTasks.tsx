"use client";

import { motion } from "motion/react";
import {
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Eye,
  Flame,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getTasks } from "@/src/services/tasks";
import Link from "next/link";

// Helper to format date
const timeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hrs ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " min ago";
  return Math.floor(seconds) + " sec ago";
};

export const FeaturedTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks("limit=6");
        if (res?.success) {
          setTasks(res.data.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

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

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/tasks"
              className="flex items-center gap-2 text-primary font-bold text-lg hover:gap-3 transition-all group"
            >
              View All Tasks
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-400">
              No tasks posted recently.
            </div>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-primary/30 hover:bg-white/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-gray-300">
                    {task.category?.name || "General"}
                  </span>
                  {task.isPromoted && (
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
                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">
                      ৳{task.offerPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="line-clamp-1">{task.stops?.[0]?.locationLabel || "Multiple locations"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span>{timeAgo(task.createdAt)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-sm text-gray-500">
                    <span className="text-primary font-bold">{task._count?.applications || 0}</span>{" "}
                    offers
                  </span>
                  <Link href="/tasks">
                    <button className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4" />
                      View Task
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
