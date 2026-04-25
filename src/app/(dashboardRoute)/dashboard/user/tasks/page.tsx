"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search, Filter, Eye, Trash2, Clock, CheckCircle2, AlertCircle, Loader2, XCircle, Pencil, CreditCard } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getMyTasks, updateTaskStatus, deleteTask } from "@/src/services/tasks";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { TaskPaymentModal } from "@/src/components/shared/TaskPaymentModal";
import { TaskConfirmationModal } from "@/src/components/shared/TaskConfirmationModal";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Payment Modal State (for initial funding if needed)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Confirmation Modal State (for releasing payment)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getMyTasks();
      if (res?.success && res.data) {
        setTasks(res.data);
      }
    } catch (error) {
      console.error("Error fetching my tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPayment = (task: any) => {
    setSelectedTask(task);
    setIsPaymentModalOpen(true);
  };

  const handleOpenConfirmation = (task: any) => {
    setSelectedTask(task);
    setIsConfirmModalOpen(true);
  };

  const handleCancelTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to cancel this task? This action cannot be undone.")) {
      return;
    }
    
    setActionLoading(taskId);
    try {
      const res = await updateTaskStatus(taskId, "CANCELLED", "User cancelled the task");
      if (res?.success) {
        toast.success("Task cancelled successfully.");
        await fetchTasks();
      } else {
        toast.error(res?.message || "Failed to cancel task.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to permanently delete this task? This action cannot be undone.")) {
      return;
    }
    
    setActionLoading(taskId);
    try {
      const res = await deleteTask(taskId);
      if (res?.success) {
        toast.success("Task deleted successfully.");
        await fetchTasks();
      } else {
        toast.error(res?.message || "Failed to delete task.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "bg-blue-100 text-blue-600";
      case "ASSIGNED": return "bg-purple-100 text-purple-600";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-600";
      case "COMPLETED": return "bg-green-100 text-green-600";
      case "CONFIRMED": return "bg-emerald-100 text-emerald-600";
      case "CANCELLED": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const filteredTasks = tasks.filter(task => 
    searchQuery === "" || 
    task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />

      {/* Payment Modal Integration */}
      {selectedTask && (
        <TaskPaymentModal
          taskId={selectedTask.id}
          amount={Number(selectedTask.offerPrice) || 0}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={fetchTasks}
        />
      )}

      {/* Confirmation Modal (for releasing payment) */}
      {selectedTask && (
        <TaskConfirmationModal
          taskId={selectedTask.id}
          assignment={selectedTask.assignment}
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onSuccess={fetchTasks}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">My Tasks</h1>
          <p className="text-muted-foreground text-lg">Track and manage all your posted tasks.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input 
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-64 pl-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none focus:border-primary transition-colors font-medium"
            />
          </div>
          <Button onClick={fetchTasks} variant="outline" className="h-12 px-6 rounded-xl border-gray-200 dark:border-white/10 font-bold flex gap-2">
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Task Details</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Runner</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredTasks.map((task, index) => {
                const isActionLoading = actionLoading === task.id;
                const runner = task.assignment?.runner;
                
                return (
                  <motion.tr 
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-6 max-w-[200px]">
                      <p className="font-bold text-black dark:text-white text-lg truncate">{task.title}</p>
                      <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" /> 
                        {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${getStatusColor(task.status)}`}>
                        {task.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-6">
                      {runner ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs overflow-hidden">
                            {runner.avatarUrl ? (
                              <img src={runner.avatarUrl} alt={runner.name} className="w-full h-full object-cover" />
                            ) : (
                              runner.name?.charAt(0) || "R"
                            )}
                          </div>
                          <span className="font-bold text-sm truncate max-w-[120px]">{runner.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-sm">
                          {task.status === "CANCELLED" ? "-" : "Searching..."}
                        </span>
                      )}
                    </td>
                    <td className="p-6">
                      <span className="font-black text-lg text-black dark:text-white">
                        ৳{task.offerPrice || "N/A"}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors" title="View Details">
                            <Eye className="w-5 h-5" />
                         </button>
                         {task.status === "COMPLETED" && (
                           <button 
                             onClick={() => handleOpenConfirmation(task)}
                             className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                             title="Review & Confirm"
                           >
                              <CheckCircle2 className="w-4 h-4" />
                              Review & Confirm
                           </button>
                         )}
                         {task.status === "OPEN" && (
                           <Link href={`/dashboard/user/tasks/${task.id}/edit`}>
                             <button className="p-2 hover:bg-amber-50 text-amber-500 rounded-lg transition-colors" title="Edit Task">
                                <Pencil className="w-5 h-5" />
                             </button>
                           </Link>
                         )}
                         {(task.status === "OPEN" || task.status === "ASSIGNED") && (
                           <button 
                             onClick={() => handleCancelTask(task.id)}
                             disabled={isActionLoading}
                             className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors disabled:opacity-50"
                             title="Cancel Task"
                           >
                             {isActionLoading ? (
                               <Loader2 className="w-5 h-5 animate-spin" />
                             ) : (
                               <XCircle className="w-5 h-5" />
                             )}
                           </button>
                         )}
                         {(task.status === "OPEN" || task.status === "CANCELLED") && (
                           <button 
                             onClick={() => handleDeleteTask(task.id)}
                             disabled={isActionLoading}
                             className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                             title="Delete Task"
                           >
                             <Trash2 className="w-5 h-5" />
                           </button>
                         )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredTasks.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10 text-gray-400" />
             </div>
             <p className="text-gray-400 font-bold">No tasks found.</p>
             {searchQuery === "" && (
               <Link href="/dashboard/user/post-task">
                 <Button className="mt-4 bg-primary text-white font-bold rounded-xl">
                   Post a Task Now
                 </Button>
               </Link>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
