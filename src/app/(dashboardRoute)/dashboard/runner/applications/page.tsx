"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowRight,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getMyApplications } from "@/src/services/task-applications";
import Link from "next/link";
import { toast } from "sonner";

export default function RunnerApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMyApplications();
      if (res?.success) {
        setApplications(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    
    setLoading(true);
    try {
      const { updateApplicationStatus } = await import("@/src/services/task-applications");
      const res = await updateApplicationStatus(applicationId, "WITHDRAWN");
      if (res?.success) {
        toast.success("Application withdrawn successfully");
        fetchData();
      } else {
        toast.error(res?.message || "Failed to withdraw application");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "bg-emerald-500 text-white";
      case "REJECTED": return "bg-red-500 text-white";
      case "WITHDRAWN": return "bg-gray-500 text-white";
      default: return "bg-amber-500 text-white";
    }
  };

  const filteredApps = filter === "ALL" 
    ? applications 
    : applications.filter(app => app.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-black dark:text-white tracking-tight">My Applications</h1>
          <p className="text-muted-foreground text-lg font-medium opacity-80">Track and manage your task applications.</p>
        </div>
        
        <div className="flex items-center gap-4 p-2 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
           {["ALL", "PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                 filter === f 
                   ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                   : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
               }`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredApps.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-white/5">
            <Package className="w-20 h-20 text-gray-200 mx-auto mb-8" />
            <h3 className="text-3xl font-black text-gray-400 mb-3 tracking-tight">No Applications Found</h3>
            <p className="text-muted-foreground mb-10 font-medium">You haven't made any applications in this category yet.</p>
            <Link href="/dashboard/runner">
              <Button className="rounded-[1.5rem] font-black bg-primary px-12 h-16 shadow-xl shadow-primary/20 hover:scale-105 transition-all text-xs uppercase tracking-widest">Explore Available Tasks</Button>
            </Link>
          </div>
        ) : (
          filteredApps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all group"
            >
              <div className="flex flex-col md:flex-row justify-between gap-10">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-4 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-black text-black dark:text-white group-hover:text-primary transition-colors tracking-tight">
                    {app.task.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-8 text-sm text-muted-foreground font-bold">
                    <span className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-primary" /> {app.task.location}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-primary" /> {app.task.category?.name || "General"}
                    </span>
                  </div>
                </div>

                <div className="md:w-56 flex flex-col justify-between items-end gap-10 border-l border-gray-50 dark:border-white/5 pl-10">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">Offer Amount</p>
                      <p className="text-4xl font-black text-black dark:text-white tracking-tighter">৳{app.task.offerPrice}</p>
                   </div>
                   
                   {app.status === "ACCEPTED" ? (
                     <Link href="/dashboard/runner/my-tasks" className="w-full">
                       <Button className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                         Go to Job <ArrowRight className="w-4 h-4" />
                       </Button>
                     </Link>
                   ) : app.status === "PENDING" ? (
                     <Button 
                       onClick={() => handleWithdraw(app.id)}
                       variant="outline" 
                       className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-500 border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/5 hover:text-red-600 active:scale-95 transition-all"
                     >
                        Withdraw
                     </Button>
                   ) : null}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
