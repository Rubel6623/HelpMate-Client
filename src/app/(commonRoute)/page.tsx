"use client";

import { motion } from "motion/react";
import { Navbar } from "./_components/shared/navbar/Navbar";
import BannerPage from "./_components/page/home/Banner";
import { Carousel } from "./_components/page/home/Carousel";
import { Categories } from "./_components/page/home/Categories";
import { TopRunners } from "./_components/page/home/TopRunners";
import { UserReviews } from "./_components/page/home/UserReviews";
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
        <BannerPage />
        <Carousel />
        <Categories />
        <TopRunners />
        <UserReviews />
        <Footer />
      </motion.div>
    </main>
  );
}
