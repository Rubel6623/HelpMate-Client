"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Wallet,
  TrendingUp,
  Calendar,
  ArrowDownCircle,
  Banknote,
  Landmark,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getMyWallet, withdrawFunds } from "@/src/services/wallets";
import { getMyAssignments } from "@/src/services/assignments";
import { getMe } from "@/src/services/auth";
import { createConnectAccount, createOnboardingLink } from "@/src/services/payment";
import { toast } from "sonner";

export default function EarningsPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [walletRes, assignmentsRes, meRes] = await Promise.all([
        getMyWallet(),
        getMyAssignments(),
        getMe(),
      ]);

      if (walletRes?.success && walletRes.data) {
        setWallet(walletRes.data);
        setTransactions(walletRes.data.transactions || []);
      }

      if (assignmentsRes?.success && assignmentsRes.data) {
        setAssignments(assignmentsRes.data);
      }

      if (meRes?.success) {
        setUser(meRes.data);
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupPayouts = async () => {
    setIsOnboarding(true);
    try {
      const accountRes = await createConnectAccount();
      if (accountRes.success && accountRes.data?.accountId) {
        const linkRes = await createOnboardingLink(accountRes.data.accountId);
        if (linkRes.success && linkRes.data?.url) {
          window.location.href = linkRes.data.url;
        } else {
          toast.error(linkRes.message || "Failed to create onboarding link");
        }
      } else {
        toast.error(accountRes.message || "Failed to create payout account");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong during onboarding");
    } finally {
      setIsOnboarding(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg("Please enter a valid amount.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    if (amount < 500) {
      setErrorMsg("Minimum withdrawal amount is ৳500.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }
    if (wallet && amount > Number(wallet.balance)) {
      setErrorMsg("Insufficient balance.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    setWithdrawing(true);
    try {
      const res = await withdrawFunds(amount);
      if (res?.success) {
        setSuccessMsg(`৳${amount} withdrawn successfully!`);
        setShowWithdrawModal(false);
        setWithdrawAmount("");
        await fetchData();
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res?.message || "Withdrawal failed.");
        setTimeout(() => setErrorMsg(""), 4000);
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
      setTimeout(() => setErrorMsg(""), 4000);
    } finally {
      setWithdrawing(false);
    }
  };

  // Calculate stats from wallet transactions (most accurate source)
  const totalBalance = wallet ? Number(wallet.balance) : 0;
  const completedJobs = assignments.filter((a: any) => a.confirmedAt);
  const totalEarned = completedJobs.reduce((sum: number, a: any) => {
    return sum + Number(a.task?.offerPrice || 0);
  }, 0);
  const pendingJobs = assignments.filter((a: any) => a.completedAt && !a.confirmedAt);
  const pendingEarnings = pendingJobs.reduce((sum: number, a: any) => {
    return sum + Number(a.task?.offerPrice || 0);
  }, 0);

  const isStripeConnected = !!user?.runnerProfile?.stripeAccountId;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toasts */}
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-semibold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" /> {successMsg}
        </motion.div>
      )}
      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5" /> {errorMsg}
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">My Earnings</h1>
          <p className="text-muted-foreground text-lg">Track your income and withdraw your earnings.</p>
        </div>
        <div className="flex gap-4">
          {!isStripeConnected ? (
            <Button
              onClick={handleSetupPayouts}
              disabled={isOnboarding}
              className="h-14 px-8 rounded-2xl bg-primary text-white font-black shadow-xl flex gap-3"
            >
              {isOnboarding ? <Loader2 className="w-6 h-6 animate-spin" /> : <Landmark className="w-6 h-6" />}
              Setup Payouts
            </Button>
          ) : (
             <Button
                onClick={() => setShowWithdrawModal(true)}
                className="h-14 px-8 rounded-2xl bg-black dark:bg-white dark:text-black text-lg font-black shadow-xl flex gap-3"
              >
                <Banknote className="w-6 h-6" />
                Withdraw Funds
              </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Wallet Balance", value: `৳${totalBalance.toLocaleString()}`, icon: Wallet, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Total Earned", value: `৳${totalEarned.toLocaleString()}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
          { label: "Pending Payout", value: `৳${pendingEarnings.toLocaleString()}`, icon: Calendar, color: "text-orange-500", bg: "bg-orange-50" },
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

      {/* Transaction History */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-black dark:text-white px-2">
          Recent Transactions
        </h3>

        {transactions.length === 0 ? (
          <div className="p-16 text-center rounded-3xl border-4 border-dashed border-gray-100 dark:border-white/5">
            <p className="text-xl font-bold text-gray-400 mb-2">No transactions yet</p>
            <p className="text-muted-foreground">Your earnings and withdrawal history will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx: any, i: number) => (
              <motion.div
                key={tx.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tx.type === "CREDIT"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}>
                    {tx.type === "CREDIT" ? (
                      <ArrowDownLeft className="w-6 h-6" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-black dark:text-white">
                      {tx.reason?.replace(/_/g, " ") || tx.note || "Transaction"}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(tx.createdAt).toLocaleDateString()} • {tx.status}
                    </p>
                  </div>
                </div>
                <p className={`text-2xl font-black ${
                  tx.type === "CREDIT" ? "text-green-500" : "text-red-500"
                }`}>
                  {tx.type === "CREDIT" ? "+" : "-"}৳{Number(tx.amount).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawal Info Card */}
      <div className="p-8 rounded-[2rem] bg-zinc-900 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-3xl font-black">Ready for Payout?</h3>
            <p className="text-gray-400 max-w-md">
              Withdraw your earnings directly to your bKash, Nagad, or Bank account. Minimum withdrawal is ৳500.
            </p>
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

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 shadow-2xl"
          >
            <h3 className="text-2xl font-black text-black dark:text-white mb-2">Withdraw Funds</h3>
            <p className="text-muted-foreground mb-6">
              Available balance: <span className="text-primary font-bold">৳{totalBalance.toLocaleString()}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Amount (৳)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Minimum ৳500"
                  min={500}
                  className="w-full h-14 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 text-lg font-bold focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => { setShowWithdrawModal(false); setWithdrawAmount(""); }}
                  className="flex-1 h-12 rounded-xl font-bold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                  className="flex-1 h-12 rounded-xl bg-primary font-bold"
                >
                  {withdrawing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                    </span>
                  ) : (
                    "Withdraw"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
