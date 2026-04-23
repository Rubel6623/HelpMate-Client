"use client";

import { motion } from "motion/react";
import { ShieldCheck, Star, Trophy, Target, Award, Zap } from "lucide-react";

export default function RunnerBadgesPage() {
  const badges = [
    { id: "1", label: "Top Runner", desc: "Top 5% earnings this month", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50", locked: false },
    { id: "2", label: "Quick Responder", desc: "Average response < 5 mins", icon: Zap, color: "text-blue-500", bg: "bg-blue-50", locked: false },
    { id: "3", label: "Five Star Streak", desc: "10 consecutive 5-star ratings", icon: Star, color: "text-orange-500", bg: "bg-orange-50", locked: true },
    { id: "4", label: "Punctuality King", desc: "No late arrivals in 50 tasks", icon: Target, color: "text-green-500", bg: "bg-green-50", locked: true },
    { id: "5", label: "Trusted Partner", desc: "Completed 100+ tasks", icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-50", locked: true },
    { id: "6", label: "Expert Errand", desc: "Specialist in grocery tasks", icon: Award, color: "text-pink-500", bg: "bg-pink-50", locked: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">My Achievement Badges</h1>
        <p className="text-muted-foreground text-lg">Unlock badges to increase your visibility and trust score.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {badges.map((badge, i) => (
          <motion.div 
            key={badge.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 rounded-[2rem] border-2 transition-all relative overflow-hidden group ${
              badge.locked 
              ? "bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/5 grayscale" 
              : "bg-white dark:bg-white/5 border-primary/10 shadow-xl hover:border-primary/30"
            }`}
          >
             <div className={`w-20 h-20 rounded-2xl ${badge.bg} dark:bg-white/10 flex items-center justify-center ${badge.color} mb-6 group-hover:rotate-12 transition-transform`}>
                <badge.icon className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-black text-black dark:text-white mb-2">{badge.label}</h3>
             <p className="text-muted-foreground font-medium leading-relaxed">{badge.desc}</p>
             
             {badge.locked && (
                <div className="mt-6 flex items-center gap-2">
                   <div className="flex-1 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[60%]" />
                   </div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Locked</span>
                </div>
             )}

             {!badge.locked && (
                <div className="absolute top-6 right-6">
                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                      <ShieldCheck className="w-4 h-4" />
                   </div>
                </div>
             )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
