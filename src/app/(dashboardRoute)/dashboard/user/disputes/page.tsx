"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Clock, CheckCircle2, XCircle, Search, Filter, Loader2, MessageSquare, ShieldCheck } from "lucide-react";
import { getMyDisputes } from "@/src/services/disputes";
import { toast } from "sonner";

export default function UserDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDisputes = async () => {
    try {
      const res = await getMyDisputes();
      if (res?.success) {
        setDisputes(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to load disputes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">My Disputes</h1>
          <p className="text-muted-foreground text-lg font-medium">Track and monitor the status of your reported issues.</p>
        </div>
        <div className="px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold flex items-center gap-2">
           <AlertTriangle className="w-5 h-5" />
           {disputes.filter(d => d.status === "PENDING").length} Open Cases
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {disputes.map((dispute, i) => (
          <motion.div 
            key={dispute.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
               <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                     <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                       dispute.status === "PENDING" ? "bg-amber-500 text-white" : 
                       dispute.status === "RESOLVED" ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                     }`}>
                       {dispute.status}
                     </span>
                     <span className="text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {new Date(dispute.createdAt).toLocaleString()}
                     </span>
                  </div>
                  <h3 className="text-2xl font-black text-black dark:text-white leading-tight">
                    Issue with task: <span className="text-primary">{dispute.task?.title}</span>
                  </h3>
                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 italic text-gray-600 dark:text-gray-400">
                     "{dispute.reason}"
                  </div>
               </div>

               <div className="flex flex-col gap-3 min-w-[200px]">
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-1">
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest">Against Runner</p>
                     <p className="font-bold text-black dark:text-white">{dispute.runner?.name}</p>
                  </div>
                  {dispute.status === "RESOLVED" && (
                    <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 space-y-1">
                       <p className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Resolution
                       </p>
                       <p className="text-sm font-bold text-green-700 dark:text-green-400">Fixed by Admin</p>
                    </div>
                  )}
               </div>
            </div>

            {dispute.adminNotes && (
              <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-3">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" /> Admin Feedback
                 </p>
                 <p className="text-sm font-medium text-gray-500 bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                    {dispute.adminNotes}
                 </p>
              </div>
            )}
          </motion.div>
        ))}

        {disputes.length === 0 && (
          <div className="py-20 text-center space-y-4 bg-gray-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-white/5">
             <div className="w-20 h-20 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
             </div>
             <div>
                <h3 className="text-2xl font-black text-black dark:text-white">All Clear</h3>
                <p className="text-gray-400 font-bold">You have no active or historical disputes.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
