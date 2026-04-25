"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  ArrowRight,
  User,
  DollarSign,
  ChevronRight,
  ShieldAlert,
  Star,
  FileText,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getMyAssignments, startAssignment } from "@/src/services/assignments";
import Link from "next/link";
import { toast, Toaster } from "sonner";

export default function RunnerMyTasksPage() {
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMyAssignments();
      if (res?.success && res.data) {
        const assignments = res.data;
        // Active tasks are those not yet confirmed by the user
        setActiveTasks(assignments.filter((a: any) => !a.confirmedAt));
        // Completed tasks are confirmed history
        setCompletedTasks(assignments.filter((a: any) => a.confirmedAt));
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load your tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (assignmentId: string) => {
    setActionLoading(assignmentId);
    try {
      const res = await startAssignment(assignmentId);
      if (res?.success) {
        toast.success("Task started! Good luck!");
        await fetchData();
      } else {
        toast.error(res?.message || "Failed to start task");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (assignment: any) => {
    if (assignment.confirmedAt) return "bg-emerald-500 shadow-emerald-500/20";
    if (assignment.completedAt) return "bg-blue-500 shadow-blue-500/20";
    if (assignment.startedAt) return "bg-amber-500 shadow-amber-500/20";
    return "bg-primary shadow-primary/20";
  };

  const getStatusLabel = (assignment: any) => {
    if (assignment.confirmedAt) return "Confirmed";
    if (assignment.completedAt) return "Submitted";
    if (assignment.startedAt) return "In Progress";
    return "Accepted";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
           <Loader2 className="w-16 h-16 text-primary animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary/40" />
           </div>
        </div>
        <p className="text-muted-foreground font-black uppercase tracking-widest text-sm animate-pulse">Syncing your assignments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <Toaster position="top-right" richColors />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/10">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Live Assignments
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-black dark:text-white tracking-tight">
            My <span className="text-primary italic text-6xl md:text-7xl">Tasks</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">
            Manage your active work, communicate with customers, and mark tasks as complete to receive payment.
          </p>
        </div>
        <Button 
          onClick={fetchData} 
          variant="outline" 
          className="rounded-2xl font-black h-16 px-10 border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all text-xs uppercase tracking-widest gap-3 group"
        >
          <Loader2 className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Refresh Worklist
        </Button>
      </div>

      {/* Active Tasks Grid */}
      <div className="space-y-8">
        {activeTasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-20 rounded-[3.5rem] bg-white dark:bg-white/5 border-4 border-dashed border-gray-100 dark:border-white/5 text-center group hover:border-primary/20 transition-all"
          >
            <div className="w-32 h-32 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Package className="w-16 h-16 text-gray-200 dark:text-gray-700" />
            </div>
            <h2 className="text-4xl font-black text-gray-300 dark:text-gray-600 mb-4 tracking-tight">No Active Work</h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto font-medium">
              You haven't been assigned any tasks recently. Browse the feed to find new opportunities!
            </p>
            <Link href="/dashboard/runner">
              <Button className="h-16 px-12 rounded-[1.5rem] font-black bg-primary text-white text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex gap-3">
                Find Tasks <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {activeTasks.map((assignment, index) => {
              const task = assignment.task;
              const isStarted = !!assignment.startedAt;
              const isCompleted = !!assignment.completedAt;
              const isStarting = actionLoading === assignment.id;

              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className="group relative"
                >
                  <div className="p-10 rounded-[3.5rem] bg-white dark:bg-zinc-900 border-2 border-gray-100 dark:border-white/5 shadow-2xl hover:shadow-primary/10 hover:border-primary/20 transition-all relative z-10 overflow-hidden">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="flex flex-col lg:flex-row gap-12">
                      {/* Left Side: Content */}
                      <div className="flex-1 space-y-10">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className={`px-5 py-2 ${getStatusColor(assignment)} text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg`}>
                            {getStatusLabel(assignment)}
                          </span>
                          <span className="px-5 py-2 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
                            {task.category?.name || "General"}
                          </span>
                          <span className="text-gray-400 font-bold text-xs flex items-center gap-2 ml-auto">
                            <Calendar className="w-4 h-4" />
                            Assigned {new Date(assignment.acceptedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="space-y-6">
                          <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white leading-tight tracking-tight">
                            {task.title}
                          </h2>
                          <p className="text-muted-foreground text-xl leading-relaxed max-w-4xl font-medium line-clamp-3">
                            {task.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center gap-5 p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 group/info hover:bg-white dark:hover:bg-white/10 transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover/info:scale-110 transition-transform">
                              <MapPin className="w-7 h-7" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pick-up / Location</p>
                              <p className="font-bold text-black dark:text-white text-lg">{task.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-5 p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 group/info hover:bg-white dark:hover:bg-white/10 transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover/info:scale-110 transition-transform">
                              <Clock className="w-7 h-7" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Deadline</p>
                              <p className="font-bold text-black dark:text-white text-lg">
                                {new Date(task.deadline).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Customer Quick Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-50 dark:border-white/5">
                           <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase overflow-hidden border-2 border-white dark:border-zinc-800 shadow-sm">
                                 {task.user?.avatarUrl ? (
                                   <img src={task.user.avatarUrl} alt={task.user.name} className="w-full h-full object-cover" />
                                 ) : (
                                   task.user.name.charAt(0)
                                 )}
                              </div>
                              <div>
                                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Customer</p>
                                 <p className="font-black text-black dark:text-white">{task.user.name}</p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <a href={`tel:${task.user.phone}`}>
                                 <Button variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-6 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 transition-all gap-2">
                                    <Phone className="w-4 h-4" /> Call
                                 </Button>
                              </a>
                              <Button variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-6 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30 transition-all gap-2">
                                 <MessageSquare className="w-4 h-4" /> Message
                              </Button>
                           </div>
                        </div>
                      </div>

                      {/* Right Side: Action Hub */}
                      <div className="lg:w-[360px] flex flex-col justify-between gap-10 p-10 rounded-[3rem] bg-gray-50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 relative">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Net Payout</p>
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
                               <DollarSign className="w-5 h-5" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-6xl font-black text-black dark:text-white tracking-tighter">
                              ৳{Number(task.offerPrice).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Funds secured in Escrow
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {!isStarted && !isCompleted && (
                            <Button
                              onClick={() => handleStart(assignment.id)}
                              disabled={isStarting}
                              className="w-full h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 group/start active:scale-95 transition-all"
                            >
                              {isStarting ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                              ) : (
                                <Play className="w-8 h-8 group-hover/start:scale-125 transition-transform" />
                              )}
                              {isStarting ? "Initializing..." : "Start This Job"}
                            </Button>
                          )}

                          {isStarted && !isCompleted && (
                            <Link href={`/dashboard/runner/jobs/${assignment.id}/complete`} className="block">
                              <Button
                                className="w-full h-20 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all"
                              >
                                <CheckCircle2 className="w-8 h-8" />
                                Mark as Done
                              </Button>
                            </Link>
                          )}

                          {isCompleted && (
                            <div className="w-full h-20 rounded-[2rem] bg-blue-500/10 border-2 border-dashed border-blue-500/30 flex flex-col items-center justify-center gap-1 text-blue-600 dark:text-blue-400 font-black">
                              <div className="flex items-center gap-3 text-lg">
                                 <Clock className="w-6 h-6 animate-pulse" />
                                 Awaiting Approval
                              </div>
                              <p className="text-[10px] uppercase tracking-widest opacity-60">Buyer is reviewing proof</p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-3">
                            <Link href={`/dashboard/runner/jobs/${assignment.id}`}>
                              <Button variant="ghost" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-white/10 gap-2">
                                <FileText className="w-4 h-4" /> Full Details
                              </Button>
                            </Link>
                             <Link href={`/dashboard/dispute/${task.id}`}>
                               <Button variant="ghost" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-500/60 hover:text-red-500 hover:bg-red-500/5 gap-2">
                                 <ShieldAlert className="w-4 h-4" /> Raise Dispute
                               </Button>
                             </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Finished Work Section (Collapsible History) */}
      {completedTasks.length > 0 && (
        <div className="space-y-8 pt-12 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between px-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                   <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-black dark:text-white tracking-tight">
                  Completed History
                </h3>
             </div>
             <span className="px-4 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 font-bold text-xs">
                {completedTasks.length} {completedTasks.length === 1 ? 'Job' : 'Jobs'} Done
             </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedTasks.slice(0, 4).map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all flex justify-between items-center group"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-widest">
                      Confirmed
                    </span>
                    <span className="text-gray-400 font-bold text-xs">
                      {new Date(assignment.confirmedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-black dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                    {assignment.task?.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {assignment.task?.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Paid
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-3">
                   <div>
                     <p className="text-3xl font-black text-black dark:text-white tracking-tighter">৳{assignment.task?.offerPrice}</p>
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Received</p>
                   </div>
                   <Link href={`/dashboard/review/${assignment.task?.id}`}>
                     <Button variant="outline" size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-1.5 border-amber-500/30 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/5 hover:text-amber-700">
                       <Star className="w-3.5 h-3.5" /> Leave Review
                     </Button>
                   </Link>
                 </div>
              </motion.div>
            ))}
          </div>

          {completedTasks.length > 4 && (
             <div className="flex justify-center pt-6">
                <Link href="/dashboard/runner/earnings">
                   <Button variant="ghost" className="font-black text-xs uppercase tracking-widest text-primary gap-2">
                      View Full Earnings History <ChevronRight className="w-4 h-4" />
                   </Button>
                </Link>
             </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper icon not imported above
function Trophy({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
