"use client";

import { motion } from "motion/react";
import { Search, Filter, MoreVertical, Eye, Trash2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function MyTasksPage() {
  const tasks = [
    { id: "1", title: "Grocery Shopping", status: "Active", runner: "Ariful I.", price: "৳250", date: "Today, 4:00 PM" },
    { id: "2", title: "Document Delivery", status: "Completed", runner: "Sayed H.", price: "৳150", date: "Yesterday" },
    { id: "3", title: "Medicine Purchase", status: "Pending", runner: null, price: "৳100", date: "24 Apr, 10:00 AM" },
  ];

  return (
    <div className="space-y-8">
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
              className="h-12 w-64 pl-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none focus:border-primary transition-colors font-medium"
            />
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-200 dark:border-white/10 font-bold flex gap-2">
            <Filter className="w-5 h-5" />
            Filter
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
              {tasks.map((task, index) => (
                <motion.tr 
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <td className="p-6">
                    <p className="font-bold text-black dark:text-white text-lg">{task.title}</p>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.date}
                    </p>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${
                      task.status === "Active" ? "bg-blue-100 text-blue-600" : 
                      task.status === "Completed" ? "bg-green-100 text-green-600" : 
                      "bg-yellow-100 text-yellow-600"
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-6">
                    {task.runner ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {task.runner.charAt(0)}
                        </div>
                        <span className="font-bold text-sm">{task.runner}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">Searching...</span>
                    )}
                  </td>
                  <td className="p-6">
                    <span className="font-black text-lg text-black dark:text-white">{task.price}</span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                          <Eye className="w-5 h-5" />
                       </button>
                       <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {tasks.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10 text-gray-400" />
             </div>
             <p className="text-gray-400 font-bold">No tasks found. Try posting one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
