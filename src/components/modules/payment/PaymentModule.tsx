"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/src/components/ui/button";
import { Loader2, ShieldCheck, CheckCircle2, CreditCard } from "lucide-react";
import { createPaymentIntent } from "@/src/services/payment";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51TNuju2KMrtjiRDvh0UX76P5Vcz8hceBl7ih9fV9PuLsCHb9TAfWRO3XHQEXAZ9X3IEZWesePh6Ai1sCllXw8kcK00yChlNTL2");

function CheckoutForm({ amount, onSuccess, clientSecret }: { amount: number; onSuccess: () => void; clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // Poll for payment success when displaying QR code
  useEffect(() => {
    if (!qrCodeUrl || !stripe || !clientSecret) return;

    const intervalId = setInterval(() => {
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "requires_capture") {
          clearInterval(intervalId);
          toast.success("Payment successful! Updating your balance...");
          onSuccess();
        } else if (paymentIntent?.status === "canceled") {
          clearInterval(intervalId);
          setQrCodeUrl(null);
          toast.error("Payment was canceled.");
        }
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [qrCodeUrl, stripe, clientSecret, onSuccess]);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;
      
      switch (paymentIntent.status) {
        case "succeeded":
        case "requires_capture":
          toast.success("Payment successful! Updating your balance...");
          onSuccess();
          break;
        case "processing":
          toast.info("Your payment is processing.");
          break;
        case "requires_payment_method":
          toast.error("Your payment was not successful, please try again.");
          break;
        default:
          toast.error("Something went wrong with the payment.");
          break;
      }
    });
  }, [stripe, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !isReady) return;

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href, // Or your success page
        },
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Something went wrong.");
      } 
      else if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "requires_capture")) {
        toast.success("Payment successful! Updating your balance...");
        
        // Tell the parent component (PaymentModule) that we are done
        onSuccess(); 
      }
      else if (paymentIntent && paymentIntent.status === "requires_action") {
        if (paymentIntent.next_action?.type === "cashapp_handle_redirect_or_display_qr_code") {
          const qrData = (paymentIntent.next_action as any).cashapp_handle_redirect_or_display_qr_code;
          if (qrData?.qr_code?.image_url_png) {
            setQrCodeUrl(qrData.qr_code.image_url_png);
            toast.info("Please scan the QR code with your Cash App to complete the payment.");
          }
        } else {
          toast.info("Please complete the required action.");
        }
      }
    } catch (err: any) {
      toast.error("Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Top-up Amount</p>
            <p className="font-black text-2xl text-foreground">৳{amount}</p>
          </div>
        </div>
      </div>

      {qrCodeUrl ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-white/5 rounded-3xl border border-border">
          <h3 className="text-xl font-bold text-foreground mb-4">Scan to Pay with Cash App</h3>
          <div className="bg-white p-4 rounded-2xl shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={qrCodeUrl} 
              alt="Cash App QR Code" 
              className="w-56 h-56 object-contain" 
            />
          </div>
          <p className="mt-6 text-sm font-medium text-muted-foreground text-center animate-pulse flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Waiting for payment completion...
          </p>
          <Button 
            type="button" 
            variant="ghost" 
            className="mt-6 text-muted-foreground hover:text-foreground"
            onClick={() => setQrCodeUrl(null)}
          >
            Cancel or Choose Another Method
          </Button>
        </div>
      ) : (
        <div className="min-h-[200px] p-2 bg-white dark:bg-white/5 rounded-2xl border border-border">
          <PaymentElement onReady={() => setIsReady(true)} />
        </div>
      )}

      {!qrCodeUrl && (
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
          {isReady ? `Confirm & Pay ৳${amount}` : "Securing Gateway..."}
        </Button>
      )}
    </form>
  );
}

export default function PaymentModule() {
  const [amount, setAmount] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInitialize = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsInitializing(true);
    try {
      const res = await createPaymentIntent(numAmount);
      console.log("Payment Intent Result:", res);
      if (res.success && res.data?.client_secret) {
        setClientSecret(res.data.client_secret);
      } else {
        toast.error(res.message || "Failed to initialize payment");
      }
    } catch (err: any) {
      console.error("Initialization error:", err);
      toast.error("Connection error. Please try again.");
    } finally {
      setIsInitializing(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-20 px-6 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-2xl border border-border"
      >
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-foreground mb-4">Payment Successful!</h2>
        <p className="text-muted-foreground mb-10 font-medium text-lg leading-relaxed">
          Your wallet has been topped up successfully. You can now use your balance to pay for tasks.
        </p>
        <Button 
          onClick={() => window.location.href = "/dashboard/user/wallet"}
          className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl text-lg"
        >
          Go to Wallet
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {!clientSecret ? (
          <motion.div 
            key="amount-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl border border-border"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <CreditCard className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">Top Up Wallet</h1>
                <p className="text-muted-foreground font-medium">Add funds to your secure escrow wallet</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Enter Amount (৳)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-primary">৳</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-20 bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/50 text-4xl font-black text-foreground pl-14 pr-8 rounded-3xl outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-zinc-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[500, 1000, 2000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="h-12 rounded-xl bg-muted hover:bg-primary hover:text-white font-bold transition-all"
                  >
                    +৳{val}
                  </button>
                ))}
              </div>

              <Button 
                onClick={handleInitialize}
                disabled={isInitializing || !amount || parseFloat(amount) <= 0}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black h-16 rounded-2xl text-xl shadow-2xl shadow-primary/30 mt-4"
              >
                {isInitializing ? <Loader2 className="animate-spin w-8 h-8" /> : "Proceed to Payment"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="payment-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl border border-border"
          >
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setClientSecret(null)}
                className="text-sm font-bold text-primary hover:underline"
              >
                ← Change Amount
              </button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Secure Checkout</span>
              </div>
            </div>

            <Elements key={clientSecret} stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm amount={parseFloat(amount)} onSuccess={() => setIsSuccess(true)} clientSecret={clientSecret} />
            </Elements>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
