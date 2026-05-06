# HelpMate Frontend 🚀

[![Live Link](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](https://help-mate-frontend-nvoze4ypn-rubel6623s-projects.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

HelpMate is a modern, high-performance web application designed to connect people who need help with local service providers (Runners). Featuring a sleek interface, AI-powered assistance, and secure payment integrations.

## 🔗 Live Application
Experience the platform here:  
[**HelpMate Live Demo**](https://help-mate-frontend-nvoze4ypn-rubel6623s-projects.vercel.app)

---

## ✨ Features

- **🤖 AI Assistant:** Integrated Gemini AI chatbot for instant support and guidance.
- **💳 Secure Payments:** Seamless checkout experience powered by Stripe.
- **🔐 Firebase Auth:** Robust authentication system with social login support.
- **📊 Real-time Dashboard:** Interactive data visualizations using Recharts.
- **🌓 Dark/Light Mode:** Full theme support with `next-themes`.
- **⚡ Performance First:** Built with Next.js 15+ and Turbopack for lightning-fast speeds.
- **🎨 Premium UI:** Styled with Tailwind CSS 4, Shadcn/UI, and Radix UI components.
- **🎬 Smooth Animations:** Dynamic micro-interactions powered by Framer Motion.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/)
- **State Management:** React Hook Form & Zod
- **Auth:** [Firebase](https://firebase.google.com/)
- **Payment:** [Stripe](https://stripe.com/)
- **AI:** [Google Gemini AI](https://deepmind.google/technologies/gemini/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** Hugeicons & Lucide React

---

## 🚀 Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/HelpMate-Frontend.git
   cd HelpMate-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file and add your credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_key
   NEXT_PUBLIC_API_BASE_URL=https://help-mate-server-rubel6623-rubel6623s-projects.vercel.app/api/v1
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📦 Project Structure

- `src/app`: Next.js App Router and page layouts.
- `src/components`: Reusable UI components (Shadcn/UI).
- `src/hooks`: Custom React hooks for logic reuse.
- `src/lib`: Utility functions and third-party configurations.
- `public`: Static assets like images and fonts.

---

## 🤝 Contributing
Interested in contributing? Fork the repository and submit a pull request!

## 📄 License
This project is licensed under the MIT License.
