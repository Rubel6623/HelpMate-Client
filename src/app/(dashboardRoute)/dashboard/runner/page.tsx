"use client";

import { motion } from "motion/react";
import { Search, MapPin, Clock, Star, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function RunnerDashboard() {
  const stats = [
    { label: "Today's Earnings", value: "৳850", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    { label: "Completed Tasks", value: "42", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Rating", value: "4.9", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
  ];

  const availableTasks = [
    { id: "1", title: "Grocery Pickup from Shwapno", location: "Gulshan 1 (1.2 km)", time: "Needs by 6:00 PM", price: "৳200", category: "Grocery" },
    { id: "2", title: "Queue for Movie Tickets", location: "Star Cineplex (0.8 km)", time: "Starts at 7:30 PM", price: "৳350", category: "Queue" },
    { id: "3", title: "Deliver Documents to Bashundhara", location: "Banani (2.5 km)", time: "Immediate", price: "৳150", category: "Document" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Available Tasks Feed</h1>
          <p className="text-muted-foreground text-lg">Browse tasks within your 5km radius and start earning.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="h-12 w-64 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl pl-12 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <Button className="h-12 px-6 rounded-xl bg-black dark:bg-white dark:text-black font-bold">
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all"
          >
            <div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-2">{stat.label}</p>
              <h3 className="text-4xl font-extrabold text-black dark:text-white">{stat.value}</h3>
            </div>
            <div className={`w-16 h-16 ${stat.bg} dark:bg-white/10 rounded-2xl flex items-center justify-center ${stat.color} group-hover:rotate-12 transition-transform`}>
              <stat.icon className="w-8 h-8" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Task Feed */}
        <div className="lg:col-span-3 space-y-6">
          <h3 className="text-2xl font-bold text-black dark:text-white px-2">Nearby Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableTasks.map((task, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-widest">
                    {task.category}
                  </span>
                  <p className="text-3xl font-black text-black dark:text-white">{task.price}</p>
                </div>
                <h4 className="text-2xl font-bold mb-4 text-black dark:text-white flex-1">{task.title}</h4>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-medium">{task.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-medium">{task.time}</span>
                  </div>
                </div>

                <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20">
                  Accept Task
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Runner Sidebar */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-black dark:text-white px-2">Status</h3>
          <div className="p-8 rounded-3xl bg-zinc-900 text-white shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Online Status</span>
              <div className="w-12 h-6 bg-green-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Acceptance Rate</p>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[96%]" />
                </div>
                <p className="text-right mt-1 text-sm font-bold">96%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Completion Rate</p>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[100%]" />
                </div>
                <p className="text-right mt-1 text-sm font-bold">100%</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm text-center">
            <div className="w-20 h-20 bg-yellow-50 dark:bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
            </div>
            <h4 className="text-xl font-bold text-black dark:text-white mb-2">Top Runner</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You're in the top 5% of runners this month! Keep it up to earn exclusive bonuses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
