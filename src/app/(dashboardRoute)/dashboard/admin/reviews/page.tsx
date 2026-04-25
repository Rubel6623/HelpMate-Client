"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Star, Trash2, MessageSquare, User, Loader2, ShieldCheck, Search, Filter } from "lucide-react";
import { getReviews, deleteReview } from "@/src/services/reviews";
import { toast, Toaster } from "sonner";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("ALL");

  const fetchReviews = async () => {
    try {
      const res = await getReviews();
      if (res?.success) {
        setReviews(res.data || []);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this review? This action cannot be undone.")) return;
    try {
      const res = await deleteReview(id);
      if (res?.success) {
        toast.success("Review deleted");
        fetchReviews();
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.reviewer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.reviewee?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === "ALL" || r.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">Feedback Moderation</h1>
          <p className="text-muted-foreground text-lg">Manage and moderate reviews across the platform.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
           <Star className="w-6 h-6 fill-primary" />
           <span className="font-black text-lg">{reviews.length} Total Reviews</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input 
              placeholder="Search by user or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full lg:max-w-md pl-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {["ALL", "5", "4", "3", "2", "1"].map((r) => (
              <button 
                key={r}
                onClick={() => setFilterRating(r)}
                className={`px-5 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  filterRating === r 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {r} {r !== "ALL" && <Star className={`w-3 h-3 ${filterRating === r ? "fill-white" : "fill-gray-400"}`} />}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-white/5">
          {filteredReviews.map((review, i) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-8 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group flex flex-col md:flex-row gap-8"
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     {[...Array(5)].map((_, idx) => (
                       <Star key={idx} className={`w-5 h-5 ${idx < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"}`} />
                     ))}
                     <span className="ml-2 text-sm font-bold text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                   </div>
                   <button 
                    onClick={() => handleDelete(review.id)}
                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all md:opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                </div>

                <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 relative">
                   <MessageSquare className="absolute -top-3 -left-3 w-8 h-8 text-primary/10" />
                   <p className="text-lg font-medium text-gray-600 dark:text-gray-300 italic leading-relaxed">
                     "{review.comment || "No comment provided."}"
                   </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-8 pt-2">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reviewer (User)</p>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                           {review.reviewer?.name?.substring(0, 2)}
                         </div>
                         <p className="font-bold text-black dark:text-white">{review.reviewer?.name}</p>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reviewee (Runner)</p>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs uppercase">
                           {review.reviewee?.name?.substring(0, 2)}
                         </div>
                         <p className="font-bold text-black dark:text-white">{review.reviewee?.name}</p>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Related Task</p>
                      <p className="font-bold text-primary hover:underline cursor-pointer">{review.task?.title}</p>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredReviews.length === 0 && (
            <div className="p-20 text-center">
              <Star className="w-12 h-12 mx-auto text-gray-300 mb-4 opacity-20" />
              <p className="text-xl font-bold text-gray-400">No reviews found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
