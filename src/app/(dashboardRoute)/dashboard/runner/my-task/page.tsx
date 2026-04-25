"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Loader2,
  Play,
  Calendar,
  AlertCircle,
  Package,
  ArrowRight,
  User,
  DollarSign
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getMyAssignments, startAssignment, completeAssignment } from "@/src/services/assignments";
import { getMyApplications } from "@/src/services/task-applications";
import Link from "next/link";

export default function MyTaskPage() {
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignmentsRes, applicationsRes] = await Promise.all([
        getMyAssignments(),
        getMyApplications()
      ]);

      if (assignmentsRes?.success && assignmentsRes.data) {
        // Filter only active (not confirmed) assignments
        const activeOnes = assignmentsRes.data.filter((a: any) => !a.confirmedAt);
        setActiveTasks(activeOnes);
      }

      if (applicationsRes?.success && applicationsRes.data) {
        // Find tasks that are applied for but NOT yet in assignments
        const assignedTaskIds = new Set(
          assignmentsRes?.data?.map((a: any) => a.taskId) || []
        );
        
        const pendingOnes = applicationsRes.data.filter(
          (app: any) => !assignedTaskIds.has(app.taskId) && app.status === "PENDING"
        );
        setPendingTasks(pendingOnes);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = fetchData; // For the Refresh button

  const handleStart = async (assignmentId: string) => {
    setActionLoading(assignmentId);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await startAssignment(assignmentId);
      if (res?.success) {
        setSuccessMsg("Task started! You're now in progress.");
        await fetchAssignments();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res?.message || "Failed to start task.");
        setTimeout(() => setErrorMsg(""), 4000);
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (assignmentId: string) => {
    setActionLoading(assignmentId);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await completeAssignment(assignmentId);
      if (res?.success) {
        setSuccessMsg("Task marked as done! Waiting for buyer confirmation.");
        await fetchAssignments();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res?.message || "Failed to mark task as done.");
        setTimeout(() => setErrorMsg(""), 4000);
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-bold text-lg animate-pulse">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
            <Package className="w-3.5 h-3.5" />
            Active Assignments
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white">
            My Tasks
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            View your accepted tasks and update their progress. High quality work leads to better ratings!
          </p>
        </div>
        <Button 
          onClick={fetchAssignments} 
          variant="outline" 
          className="rounded-2xl font-black h-14 px-8 border-2 hover:bg-primary/5 transition-all"
        >
          Refresh Tasks
        </Button>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-3 shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5" /> {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold flex items-center gap-3 shadow-sm"
          >
            <AlertCircle className="w-5 h-5" /> {errorMsg}
          </motion.div>
        )}
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 gap-8">
        {activeTasks.length === 0 && pendingTasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-20 rounded-[3rem] bg-white dark:bg-white/5 border-4 border-dashed border-gray-100 dark:border-white/5 text-center"
          >
            <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-400 mb-4">No Active Tasks</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              You haven't accepted any tasks yet. Head over to the Task Feed to find new opportunities!
            </p>
            <Link href="/dashboard/runner">
              <Button className="h-14 px-10 rounded-2xl font-black bg-primary text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex gap-2">
                Browse Tasks <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Active Tasks Section */}
            {activeTasks.map((assignment, index) => {
              const task = assignment.task;
              const isStarted = !!assignment.startedAt;
              const isCompleted = !!assignment.completedAt;
              const isStarting = actionLoading === assignment.id;

              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden"
                >
                  <div className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border-2 border-primary/10 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all relative z-10">
                    <div className="flex flex-col lg:flex-row gap-10">
                      {/* Left Side: Content */}
                      <div className="flex-1 space-y-8">
                        <div className="flex items-center gap-4 flex-wrap">
                          {isCompleted ? (
                            <span className="px-4 py-1.5 bg-blue-500 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">
                              Completed
                            </span>
                          ) : isStarted ? (
                            <span className="px-4 py-1.5 bg-yellow-500 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg shadow-yellow-500/20">
                              In Progress
                            </span>
                          ) : (
                            <span className="px-4 py-1.5 bg-primary text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                              Accepted
                            </span>
                          )}
                          <span className="px-4 py-1.5 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-full uppercase tracking-widest">
                            {task.category?.name || "General"}
                          </span>
                        </div>

                        <div className="space-y-4">
                          <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white leading-tight">
                            {task.title}
                          </h2>
                          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
                            {task.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                          <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                              <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Location</p>
                              <p className="font-bold text-black dark:text-white">{task.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                              <Clock className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Deadline</p>
                              <p className="font-bold text-black dark:text-white">
                                {new Date(task.deadline).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                              <User className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Customer</p>
                              <p className="font-bold text-black dark:text-white">{task.user?.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                              <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Accepted On</p>
                              <p className="font-bold text-black dark:text-white">
                                {new Date(assignment.acceptedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Action Card */}
                      <div className="lg:w-[320px] flex flex-col justify-between gap-8 p-8 rounded-[2rem] bg-primary/5 border border-primary/10">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-black text-primary uppercase tracking-widest">Payout</p>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                               <DollarSign className="w-4 h-4" />
                            </div>
                          </div>
                          <p className="text-5xl font-black text-black dark:text-white">
                            ৳{task.offerPrice || "N/A"}
                          </p>
                          <p className="text-sm text-muted-foreground font-medium">
                            Payment will be released after completion and user confirmation.
                          </p>
                        </div>

                        <div className="space-y-3">
                          {!isStarted && !isCompleted && (
                            <Button
                              onClick={() => handleStart(assignment.id)}
                              disabled={isStarting}
                              className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-xl shadow-primary/20 flex gap-3 group/btn transition-all"
                            >
                              {isStarting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                              ) : (
                                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                              )}
                              {isStarting ? "Starting..." : "Start Task"}
                            </Button>
                          )}

                          {isStarted && !isCompleted && (
                            <Button
                              onClick={() => handleComplete(assignment.id)}
                              disabled={actionLoading === assignment.id}
                              className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl shadow-xl shadow-emerald-500/20 flex gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                              {actionLoading === assignment.id ? (
                                <Loader2 className="w-7 h-7 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-7 h-7" />
                              )}
                              {actionLoading === assignment.id ? "Marking Done..." : "Mark as Done"}
                            </Button>
                          )}

                          {isCompleted && (
                            <div className="w-full h-16 rounded-2xl bg-blue-500/10 border-2 border-dashed border-blue-500/30 flex items-center justify-center gap-3 text-blue-600 dark:text-blue-400 font-black text-lg">
                              <Clock className="w-6 h-6 animate-pulse" />
                              Awaiting Confirmation
                            </div>
                          )}
                          
                          <Button variant="ghost" className="w-full font-bold text-muted-foreground hover:text-black dark:hover:text-white rounded-xl">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Background Decoration */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              );
            })}

            {/* Pending Applications Section */}
            {pendingTasks.length > 0 && (
              <div className="space-y-6 pt-10 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="text-2xl font-bold text-black dark:text-white">
                    Pending Approval ({pendingTasks.length})
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingTasks.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-xs font-black rounded-full uppercase tracking-widest">
                          Waiting for Poster
                        </span>
                        <p className="text-xl font-black text-black dark:text-white">
                          ৳{app.task.offerPrice || "N/A"}
                        </p>
                      </div>
                      <h4 className="text-xl font-bold text-black dark:text-white line-clamp-1">
                        {app.task.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {app.task.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          Applied {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="pt-2">
                         <p className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 text-center">
                            The task poster is reviewing your application. You'll be notified once assigned!
                         </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
