"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Navigation,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  Trophy,
  Filter,
  Package
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getTasks, applyForTask } from "@/src/services/tasks";
import { getMyApplications } from "@/src/services/task-applications";
import { getMyAssignments } from "@/src/services/assignments";
import { getMyWallet } from "@/src/services/wallets";
import { getMe } from "@/src/services/auth";
import { capturePayment } from "@/src/services/payment";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RunnerDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [appliedTaskIds, setAppliedTaskIds] = useState<Set<string>>(new Set());
  
  const [stats, setStats] = useState({ 
    earnings: "৳0", 
    completedTasks: 0, 
    rating: "4.9", 
    hasProfileDetails: true,
    isVerified: false,
    verificationStatus: "UNVERIFIED",
    activeTasksCount: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all available tasks (status = PENDING)
      const [tasksRes, applicationsRes, assignmentsRes, walletRes, meRes] = await Promise.all([
        getTasks("status=PENDING"),
        getMyApplications(),
        getMyAssignments(),
        getMyWallet(),
        getMe(),
      ]);

      if (tasksRes?.success) {
        setTasks(tasksRes.data || []);
      }

      if (applicationsRes?.success && applicationsRes.data) {
        const appliedIds = new Set<string>(applicationsRes.data.map((app: any) => app.taskId));
        setAppliedTaskIds(appliedIds);
      }
      
      const user = meRes?.data;
      const isVerified = user?.verificationStatus === "VERIFIED";
      const verificationStatus = user?.verificationStatus || "UNVERIFIED";

      if (meRes?.success) {
        const walletBalance = walletRes?.success && walletRes.data?.balance 
          ? `৳${Number(walletRes.data.balance).toLocaleString()}` 
          : "৳0";
          
        const completedCount = assignmentsRes?.success && assignmentsRes.data
          ? assignmentsRes.data.filter((a: any) => a.confirmedAt).length
          : 0;
        
        const hasProfile = user?.runnerProfile && 
                         user.runnerProfile.bio && 
                         user.runnerProfile.skills && 
                         user.runnerProfile.skills.length > 0;

        const activeCount = assignmentsRes?.success && assignmentsRes.data
          ? assignmentsRes.data.filter((a: any) => !a.confirmedAt).length
          : 0;
          
        setStats({
          earnings: walletBalance,
          completedTasks: completedCount,
          rating: user?.runnerProfile?.averageRating?.toFixed(1) || "0.0",
          hasProfileDetails: !!hasProfile,
          isVerified,
          verificationStatus,
          activeTasksCount: activeCount
        });
      }
    } catch (error) {
      console.error("Error fetching runner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (taskId: string) => {
    if (!stats.isVerified) {
      setErrorMsg("Your account must be verified by an admin before you can apply for tasks.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }

    setApplyingId(taskId);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await applyForTask({ taskId });
      if (res?.success) {
        // Capture payment (ESCROW phase)
        await capturePayment(taskId);
        
        setAppliedTaskIds(prev => new Set(prev).add(taskId));
        setSuccessMsg("Task accepted and funds escrowed! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard/runner/my-tasks");
        }, 1500);
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

  const filteredTasks = tasks.filter(task => !appliedTaskIds.has(task.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-bold text-lg animate-pulse">Scanning for opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Welcome & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-600 text-white shadow-2xl shadow-primary/20 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
           <div className="relative z-10 space-y-2">
              <h1 className="text-4xl font-black tracking-tight">Runner Dashboard</h1>
              <p className="text-primary-50 font-medium opacity-90">Ready to help someone today? Browse tasks below.</p>
           </div>
           
           <div className="relative z-10 flex items-center gap-4 pt-6">
              <div className="flex-1 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Earned</p>
                 <p className="text-2xl font-black">{stats.earnings}</p>
              </div>
               <Link href="/dashboard/runner/my-tasks" className="flex-1 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 group hover:bg-white/20 transition-all">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Active Tasks</p>
                  <div className="flex items-center justify-between">
                     <p className="text-2xl font-black">{stats.activeTasksCount}</p>
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
               </Link>
               <div className="flex-1 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Tasks Done</p>
                  <p className="text-2xl font-black">{stats.completedTasks}</p>
               </div>
           </div>

           {/* Decoration */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl flex flex-col justify-between">
           <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                 <Star className="w-6 h-6 fill-amber-500" />
              </div>
              <div>
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Average Rating</p>
                 <p className="text-3xl font-black text-black dark:text-white">{stats.rating}</p>
              </div>
           </div>
           <p className="text-xs text-muted-foreground font-medium pt-4 border-t border-gray-100 dark:border-white/5">Keep it up! Top runners get more visibility.</p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl flex flex-col justify-between">
           <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Trust Status</p>
                 <p className={`text-xl font-black ${stats.isVerified ? "text-emerald-500" : stats.verificationStatus === "PENDING" ? "text-amber-500" : "text-red-500"}`}>
                   {stats.verificationStatus}
                 </p>
              </div>
           </div>
           <Link href="/dashboard/profile">
             <Button variant="ghost" className="w-full justify-start p-0 h-auto font-bold text-primary hover:bg-transparent">
                View Verification Details <ArrowRight className="w-4 h-4 ml-1" />
             </Button>
           </Link>
        </div>
      </div>

      {/* Warnings & Alerts */}
      <div className="space-y-4">
        {!stats.isVerified && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-6 rounded-3xl border flex items-center justify-between gap-6 ${
              stats.verificationStatus === "PENDING" 
                ? "bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-400" 
                : "bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-400"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stats.verificationStatus === "PENDING" ? "bg-amber-500/20" : "bg-red-500/20"}`}>
                 <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold">
                  {stats.verificationStatus === "PENDING" ? "Verification in Progress" : "Account Unverified"}
                </h4>
                <p className="font-medium opacity-80">
                  {stats.verificationStatus === "PENDING" 
                    ? "Our team is currently reviewing your documents. You'll be able to accept tasks once verified." 
                    : "Please complete your identity verification in the Profile section to start earning."}
                </p>
              </div>
            </div>
            {stats.verificationStatus !== "PENDING" && (
              <Link href="/dashboard/profile">
                <Button className="rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 px-8 h-12">Verify Now</Button>
              </Link>
            )}
          </motion.div>
        )}

        {!stats.hasProfileDetails && stats.isVerified && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 text-blue-700 dark:text-blue-400 flex items-center justify-between gap-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                 <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold">Complete Your Profile</h4>
                <p className="font-medium opacity-80 text-sm">Add your skills and bio to stand out to task posters.</p>
              </div>
            </div>
            <Link href="/dashboard/profile">
              <Button className="rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 px-8 h-12">Update Profile</Button>
            </Link>
          </motion.div>
        )}

        {/* Success/Error Toasts */}
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" /> {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold flex items-center gap-3">
            <AlertCircle className="w-5 h-5" /> {errorMsg}
          </motion.div>
        )}
      </div>

      {/* Main Feed Section */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-2">
              <h2 className="text-3xl font-black text-black dark:text-white flex items-center gap-3">
                 <Search className="w-8 h-8 text-primary" />
                 Available Tasks
              </h2>
              <p className="text-muted-foreground text-lg">Pick a task that fits your schedule and start helping.</p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative group">
                 <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                 <select className="pl-10 pr-6 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none min-w-[160px]">
                    <option>All Categories</option>
                    <option>Delivery</option>
                    <option>Moving</option>
                    <option>Cleaning</option>
                 </select>
              </div>
              <Button onClick={fetchData} variant="outline" className="h-12 rounded-xl font-bold px-6 border-2">Refresh Feed</Button>
           </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTasks.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3 py-32 text-center rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-white/5">
               <Briefcase className="w-16 h-16 mx-auto text-gray-200 mb-6" />
               <h3 className="text-2xl font-bold text-gray-400 mb-2">No tasks available right now</h3>
               <p className="text-muted-foreground">Check back later or try refreshing the feed.</p>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden"
              >
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/10">
                      {task.category?.name || "General"}
                    </span>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Offer</p>
                      <p className="text-2xl font-black text-black dark:text-white">৳{task.offerPrice}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-black dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 dark:border-white/5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span className="truncate">{task.location || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{task.estimatedDuration || "30"} min</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleApply(task.id)}
                    disabled={applyingId === task.id || !stats.isVerified}
                    className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                      !stats.isVerified 
                        ? "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed border-none shadow-none" 
                        : "bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] shadow-xl"
                    }`}
                  >
                    {applyingId === task.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : !stats.isVerified ? (
                      "Verify to Apply"
                    ) : (
                      "Accept Task"
                    )}
                  </Button>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
