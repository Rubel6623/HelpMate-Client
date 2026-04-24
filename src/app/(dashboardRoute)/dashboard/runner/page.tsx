"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search, MapPin, Clock, Star, TrendingUp, ShieldCheck, DollarSign, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { getTasks } from "@/src/services/tasks";
import { applyForTask, getMyApplications } from "@/src/services/task-applications";
import { getMyAssignments } from "@/src/services/assignments";
import { getMyWallet } from "@/src/services/wallets";
import { getMe } from "@/src/services/auth";

export default function RunnerDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [appliedTaskIds, setAppliedTaskIds] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ earnings: "৳0", completedTasks: 0, rating: "4.9", hasProfileDetails: true });
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all available tasks (status = OPEN)
      const [tasksRes, applicationsRes, assignmentsRes, walletRes, meRes] = await Promise.all([
        getTasks("status=OPEN"),
        getMyApplications(),
        getMyAssignments(),
        getMyWallet(),
        getMe(),
      ]);

      if (tasksRes?.success && tasksRes.data) {
        setTasks(tasksRes.data);
      }

      const hasProfile = meRes?.success && meRes.data?.runnerProfile && 
                       meRes.data.runnerProfile.bio && 
                       meRes.data.runnerProfile.skills && 
                       meRes.data.runnerProfile.skills.length > 0;

      // Track which tasks runner already applied to
      if (applicationsRes?.success && applicationsRes.data) {
        const appliedIds = new Set<string>(applicationsRes.data.map((app: any) => app.taskId));
        setAppliedTaskIds(appliedIds);
      }

      // Calculate stats
      const completedCount = assignmentsRes?.success && assignmentsRes.data
        ? assignmentsRes.data.filter((a: any) => a.completedAt).length
        : 0;

      const walletBalance = walletRes?.success && walletRes.data
        ? `৳${Number(walletRes.data.balance).toLocaleString()}`
        : "৳0";

      setStats({
        earnings: walletBalance,
        completedTasks: completedCount,
        rating: "4.9",
        hasProfileDetails: !!hasProfile,
      });
    } catch (error) {
      console.error("Error fetching runner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (taskId: string) => {
    setApplyingId(taskId);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await applyForTask({ taskId });
      if (res?.success) {
        setAppliedTaskIds(prev => new Set(prev).add(taskId));
        setSuccessMsg("Applied successfully! The task poster will review your application.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res?.message || "Failed to apply for this task.");
        setTimeout(() => setErrorMsg(""), 4000);
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setApplyingId(null);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery === "" ||
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "" ||
      task.category?.name?.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const statCards = [
    { label: "Wallet Balance", value: stats.earnings, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    { label: "Completed Tasks", value: stats.completedTasks.toString(), icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Rating", value: stats.rating, icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading task feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toasts */}
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-semibold flex items-center gap-3">
          <ShieldCheck className="w-5 h-5" /> {successMsg}
        </motion.div>
      )}
      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5" /> {errorMsg}
        </motion.div>
      )}

      {/* Profile Completion Warning */}
      {(!stats.hasProfileDetails) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-amber-700 dark:text-amber-400">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-bold">Complete Your Profile</p>
              <p className="font-medium opacity-80">Add your bio and skills to increase your chances of being selected for tasks!</p>
            </div>
          </div>
          <Link href="/dashboard/profile">
            <Button className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 h-12 shadow-lg shadow-amber-500/20">
              Update Profile Now
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Available Tasks Feed</h1>
          <p className="text-muted-foreground text-lg">Browse open tasks and apply to start earning.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-64 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl pl-12 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
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
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-bold text-black dark:text-white">
              Open Tasks ({filteredTasks.length})
            </h3>
            <Button variant="outline" onClick={fetchData} className="rounded-xl font-bold">
              Refresh
            </Button>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="p-20 text-center rounded-3xl border-4 border-dashed border-gray-100 dark:border-white/5">
              <p className="text-2xl font-bold text-gray-400 mb-2">No open tasks available</p>
              <p className="text-muted-foreground">Check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTasks.map((task: any, index: number) => {
                const isApplied = appliedTaskIds.has(task.id);
                const isApplying = applyingId === task.id;

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-widest">
                        {task.category?.name || "General"}
                      </span>
                      <p className="text-3xl font-black text-black dark:text-white">
                        ৳{task.budget || task.estimatedBudget || "N/A"}
                      </p>
                    </div>
                    <h4 className="text-2xl font-bold mb-3 text-black dark:text-white flex-1 line-clamp-2">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="space-y-3 mb-8">
                      {task.location && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <MapPin className="w-5 h-5 text-primary shrink-0" />
                          <span className="font-medium truncate">{task.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="w-5 h-5 text-primary shrink-0" />
                        <span className="font-medium">
                          {task.deadline
                            ? `Due: ${new Date(task.deadline).toLocaleDateString()}`
                            : "Flexible timing"}
                        </span>
                      </div>
                    </div>

                    {isApplied ? (
                      <Button
                        disabled
                        className="w-full h-12 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 font-bold cursor-not-allowed"
                      >
                        ✓ Already Applied
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleApply(task.id)}
                        disabled={isApplying}
                        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
                      >
                        {isApplying ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Applying...
                          </span>
                        ) : (
                          "Accept Task"
                        )}
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
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
                <p className="text-gray-400 text-sm mb-2">Applications Sent</p>
                <p className="text-2xl font-black">{appliedTaskIds.size}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Tasks Completed</p>
                <p className="text-2xl font-black">{stats.completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm text-center">
            <div className="w-20 h-20 bg-yellow-50 dark:bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-yellow-500 fill-yellow-500" />
            </div>
            <h4 className="text-xl font-bold text-black dark:text-white mb-2">Keep Going!</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Complete more tasks to earn badges and increase your visibility on the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
