"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Award, Sparkles, ShieldCheck, Star, Loader2, Clock, CheckCircle2 } from "lucide-react";
import { getMyBadges } from "@/src/services/badges";
import { toast } from "sonner";

export default function UserBadgesPage() {
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = async () => {
    try {
      const res = await getMyBadges();
      if (res?.success) {
        setUserBadges(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to load badges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Achievements
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight">Trust & Milestones</h1>
          <p className="text-muted-foreground text-lg font-medium">Your earned badges based on platform activity and reliability.</p>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm flex items-center gap-4">
           <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
              <Award className="w-8 h-8" />
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unlocked</p>
              <p className="text-2xl font-black text-black dark:text-white">{userBadges.length} Badges</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {userBadges.map((ub, i) => (
          <motion.div 
            key={ub.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-2xl transition-all relative group overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />

            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-gray-50 to-white dark:from-white/5 dark:to-transparent border border-gray-100 dark:border-white/5 flex items-center justify-center mb-8 mx-auto shadow-inner relative z-10 group-hover:rotate-6 transition-transform">
                {ub.badge.iconUrl ? (
                    <img src={ub.badge.iconUrl} alt={ub.badge.label} className="w-16 h-16 object-contain" />
                ) : (
                    <Award className="w-12 h-12 text-primary" />
                )}
            </div>

            <div className="text-center space-y-3 relative z-10">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
                    {ub.badge.type.replace(/_/g, ' ')}
                </span>
                <h3 className="text-2xl font-black text-black dark:text-white">{ub.badge.label}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{ub.badge.description}</p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(ub.createdAt).toLocaleDateString()}</div>
                <div className="flex items-center gap-1.5 text-green-500"><ShieldCheck className="w-3.5 h-3.5" /> Verified</div>
            </div>
          </motion.div>
        ))}

        {userBadges.length === 0 && (
          <div className="col-span-full py-24 text-center space-y-6 bg-gray-50 dark:bg-white/5 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-white/5">
             <div className="w-20 h-20 bg-white dark:bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                <Star className="w-10 h-10 text-gray-200" />
             </div>
             <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-black text-black dark:text-white">Begin Your Journey</h3>
                <p className="text-gray-400 font-bold mt-2">Earn your first badge by completing tasks and maintaining a high rating on the platform.</p>
             </div>
          </div>
        )}
      </div>

      {/* Trust Progress */}
      <div className="p-10 rounded-[3rem] bg-gradient-to-br from-gray-900 to-black text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10">
            <CheckCircle2 className="w-48 h-48" />
         </div>
         <div className="relative z-10 space-y-6">
            <h3 className="text-3xl font-black">Platform Reputation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               <div className="space-y-4">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Reliability Score</p>
                  <div className="flex items-end gap-3">
                     <p className="text-5xl font-black">98%</p>
                     <p className="text-green-500 font-bold text-sm mb-2 flex items-center gap-1"><Sparkles className="w-4 h-4" /> Top 5%</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Prompt Payments</p>
                  <div className="flex items-end gap-3">
                     <p className="text-5xl font-black">100%</p>
                     <p className="text-primary font-bold text-sm mb-2">Excellent</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Milestone Progress</p>
                  <div className="space-y-2">
                     <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-3/4 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                     </div>
                     <p className="text-[10px] font-bold text-gray-400">5/10 Tasks for "Master Delegator"</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
