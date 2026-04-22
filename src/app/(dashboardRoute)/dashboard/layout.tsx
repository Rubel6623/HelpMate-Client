"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListTodo, 
  Wallet, 
  User, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Search,
  ShieldCheck,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

const menuItems = {
  USER: [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard/user" },
    { label: "Post a Task", icon: PlusCircle, href: "/dashboard/user/post-task" },
    { label: "My Tasks", icon: ListTodo, href: "/dashboard/user/tasks" },
    { label: "Wallet", icon: Wallet, href: "/dashboard/user/wallet" },
  ],
  RUNNER: [
    { label: "Task Feed", icon: Search, href: "/dashboard/runner" },
    { label: "Active Jobs", icon: ListTodo, href: "/dashboard/runner/jobs" },
    { label: "Earnings", icon: Wallet, href: "/dashboard/runner/earnings" },
    { label: "Badges", icon: ShieldCheck, href: "/dashboard/runner/badges" },
  ],
  ADMIN: [
    { label: "Analytics", icon: BarChart3, href: "/dashboard/admin" },
    { label: "Users", icon: User, href: "/dashboard/admin/users" },
    { label: "Tasks", icon: ListTodo, href: "/dashboard/admin/tasks" },
    { label: "Disputes", icon: ShieldCheck, href: "/dashboard/admin/disputes" },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Mock role - in real app, this would come from auth context
  const role: "USER" | "RUNNER" | "ADMIN" = "USER"; 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed lg:relative z-50 w-72 h-screen bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-white/5 flex flex-col shadow-xl"
          >
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
                  <span className="text-xl font-bold italic">Q</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-black dark:text-white">
                  QuickStep
                </span>
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-6 space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">
                Menu
              </p>
              {menuItems[role].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-primary/5 hover:text-primary transition-all group"
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="p-6 border-t border-gray-100 dark:border-white/5 space-y-4">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                <User className="w-5 h-5" />
                <span className="font-semibold">Profile</span>
              </Link>
              <button
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-white/5 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-500" />
              </button>
            )}
            <h2 className="text-xl font-bold text-black dark:text-white hidden md:block">
              Welcome back, User!
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-zinc-900 rounded-full" />
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200 dark:border-white/5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-black dark:text-white leading-none mb-1">
                  John Doe
                </p>
                <p className="text-xs text-primary font-semibold">
                  {role} Account
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                JD
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
