"use client";

import { motion } from "motion/react";
import { MapPin, Clock, Phone, MessageSquare, CheckCircle2, Navigation } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function RunnerJobsPage() {
  const activeJobs = [
    { 
      id: "1", 
      title: "Grocery Pickup", 
      customer: "John Doe", 
      location: "Gulshan 1", 
      price: "৳250", 
      timeLeft: "45 mins",
      status: "In Progress"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">My Active Jobs</h1>
        <p className="text-muted-foreground text-lg">Manage your ongoing tasks and communicate with customers.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeJobs.map((job) => (
          <motion.div 
            key={job.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl bg-white dark:bg-white/5 border-2 border-primary/20 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <span className="px-4 py-1.5 bg-primary text-white text-xs font-black rounded-full uppercase tracking-widest">
                        {job.status}
                     </span>
                     <span className="text-gray-400 font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {job.timeLeft} remaining
                     </span>
                  </div>
                  <h2 className="text-4xl font-black text-black dark:text-white">{job.title}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                           <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</p>
                           <p className="font-bold text-black dark:text-white">{job.location}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                           <Navigation className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</p>
                           <p className="font-bold text-black dark:text-white">{job.customer}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col justify-between items-end gap-6 lg:min-w-[250px]">
                  <div className="text-right">
                     <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-1">Earning</p>
                     <p className="text-5xl font-black text-primary">{job.price}</p>
                  </div>
                  <div className="flex flex-col w-full gap-3">
                     <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 h-12 rounded-xl border-gray-200 dark:border-white/10 font-bold flex gap-2">
                           <Phone className="w-4 h-4" /> Call
                        </Button>
                        <Button variant="outline" className="flex-1 h-12 rounded-xl border-gray-200 dark:border-white/10 font-bold flex gap-2">
                           <MessageSquare className="w-4 h-4" /> Chat
                        </Button>
                     </div>
                     <Button className="w-full h-14 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black text-lg shadow-xl shadow-green-500/20 flex gap-3">
                        <CheckCircle2 className="w-6 h-6" />
                        Mark as Completed
                     </Button>
                  </div>
               </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          </motion.div>
        ))}

        {activeJobs.length === 0 && (
           <div className="p-20 text-center rounded-3xl border-4 border-dashed border-gray-100 dark:border-white/5">
              <p className="text-2xl font-bold text-gray-400">No active jobs right now.</p>
              <Button variant="link" className="text-primary font-bold mt-4">Go to Task Feed</Button>
           </div>
        )}
      </div>
    </div>
  );
}
