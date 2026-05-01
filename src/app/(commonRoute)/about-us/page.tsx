"use client";

import { motion } from "motion/react";
import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <section className="bg-white py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            About HelpMate
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Connecting people who need help with those ready to get things done.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-700 leading-relaxed mb-6">
              HelpMate is built for real life. Tasks pile up, schedules get tight,
              and sometimes you just need someone reliable to step in and help.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              We connect people who need help with students and individuals who
              are ready to earn by offering their time and skills. From errands
              to small jobs, everything happens in a simple, secure way.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Post a task, get offers, and get it done without unnecessary
              complications.
            </p>
          </motion.div>

          {/* Right Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid gap-6"
          >
            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">
                Secure Payments
              </h4>
              <p className="text-gray-600 text-sm">
                Escrow-based system ensures both sides are protected.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">
                Earn Easily
              </h4>
              <p className="text-gray-600 text-sm">
                Students can earn flexibly without complex requirements.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">
                Fast & Simple
              </h4>
              <p className="text-gray-600 text-sm">
                Post tasks, receive offers, and get things done quickly.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            Built for your daily life
          </h3>
          <p className="text-gray-600 mb-6">
            Whether you need help or want to earn, HelpMate fits around your schedule.
          </p>

          <div className="flex justify-center gap-4">
            <Link href={"/dashboard/user/post-task"}>
            <button className="bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90 transition hover:cursor-pointer">
              Post a Task
            </button>
            </Link>
            <Link href={"/register"}>
            <button className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100 transition hover:cursor-pointer">
              Become a Helper
            </button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
      <Footer />
    </>
  );
}
