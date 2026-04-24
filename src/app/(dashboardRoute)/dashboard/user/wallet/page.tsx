"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, History, CreditCard } from "lucide-react";
import { getMyWallet } from "@/src/services/wallets";
import { TopUpDialog } from "./_components/TopUpDialog";

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchWallet = async () => {
    const res = await getMyWallet();
    if (res?.success && res.data) {
      setWallet(res.data);
      setTransactions(res.data.transactions || []);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">My Wallet</h1>
          <p className="text-muted-foreground text-lg">Manage your funds and track your spending.</p>
        </div>
        <TopUpDialog onTopUpSuccess={fetchWallet} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary via-purple-600 to-indigo-800 text-white shadow-2xl relative overflow-hidden group h-full flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-8">
              <CreditCard className="w-12 h-12 text-white/20" />
            </div>
            <div className="relative z-10">
               <p className="text-white/60 font-bold text-sm uppercase tracking-widest mb-2">Available Balance</p>
               <h3 className="text-6xl font-black mb-2 tracking-tighter">৳{wallet ? Number(wallet.balance).toLocaleString() : 0}</h3>
               <p className="text-white/40 text-sm font-medium">Last updated: Just now</p>
            </div>
            <div className="mt-12 space-y-4 relative z-10">
               <div className="flex justify-between items-center py-4 border-t border-white/10">
                  <span className="text-white/60 font-bold">In Escrow</span>
                  <span className="text-xl font-bold">৳500</span>
               </div>
               <div className="flex justify-between items-center py-4 border-t border-white/10">
                  <span className="text-white/60 font-bold">Total Spent</span>
                  <span className="text-xl font-bold">৳8,400</span>
               </div>
            </div>
            {/* Animated decoration */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
          </motion.div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-bold text-black dark:text-white flex items-center gap-3">
              <History className="w-6 h-6 text-primary" />
              Recent Transactions
            </h3>
            <button className="text-primary font-bold hover:underline">See Statement</button>
          </div>
          
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <motion.div 
                key={tx.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    tx.type === "CREDIT" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {tx.type === "CREDIT" ? <ArrowDownLeft className="w-7 h-7" /> : <ArrowUpRight className="w-7 h-7" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-black dark:text-white text-lg">{tx.reason || tx.note || "Transaction"}</h4>
                    <p className="text-sm text-gray-400 mt-0.5">{new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${
                    tx.type === "CREDIT" ? "text-green-500" : "text-black dark:text-white"
                  }`}>
                    {tx.type === "CREDIT" ? "+" : "-"}{tx.amount}
                  </p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{tx.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
