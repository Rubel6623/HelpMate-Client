"use client";

import { motion } from "motion/react";
import { Navbar } from "./_components/shared/navbar/Navbar";
import BannerPage from "./_components/page/home/Banner";
import { TrustBar } from "./_components/page/home/TrustBar";
import { HowItWorks } from "./_components/page/home/HowItWorks";
import { Categories } from "./_components/page/home/Categories";
import { RunnerServices } from "./_components/page/home/RunnerServices";
import { WhyChooseUs } from "./_components/page/home/WhyChooseUs";
import { SafetyTrust } from "./_components/page/home/SafetyTrust";
import { FeaturedTasks } from "./_components/page/home/FeaturedTasks";
import { UserReviews } from "./_components/page/home/UserReviews";
import { DualCTA } from "./_components/page/home/DualCTA";
import { PricingFees } from "./_components/page/home/PricingFees";
import FaqSection from "./_components/page/home/FaqSection";
import { Footer } from "./_components/shared/footer/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* 1. Hero Section */}
        <BannerPage />

        {/* 2. Social Proof / Trust Bar */}
        <TrustBar />

        {/* 3. How It Works (4 Steps) */}
        <HowItWorks />

        {/* 4. Core Services / Categories */}
        <Categories />
        <RunnerServices />

        {/* 5. Why Choose HelpMate */}
        <WhyChooseUs />

        {/* 6. Safety & Trust */}
        <SafetyTrust />

        {/* 7. Featured Tasks / Live Marketplace */}
        <FeaturedTasks />

        {/* 8. Testimonials / Reviews */}
        <UserReviews />

        {/* 9. Dual CTA Section */}
        <DualCTA />

        {/* 10. Pricing / Fees */}
        <PricingFees />

        {/* 11. FAQ */}
        <FaqSection />

        {/* 12. Footer */}
        <Footer />
      </motion.div>
    </main>
  );
}
