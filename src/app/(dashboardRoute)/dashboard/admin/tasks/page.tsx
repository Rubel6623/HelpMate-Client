"use client";

import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, DollarSign, Clock, AlertCircle, Trash2, Eye, X, User, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState, Suspense } from "react";
import { getTasks, deleteTask } from "@/src/services/tasks";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

function AdminTasksContent() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const searchParams = useSearchParams();
  const taskIdParam = searchParams.get("id");

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (taskIdParam && tasks.length > 0) {
      const task = tasks.find(t => t.id === taskIdParam);
      if (task) setSelectedTask(task);
    }
  }, [taskIdParam, tasks]);

  const fetchTasks = async () => {
    setLoading(true);
    const res = await getTasks();
    if (res.success) {
      setTasks(res.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const res = await deleteTask(id);
    if (res.success) {
      toast.success("Task deleted successfully");
      fetchTasks();
    } else {
      toast.error(res.message || "Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">Global Tasks Monitor</h1>
          <p className="text-muted-foreground text-lg">Monitor all active and completed tasks across the platform.</p>
        </div>
        <div className="flex gap-4">
           <Link href="/dashboard/admin/disputes">
            <Button variant="outline" className="h-12 rounded-xl font-bold border-red-500/20 text-red-500 hover:bg-red-50">
                Manage Disputes
            </Button>
           </Link>
           <div className="relative">
             <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
             <input 
               placeholder="Search by ID or title..."
               className="h-12 w-64 pl-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none focus:border-primary transition-colors font-medium shadow-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredTasks.map((task, i) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-[2rem] bg-white dark:bg-white/5 border shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between gap-6 group ${
              selectedTask?.id === task.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100 dark:border-white/5'
            }`}
          >
             <div className="flex items-center gap-6 flex-1">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl ${
                  task.status === "OPEN" ? "bg-yellow-100 text-yellow-600" : 
                  task.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                }`}>
                   {task.title.charAt(0)}
                </div>
                <div className="space-y-1">
                   <h3 className="text-xl font-bold text-black dark:text-white">{task.title}</h3>
                   <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {task.user?.name}</span>
                      <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {task.assignment?.runner?.name || "Unassigned"}</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-12">
                <div className="text-center">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                     task.status === "OPEN" ? "bg-yellow-500/10 text-yellow-600" : 
                     task.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-600" : "bg-green-500/10 text-green-600"
                   }`}>
                      {task.status}
                   </span>
                </div>
                <div className="text-right min-w-[100px]">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Budget</p>
                   <p className="text-2xl font-black text-black dark:text-white">৳{task.offerPrice}</p>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => setSelectedTask(task)}
                    className="p-3 hover:bg-primary/10 text-primary rounded-2xl transition-colors"
                   >
                      <Eye className="w-5 h-5" />
                   </button>
                   <button 
                    onClick={() => handleDelete(task.id)}
                    className="p-3 hover:bg-red-50 text-red-500 rounded-2xl transition-colors"
                   >
                      <Trash2 className="w-5 h-5" />
                   </button>
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Task Details Sidebar/Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div 
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-white dark:bg-zinc-900 shadow-2xl z-[100] border-l border-gray-200 dark:border-white/10 p-10 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-black dark:text-white">Task Details</h2>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl text-gray-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="px-4 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                       {selectedTask.status}
                    </span>
                    <span className="text-gray-400 text-sm font-bold">
                       ID: {selectedTask.id}
                    </span>
                 </div>
                 <h3 className="text-4xl font-black text-black dark:text-white">{selectedTask.title}</h3>
                 <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                   {selectedTask.description}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <DollarSign className="w-3 h-3 text-green-500" /> Offer Price
                    </p>
                    <p className="text-2xl font-black text-black dark:text-white">৳{selectedTask.offerPrice}</p>
                 </div>
                 <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Clock className="w-3 h-3 text-blue-500" /> Duration
                    </p>
                    <p className="text-2xl font-black text-black dark:text-white">{selectedTask.estimatedDuration} Min</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-lg font-black text-black dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> Stops & Locations
                 </h4>
                 <div className="space-y-3">
                    {selectedTask.stops?.map((stop: any, idx: number) => (
                      <div key={stop.id} className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-black dark:text-white">{stop.locationLabel}</p>
                          <p className="text-xs text-gray-400">{stop.address}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="pt-8 border-t border-gray-100 dark:border-white/5">
                 <h4 className="text-lg font-black text-black dark:text-white mb-4">Stakeholders</h4>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Posted By</p>
                       <p className="font-bold text-black dark:text-white">{selectedTask.user?.name}</p>
                       <p className="text-sm text-gray-400">{selectedTask.user?.phone}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned To</p>
                       <p className="font-bold text-black dark:text-white">{selectedTask.assignment?.runner?.name || "None"}</p>
                       <p className="text-sm text-gray-400">{selectedTask.assignment?.runner?.phone || "N/A"}</p>
                    </div>
                 </div>
              </div>

              {selectedTask.specialNotes && (
                <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 text-amber-600">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                      <AlertCircle className="w-3 h-3" /> Special Notes
                   </p>
                   <p className="text-sm font-medium italic">"{selectedTask.specialNotes}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminTasksPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>}>
      <AdminTasksContent />
    </Suspense>
  );
}
