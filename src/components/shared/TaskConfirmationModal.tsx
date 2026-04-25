"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { CheckCircle2, Loader2, ShieldCheck, Image as ImageIcon, AlertCircle, DollarSign, User, ExternalLink } from "lucide-react";
import { getAssignmentById, confirmAssignment } from "@/src/services/assignments";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export function TaskConfirmationModal({ 
  taskId, 
  assignment,
  isOpen, 
  onClose,
  onSuccess
}: { 
  taskId: string, 
  assignment: any,
  isOpen: boolean, 
  onClose: () => void,
  onSuccess: () => void
}) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    if (!assignment?.id) {
      toast.error("Assignment information is missing.");
      return;
    }

    setConfirming(true);
    try {
      // Since we modified the backend to allow posters to confirm without OTP, 
      // we can pass null/empty for otp
      const res = await confirmAssignment(assignment.id, "");
      if (res?.success) {
        toast.success("Task confirmed and payment released!");
        onSuccess();
        onClose();
      } else {
        toast.error(res?.message || "Failed to confirm task.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setConfirming(false);
    }
  };

  if (!assignment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-zinc-900 border-none rounded-[3rem] p-0 overflow-hidden shadow-2xl">
        <div className="relative h-32 bg-primary flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)]" />
            <DialogHeader>
                <DialogTitle className="text-3xl font-black text-white flex items-center gap-3">
                    <ShieldCheck className="w-10 h-10" />
                    Review & Confirm
                </DialogTitle>
            </DialogHeader>
        </div>

        <div className="p-8 space-y-8">
            {/* Task & Runner Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Payment Amount</span>
                    </div>
                    <p className="text-4xl font-black text-black dark:text-white">৳{assignment.task?.offerPrice || "N/A"}</p>
                    <p className="text-xs text-muted-foreground font-medium italic">Funds will be moved from your wallet to the runner.</p>
                </div>
                <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-500">
                        <User className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Task Runner</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                            {assignment.runner?.name?.charAt(0) || "R"}
                        </div>
                        <span className="font-bold text-lg text-black dark:text-white">{assignment.runner?.name || "Runner"}</span>
                    </div>
                </div>
            </div>

            {/* Proof of Work */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-black text-black dark:text-white uppercase tracking-tighter">Proof of Completion</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {assignment.proofUrls && assignment.proofUrls.length > 0 ? (
                        assignment.proofUrls.map((url: string, idx: number) => (
                            <motion.div 
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/10 group shadow-md"
                            >
                                <img src={url} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" />
                                <a 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                >
                                    <ExternalLink className="text-white w-6 h-6" />
                                </a>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-10 rounded-2xl border-2 border-dashed border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                            <p className="font-bold">No visual proof provided</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Disclaimer & Action */}
            <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-6">
                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        By clicking confirm, you agree that the task has been completed to your satisfaction. <span className="font-bold text-black dark:text-white underline">This action will immediately release ৳{assignment.task?.offerPrice || "N/A"} to the runner</span> and cannot be reversed.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button 
                        onClick={onClose}
                        variant="ghost"
                        className="h-16 flex-1 rounded-2xl font-bold text-gray-500 hover:bg-gray-50"
                    >
                        Not Yet
                    </Button>
                    <Button 
                        onClick={handleConfirm}
                        disabled={confirming}
                        className="h-16 flex-[2] rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl shadow-xl shadow-emerald-500/20 transition-all flex gap-3"
                    >
                        {confirming ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-7 h-7" />
                        )}
                        {confirming ? "Processing Payment..." : "Confirm & Pay"}
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
