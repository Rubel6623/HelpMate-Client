"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  Wallet, 
  ArrowUpRight, 
  Loader2, 
  CreditCard,
  AlertCircle,
  X
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getMyTasks } from "@/src/services/tasks";
import { getMyWallet } from "@/src/services/wallets";
import { approveAssignment } from "@/src/services/assignments";
import { toast } from "sonner";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";

export default function UserDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirmingTask, setConfirmingTask] = useState<any>(null);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [taskRes, walletRes] = await Promise.all([
        getMyTasks(),
        getMyWallet()
      ]);

      if (taskRes?.success) setTasks(taskRes.data);
      if (walletRes?.success) setWallet(walletRes.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPay = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid completion OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await approveAssignment(confirmingTask.assignment.id, otp);
      if (res?.success) {
        toast.success("Payment released and task confirmed!");
        setConfirmingTask(null);
        setOtp("");
        fetchDashboardData();
      } else {
        toast.error(res?.message || "Failed to confirm task. Check your OTP and balance.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { 
      label: "Active Tasks", 
      value: tasks.filter(t => t.status === "PENDING" || t.status === "ACCEPTED" || t.status === "IN_PROGRESS" || t.status === "SUBMITTED").length, 
      icon: Clock, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Completed", 
      value: tasks.filter(t => t.status === "RELEASED").length, 
      icon: CheckCircle2, 
      color: "text-green-500", 
      bg: "bg-green-50" 
    },
    { 
      label: "Wallet Balance", 
      value: `৳${wallet?.balance || "0"}`, 
      icon: Wallet, 
      color: "text-purple-500", 
      bg: "bg-purple-50" 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-black dark:text-white mb-2 tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground text-lg font-medium">Manage your tasks and track your errands in real-time.</p>
        </div>
        <Link href="/dashboard/user/post-task">
          <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-xl shadow-primary/20 flex gap-3 transition-all hover:scale-[1.02]">
            <Plus className="w-6 h-6" />
            Post New Task
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all"
          >
            <div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-black dark:text-white">{stat.value}</h3>
            </div>
            <div className={`w-16 h-16 ${stat.bg} dark:bg-white/10 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform shadow-inner`}>
              <stat.icon className="w-8 h-8" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">Recent Tasks</h3>
            <Link href="/dashboard/user/tasks">
              <button className="text-primary font-bold hover:underline flex items-center gap-1 group">
                View all <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </Link>
          </div>
          <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-xl">
            {tasks.slice(0, 5).map((task, index) => (
              <div
                key={task.id}
                className={`p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${index !== tasks.length - 1 ? "border-b border-gray-100 dark:border-white/5" : ""
                  }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg ${
                    task.status === "IN_PROGRESS" ? "bg-blue-500" : 
                    task.status === "COMPLETED" ? "bg-amber-500" : 
                    task.status === "RELEASED" ? "bg-green-500" : "bg-gray-400"
                    }`}>
                    {task.title.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-black dark:text-white text-lg tracking-tight">{task.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                        task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-600" : 
                        task.status === "COMPLETED" ? "bg-amber-100 text-amber-600" : 
                        task.status === "RELEASED" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                        }`}>
                        {task.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-gray-400 font-bold">{new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-2xl font-black text-black dark:text-white">৳{task.offerPrice}</p>
                  {task.status === "COMPLETED" && (
                    <Button 
                      size="sm"
                      onClick={() => setConfirmingTask(task)}
                      className="bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-xl shadow-lg shadow-green-500/20 flex gap-2"
                    >
                      <CreditCard className="w-3 h-3" /> Confirm & Pay
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="p-20 text-center text-gray-400 font-bold">
                No tasks posted yet.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Card */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-black dark:text-white px-2 tracking-tight">Financials</h3>
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-purple-800 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            
            <p className="text-white/60 font-black text-xs uppercase tracking-widest mb-2 relative z-10">Total Balance</p>
            <h3 className="text-5xl font-black mb-10 relative z-10">৳{wallet?.balance || "0.00"}</h3>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <Link href="/dashboard/user/payment">
                <Button className="w-full bg-white text-primary font-black uppercase text-[10px] tracking-widest hover:bg-white/90 rounded-xl h-12 shadow-xl shadow-black/10">
                  Top Up
                </Button>
              </Link>
              <Link href="/dashboard/user/wallet">
                <Button className="w-full bg-black/20 hover:bg-black/30 text-white font-black uppercase text-[10px] tracking-widest border border-white/10 rounded-xl h-12 backdrop-blur-sm">
                  History
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <AlertCircle className="w-12 h-12" />
            </div>
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
               Trust Badge
               <CheckCircle2 className="w-5 h-5 text-primary" />
            </h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-3 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-purple-500 w-[92%]" />
              </div>
              <span className="font-black text-primary text-sm">92%</span>
            </div>
            <p className="text-gray-400 text-xs font-bold leading-relaxed">
              Complete more tasks and pay runners promptly to keep your high trust score.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmingTask} onOpenChange={() => setConfirmingTask(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-none rounded-[3rem] p-10 shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center text-green-500 mx-auto">
               <ShieldCheck className="w-10 h-10" />
            </div>
            <DialogTitle className="text-3xl font-black text-center text-black dark:text-white">Confirm Completion</DialogTitle>
            <p className="text-center text-gray-400 font-medium px-4">
               Enter the completion OTP provided by the runner to release the payment.
            </p>
          </DialogHeader>

          <div className="space-y-6 mt-8">
            <div className="space-y-3 text-center">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount to release</p>
               <p className="text-4xl font-black text-black dark:text-white">৳{confirmingTask?.offerPrice}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Completion OTP</Label>
              <Input
                placeholder="e.g. 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-16 rounded-2xl text-center text-2xl font-black tracking-[0.5em] border-gray-200 dark:border-white/10 focus:ring-4 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleConfirmPay} 
                disabled={isSubmitting || !otp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-lg h-16 rounded-2xl shadow-xl shadow-green-500/20"
              >
                {isSubmitting ? <Loader2 className="animate-spin w-6 h-6 mr-2" /> : <CreditCard className="w-6 h-6 mr-2" />}
                Release Payment
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setConfirmingTask(null)}
                className="text-gray-400 font-bold hover:text-red-500"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ShieldCheck(props: any) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Label({ children, className }: any) {
  return <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>{children}</label>;
}
