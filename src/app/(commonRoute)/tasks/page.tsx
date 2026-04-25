"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";
import { Search, Loader2, MapPin, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getTasks } from "@/src/services/tasks";
import { applyForTask, getMyApplications } from "@/src/services/task-applications";
import { getUser } from "@/src/services/auth";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [appliedTaskIds, setAppliedTaskIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const currentUser = await getUser();
      setUser(currentUser);

      const [tasksRes, applicationsRes] = await Promise.all([
        getTasks("status=NOT_COMPLETED"),
        currentUser?.role === "RUNNER" ? getMyApplications() : Promise.resolve(null),
      ]);

      if (tasksRes?.success && tasksRes.data) {
        setTasks(tasksRes.data);
      }

      if (applicationsRes?.success && applicationsRes.data) {
        const appliedIds = new Set<string>(applicationsRes.data.map((app: any) => app.taskId));
        setAppliedTaskIds(appliedIds);
      }
    } catch (error) {
      console.error("Error fetching tasks data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (taskId: string) => {
    if (!user || user.role !== "RUNNER") {
      setErrorMsg("Only registered runners can apply for tasks.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }
    
    setApplyingId(taskId);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await applyForTask({ taskId });
      if (res?.success) {
        setAppliedTaskIds(prev => new Set(prev).add(taskId));
        setSuccessMsg("Task accepted! Head to My Task to track your progress.");
        // Refetch tasks so accepted task (now ASSIGNED) is removed from list
        await fetchData();
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
    return searchQuery === "" ||
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl w-full text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6">
            Find <span className="text-primary italic">Tasks</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Browse available tasks in your area and start earning.
          </p>

          <div className="relative mt-10 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by keyword or category..."
              className="h-14 w-full pl-14 pr-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary transition-colors font-medium shadow-lg text-black dark:text-white"
            />
          </div>
        </motion.div>

        <div className="max-w-6xl w-full">
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-semibold flex items-center justify-center gap-3">
              <ShieldCheck className="w-5 h-5" /> {successMsg}
            </motion.div>
          )}
          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-3">
              <AlertCircle className="w-5 h-5" /> {errorMsg}
            </motion.div>
          )}

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400"
            >
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium">Loading available tasks...</p>
            </motion.div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-20 text-center rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm">
              <p className="text-2xl font-bold text-gray-400 mb-2">No open tasks available</p>
              <p className="text-muted-foreground">Check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <p className="text-2xl font-black text-black dark:text-white">
                        ৳{task.offerPrice || "N/A"}
                      </p>
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-black dark:text-white flex-1 line-clamp-2">
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
                          <span className="font-medium text-sm truncate">{task.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="w-5 h-5 text-primary shrink-0" />
                        <span className="font-medium text-sm">
                          {task.deadline
                            ? `Due: ${new Date(task.deadline).toLocaleDateString()}`
                            : "Flexible timing"}
                        </span>
                      </div>
                    </div>

                    {user?.role === "RUNNER" ? (
                      isApplied ? (
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
                      )
                    ) : (
                      <Button
                        disabled
                        className="w-full h-12 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold cursor-not-allowed"
                      >
                        {user ? "Only Runners Can Apply" : "Login to Apply"}
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
