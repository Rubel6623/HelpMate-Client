"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Plus, CreditCard, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent, topUpWallet } from "@/src/services/payment";
import { toast } from "sonner";

// Initialize Stripe (use environment variable or a fallback for testing)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51TNuju2KMrtjiRDvh0UX76P5Vcz8hceBl7ih9fV9PuLsCHb9TAfWRO3XHQEXAZ9X3IEZWesePh6Ai1sCllXw8kcK00yChlNTL2");

function CheckoutForm({ amount, clientSecret, onSuccess }: { amount: number, clientSecret: string, onSuccess: () => void }) {
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
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Call top-up wallet API
        const res = await topUpWallet(amount, paymentIntent.id);
        if (res.success !== false) {
          toast.success("Wallet topped up successfully!");
          onSuccess();
        } else {
          toast.error(res.message || "Failed to update wallet balance.");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="min-h-[200px]">
        <PaymentElement onReady={() => setIsReady(true)} />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading || !stripe || !elements || !isReady} 
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="animate-spin w-5 h-5 mr-2" />
        ) : (
          <CreditCard className="w-5 h-5 mr-2" />
        )}
        {isReady ? `Pay ৳${amount}` : "Loading Payment Details..."}
      </Button>
    </form>
  );
}

export function TopUpDialog({ onTopUpSuccess }: { onTopUpSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number | "">("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleNext = async () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsInitializing(true);
    try {
      const res = await createPaymentIntent(Number(amount));
      if (res.success !== false && res.data?.client_secret) {
        setClientSecret(res.data.client_secret);
      } else {
        toast.error(res.message || "Failed to initialize payment");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment");
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    setAmount("");
    setClientSecret(null);
    if (onTopUpSuccess) {
      onTopUpSuccess();
    } else {
      window.location.reload();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setAmount("");
      setClientSecret(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-xl shadow-primary/20 flex gap-3">
          <Plus className="w-6 h-6" />
          Top Up Balance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-none rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Top Up Wallet</DialogTitle>
        </DialogHeader>

        {!clientSecret ? (
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount (BDT)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="h-14 rounded-xl text-lg px-4 border-gray-200 dark:border-zinc-800 focus-visible:ring-primary"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[500, 1000, 2000].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  onClick={() => setAmount(preset)}
                  className={`h-12 rounded-xl border-gray-200 dark:border-zinc-800 ${amount === preset ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                >
                  ৳{preset}
                </Button>
              ))}
            </div>

            <Button 
              onClick={handleNext} 
              disabled={isInitializing || !amount}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-xl"
            >
              {isInitializing ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
              Proceed to Pay
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <CheckoutForm amount={Number(amount)} clientSecret={clientSecret} onSuccess={handleSuccess} />
            </Elements>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
