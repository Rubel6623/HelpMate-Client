"use client";

import { SiFacebook, SiX, SiInstagram, SiLinkerd } from "react-icons/si";
import {FaLinkedin, FaInstagram, FaFacebook, FaTwitter} from 'react-icons/fa';
import { Send } from "lucide-react";
import Link from "next/link";


export const Footer = () => {
  return (
    <footer className="bg-black text-white py-20 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-[50rem] h-[20rem] bg-primary/10 blur-[10rem] rounded-full -translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-xl">
                <span className="text-xl font-bold italic">H</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                HelpMate
              </span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-sm">
              Connecting busy individuals with verified university students for quick, affordable errands. 
              Making everyday life easier.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={FaFacebook} />
              <SocialIcon icon={FaTwitter} />
              <SocialIcon icon={FaInstagram} />
              <SocialIcon icon={FaLinkedin} />
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              <FooterLink href="/how-it-works">How it Works</FooterLink>
              <FooterLink href="/categories">Task Categories</FooterLink>
              <FooterLink href="/register?role=RUNNER">Become a Runner</FooterLink>
              <FooterLink href="/safety">Trust & Safety</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <FooterLink href="/about-us">About Us</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>


          <div>
            <h4 className="text-xl font-bold mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-6">
              Subscribe to get the latest updates and offers.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:border-primary transition-colors"
              />
              <button className="absolute right-2 top-2 h-10 w-10 bg-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © 2026 HelpMate. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon }: { icon: any }) => (
  <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
    <Icon className="w-5 h-5" />
  </a>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link href={href} className="text-gray-400 hover:text-white transition-colors flex items-center group">
      <span className="w-0 group-hover:w-4 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300" />
      {children}
    </Link>
  </li>
);

