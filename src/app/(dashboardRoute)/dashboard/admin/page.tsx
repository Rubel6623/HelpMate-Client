"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import { Users, LayoutDashboard, AlertTriangle, CreditCard, ArrowUp, ArrowDown, Loader2, ShieldAlert, BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { getUsers } from "@/src/services/user";
import { getTasks } from "@/src/services/tasks";
import { getDisputes } from "@/src/services/disputes";
import { getSosAlerts } from "@/src/services/sos";
import { getMyBadges } from "@/src/services/badges";
import Link from "next/link";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

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

  // Process data for charts
  const chartData = useMemo(() => {
    if (!data.tasks.length) return { revenue: [], status: [] };

    // Revenue by date (Last 7 days)
    const revenueMap: { [key: string]: number } = {};
    data.tasks.forEach((task: any) => {
      if (task.status === "COMPLETED") {
        const date = new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        revenueMap[date] = (revenueMap[date] || 0) + (task.offerPrice || 0);
      }
    });

    const revenueData = Object.keys(revenueMap).map(date => ({
      date,
      revenue: revenueMap[date]
    })).slice(-7);

    // Status distribution
    const statusCounts: { [key: string]: number } = {};
    data.tasks.forEach((task: any) => {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
    });

    const statusData = Object.keys(statusCounts).map(status => ({
      name: status.replace("_", " "),
      value: statusCounts[status]
    }));

    return { revenue: revenueData, status: statusData };
  }, [data.tasks]);

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
    { label: "Total Users", value: data.users.length.toString(), icon: Users, change: "+12%", trend: "up", color: "text-blue-600" },
    { label: "Active Tasks", value: activeTasksCount.toString(), icon: LayoutDashboard, change: "+5%", trend: "up", color: "text-purple-600" },
    { label: "Total Revenue", value: `৳${totalRevenue}`, icon: CreditCard, change: "+18%", trend: "up", color: "text-green-600" },
    { label: "SOS Alerts", value: activeSos.toString(), icon: ShieldAlert, change: "0%", trend: "down", color: "text-red-600" },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-black dark:text-white mb-2 tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground font-medium">Real-time system health and growth metrics.</p>
        </div>
        <div className="flex gap-2">
            <button onClick={() => window.location.reload()} className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm">
                <TrendingUp className="w-5 h-5 text-primary" />
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full opacity-10 bg-current transition-opacity group-hover:opacity-30" />
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-gray-50 dark:bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-black dark:text-white tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="p-10 rounded-[3rem] bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/10 shadow-xl"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-black dark:text-white flex items-center gap-3">
               <TrendingUp className="w-6 h-6 text-primary" />
               Revenue Growth
            </h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-xl">Last 7 Days</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.revenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888822" />
                <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#888', fontSize: 12, fontWeight: 'bold'}}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#888', fontSize: 12, fontWeight: 'bold'}}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: '#000', color: '#fff' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 8, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
           className="p-10 rounded-[3rem] bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/10 shadow-xl"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-black dark:text-white flex items-center gap-3">
               <PieChartIcon className="w-6 h-6 text-purple-500" />
               Task Status
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.status}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  cornerRadius={8}
                  dataKey="value"
                >
                  {chartData.status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: '#000', color: '#fff' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users Table */}
        <div className="p-10 rounded-[3rem] bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/10 shadow-xl h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <h3 className="text-2xl font-black text-black dark:text-white flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-500" />
                Recent Users
            </h3>
            <Link href="/dashboard/admin/users">
                <button className="px-6 py-2 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all">View all</button>
            </Link>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {data.users.slice(0, 10).map((user: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-primary/20 group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl uppercase group-hover:scale-110 transition-transform">
                    {user.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-black text-black dark:text-white">{user.name}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{user.role} • {user.isActive ? 'Active' : 'Suspended'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${user.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {user.isActive ? 'ACTIVE' : 'SUSPENDED'}
                  </span>
                </div>
              </div>
            ))}
            {data.users.length === 0 && (
              <p className="text-center text-gray-500 mt-10 font-bold italic">No users found.</p>
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="p-10 rounded-[3rem] bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/10 shadow-xl h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <h3 className="text-2xl font-black text-black dark:text-white flex items-center gap-3">
                <LayoutDashboard className="w-6 h-6 text-purple-500" />
                Recent Tasks
            </h3>
            <Link href="/dashboard/admin/tasks">
                <button className="px-6 py-2 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all">View all</button>
            </Link>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {data.tasks.slice(0, 10).map((task: any, i: number) => (
              <div key={i} className="flex flex-col gap-3 p-5 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-primary/20">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-black dark:text-white truncate max-w-[250px]">{task.title}</h4>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    task.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 
                    task.status === 'OPEN' ? 'bg-blue-500/10 text-blue-500' : 
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-primary tracking-tighter text-lg">৳{task.offerPrice}</span>
                  <span className="text-gray-400 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {data.tasks.length === 0 && (
              <p className="text-center text-gray-500 mt-10 font-bold italic">No tasks found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Clock(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
}
