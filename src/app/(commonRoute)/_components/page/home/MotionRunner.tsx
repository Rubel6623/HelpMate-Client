"use client";

import { motion } from "motion/react";
import runnerImage from "../../../../../../public/assets/Runner.png";
import Image from "next/image";
import { Package, Zap, Clock, ShieldCheck } from "lucide-react";

export const MotionRunner = () => {
  return (
    <div className="relative w-full max-w-[600px] mx-auto lg:mx-0">
      {/* Background Decorative Elements */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full z-0"
      />

      {/* Floating Icons */}
      <FloatingIcon
        icon={<Package className="text-blue-400" />}
        delay={0}
        className="top-0 left-10"
      />
      <FloatingIcon
        icon={<Zap className="text-yellow-400" />}
        delay={1}
        className="top-20 right-0"
      />
      <FloatingIcon
        icon={<Clock className="text-pink-400" />}
        delay={2}
        className="bottom-10 left-0"
      />
      <FloatingIcon
        icon={<ShieldCheck className="text-green-400" />}
        delay={1.5}
        className="bottom-0 right-10"
      />

      {/* Main Runner Image Container */}
      <motion.div
        initial={{ x: 100, opacity: 0, scale: 0.8 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 1,
        }}
        className="relative z-10"
      >
        {/* Floating Animation for the Runner */}
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        >
          <Image
            src={runnerImage}
            alt="HelpMate Runner"
            width={600}
            height={600}
            priority
            className="w-full h-auto object-contain pointer-events-none"
          />

          {/* Badge Overlay */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-white fill-current" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Delivery Time</p>
                <p className="text-sm text-white font-bold">~15-30 Mins</p>
              </div>
            </div>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-gray-900 bg-gray-700 overflow-hidden"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-600" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white font-bold">500+ Active Runners</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const FloatingIcon = ({
  icon,
  delay,
  className,
}: {
  icon: React.ReactNode;
  delay: number;
  className: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0, 1, 0.5],
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
    }}
    transition={{
      y: {
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      },
      rotate: {
        duration: 5,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      },
      opacity: {
        duration: 2,
        delay,
      },
    }}
    className={`absolute z-0 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full shadow-lg ${className}`}
  >
    {icon}
  </motion.div>
);