"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  DollarSign, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Calendar,
  MessageSquare,
  XCircle,
  CreditCard,
  FileText,
  Star,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getTaskById, updateTaskStatus } from "@/src/services/tasks";
import { approveAssignment } from "@/src/services/assignments";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { TaskPaymentModal } from "@/src/components/shared/TaskPaymentModal";
import { updateApplicationStatus } from "@/src/services/task-applications";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "@/src/components/ui";

export default function UserTaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await getTaskById(taskId);
      if (res?.success && res.data) {
        setTask(res.data);
      } else {
        toast.error("Task not found");
        router.push("/dashboard/user/tasks");
      }
    } catch (error) {
      toast.error("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const handleConfirmPay = async () => {
    if (!otp || otp.length < 6) {
      toast.error("Please enter the 6-digit completion OTP");
      return;
    }

    if (!task?.assignment?.id) {
      toast.error("Assignment record not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await approveAssignment(task.assignment.id, otp);
      if (res?.success) {
        toast.success("Task confirmed! Payment has been released to the runner.");
        setIsConfirmModalOpen(false);
        setOtp("");
        fetchTask();
      } else {
        toast.error(res?.message || "Incorrect OTP or payment release failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelTask = async () => {
    if (!confirm("Are you sure you want to cancel this task? This action cannot be undone.")) return;
    
    setIsSubmitting(true);
    try {
      const res = await updateTaskStatus(taskId, "CANCELLED", "User cancelled the task from details page");
      if (res?.success) {
        toast.success("Task cancelled successfully.");
        fetchTask();
      } else {
        toast.error(res?.message || "Failed to cancel task");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptRunner = (application: any) => {
    setSelectedApplication(application);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedApplication) return;
    
    setIsSubmitting(true);
    try {
      const res = await updateApplicationStatus(selectedApplication.id, "ACCEPTED");
      if (res?.success) {
        toast.success(`Runner ${selectedApplication.runner.name} assigned successfully!`);
        fetchTask();
      } else {
        toast.error(res?.message || "Failed to assign runner");
      }
    } catch (error) {
      toast.error("Failed to assign runner");
    } finally {
      setIsSubmitting(false);
      setIsPaymentModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!task) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-blue-500";
      case "ACCEPTED": return "bg-purple-500";
      case "IN_PROGRESS": return "bg-yellow-500";
      case "SUBMITTED": return "bg-orange-500";
      case "COMPLETED": return "bg-green-500";
      case "RELEASED": return "bg-emerald-500";
      case "CANCELLED": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="space-y-6">
        <Link href="/dashboard/user/tasks">
          <Button variant="ghost" className="gap-2 text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to My Tasks
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className={`px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest ${getStatusColor(task.status)} shadow-lg shadow-black/5`}>
                {task.status.replace("_", " ")}
              </span>
              <span className="text-gray-400 font-bold text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" /> Posted on {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight leading-tight">
              {task.title}
            </h1>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Offer Price</p>
            <p className="text-5xl font-black text-primary">৳{Number(task.offerPrice)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-2xl space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-black dark:text-white flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                Description
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100 dark:border-white/5">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Locations
                </h3>
                <div className="space-y-4">
                  {task.stops?.map((stop: any, idx: number) => (
                    <div key={stop.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-black dark:text-white">{stop.locationLabel}</p>
                        <p className="text-sm text-gray-500">{stop.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Schedule
                </h3>
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold text-xs uppercase">Start After</span>
                    <span className="font-bold">{new Date(task.timeWindowStart).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold text-xs uppercase">End Before</span>
                    <span className="font-bold">{new Date(task.timeWindowEnd).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          {/* Timeline / Logs */}
          <div className="space-y-6 pt-10">
            <h3 className="text-2xl font-black text-black dark:text-white px-4 tracking-tight text-center">Task Timeline</h3>
            <div className="relative space-y-8 pl-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-white/5">
               {task.statusLogs?.map((log: any, index: number) => (
                 <div key={log.id} className="relative">
                    <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <div className="space-y-1">
                      <p className="font-bold text-black dark:text-white flex items-center gap-2">
                        {log.status.replace("_", " ")}
                        <span className="text-xs text-gray-400 font-normal">{new Date(log.createdAt).toLocaleString()}</span>
                      </p>
                      {log.note && <p className="text-sm text-gray-500 italic">"{log.note}"</p>}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

          {/* Applications Section */}
          {task.status === "PENDING" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">Runner Applications</h3>
                <Badge variant="outline" className="rounded-full px-4 py-1 font-bold">
                  {task.applications?.length || 0} Bids
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {task.applications && task.applications.length > 0 ? (
                  task.applications.map((app: any) => (
                    <div key={app.id} className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all group">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-14 h-14 rounded-2xl border-2 border-primary/20">
                            <AvatarImage src={app.runner.avatarUrl} />
                            <AvatarFallback className="bg-primary/10 text-primary font-black">
                               {app.runner.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-lg font-black text-black dark:text-white group-hover:text-primary transition-colors">
                              {app.runner.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="text-sm font-bold text-gray-500">
                                {app.runner.runnerProfile?.averageRating ? Number(app.runner.runnerProfile.averageRating).toFixed(1) : "New"}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {app.runner.runnerProfile?.totalTasksDone || 0} Tasks
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bid Amount</p>
                            <p className="text-2xl font-black text-primary">৳{Number(app.bidAmount || task.offerPrice)}</p>
                          </div>
                          <Button 
                            onClick={() => handleAcceptRunner(app)}
                            className="bg-black dark:bg-white text-white dark:text-black hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white font-black px-8 h-12 rounded-xl transition-all"
                          >
                            Accept & Pay
                          </Button>
                        </div>
                      </div>
                      {app.message && (
                        <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 text-sm text-gray-600 dark:text-gray-400 font-medium italic">
                          "{app.message}"
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-white/5">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-bold italic">No applications yet. Check back soon!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Runner Info */}
          <div className="p-8 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-2xl space-y-6">
             <h3 className="text-xl font-black text-black dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Assigned Runner
             </h3>
             {task.assignment?.runner ? (
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black uppercase overflow-hidden">
                        {task.assignment.runner.avatarUrl ? (
                          <img src={task.assignment.runner.avatarUrl} alt={task.assignment.runner.name} className="w-full h-full object-cover" />
                        ) : (
                          task.assignment.runner.name.charAt(0)
                        )}
                     </div>
                     <div>
                        <p className="text-xl font-black text-black dark:text-white">{task.assignment.runner.name}</p>
                        <p className="text-sm text-gray-400 font-bold">{task.assignment.runner.phone}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <Button variant="outline" className="flex-1 rounded-xl font-bold gap-2">
                        <MessageSquare className="w-4 h-4" /> Message
                     </Button>
                  </div>
               </div>
             ) : (
               <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto">
                     <User className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold italic">{task.status === "PENDING" ? "Choose a runner from applications below" : "Searching for a runner..."}</p>
               </div>
             )}
          </div>

          {/* Payment Status (if accepted but not yet started/funded) */}
          {(task.status === "ACCEPTED" || task.status === "IN_PROGRESS" || task.status === "SUBMITTED") && !task.payment && (
            <div className="p-8 rounded-[3rem] bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 shadow-xl space-y-4">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertCircle className="w-6 h-6" />
                <h4 className="font-black uppercase tracking-tight text-amber-700 dark:text-amber-500">Payment Required</h4>
              </div>
              <p className="text-sm text-amber-700/70 dark:text-amber-400/70 font-bold">
                You've accepted a runner, but the task isn't funded yet. Fund it now to allow the runner to start.
              </p>
              <Button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-lg shadow-amber-500/20"
              >
                Fund Task ৳{Number(task.offerPrice)}
              </Button>
            </div>
          )}

          {/* Submitted Proof Section */}
          {task.status === "SUBMITTED" && task.assignment?.proofUrls?.length > 0 && (
            <div className="p-8 rounded-[3rem] bg-white dark:bg-white/5 border border-orange-200 dark:border-orange-500/20 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-black text-black dark:text-white">Proof of Completion</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {task.assignment.proofUrls.map((url: string, idx: number) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-white/10 overflow-hidden border border-gray-200 dark:border-white/10 hover:border-primary/40 transition-colors">
                      <img src={url} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" onError={(e: any) => { e.target.style.display = 'none'; }} />
                    </div>
                  </a>
                ))}
              </div>
              <p className="text-xs text-gray-400 font-medium text-center">Runner has submitted proof. Review and confirm to release payment.</p>
            </div>
          )}

          {/* OTP Card for SUBMITTED tasks */}
          {task.status === "SUBMITTED" && task.assignment?.completionOTP && (
            <div className="p-8 rounded-[3rem] bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <h4 className="font-black text-emerald-700 dark:text-emerald-400">Completion OTP</h4>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-black/20 border border-emerald-200 dark:border-emerald-500/20 text-center">
                <p className="text-5xl font-black tracking-[0.3em] text-emerald-600 dark:text-emerald-400">{task.assignment.completionOTP}</p>
              </div>
              <p className="text-xs text-emerald-700/70 dark:text-emerald-400/60 font-medium text-center">Use this OTP to confirm task completion and release payment.</p>
            </div>
          )}

          <div className="p-8 rounded-[3rem] bg-gray-950 text-white shadow-2xl space-y-6 relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
             
             <h3 className="text-xl font-black relative z-10">Task Actions</h3>
             
             <div className="space-y-3 relative z-10">
                {task.status === "SUBMITTED" && (
                  <Button 
                    onClick={() => setIsConfirmModalOpen(true)}
                    className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-green-500/20 gap-2"
                  >
                     <CheckCircle2 className="w-5 h-5" />
                     Release Payment & Complete
                  </Button>
                )}

                {task.status === "PENDING" && (
                  <Link href={`/dashboard/user/tasks/${task.id}/edit`} className="block">
                    <Button className="w-full h-14 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-xs tracking-widest rounded-2xl border border-white/10 gap-2">
                       <Pencil className="w-5 h-5" />
                       Edit Task Details
                    </Button>
                  </Link>
                )}

                 {(task.status === "PENDING" || task.status === "ACCEPTED" || task.status === "IN_PROGRESS") && (
                    <Button 
                      onClick={handleCancelTask}
                      disabled={isSubmitting}
                      variant="ghost" className="w-full h-14 text-red-500 hover:text-red-400 hover:bg-red-500/10 font-black uppercase text-xs tracking-widest rounded-2xl gap-2">
                       <XCircle className="w-5 h-5" />
                       {isSubmitting ? "Cancelling..." : "Cancel Task"}
                    </Button>
                 )}

                {task.status === "RELEASED" && (
                  <Link href={`/dashboard/review/${task.id}`} className="block">
                    <Button className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-amber-500/20 gap-2">
                       <Star className="w-5 h-5" />
                       Leave a Review
                    </Button>
                  </Link>
                )}

                <div className="pt-4 flex flex-col gap-2 border-t border-white/10">
                  <Link href={`/dashboard/dispute/${task.id}`}>
                    <Button variant="ghost" className="w-full h-12 text-white/60 hover:text-white hover:bg-white/5 font-bold uppercase text-[10px] tracking-widest rounded-xl gap-2">
                       <ShieldAlert className="w-4 h-4" />
                       Raise a Dispute
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full h-12 text-white/40 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest rounded-xl gap-2">
                     <AlertCircle className="w-4 h-4" />
                     Report Issue
                  </Button>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-none rounded-[3rem] p-10 shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center text-green-500 mx-auto">
               <ShieldCheck className="w-10 h-10" />
            </div>
            <DialogTitle className="text-3xl font-black text-center text-black dark:text-white">Verify Completion</DialogTitle>
            <p className="text-center text-gray-400 font-medium px-4">
               Enter the completion OTP provided by your runner to finalize this task.
            </p>
          </DialogHeader>

          <div className="space-y-6 mt-8">
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 text-center">Enter 6-Digit OTP</p>
              <Input
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="h-20 rounded-2xl text-center text-4xl font-black tracking-[0.5em] border-gray-200 dark:border-white/10 focus:ring-4 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleConfirmPay} 
                disabled={isSubmitting || otp.length < 6}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-lg h-16 rounded-2xl shadow-xl shadow-green-500/20"
              >
                {isSubmitting ? <Loader2 className="animate-spin w-6 h-6 mr-2" /> : <CreditCard className="w-6 h-6 mr-2" />}
                Confirm & Pay ৳{Number(task?.offerPrice)}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-gray-400 font-bold"
              >
                Go Back
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <TaskPaymentModal
        taskId={task.id}
        amount={selectedApplication?.bidAmount || task.offerPrice}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

function Pencil(props: any) {
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
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
