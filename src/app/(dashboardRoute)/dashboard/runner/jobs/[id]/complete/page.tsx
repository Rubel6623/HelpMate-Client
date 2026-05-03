"use client";

import { useEffect, useState, use } from "react";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  Camera, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  ArrowLeft,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { getAssignmentById, submitAssignment } from "@/src/services/assignments";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function CompleteJobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [proofUrls, setProofUrls] = useState<string[]>([""]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getAssignmentById(id);
        if (res?.success) {
          setAssignment(res.data);
          
          // Redirect if already completed
          if (res.data.completedAt) {
            toast.info("This task is already marked as completed.");
            router.push("/dashboard/runner/my-tasks");
          }
        } else {
          toast.error("Failed to load task details.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching task details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, router]);

  const addProofField = () => {
    setProofUrls([...proofUrls, ""]);
  };

  const removeProofField = (index: number) => {
    const newUrls = [...proofUrls];
    newUrls.splice(index, 1);
    setProofUrls(newUrls);
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...proofUrls];
    newUrls[index] = value;
    setProofUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Filter out empty URLs
    const filteredUrls = proofUrls.filter(url => url.trim() !== "");
    
    try {
      const res = await submitAssignment(id, filteredUrls);
      if (res?.success) {
        toast.success("Task marked as completed successfully!");
        setTimeout(() => {
          router.push("/dashboard/runner/my-tasks");
        }, 2000);
      } else {
        toast.error(res?.message || "Failed to complete task.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Task Not Found</h2>
        <Link href="/dashboard/runner/my-tasks">
          <Button variant="outline">Back to My Tasks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      
      
      <Link href="/dashboard/runner/my-tasks" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to My Tasks
      </Link>

      <div className="space-y-2">
        <h1 className="text-4xl font-black text-black dark:text-white">Complete Task</h1>
        <p className="text-muted-foreground text-lg">Provide proof of work to finalize the task and receive payment.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-2xl space-y-8"
      >
        {/* Task Summary */}
        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
          <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Active Task</p>
          <h2 className="text-2xl font-bold text-black dark:text-white">{assignment.task.title}</h2>
          <div className="flex items-center gap-2 mt-2">
             <span className="text-sm font-bold text-gray-500">Earnings:</span>
             <span className="text-xl font-black text-emerald-500">৳{assignment.task.offerPrice}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">
                Proof of Completion (Photo URLs)
              </Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addProofField}
                className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold"
              >
                + Add Another
              </Button>
            </div>
            
            <div className="space-y-3">
              {proofUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <Camera className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <Input 
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      placeholder="https://example.com/proof-photo.jpg"
                      className="h-12 pl-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-semibold text-black dark:text-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  {proofUrls.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => removeProofField(index)}
                      className="h-12 w-12 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground ml-1">
              Tip: You can upload your photos to a service like Imgur or Cloudinary and paste the link here.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-white/5">
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4 mb-8">
               <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
               <div>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">Secure Release</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Once you mark this task as complete, the user will be notified to confirm and release your payment of <span className="font-bold text-black dark:text-white">৳{assignment.task.offerPrice}</span>.
                  </p>
               </div>
            </div>

            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl shadow-xl shadow-emerald-500/20 transition-all flex gap-3"
            >
              {submitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <CheckCircle2 className="w-7 h-7" />
              )}
              {submitting ? "Finalizing..." : "Submit Proof & Complete Task"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
