"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { CreditCard, Loader2, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "@/src/services/wallets";
import { updateTaskStatus } from "@/src/services/tasks";
import { toast } from "sonner";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51TNuju2KMrtjiRDvh0UX76P5Vcz8hceBl7ih9fV9PuLsCHb9TAfWRO3XHQEXAZ9X3IEZWesePh6Ai1sCllXw8kcK00yChlNTL2");

function TaskCheckoutForm({ 
  amount, 
  taskId, 
  onSuccess 
}: { 
  amount: number, 
  taskId: string, 
  onSuccess: () => void 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !isReady) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "An unexpected error occurred.");
      } else if (paymentIntent && (
        paymentIntent.status === "succeeded" || 
        paymentIntent.status === "requires_capture" // manual capture mode
      )) {
        toast.success("Payment authorized! Assigning runner...");
        onSuccess();
      } else {
        toast.error("Payment was not completed. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
            <p className="font-black text-xl text-black dark:text-white">৳{amount}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Secure Escrow</p>
          <div className="flex gap-1 justify-end mt-1">
             <div className="w-6 h-4 bg-gray-200 dark:bg-white/10 rounded-sm" />
             <div className="w-6 h-4 bg-gray-200 dark:bg-white/10 rounded-sm" />
             <div className="w-6 h-4 bg-gray-200 dark:bg-white/10 rounded-sm" />
          </div>
        </div>
      </div>

      <div className="min-h-[200px] p-2">
        <PaymentElement onReady={() => setIsReady(true)} />
      </div>

      <Button 
        type="submit" 
        disabled={isLoading || !stripe || !elements || !isReady} 
        className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl transition-all shadow-xl shadow-primary/20 disabled:opacity-50 text-lg"
      >
        {isLoading ? (
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
        ) : (
          <CheckCircle2 className="w-6 h-6 mr-2" />
        )}
        {isReady ? `Confirm & Pay ৳${amount}` : "Initializing Secure Gateway..."}
      </Button>
      
      <p className="text-center text-xs text-gray-400 font-medium">
        Payments are processed securely by Stripe. Funds are held in escrow until you confirm the task.
      </p>
    </form>
  );
}

export function TaskPaymentModal({ 
  taskId, 
  amount, 
  isOpen, 
  onClose,
  onSuccess
}: { 
  taskId: string, 
  amount: number, 
  isOpen: boolean, 
  onClose: () => void,
  onSuccess: () => void
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize payment intent when modal opens
  const initializePayment = async () => {
    if (!taskId || !amount || amount <= 0) {
      setError("Invalid task data or missing payment amount. Please contact support.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await createPaymentIntent(amount, taskId);
      if (res?.success && res.data?.client_secret) {
        setClientSecret(res.data.client_secret);
      } else {
        const msg = res?.message || "Failed to initialize payment gateway";
        setError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err.message || "Connection error";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize payment intent when modal opens
  useEffect(() => {
    if (isOpen && !clientSecret && !isLoading && !error) {
      initializePayment();
    }
  }, [isOpen, clientSecret, isLoading, error, taskId, amount]);

  const handleClose = () => {
    setClientSecret(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-900 border-none rounded-[2.5rem] p-8 shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-3xl font-black text-black dark:text-white flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary" />
            Complete Payment
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-gray-400 font-bold animate-pulse">Setting up secure connection...</p>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
            <TaskCheckoutForm 
              amount={amount} 
              taskId={taskId} 
              onSuccess={() => {
                onSuccess();
                handleClose();
              }} 
            />
          </Elements>
        ) : (
          <div className="py-10 text-center">
             <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
             </div>
             <p className="text-red-500 font-bold mb-2">Initialization Failed</p>
             <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-[280px] mx-auto">
               {error || "Could not initialize payment. Please try again."}
             </p>
             <Button onClick={initializePayment} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl">
               Retry Initialization
             </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
