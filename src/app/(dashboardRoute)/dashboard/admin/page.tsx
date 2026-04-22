"use client";

import { motion } from "motion/react";
import { Users, LayoutDashboard, AlertTriangle, CreditCard, ArrowUp, ArrowDown } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "1,284", icon: Users, change: "+12%", trend: "up", color: "text-blue-600" },
    { label: "Active Tasks", value: "156", icon: LayoutDashboard, change: "+5%", trend: "up", color: "text-purple-600" },
    { label: "Revenue", value: "৳45,200", icon: CreditCard, change: "+18%", trend: "up", color: "text-green-600" },
    { label: "Disputes", value: "4", icon: AlertTriangle, change: "-2%", trend: "down", color: "text-red-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Platform Overview</h1>
        <p className="text-muted-foreground text-lg">System-wide monitoring and administrative controls.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-gray-50 dark:bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-3xl font-extrabold text-black dark:text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users Table */}
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-black dark:text-white">New Verifications</h3>
            <button className="text-primary font-bold hover:underline">View all</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    AS
                  </div>
                  <div>
                    <h4 className="font-bold text-black dark:text-white">Ariful Islam</h4>
                    <p className="text-sm text-gray-400 italic">Runner • DU</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors">
                    Approve
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="p-8 rounded-3xl bg-black text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <h3 className="text-2xl font-bold mb-8">System Health</h3>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-bold">API Services</span>
                    </div>
                    <span className="text-gray-400">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-bold">Payment Gateway</span>
                    </div>
                    <span className="text-gray-400">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="font-bold">SMS Engine</span>
                    </div>
                    <span className="text-gray-400 italic">Delayed (3s)</span>
                </div>
                <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Server Load</p>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[34%]" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
