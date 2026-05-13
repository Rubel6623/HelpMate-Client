"use client";

import { motion } from "motion/react";
import { Star, Quote, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getReviews } from "@/src/services/reviews";
import { Skeleton } from "@/src/components/ui/skeleton";

const reviews = [
  {
    id: 1,
    user: "David Smith",
    role: "Regular Customer",
    content: "HelpMate saved my day! I was stuck in a meeting and needed some urgent documents delivered. My helper was professional and fast.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=david"
  },
  {
    id: 2,
    user: "Emily Blunt",
    role: "Busy Parent",
    content: "The grocery delivery service is a life saver. I can order exactly what I need and it arrives right at my door. Verified students give me peace of mind.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=emily"
  },
  {
    id: 3,
    user: "Michael Scott",
    role: "Office Manager",
    content: "We use HelpMate for small office errands. It's much cheaper than a courier and just as reliable. Highly recommended for local tasks.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=michael"
  }
];

const ReviewCardSkeleton = () => (
  <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between h-full space-y-6">
    <div className="space-y-4">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-4 h-4 rounded-full bg-white/10" />
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-lg bg-white/10" />
        <Skeleton className="h-4 w-5/6 rounded-lg bg-white/10" />
        <Skeleton className="h-4 w-4/5 rounded-lg bg-white/10" />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-full bg-white/10" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-lg bg-white/10" />
        <Skeleton className="h-3 w-16 rounded-lg bg-white/10" />
      </div>
    </div>
  </div>
);

export const UserReviews = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getReviews("limit=8");
        if (res?.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-primary/5 blur-[10rem] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Community</span> Says
            </h2>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              Real stories from real people using HelpMate to simplify their daily lives.
            </p>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 px-8 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <div className="h-6 w-px bg-white/10 mx-2" />
            <span className="text-white font-black text-2xl">4.9</span>
            <span className="text-gray-500 font-bold text-sm">/5</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            [...Array(4)].map((_, i) => <ReviewCardSkeleton key={i} />)
          ) : data.length > 0 ? (
            data.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all duration-500 flex flex-col justify-between h-full overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none group-hover:text-primary/10 transition-colors duration-500">
                  <Quote className="w-24 h-24 rotate-180" />
                </div>

                <div className="relative z-10">
                  <div className="flex gap-1 text-amber-500 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8 italic font-medium">
                    "{review.comment || review.content}"
                  </p>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-1 group-hover:border-primary/50 transition-colors duration-500">
                    {review.reviewer?.avatarUrl || review.avatar ? (
                      <img 
                        src={review.reviewer?.avatarUrl || review.avatar} 
                        alt={review.reviewer?.name || review.user}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCircle className="w-8 h-8 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-black group-hover:text-primary transition-colors">
                      {review.reviewer?.name || review.user}
                    </h4>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {review.role || "Verified User"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all duration-500 flex flex-col justify-between h-full"
              >
                <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none group-hover:text-primary/10 transition-colors duration-500">
                  <Quote className="w-24 h-24 rotate-180" />
                </div>

                <div className="relative z-10">
                  <div className="flex gap-1 text-amber-500 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8 italic font-medium">
                    "{review.content}"
                  </p>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-1 group-hover:border-primary/50 transition-colors duration-500">
                    <img 
                      src={review.avatar} 
                      alt={review.user}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-black group-hover:text-primary transition-colors">
                      {review.user}
                    </h4>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {review.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
