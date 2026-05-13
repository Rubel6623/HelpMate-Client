"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, MapPin, Clock, ShieldCheck, AlertCircle, PlusCircle, Eye, ArrowLeft, Home, Users, Timer, Flame } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getTasks } from "@/src/services/tasks";
import { applyForTask, getMyApplications } from "@/src/services/task-applications";
import { getUser } from "@/src/services/auth";
import Link from "next/link";
import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";
import { GlobalSkeleton } from "@/src/components/shared/GlobalSkeleton";
import { AISmartSearch } from "@/src/components/shared/AISmartSearch";

export default function TasksContent() {
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
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col items-center py-20 px-4">
        {loading ? (
          <GlobalSkeleton type="page" />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-6xl w-full mb-8 flex justify-start"
            >
              <Link href="/">
                <Button variant="ghost" className="rounded-full gap-2 text-gray-900 dark:text-white hover:text-primary transition-colors border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                  <ArrowLeft className="w-4 h-4" />
                  <Home className="w-4 h-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl w-full text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6 tracking-tight">
                Find <span className="text-primary italic">Tasks</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Browse available tasks in your area and start earning.
              </p>

              <div className="relative mt-10 max-w-2xl mx-auto flex">
                <AISmartSearch
                  placeholder="Search tasks by keyword or category..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  context="tasks"
                  data={tasks}
                />
              </div>

              <div className="mt-12 p-8 rounded-[2.5rem] bg-primary/5 dark:bg-primary/10 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-black dark:text-white">Can't find what you're looking for?</h3>
                  <p className="text-muted-foreground">Post your custom task and let our runners help you out.</p>
                </div>
                <Link href="/dashboard/user/post-task">
                  <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold flex gap-2 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                    <PlusCircle className="w-5 h-5" />
                    Post a New Task
                  </Button>
                </Link>
              </div>
            </motion.div>

            <div className="max-w-7xl w-full px-4">
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

              {filteredTasks.length === 0 ? (
                <div className="p-20 text-center rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm">
                  <p className="text-2xl font-bold text-gray-400 mb-2">No open tasks available</p>
                  <p className="text-muted-foreground">Check back later for new opportunities.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredTasks.map((task: any, index: number) => {
                    const isApplied = appliedTaskIds.has(task.id);
                    const isApplying = applyingId === task.id;

                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 flex flex-col h-full"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex flex-col gap-2 items-start">
                            <span className="text-[10px] font-bold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-widest">
                              {task.category?.name || "General"}
                            </span>
                            {task.isPromoted && (
                              <span className="text-[10px] font-bold px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full uppercase tracking-widest flex items-center gap-1">
                                <Flame className="w-3 h-3" /> Promoted
                              </span>
                            )}
                          </div>
                          <p className="text-2xl font-black text-black dark:text-white">
                            ৳{task.offerPrice || "N/A"}
                          </p>
                        </div>
                        <h4 className="text-xl font-bold mb-3 text-black dark:text-white group-hover:text-primary transition-colors flex-1 line-clamp-2">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-muted-foreground text-sm mb-6 line-clamp-2 font-medium">
                            {task.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="flex flex-col gap-1 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary shrink-0" />
                              <span className="font-bold text-[11px] truncate uppercase tracking-tight">
                                Location
                              </span>
                            </div>
                            <span className="text-xs font-medium text-black dark:text-white truncate">
                              {task.stops?.[0]?.locationLabel || "Multiple stops"}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary shrink-0" />
                              <span className="font-bold text-[11px] uppercase">
                                Deadline
                              </span>
                            </div>
                            <span className="text-xs font-medium text-black dark:text-white truncate">
                              {task.deadline
                                ? new Date(task.deadline).toLocaleDateString()
                                : "Flexible timing"}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Timer className="w-4 h-4 text-primary shrink-0" />
                              <span className="font-bold text-[11px] uppercase tracking-tight">
                                Est. Time
                              </span>
                            </div>
                            <span className="text-xs font-medium text-black dark:text-white truncate">
                              {task.estimatedDuration ? `${task.estimatedDuration} min` : "Not specified"}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary shrink-0" />
                              <span className="font-bold text-[11px] uppercase">
                                Applicants
                              </span>
                            </div>
                            <span className="text-xs font-medium text-black dark:text-white truncate">
                              {task._count?.applications ?? task.applications?.length ?? 0} runners applied
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-auto">
                          <Link href={`/tasks/${task.id}`}>
                            <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 font-bold text-xs gap-2">
                              <Eye className="w-4 h-4" />
                              Details
                            </Button>
                          </Link>
                          
                          {user?.role === "RUNNER" ? (
                            isApplied ? (
                              <Button
                                disabled
                                className="w-full h-12 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 font-bold cursor-not-allowed text-xs"
                              >
                                ✓ Applied
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleApply(task.id)}
                                disabled={isApplying}
                                className="w-full h-12 rounded-xl bg-gray-900 dark:bg-white dark:text-black hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300 font-bold text-xs"
                              >
                                {isApplying ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Accept"
                                )}
                              </Button>
                            )
                          ) : (
                            <Button
                              disabled
                              className="w-full h-12 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold cursor-not-allowed text-[10px]"
                            >
                              {user ? "Runner Only" : "Login"}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
