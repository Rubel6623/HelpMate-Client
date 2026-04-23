"use client";

import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

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

export const UserReviews = () => {
  return (
    <section className="py-20 bg-transparent relative">

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our <span className="text-primary">Community</span> Says
            </h2>
            <p className="text-gray-400 text-lg">
              Real stories from real people using HelpMate to simplify their daily lives.
            </p>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400" />
              ))}
            </div>
            <span className="text-white font-bold text-lg ml-2">4.9/5</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between"
            >
              <div className="absolute top-6 right-8 text-white/5 pointer-events-none">
                <Quote className="w-20 h-20 fill-white/10" />
              </div>

              <div>
                <div className="flex gap-1 text-yellow-400 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-8 italic">
                  "{review.content}"
                </p>
              </div>

              <div className="flex items-center gap-4">
                <img 
                  src={review.avatar} 
                  alt={review.user}
                  className="w-12 h-12 rounded-full border border-white/10"
                />
                <div>
                  <h4 className="text-white font-bold">{review.user}</h4>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
