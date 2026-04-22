"use client";

import { motion } from "motion/react";
import { Plus, Clock, CheckCircle2, Wallet, ArrowUpRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function UserDashboard() {
  const stats = [
    { label: "Active Tasks", value: "3", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Completed", value: "12", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    { label: "Wallet Balance", value: "৳2,450", icon: Wallet, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  const recentTasks = [
    { id: "1", title: "Grocery Shopping from Unimart", status: "In Progress", date: "Today, 2:30 PM", price: "৳250" },
    { id: "2", title: "Queue for Passport Delivery", status: "Open", date: "Tomorrow, 9:00 AM", price: "৳500" },
    { id: "3", title: "Document Pick & Drop", status: "Completed", date: "Yesterday", price: "৳150" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground text-lg">Manage your tasks and track your errands in real-time.</p>
        </div>
        <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-xl shadow-primary/20 flex gap-3">
          <Plus className="w-6 h-6" />
          Post New Task
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all"
          >
            <div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-2">{stat.label}</p>
              <h3 className="text-4xl font-extrabold text-black dark:text-white">{stat.value}</h3>
            </div>
            <div className={`w-16 h-16 ${stat.bg} dark:bg-white/10 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-8 h-8" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-bold text-black dark:text-white">Recent Tasks</h3>
            <button className="text-primary font-bold hover:underline">View all</button>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
            {recentTasks.map((task, index) => (
              <div
                key={index}
                className={`p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${index !== recentTasks.length - 1 ? "border-b border-gray-100 dark:border-white/5" : ""
                  }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${task.status === "In Progress" ? "bg-blue-500" : task.status === "Completed" ? "bg-green-500" : "bg-yellow-500"
                    }`}>
                    {task.title.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-black dark:text-white text-lg">{task.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${task.status === "In Progress" ? "bg-blue-100 text-blue-600" : task.status === "Completed" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                        }`}>
                        {task.status}
                      </span>
                      <span className="text-sm text-gray-400">{task.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-black dark:text-white">{task.price}</p>
                  <button className="text-gray-400 hover:text-primary transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Card */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-black dark:text-white px-2">Wallet</h3>
          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-purple-700 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <p className="text-white/60 font-bold text-sm uppercase tracking-wider mb-2">Total Balance</p>
            <h3 className="text-5xl font-black mb-10">৳2,450.00</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-white text-primary font-bold hover:bg-white/90 rounded-xl h-12">
                Top Up
              </Button>
              <Button className="bg-black/20 hover:bg-black/30 text-white font-bold border border-white/10 rounded-xl h-12 backdrop-blur-sm">
                History
              </Button>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-black text-white shadow-xl">
            <h4 className="text-xl font-bold mb-4">Trust Score</h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[92%]" />
              </div>
              <span className="font-bold text-primary">92%</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Maintain a high trust score to get faster acceptance from top runners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
