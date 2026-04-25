"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, LayoutDashboard, AlertTriangle, CreditCard, ArrowUp, ArrowDown, Loader2, ShieldAlert } from "lucide-react";
import { getUsers } from "@/src/services/user";
import { getTasks } from "@/src/services/tasks";
import { getDisputes } from "@/src/services/disputes";
import { getSosAlerts } from "@/src/services/sos";
import { getMyBadges } from "@/src/services/badges";

export default function AdminDashboard() {
  const [data, setData] = useState({
    users: [],
    tasks: [],
    disputes: [],
    sos: [],
    badges: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, tasksRes, disputesRes, sosRes, badgesRes] = await Promise.all([
          getUsers(),
          getTasks(),
          getDisputes(),
          getSosAlerts(),
          getMyBadges(),
        ]);

        setData({
          users: usersRes?.data || [],
          tasks: tasksRes?.data || [],
          disputes: disputesRes?.data || [],
          sos: sosRes?.data || [],
          badges: badgesRes?.data || [],
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const activeTasksCount = data.tasks.filter((t: any) => t.status !== "COMPLETED" && t.status !== "CANCELLED").length;
  const totalRevenue = data.tasks.filter((t: any) => t.status === "COMPLETED").reduce((acc: number, t: any) => acc + (t.offerPrice || 0), 0);
  const activeSos = data.sos.filter((s: any) => !s.isResolved).length;

  const stats = [
    { label: "Total Users", value: data.users.length.toString(), icon: Users, change: "+0%", trend: "up", color: "text-blue-600" },
    { label: "Active Tasks", value: activeTasksCount.toString(), icon: LayoutDashboard, change: "+0%", trend: "up", color: "text-purple-600" },
    { label: "Est. Revenue", value: `৳${totalRevenue}`, icon: CreditCard, change: "+0%", trend: "up", color: "text-green-600" },
    { label: "SOS Alerts", value: activeSos.toString(), icon: ShieldAlert, change: "0%", trend: "down", color: "text-red-600" },
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
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm h-[400px] overflow-y-auto">
          <div className="flex items-center justify-between mb-8 sticky top-0 bg-white dark:bg-zinc-900 z-10 pb-2">
            <h3 className="text-2xl font-bold text-black dark:text-white">Recent Users</h3>
            <button className="text-primary font-bold hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {data.users.slice(0, 5).map((user: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold uppercase">
                    {user.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-black dark:text-white">{user.name}</h4>
                    <p className="text-sm text-gray-400 italic capitalize">{user.role?.toLowerCase()} • {user.isActive ? 'Active' : 'Suspended'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {user.isActive ? 'ACTIVE' : 'SUSPENDED'}
                  </span>
                </div>
              </div>
            ))}
            {data.users.length === 0 && (
              <p className="text-center text-gray-500 mt-10">No users found.</p>
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm h-[400px] overflow-y-auto">
          <div className="flex items-center justify-between mb-8 sticky top-0 bg-white dark:bg-zinc-900 z-10 pb-2">
            <h3 className="text-2xl font-bold text-black dark:text-white">Recent Tasks</h3>
            <button className="text-primary font-bold hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {data.tasks.slice(0, 5).map((task: any, i: number) => (
              <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-black dark:text-white truncate max-w-[200px]">{task.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    task.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 
                    task.status === 'OPEN' ? 'bg-blue-500/10 text-blue-500' : 
                    'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Offer: ৳{task.offerPrice}</span>
                  <span className="text-gray-400">{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {data.tasks.length === 0 && (
              <p className="text-center text-gray-500 mt-10">No tasks found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
