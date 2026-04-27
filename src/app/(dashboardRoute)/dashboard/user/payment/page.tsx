"use client";

import PaymentModule from "@/src/components/modules/payment/PaymentModule";
import { motion } from "motion/react";

export default function UserPaymentPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <PaymentModule />
      </motion.div>
    </div>
  );
}
