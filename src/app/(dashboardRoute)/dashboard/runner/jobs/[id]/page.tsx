"use client";

import { useEffect, useState, use } from "react";
import { motion } from "motion/react";
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
  FileText,
  Phone,
  Navigation,
  Play,
  Star,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getAssignmentById, startAssignment } from "@/src/services/assignments";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RunnerJobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const assignmentId = resolvedParams.id;
  const router = useRouter();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAssignment = async () => {
    setLoading(true);
    try {
      const res = await getAssignmentById(assignmentId);
      if (res?.success && res.data) {
        setAssignment(res.data);
      } else {
        toast.error("Assignment not found");
        router.push("/dashboard/runner/jobs");
      }
    } catch (error) {
      toast.error("Failed to load assignment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const handleStart = async () => {
    setIsSubmitting(true);
    try {
      const res = await startAssignment(assignmentId);
      if (res?.success) {
        toast.success("Task started! You are now in progress.");
        fetchAssignment();
      } else {
        toast.error(res?.message || "Failed to start task.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const task = assignment.task;

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

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="space-y-6">
        <Link href="/dashboard/runner/my-tasks">
          <Button variant="ghost" className="gap-2 text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to My Tasks
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className={`px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest ${getStatusColor(assignment)} shadow-lg shadow-black/5`}>
                {getStatusLabel(assignment)}
              </span>
              <span className="text-gray-400 font-bold text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" /> Accepted on {new Date(assignment.acceptedAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight leading-tight">
              {task.title}
            </h1>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Earnings</p>
            <p className="text-5xl font-black text-primary">৳{task.offerPrice}</p>
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
                Job Description
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100 dark:border-white/5">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Task Locations
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
                  {(!task.stops || task.stops.length === 0) && (
                    <p className="text-gray-500 font-medium">{task.location}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Timeline
                </h3>
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold text-xs uppercase">Start After</span>
                    <span className="font-bold">{new Date(task.timeWindowStart).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold text-xs uppercase">Complete By</span>
                    <span className="font-bold">{new Date(task.timeWindowEnd).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 space-y-4">
             <h4 className="text-lg font-black text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Runner Guidelines
             </h4>
             <ul className="space-y-2 text-sm text-amber-800/70 dark:text-amber-400/70 font-medium list-disc ml-5">
                <li>Always call the customer before starting the trip.</li>
                <li>Take photos of the item/location upon completion for proof.</li>
                <li>Be polite and professional during interactions.</li>
                <li>Report any safety issues immediately via the SOS button.</li>
             </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Customer Info */}
          <div className="p-8 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-2xl space-y-6">
             <h3 className="text-xl font-black text-black dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Customer Details
             </h3>
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black uppercase overflow-hidden">
                      {task.user?.avatarUrl ? (
                        <img src={task.user.avatarUrl} alt={task.user.name} className="w-full h-full object-cover" />
                      ) : (
                        task.user.name.charAt(0)
                      )}
                   </div>
                   <div>
                      <p className="text-xl font-black text-black dark:text-white">{task.user.name}</p>
                      <p className="text-sm text-gray-400 font-bold">Customer ID: #{task.user.id.substring(0, 8)}</p>
                   </div>
                </div>
                <div className="flex flex-col gap-3">
                   <a href={`tel:${task.user.phone}`} className="w-full">
                      <Button className="w-full rounded-xl font-bold gap-2 h-12 bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none">
                         <Phone className="w-4 h-4" /> {task.user.phone}
                      </Button>
                   </a>
                   <Button variant="outline" className="w-full rounded-xl font-bold gap-2 h-12">
                      <MessageSquare className="w-4 h-4" /> Message Customer
                   </Button>
                </div>
             </div>
          </div>

          {/* Action Card */}
          <div className="p-8 rounded-[3rem] bg-gray-950 text-white shadow-2xl space-y-6 relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
             
             <h3 className="text-xl font-black relative z-10">Job Controls</h3>
             
             <div className="space-y-3 relative z-10">
                {!assignment.startedAt && !assignment.completedAt && (
                  <Button 
                    onClick={handleStart}
                    disabled={isSubmitting}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-primary/20 gap-2"
                  >
                     {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                     Start This Job
                  </Button>
                )}

                {assignment.startedAt && !assignment.completedAt && (
                  <Link href={`/dashboard/runner/jobs/${assignmentId}/complete`} className="block">
                    <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 gap-2">
                       <CheckCircle2 className="w-5 h-5" />
                       Mark as Completed
                    </Button>
                  </Link>
                )}

                {assignment.completedAt && !assignment.confirmedAt && (
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center space-y-2">
                     <p className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 animate-pulse" /> Pending Confirmation
                     </p>
                     <p className="text-[10px] text-gray-400">Waiting for user to enter OTP</p>
                  </div>
                )}

                {assignment.confirmedAt && (
                  <Link href={`/dashboard/review/${assignment.taskId}`} className="block">
                    <Button className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-amber-500/20 gap-2">
                       <Star className="w-5 h-5" />
                       Leave a Review
                    </Button>
                  </Link>
                )}

                <div className="pt-4 flex flex-col gap-2 border-t border-white/10">
                  <Link href={`/dashboard/dispute/${assignment.taskId}`}>
                    <Button variant="ghost" className="w-full h-12 text-white/60 hover:text-white hover:bg-white/5 font-bold uppercase text-[10px] tracking-widest rounded-xl gap-2">
                       <ShieldAlert className="w-4 h-4" />
                       Raise a Dispute
                    </Button>
                  </Link>
                  <Link href="/dashboard/runner/sos" className="block">
                    <Button variant="ghost" className="w-full h-12 text-white/40 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest rounded-xl gap-2">
                       <AlertCircle className="w-4 h-4" />
                       Report Safety Issue
                    </Button>
                  </Link>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
