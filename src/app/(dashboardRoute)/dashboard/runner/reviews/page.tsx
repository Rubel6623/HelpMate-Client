"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Star, MessageSquare, User, Loader2, Quote, ThumbsUp } from "lucide-react";
import { getMyReviews } from "@/src/services/reviews";
import { toast, Toaster } from "sonner";

export default function RunnerReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await getMyReviews();
      if (res?.success) {
        setReviews(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-10 pb-20">
      <Toaster position="top-right" richColors />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">My Runner Profile Feedback</h1>
          <p className="text-muted-foreground text-lg font-medium">Ratings and comments from customers you've helped.</p>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm flex items-center gap-6">
           <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Average Rating</p>
              <div className="flex items-center gap-2">
                 <p className="text-3xl font-black text-black dark:text-white">{averageRating}</p>
                 <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
           </div>
           <div className="w-px h-10 bg-gray-100 dark:bg-white/10" />
           <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Reviews</p>
              <p className="text-3xl font-black text-black dark:text-white">{reviews.length}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((review, i) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all relative group"
          >
            <Quote className="absolute top-6 right-8 w-12 h-12 text-gray-100 dark:text-white/5 group-hover:text-primary/10 transition-colors" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-2">
                 {[...Array(5)].map((_, idx) => (
                   <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"}`} />
                 ))}
                 <span className="ml-2 text-xs font-bold text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="text-lg font-medium text-gray-600 dark:text-gray-300 italic leading-relaxed">
                "{review.comment || "The runner was very professional and on time."}"
              </p>

              <div className="pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase">
                       {review.reviewer?.name?.charAt(0) || "C"}
                    </div>
                    <div>
                       <p className="font-bold text-black dark:text-white text-sm">{review.reviewer?.name}</p>
                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Customer</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase">
                    <ThumbsUp className="w-3 h-3" /> Top Choice
                 </div>
              </div>
              
              <div className="mt-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Task Completed</p>
                 <p className="text-sm font-bold text-primary truncate">{review.task?.title}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {reviews.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-6 bg-gray-50 dark:bg-white/5 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-white/5">
             <div className="w-20 h-20 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Star className="w-10 h-10 text-gray-200" />
             </div>
             <div>
                <h3 className="text-2xl font-black text-black dark:text-white">No Reviews Yet</h3>
                <p className="text-gray-400 font-bold mt-2">Complete tasks for customers to receive feedback and grow your reputation.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
