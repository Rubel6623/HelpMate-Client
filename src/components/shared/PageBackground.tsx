"use client";

import { motion } from "motion/react";

export const PageBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Primary Gradient Layer */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] opacity-50"
        style={{
          background: "radial-gradient(circle at 20% 20%, #8b5cf6 0%, transparent 40%), radial-gradient(circle at 80% 80%, #ec4899 0%, transparent 40%), radial-gradient(circle at 50% 50%, #6366f1 0%, transparent 50%)",
          filter: "blur(80px)",
        }}
      />

      {/* Layered Waves/Blobs inspired by bg.png */}
      <motion.div
        animate={{
          x: [-20, 20, -20],
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[10%] right-[-5%] w-[60%] h-[70%] rounded-full opacity-30 blur-[100px]"
        style={{ background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)" }}
      />

      <motion.div
        animate={{
          x: [20, -20, 20],
          y: [10, -10, 10],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] left-[-5%] w-[70%] h-[60%] rounded-full opacity-30 blur-[100px]"
        style={{ background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)" }}
      />

      {/* Noise Texture Overaly */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};
