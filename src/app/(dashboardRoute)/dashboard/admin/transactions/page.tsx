"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CreditCard, ArrowUpRight, ArrowDownLeft, Search, Filter, Loader2, DollarSign, Wallet } from "lucide-react";
import { getAllTransactions } from "@/src/services/transactions";
import { toast, Toaster } from "sonner";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const fetchTransactions = async () => {
    try {
      const res = await getAllTransactions();
      if (res?.success) {
        setTransactions(res.data || []);
      } else {
        toast.error("Failed to fetch transactions");
      }
    } catch (error) {
      toast.error("An error occurred while fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.wallet?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalVolume = transactions.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalCredits = transactions.filter(t => t.type === "CREDIT").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalDebits = transactions.filter(t => t.type === "DEBIT").reduce((acc, curr) => acc + Number(curr.amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">Financial Ledger</h1>
          <p className="text-muted-foreground text-lg">Monitor all wallet transactions, payments, and payouts.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 text-center min-w-[150px]">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Total Volume</p>
              <p className="text-2xl font-black text-primary">৳{totalVolume.toFixed(2)}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><ArrowUpRight className="w-6 h-6" /></div>
              <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Total Credits</h3>
           </div>
           <p className="text-3xl font-black text-black dark:text-white">৳{totalCredits.toFixed(2)}</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><ArrowDownLeft className="w-6 h-6" /></div>
              <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Total Debits</h3>
           </div>
           <p className="text-3xl font-black text-black dark:text-white">৳{totalDebits.toFixed(2)}</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Wallet className="w-6 h-6" /></div>
              <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Platform Activity</h3>
           </div>
           <p className="text-3xl font-black text-black dark:text-white">{transactions.length} Txns</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input 
              placeholder="Search by user, reference, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full md:max-w-md pl-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {["ALL", "CREDIT", "DEBIT"].map((type) => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
                  filterType === type 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction Info</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredTransactions.map((t, i) => (
                <motion.tr 
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${t.type === 'CREDIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {t.type === 'CREDIT' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-black dark:text-white text-sm">ID: {t.id.substring(0, 8)}...</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(t.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="font-bold text-black dark:text-white">{t.wallet?.user?.name || "System"}</p>
                    <p className="text-xs text-gray-400">{t.wallet?.user?.email || "N/A"}</p>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-[10px] font-black uppercase tracking-wider text-gray-500">
                      {t.reason.replace(/_/g, ' ')}
                    </span>
                    {t.reference && <p className="text-[10px] text-gray-400 mt-1 font-mono">Ref: {t.reference}</p>}
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      t.status === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : 
                      t.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <p className={`text-xl font-black ${t.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'}`}>
                      {t.type === 'CREDIT' ? '+' : '-'}৳{Number(t.amount).toFixed(2)}
                    </p>
                  </td>
                </motion.tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-4 opacity-20" />
                    <p className="text-xl font-bold text-gray-400">No transactions found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
