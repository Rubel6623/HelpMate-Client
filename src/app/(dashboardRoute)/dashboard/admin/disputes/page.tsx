"use client";

import { motion } from "motion/react";
import { AlertTriangle, Scale, CheckCircle2, XCircle, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { getDisputes, resolveDispute } from "@/src/services/disputes";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    setLoading(true);
    const res = await getDisputes();
    if (res.success) {
      setDisputes(res.data);
    }
    setLoading(false);
  };

  const handleResolve = async (id: string, status: string) => {
    const res = await resolveDispute(id, { 
      status, 
      adminNotes: "Resolved by Admin" 
    });
    if (res.success) {
      toast.success(`Dispute ${status.replace(/_/g, ' ')} successfully`);
      fetchDisputes();
    } else {
      toast.error(res.message || "Failed to resolve dispute");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">Dispute Resolution Center</h1>
          <p className="text-muted-foreground text-lg">Review and resolve conflicts between users and runners.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
           <AlertTriangle className="w-6 h-6 animate-pulse" />
           <span className="font-black text-lg">{disputes.filter(d => d.status === 'OPEN').length} Active Cases</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {disputes.map((dispute, i) => (
          <motion.div 
            key={dispute.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl space-y-8"
          >
             <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        dispute.status === "OPEN" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                      }`}>
                         {dispute.status}
                      </span>
                      <span className="text-gray-400 font-bold text-sm">
                        {new Date(dispute.createdAt).toLocaleString()}
                      </span>
                   </div>
                   <h2 className="text-3xl font-black text-black dark:text-white flex items-center gap-3">
                      <Scale className="w-8 h-8 text-primary" />
                      Dispute on: {dispute.task?.title}
                   </h2>
                </div>
                <div className="flex gap-4">
                   <Button variant="outline" className="h-12 rounded-xl font-bold flex gap-2">
                      <MessageSquare className="w-4 h-4" /> View Chat Log
                   </Button>
                   <Link href={`/dashboard/admin/tasks?id=${dispute.taskId}`}>
                    <Button variant="outline" className="h-12 rounded-xl font-bold flex gap-2">
                        <ExternalLink className="w-4 h-4" /> Task Details
                    </Button>
                   </Link>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-3xl bg-gray-50 dark:bg-white/5">
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Raised By</p>
                   <p className="text-xl font-bold text-black dark:text-white">{dispute.raisedBy?.name}</p>
                   <p className="text-sm text-gray-400">{dispute.raisedBy?.email}</p>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Task ID</p>
                   <p className="text-xl font-bold text-black dark:text-white">{dispute.taskId}</p>
                </div>
                <div className="md:col-span-2 space-y-2">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason / Evidence</p>
                   <p className="text-lg font-medium text-gray-600 dark:text-gray-300 italic">"{dispute.reason}"</p>
                   {dispute.evidence?.length > 0 && (
                     <div className="flex gap-2 mt-4">
                        {dispute.evidence.map((img: string, idx: number) => (
                          <img key={idx} src={img} alt="Evidence" className="w-24 h-24 object-cover rounded-xl border" />
                        ))}
                     </div>
                   )}
                </div>
             </div>

             {dispute.status === 'OPEN' && (
               <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <Button 
                    onClick={() => handleResolve(dispute.id, "RESOLVED_USER_FAVOUR")}
                    className="flex-1 h-14 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black shadow-xl shadow-green-500/20 flex gap-3"
                  >
                     <CheckCircle2 className="w-6 h-6" />
                     Resolve for User
                  </Button>
                  <Button 
                    onClick={() => handleResolve(dispute.id, "RESOLVED_RUNNER_FAVOUR")}
                    className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 flex gap-3"
                  >
                     <CheckCircle2 className="w-6 h-6" />
                     Resolve for Runner
                  </Button>
                  <Button 
                    onClick={() => handleResolve(dispute.id, "CLOSED")}
                    className="flex-1 h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black shadow-xl shadow-red-500/20 flex gap-3"
                  >
                     <XCircle className="w-6 h-6" />
                     Dismiss Case
                  </Button>
               </div>
             )}

             {dispute.status !== 'OPEN' && (
               <div className="p-4 rounded-2xl bg-gray-100 dark:bg-white/10 text-center font-bold text-gray-500">
                  Case {dispute.status} at {new Date(dispute.resolvedAt).toLocaleString()}
               </div>
             )}
          </motion.div>
        ))}

        {disputes.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Scale className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold">No disputes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
