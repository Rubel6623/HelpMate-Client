"use client";

import { useEffect, useState, use } from "react";
import { motion } from "motion/react";
import { 
  Star, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Smile,
  Frown,
  Meh
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { createReview } from "@/src/services/reviews";
import { getAssignmentById } from "@/src/services/assignments";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function RunnerReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const assignmentId = resolvedParams.id;
  const router = useRouter();
  
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getAssignmentById(assignmentId);
        if (res?.success) {
          setAssignment(res.data);
          
          // Check if already reviewed (optional enhancement)
        } else {
          toast.error("Failed to load task details.");
        }
      } catch (error) {
        toast.error("An error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [assignmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await createReview({
        taskId: assignment.taskId,
        revieweeId: assignment.task.userId, // Reviewing the task poster
        rating,
        comment
      });
      
      if (res?.success) {
        toast.success("Review submitted! Thank you for your feedback.");
        setTimeout(() => {
          router.push(`/dashboard/runner/jobs`);
        }, 2000);
      } else {
        toast.error(res?.message || "Failed to submit review.");
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
        <h2 className="text-2xl font-bold mb-4">Assignment Not Found</h2>
        <Link href="/dashboard/runner/jobs">
          <Button variant="outline">Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      
      
      <Link href={`/dashboard/runner/jobs/${assignmentId}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Job Details
      </Link>

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-black text-black dark:text-white">Rate the Customer</h1>
        <p className="text-muted-foreground text-lg">How was your experience working with {assignment.task.user?.name}?</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-2xl space-y-10"
      >
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex flex-col items-center gap-6">
             <Label className="text-sm font-black text-gray-400 uppercase tracking-widest">Select Rating</Label>
             <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      rating >= star 
                        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-110" 
                        : "bg-gray-100 dark:bg-white/5 text-gray-300"
                    }`}
                  >
                    <Star className={`w-8 h-8 ${rating >= star ? "fill-white" : ""}`} />
                  </button>
                ))}
             </div>
             <p className="font-black text-xl text-amber-500">
                {rating === 5 ? "Amazing!" : rating === 4 ? "Very Good" : rating === 3 ? "Decent" : rating === 2 ? "Could be better" : "Terrible"}
             </p>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">
              Your Feedback
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <Textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your experience with the customer..."
                className="min-h-[150px] pl-12 rounded-[2rem] bg-gray-50 dark:bg-white/5 border-none font-semibold text-black dark:text-white text-lg focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full h-16 rounded-2xl bg-black dark:bg-white dark:text-black text-white font-black text-xl shadow-xl transition-all flex gap-3"
            >
              {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Star className="w-6 h-6" />}
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
