"use client";

import { motion } from "motion/react";
import { Search, MapPin, DollarSign, Clock, AlertCircle, Trash2, Eye } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function AdminTasksPage() {
  const tasks = [
    { id: "1", title: "Grocery Pickup", customer: "John Doe", runner: "Ariful I.", status: "IN_PROGRESS", price: "৳250" },
    { id: "2", title: "Passport Queue", customer: "Sarah K.", runner: null, status: "OPEN", price: "৳500" },
    { id: "3", title: "Home Cleaning", customer: "Mike R.", runner: "Sayed H.", status: "COMPLETED", price: "৳1500" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">Global Tasks Monitor</h1>
          <p className="text-muted-foreground text-lg">Monitor all active and completed tasks across the platform.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-12 rounded-xl font-bold border-red-500/20 text-red-500 hover:bg-red-50">
              Active Disputes (4)
           </Button>
           <div className="relative">
             <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
             <input 
               placeholder="Search by ID or title..."
               className="h-12 w-64 pl-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none focus:border-primary transition-colors font-medium shadow-sm"
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tasks.map((task, i) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between gap-6 group"
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
                      <span className="flex items-center gap-1"><span className="font-bold text-gray-600 dark:text-gray-300">User:</span> {task.customer}</span>
                      <span className="flex items-center gap-1"><span className="font-bold text-gray-600 dark:text-gray-300">Runner:</span> {task.runner || "Unassigned"}</span>
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
                   <p className="text-2xl font-black text-black dark:text-white">{task.price}</p>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 hover:bg-primary/10 text-primary rounded-2xl transition-colors">
                      <Eye className="w-5 h-5" />
                   </button>
                   <button className="p-3 hover:bg-red-50 text-red-500 rounded-2xl transition-colors">
                      <Trash2 className="w-5 h-5" />
                   </button>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
