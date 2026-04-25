"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  Navigation,
  Loader2,
  Play,
  Calendar,
  AlertCircle,
  Package,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getMyAssignments, startAssignment, submitAssignment } from "@/src/services/assignments";
import { getMyApplications } from "@/src/services/task-applications";
import Link from "next/link";

export default function RunnerJobsPage() {
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
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
        const assignments = assignmentsRes.data;
        setActiveJobs(assignments.filter((a: any) => !a.confirmedAt));
        setCompletedJobs(assignments.filter((a: any) => a.confirmedAt));
      }

      if (applicationsRes?.success && applicationsRes.data) {
        const assignedTaskIds = new Set(
          assignmentsRes?.data?.map((a: any) => a.taskId) || []
        );
        const pending = applicationsRes.data.filter(
          (app: any) => !assignedTaskIds.has(app.taskId) && app.status === "PENDING"
        );
        setPendingJobs(pending);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = fetchData;

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
      const res = await submitAssignment(assignmentId);
      if (res?.success) {
        setSuccessMsg("Task marked as completed! Waiting for user confirmation.");
        await fetchAssignments();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res?.message || "Failed to complete task.");
        setTimeout(() => setErrorMsg(""), 4000);
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (assignment: any) => {
    if (assignment.confirmedAt) return "bg-emerald-500";
    if (assignment.completedAt) return "bg-blue-500";
    if (assignment.startedAt) return "bg-yellow-500";
    return "bg-primary";
  };

  const getStatusLabel = (assignment: any) => {
    if (assignment.confirmedAt) return "Confirmed";
    if (assignment.completedAt) return "Completed";
    if (assignment.startedAt) return "In Progress";
    return "Assigned";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toasts */}
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-semibold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" /> {successMsg}
        </motion.div>
      )}
      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5" /> {errorMsg}
        </motion.div>
      )}

      {/* Pending Jobs */}
      {pendingJobs.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-black dark:text-white px-2 flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" />
            Pending Approval ({pendingJobs.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingJobs.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-amber-500/10 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 text-xs font-black rounded-full uppercase tracking-widest">
                    Waiting for Poster
                  </span>
                  <p className="text-xl font-black text-black dark:text-white">
                    ৳{app.task.offerPrice}
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
                    <Calendar className="w-4 h-4" />
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">My Active Jobs</h1>
          <p className="text-muted-foreground text-lg">Manage your ongoing tasks and track progress.</p>
        </div>
        <Button onClick={fetchAssignments} variant="outline" className="rounded-xl font-bold">
          Refresh
        </Button>
      </div>

      {/* Active Jobs */}
      <div className="grid grid-cols-1 gap-8">
        {activeJobs.length === 0 ? (
          <div className="p-20 text-center rounded-3xl border-4 border-dashed border-gray-100 dark:border-white/5">
            <Package className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <p className="text-2xl font-bold text-gray-400 mb-2">No active jobs right now</p>
            <p className="text-muted-foreground mb-6">Apply for tasks in the Task Feed to get started.</p>
            <Link href="/dashboard/runner">
              <Button className="rounded-xl font-bold bg-primary">Go to Task Feed</Button>
            </Link>
          </div>
        ) : (
          activeJobs.map((assignment) => {
            const task = assignment.task;
            const isStarting = actionLoading === assignment.id && !assignment.startedAt;
            const isCompleting = actionLoading === assignment.id && assignment.startedAt;

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-3xl bg-white dark:bg-white/5 border-2 border-primary/20 shadow-2xl relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`px-4 py-1.5 ${getStatusColor(assignment)} text-white text-xs font-black rounded-full uppercase tracking-widest`}>
                        {getStatusLabel(assignment)}
                      </span>
                      {task?.category?.name && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full uppercase tracking-widest">
                          {task.category.name}
                        </span>
                      )}
                      <span className="text-gray-400 font-bold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Accepted: {new Date(assignment.acceptedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-black text-black dark:text-white">
                      {task?.title || "Untitled Task"}
                    </h2>

                    {task?.description && (
                      <p className="text-muted-foreground leading-relaxed max-w-2xl">
                        {task.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {task?.location && (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</p>
                            <p className="font-bold text-black dark:text-white">{task.location}</p>
                          </div>
                        </div>
                      )}
                      {task?.deadline && (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
                          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Deadline</p>
                            <p className="font-bold text-black dark:text-white">
                              {new Date(task.deadline).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {task?.user && (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
                          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <Navigation className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Posted By</p>
                            <p className="font-bold text-black dark:text-white">{task.user.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end gap-6 lg:min-w-[250px]">
                    <div className="text-right">
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-1">Earning</p>
                      <p className="text-5xl font-black text-primary">
                        ৳{task?.offerPrice || "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-col w-full gap-3">
                      <Link href={`/dashboard/runner/jobs/${assignment.id}`}>
                        <Button variant="ghost" className="w-full font-bold text-muted-foreground hover:text-black dark:hover:text-white rounded-xl">
                           View Details
                        </Button>
                      </Link>
                      {/* Start button - only if not started yet */}
                      {!assignment.startedAt && !assignment.completedAt && (
                        <Button
                          onClick={() => handleStart(assignment.id)}
                          disabled={isStarting}
                          className="w-full h-14 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-500/20 flex gap-3"
                        >
                          {isStarting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <Play className="w-6 h-6" />
                          )}
                          {isStarting ? "Starting..." : "Start Task"}
                        </Button>
                      )}

                      {/* Complete button - only if started but not completed */}
                      {assignment.startedAt && !assignment.completedAt && (
                        <Link href={`/dashboard/runner/jobs/${assignment.id}/complete`} className="w-full">
                          <Button
                            className="w-full h-14 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black text-lg shadow-xl shadow-green-500/20 flex gap-3"
                          >
                            <CheckCircle2 className="w-6 h-6" />
                            Mark as Completed
                          </Button>
                        </Link>
                      )}

                      {/* Waiting for confirmation */}
                      {assignment.completedAt && !assignment.confirmedAt && (
                        <div className="w-full h-14 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center gap-3 text-yellow-600 dark:text-yellow-400 font-bold">
                          <Clock className="w-5 h-5" />
                          Waiting for Confirmation
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              </motion.div>
            );
          })
        )}
      </div>

      {/* Completed Jobs History */}
      {completedJobs.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-black dark:text-white px-2">
            Completed Jobs ({completedJobs.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedJobs.map((assignment) => {
              const task = assignment.task;
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full uppercase tracking-widest">
                      Confirmed
                    </span>
                    <p className="text-2xl font-black text-black dark:text-white">
                      ৳{task?.offerPrice || "N/A"}
                    </p>
                  </div>
                  <h4 className="text-xl font-bold text-black dark:text-white mb-2 line-clamp-1">
                    {task?.title || "Untitled Task"}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(assignment.confirmedAt).toLocaleDateString()}
                    </span>
                    {task?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {task.location}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
