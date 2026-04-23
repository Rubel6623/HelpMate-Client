"use client";

import { motion } from "motion/react";
import { Wallet, TrendingUp, Calendar, ArrowDownCircle, Banknote, Landmark } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function EarningsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">My Earnings</h1>
          <p className="text-muted-foreground text-lg">Track your income and withdraw your earnings.</p>
        </div>
        <Button className="h-14 px-8 rounded-2xl bg-black dark:bg-white dark:text-black text-lg font-black shadow-xl flex gap-3">
          <Banknote className="w-6 h-6" />
          Withdraw Funds
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: "Total Earnings", value: "৳15,400", icon: Wallet, color: "text-blue-500", bg: "bg-blue-50" },
           { label: "This Month", value: "৳4,200", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
           { label: "Pending Payout", value: "৳850", icon: Calendar, color: "text-orange-500", bg: "bg-orange-50" },
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-xl transition-all"
           >
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} dark:bg-white/10 flex items-center justify-center ${stat.color} mb-6 group-hover:scale-110 transition-transform`}>
                 <stat.icon className="w-7 h-7" />
              </div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black text-black dark:text-white tracking-tighter">{stat.value}</h3>
           </motion.div>
         ))}
      </div>

      <div className="p-8 rounded-[2rem] bg-zinc-900 text-white shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 text-center md:text-left">
               <h3 className="text-3xl font-black">Ready for Payout?</h3>
               <p className="text-gray-400 max-w-md">Withdraw your earnings directly to your bKash, Nagad or Bank account. Minimum withdrawal is ৳500.</p>
            </div>
            <div className="flex gap-4">
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                  <Landmark className="w-8 h-8 mx-auto text-primary" />
                  <p className="font-bold">Bank Transfer</p>
               </div>
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                  <ArrowDownCircle className="w-8 h-8 mx-auto text-pink-500" />
                  <p className="font-bold">Mobile Wallet</p>
               </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
