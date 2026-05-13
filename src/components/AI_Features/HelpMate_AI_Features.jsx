"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// Fallback chain: try each model in order until one works
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-flash-latest"];

const CHAT_SYSTEM = `You are HelpMate Assistant — the friendly, expert AI for HelpMate, a platform connecting busy people with verified student runners for quick, affordable errands.

== YOUR CAPABILITIES ==
1. FAQ & Platform Guidance — answer any question about HelpMate features
2. Booking & Task Flow — walk users step-by-step through posting a task or booking a runner
3. Content Suggestions — recommend relevant HelpMate blog posts or guides based on user interests
4. Newsletter & Updates — suggest what the user should subscribe to based on their goals
5. Runner Support — help runners find tasks, understand earnings, build reputation

== PLATFORM KNOWLEDGE ==
Categories: Grocery & Shopping, Queue & Waiting, Document Handling, Household Help, Tech Help, Pet Care
Pricing: User sets price; HelpMate takes 10-15% service fee
Payments: bKash, Nagad, Rocket, debit/credit cards via in-app wallet (escrow-protected)
Runner verification: Student ID + National ID required, approved within 24 hrs
Safety: SOS button, address masking, in-app chat only, disputes resolved in 4 hrs
Ratings: 1-5 stars, mutual rating after completion

== BOOKING GUIDANCE ==
When user wants to book a runner or post a task, guide them:
1. Go to /runners → pick a runner → click "Book"
2. Or go to /dashboard/user/post-task → fill in task details
3. Set your budget → confirm → runner gets notified
4. Track progress in My Tasks dashboard
5. After completion, release payment and leave a rating

== CONTENT SUGGESTIONS ==
When detecting user interests, suggest relevant blog topics:
- Grocery tasks → "How to save time with grocery runners", "Top grocery errands students can help with"
- Tech help → "5 tech tasks students can handle in an hour"
- Becoming runner → "How to earn ৳5000/week as a HelpMate Runner", "Building your runner reputation"
- Safety → "How HelpMate keeps your data safe", "Escrow payments explained"
- General → "HelpMate's top 10 most-booked tasks", "New features this month"
Format suggestions as: 📖 [Title] — [brief reason why it's relevant]

== NEWSLETTER RECOMMENDATIONS ==
When user asks about updates, newsletters, or staying informed, suggest:
- Weekly Task Digest (new tasks in their area)
- Runner Tips Newsletter (earning strategies, platform updates)
- Safety & Trust Updates (new verification features)
- HelpMate Deals (discounted service fees, promotions)
Always encourage them to subscribe via email for personalized recommendations.

== RESPONSE STYLE ==
- Keep responses concise and friendly (2-4 sentences max for simple questions)
- Use emojis sparingly for warmth
- For step-by-step tasks, use numbered lists
- For content suggestions, use the 📖 format
- If user writes in Bangla, respond in Bangla
- Always end complex answers with a follow-up question to keep engagement
- When unsure, say: "Great question! Let me connect you with our support team."`;

const TASK_SYSTEM = `You are a task optimization AI for HelpMate platform. 
Analyze a task description and return ONLY valid JSON (no markdown, no explanation).

Return this exact structure:
{
  "category": "one of: Grocery & Shopping | Queue & Waiting | Document Handling | Household Help | Tech Help | Pet Care",
  "suggestedTitle": "concise 5-8 word task title",
  "improvedDescription": "clear, specific 2-3 sentence description that Runners can act on",
  "estimatedDuration": "e.g. 30-45 min",
  "suggestedPrice": number (integer BDT, realistic for Bangladesh),
  "tips": ["tip 1 for making this task successful", "tip 2"],
  "urgencyLevel": "low | medium | high",
  "confidence": number between 0 and 1
}`;

// ─── GEMINI API CALL (using official SDK) ────────────────────────────────────
async function callGemini(messages, system, maxTokens = 800) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "undefined") {
    console.warn("GEMINI_API_KEY not configured, using mock response");
    return getMockResponse(messages, system);
  }

  // Check for internet connection
  if (typeof window !== "undefined" && !window.navigator.onLine) {
    console.warn("User is offline, using mock response");
    return getMockResponse(messages, system, true);
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  // Build the chat history (all but last message)
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1].content;

  // Try each model in the fallback chain
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: system,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
        },
      });

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage);
      return result.response.text();
    } catch (err) {
      const status = err?.status || err?.message || "";
      
      // Handle network errors explicitly
      if (String(status).includes("Failed to fetch") || String(err?.message).includes("fetch")) {
         return getMockResponse(messages, system, true);
      }

      // If quota exhausted or model not found, try next model
      if (String(status).includes("429") || String(status).includes("404") ||
          String(err?.message).includes("quota") || String(err?.message).includes("not found")) {
        continue;
      }
      // Any other error — fall back to mock
      console.error("Gemini SDK error:", err);
      return getMockResponse(messages, system);
    }
  }

  // All models exhausted — use mock
  return getMockResponse(messages, system);
}

// ─── MOCK RESPONSES FOR DEMO ──────────────────────────────────────────────────
function getMockResponse(messages, system, isOffline = false) {
  if (isOffline) {
    return "It looks like you're offline. Please check your internet connection to chat with the live AI. I'll be here once you're back online!";
  }
  const lastMsg = messages[messages.length - 1].content.toLowerCase();
  
  if (system && system.includes("JSON")) {
    return JSON.stringify({
      category: "Household Help",
      suggestedTitle: "Help with daily chores and errands",
      improvedDescription: "I am looking for a reliable helper to assist with various household tasks and errands around the city. The ideal candidate should be punctual and organized.",
      estimatedDuration: "2-3 hours",
      suggestedPrice: 500,
      tips: ["Be clear about specific tasks", "Provide a preferred time window"],
      urgencyLevel: "medium",
      confidence: 0.9
    });
  }

  if (lastMsg.includes("hello") || lastMsg.includes("hi") || lastMsg.includes("hey")) {
    return "Hi there! I'm your HelpMate Assistant. How can I help you today? I can help you post a task, become a runner, or answer questions about payments and safety.";
  }
  if (lastMsg.includes("কিভাবে") || lastMsg.includes("টাস্ক") || lastMsg.includes("পোস্ট")) {
    return "টাস্ক পোস্ট করা খুব সহজ! 'Post a Task' বাটনে ট্যাপ করুন, ক্যাটাগরি সিলেক্ট করুন, বিস্তারিত লিখুন এবং আপনার বাজেট সেট করে কনফার্ম করুন। আমাদের রানাররা শীঘ্রই আপনার সাথে যোগাযোগ করবে।";
  }
  if (lastMsg.includes("টাকা") || lastMsg.includes("পেমেন্ট")) {
    return "আপনার পেমেন্ট হেল্পমেট ওয়ালেটে সুরক্ষিত থাকে। টাস্ক শেষ হওয়ার পর এবং আপনি কনফার্ম করলে টাকা রানারের কাছে পৌঁছে যাবে। আপনি bKash, Nagad বা কার্ডের মাধ্যমে পেমেন্ট করতে পারবেন।";
  }
  if (lastMsg.includes("fee") || lastMsg.includes("charge") || lastMsg.includes("cost")) {
    return "HelpMate keeps it simple! We take a small 10-15% service fee from the total task price to keep the platform running smoothly and safely for everyone.";
  }
  if (lastMsg.includes("grocery") || lastMsg.includes("shop") || lastMsg.includes("buy")) {
    return "Our 'Grocery & Shopping' category is perfect for when you're busy! A Runner can pick up anything from your local bazaar or supermarket and deliver it right to your door.";
  }
  if (lastMsg.includes("queue") || lastMsg.includes("line") || lastMsg.includes("wait")) {
    return "Need someone to stand in line for you at the Passport Office or for tickets? Our 'Queue & Waiting' service is here to save you hours of time!";
  }
  if (lastMsg.includes("post") || lastMsg.includes("task")) {
    return "To post a task, just tap the 'Post a Task' button on your dashboard. Pick a category, describe what you need, set your budget, and you're good to go! Would you like help drafting a description?";
  }
  if (lastMsg.includes("runner") || lastMsg.includes("become") || lastMsg.includes("join")) {
    return "Becoming a Runner is easy! Just sign up for an account, go to 'Become a Runner' in your profile, upload your Student ID and National ID, and wait for our team to verify you (usually within 24 hours).";
  }
  if (lastMsg.includes("pay") || lastMsg.includes("money") || lastMsg.includes("bkash")) {
    return "We support bKash, Nagad, and all major cards. Your payment is held securely in escrow and only released to the Runner once you confirm the task is completed successfully.";
  }
  if (lastMsg.includes("safe") || lastMsg.includes("safety") || lastMsg.includes("trust")) {
    return "Safety is our priority. All Runners are verified with Government IDs. We also have an SOS button, address masking, and 24/7 support to help you if anything goes wrong.";
  }
  
  return "That's a great question about HelpMate! I'm here to help you navigate our errand marketplace. Could you tell me a bit more so I can give you the best advice?";
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  Bot:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 15h0M16 15h0"/></svg>,
  Send:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Spark: () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
  X:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Task:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  Loader:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/></svg>,
  Tag:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1" fill="currentColor"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Taka:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><text x="5" y="18" fontFamily="serif" fontSize="16" stroke="none" fill="currentColor">৳</text></svg>,
};

// ─── CATEGORY BADGE ────────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  "Grocery & Shopping":  { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  "Queue & Waiting":     { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  "Document Handling":   { bg: "#ede9fe", text: "#5b21b6", dot: "#8b5cf6" },
  "Household Help":      { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  "Tech Help":           { bg: "#fce7f3", text: "#9d174d", dot: "#ec4899" },
  "Pet Care":            { bg: "#ffedd5", text: "#9a3412", dot: "#f97316" },
};

// ─── Static data for Blog & Newsletter tabs ────────────────────────────────────
const BLOG_SUGGESTIONS = [
  { emoji: "🛒", title: "Save Time on Grocery Runs", tag: "Lifestyle", url: "/blog" },
  { emoji: "💰", title: "Earn ৳5000/week as a Runner", tag: "Runners", url: "/blog" },
  { emoji: "🔒", title: "How Escrow Payments Keep You Safe", tag: "Safety", url: "/blog" },
  { emoji: "📋", title: "Top 10 Most-Booked Tasks", tag: "Trending", url: "/blog" },
  { emoji: "🎓", title: "Student Runner: Getting Started Guide", tag: "Guide", url: "/blog" },
  { emoji: "⚡", title: "Post Your First Task in 60 Seconds", tag: "Quick Start", url: "/blog" },
];

const NEWSLETTER_OPTIONS = [
  { id: "digest",   emoji: "📰", label: "Weekly Task Digest",       desc: "New tasks near you every Monday" },
  { id: "runner",   emoji: "🏃", label: "Runner Tips Newsletter",    desc: "Earning strategies & platform updates" },
  { id: "safety",   emoji: "🔐", label: "Safety & Trust Updates",    desc: "New verification & security features" },
  { id: "deals",    emoji: "🎁", label: "HelpMate Deals",            desc: "Fee discounts & limited promotions" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE 1: AI CHAT ASSISTANT
// ═══════════════════════════════════════════════════════════════════════════════
export function AIChatAssistant() {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "👋 Hi! I'm your HelpMate Assistant.\n\nI can:\n• Answer FAQs & guide you through booking\n• Suggest blogs tailored to your interests\n• Recommend newsletters for you\n\nWhat can I help you with today?", ts: Date.now() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [email, setEmail] = useState("");
  const [selectedNewsletters, setSelectedNewsletters] = useState(["digest"]);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const QUICK_REPLIES = [
    "How do I book a runner? 🏃",
    "Suggest me some blogs 📖",
    "What newsletters suit me? 📧",
    "How does payment work? 💳",
    "How to become a Runner?",
    "Is my data safe? 🔐",
  ];

  const TABS = [
    { id: "chat",       label: "Chat",       emoji: "💬" },
    { id: "blogs",      label: "Blogs",      emoji: "📖" },
    { id: "newsletter", label: "Newsletter", emoji: "📧" },
  ];

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    setIsMounted(true);
    const t = setTimeout(() => setPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open && activeTab === "chat") {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, messages, activeTab]);

  const send = useCallback(async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");
    setActiveTab("chat");
    setMessages(prev => [...prev, { role: "user", text: userMsg, ts: Date.now() }]);
    setLoading(true);
    try {
      const history = messages
        .filter(m => m.role !== "assistant" || messages.indexOf(m) > 0)
        .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      history.push({ role: "user", content: userMsg });
      const reply = await callGemini(history, CHAT_SYSTEM, 600);
      setMessages(prev => [...prev, { role: "assistant", text: reply, ts: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.", ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const toggleNewsletter = (id) => {
    setSelectedNewsletters(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNewsletterSubmit = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (selectedNewsletters.length === 0) {
      setEmailError("Please select at least one newsletter.");
      return;
    }
    setEmailError("");
    setNewsletterSent(true);
  };

  return (
    <>
      <style>{`
        @keyframes hm-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes hm-fade-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hm-spin { to{transform:rotate(360deg)} }
        @keyframes hm-pulse-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
        .hm-spin { animation: hm-spin 1s linear infinite; }
        .hm-msg-in { animation: hm-fade-in 0.25s ease; }
        .hm-chat-input:focus { outline: none; }
        .hm-quick-btn:hover { background: #1d4ed8 !important; color: #fff !important; }
        .hm-send-btn:hover:not(:disabled) { background: #1d4ed8 !important; }
        .hm-chat-fab:hover { transform: scale(1.08); }
        .hm-blog-card:hover { background: #f1f5f9 !important; transform: translateY(-1px); }
        .hm-nl-opt:hover { border-color: #2563eb !important; }
      `}</style>

      {/* FAB */}
      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999 }}>
        {!open && pulse && (
          <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "#2563eb", animation: "hm-pulse-ring 2s ease-out infinite" }}/>
        )}
        <button onClick={() => { setOpen(o => !o); setPulse(false); }} className="hm-chat-fab"
          style={{ width: 58, height: 58, borderRadius: "50%", background: open ? "#1e293b" : "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", cursor: "pointer", color: "#fff", boxShadow: "0 8px 32px rgba(37,99,235,0.45)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}
        >
          <div style={{ width: 26, height: 26 }}>{open ? <Icon.X /> : <Icon.Bot />}</div>
        </button>
        {!open && (
          <div style={{ position: "absolute", bottom: 66, right: 0, whiteSpace: "nowrap", background: "#1e293b", color: "#e2e8f0", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 20, fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", animation: "hm-fade-in 0.4s ease" }}>
            💬 Ask HelpMate AI
          </div>
        )}
      </div>

      {/* Chat Window */}
      {open && (
        <div style={{ position: "fixed", bottom: 100, right: 28, zIndex: 9998, width: 390, height: 580, background: "#fff", borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.18),0 0 0 1px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", animation: "hm-fade-in 0.3s cubic-bezier(.22,.68,0,1.2)", fontFamily: "'DM Sans',sans-serif", overflow: "hidden" }}>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg,#1e40af,#2563eb)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
              <div style={{ width: 20, height: 20 }}><Icon.Bot /></div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>HelpMate Assistant</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}/> Online · Powered by Gemini AI
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", background: "#fff", flexShrink: 0 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "9px 4px", border: "none", cursor: "pointer", background: "transparent", fontFamily: "inherit", fontSize: 12, fontWeight: 600, color: activeTab === tab.id ? "#2563eb" : "#94a3b8", borderBottom: activeTab === tab.id ? "2px solid #2563eb" : "2px solid transparent", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <span>{tab.emoji}</span>{tab.label}
              </button>
            ))}
          </div>

          {/* ── TAB: CHAT ── */}
          {activeTab === "chat" && (<>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px 0", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((msg, i) => (
                <div key={i} className="hm-msg-in" style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "84%", padding: "10px 14px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px", background: msg.role === "user" ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "#f1f5f9", color: msg.role === "user" ? "#fff" : "#1e293b", fontSize: 13.5, lineHeight: 1.6, whiteSpace: "pre-wrap", boxShadow: msg.role === "user" ? "0 2px 8px rgba(37,99,235,0.3)" : "none" }}>
                    {msg.text}
                  </div>
                  <div suppressHydrationWarning style={{ fontSize: 10, color: "#94a3b8", marginTop: 2, paddingInline: 4 }}>{isMounted ? formatTime(msg.ts) : ""}</div>
                </div>
              ))}
              {loading && (
                <div className="hm-msg-in" style={{ display: "flex" }}>
                  <div style={{ padding: "12px 16px", background: "#f1f5f9", borderRadius: "4px 18px 18px 18px", display: "flex", gap: 5, alignItems: "center" }}>
                    {[0,1,2].map(d => <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "#94a3b8", animation: `hm-bounce 1.2s ease ${d*0.18}s infinite` }}/>)}
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {messages.length <= 2 && (
              <div style={{ padding: "8px 14px 0", display: "flex", flexWrap: "wrap", gap: 5 }}>
                {QUICK_REPLIES.map(q => (
                  <button key={q} onClick={() => send(q)} className="hm-quick-btn" style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", borderRadius: 20, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 500, transition: "all 0.15s" }}>{q}</button>
                ))}
              </div>
            )}

            <div style={{ padding: "10px 14px 14px", display: "flex", gap: 8, alignItems: "center" }}>
              <input ref={inputRef} className="hm-chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} placeholder="Type a message..." style={{ flex: 1, border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "10px 14px", fontSize: 13.5, fontFamily: "inherit", background: "#f8fafc", color: "#1e293b", transition: "border-color 0.15s" }} onFocus={e => e.target.style.borderColor="#2563eb"} onBlur={e => e.target.style.borderColor="#e2e8f0"}/>
              <button onClick={() => send()} disabled={!input.trim() || loading} className="hm-send-btn" style={{ width: 40, height: 40, borderRadius: 10, background: input.trim() && !loading ? "#2563eb" : "#e2e8f0", border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed", color: input.trim() && !loading ? "#fff" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", flexShrink: 0 }}>
                {loading ? <div style={{ width: 18, height: 18 }} className="hm-spin"><Icon.Loader /></div> : <div style={{ width: 18, height: 18 }}><Icon.Send /></div>}
              </button>
            </div>
          </>)}

          {/* ── TAB: BLOGS ── */}
          {activeTab === "blogs" && (
            <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: "#64748b", fontWeight: 500 }}>✨ AI-curated reads based on popular HelpMate topics</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {BLOG_SUGGESTIONS.map((b, i) => (
                  <a key={i} href={b.url} className="hm-blog-card" style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 12, border: "1px solid #e2e8f0", textDecoration: "none", background: "#fff", transition: "all 0.15s" }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{b.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{b.title}</div>
                      <span style={{ display: "inline-block", marginTop: 3, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#2563eb", background: "#eff6ff", padding: "1px 7px", borderRadius: 10 }}>{b.tag}</span>
                    </div>
                    <span style={{ color: "#cbd5e1", fontSize: 14 }}>→</span>
                  </a>
                ))}
              </div>
              <button onClick={() => send("Suggest me blogs based on my interests")} style={{ marginTop: 12, width: "100%", padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                ✨ Get AI Personalized Suggestions
              </button>
            </div>
          )}

          {/* ── TAB: NEWSLETTER ── */}
          {activeTab === "newsletter" && (
            <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
              {newsletterSent ? (
                <div style={{ textAlign: "center", padding: "36px 12px" }}>
                  <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
                  <h3 style={{ margin: "0 0 6px", color: "#0f172a", fontSize: 15 }}>You're subscribed!</h3>
                  <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>We'll send personalized updates to <strong>{email}</strong></p>
                  <button onClick={() => { setNewsletterSent(false); setEmail(""); }} style={{ marginTop: 14, padding: "8px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#2563eb", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Update Preferences</button>
                </div>
              ) : (<>
                <p style={{ margin: "0 0 10px", fontSize: 12, color: "#64748b", fontWeight: 500 }}>📧 Get AI-personalized recommendations in your inbox</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
                  {NEWSLETTER_OPTIONS.map(opt => {
                    const sel = selectedNewsletters.includes(opt.id);
                    return (
                      <button key={opt.id} onClick={() => toggleNewsletter(opt.id)} className="hm-nl-opt" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, cursor: "pointer", border: sel ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0", background: sel ? "#eff6ff" : "#fff", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s" }}>
                        <span style={{ fontSize: 18 }}>{opt.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{opt.label}</div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>{opt.desc}</div>
                        </div>
                        <div style={{ width: 17, height: 17, borderRadius: "50%", border: sel ? "none" : "1.5px solid #cbd5e1", background: sel ? "#2563eb" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {sel && <div style={{ width: 9, height: 9 }}><Icon.Check /></div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setEmailError(""); }} placeholder="your@email.com" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: emailError ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", background: "#f8fafc", color: "#0f172a", marginBottom: emailError ? 4 : 10, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor="#2563eb"} onBlur={e => e.target.style.borderColor=emailError?"#ef4444":"#e2e8f0"}/>
                {emailError && <p style={{ margin: "0 0 8px", fontSize: 11, color: "#ef4444" }}>{emailError}</p>}
                <button onClick={handleNewsletterSubmit} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
                  Subscribe with AI Recommendations ✨
                </button>
              </>)}
            </div>
          )}

        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE 2: AI SMART TASK COMPOSER
// ═══════════════════════════════════════════════════════════════════════════════
export function AITaskComposer() {
  const [step, setStep] = useState("compose"); // compose | analyzing | result | posted
  const [rawInput, setRawInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");
  const [editedDesc, setEditedDesc] = useState("");

  const analyze = async () => {
    if (!rawInput.trim() || rawInput.length < 15) {
      setError("Please describe your task in a bit more detail (at least 15 characters).");
      return;
    }
    setError(null);
    setStep("analyzing");

    try {
      const raw = await callGemini(
        [{ role: "user", content: `Analyze this task request from Bangladesh: "${rawInput}"` }],
        TASK_SYSTEM, 600
      );

      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
      setEditedPrice(String(parsed.suggestedPrice));
      setEditedDesc(parsed.improvedDescription);
      setStep("result");
    } catch {
      setStep("compose");
      setError("Couldn't analyze right now. Please try again.");
    }
  };

  const reset = () => {
    setStep("compose"); setResult(null); setRawInput("");
    setEditedPrice(""); setEditedDesc(""); setError(null);
  };

  const catStyle = result ? CATEGORY_COLORS[result.category] || CATEGORY_COLORS["Household Help"] : {};

  const urgencyColor = {
    low:    { bg: "#f0fdf4", text: "#166534", label: "Low urgency" },
    medium: { bg: "#fffbeb", text: "#92400e", label: "Medium urgency" },
    high:   { bg: "#fef2f2", text: "#991b1b", label: "High urgency" },
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", maxWidth: 680, margin: "0 auto" }}>
      <style>{`
        @keyframes qst-spin { to{transform:rotate(360deg)} }
        @keyframes qst-fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes qst-progress { from{width:0} to{width:100%} }
        .qst-spin { animation:qst-spin 1s linear infinite; }
        .qst-card { animation:qst-fade 0.35s ease; }
        .qst-btn-primary:hover:not(:disabled) { background:#1d4ed8!important; transform:translateY(-1px); box-shadow:0 6px 20px rgba(37,99,235,0.4)!important; }
        .qst-btn-secondary:hover { background:#f8fafc!important; }
        .qst-tip-item:hover { background:#f8fafc; }
        .qst-textarea:focus { outline:none; border-color:#2563eb!important; box-shadow:0 0 0 3px rgba(37,99,235,0.1)!important; }
        .qst-input:focus { outline:none; border-color:#2563eb!important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", flexShrink: 0,
          boxShadow: "0 6px 20px rgba(37,99,235,0.35)",
        }}>
          <div style={{ width: 24, height: 24 }}><Icon.Spark /></div>
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>
            AI Task Composer
          </h2>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>
            Describe what you need — AI will optimize your task posting for the best Runners.
          </p>
        </div>
      </div>

      {/* ── Step: Compose ── */}
      {(step === "compose" || step === "analyzing") && (
        <div className="qst-card" style={{
          background: "#fff", borderRadius: 20,
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "24px 24px 0" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
              What do you need help with?
            </label>
            <textarea
              className="qst-textarea"
              value={rawInput}
              onChange={e => setRawInput(e.target.value)}
              disabled={step === "analyzing"}
              placeholder="e.g. I need someone to stand in the DGHS queue for me tomorrow morning and collect my health certificate. I'll be in office."
              style={{
                width: "100%", minHeight: 120, border: "1.5px solid #e2e8f0",
                borderRadius: 12, padding: "12px 14px", fontSize: 14, lineHeight: 1.6,
                fontFamily: "inherit", color: "#0f172a", background: "#f8fafc",
                resize: "vertical", boxSizing: "border-box", transition: "all 0.15s",
              }}
            />
            {error && (
              <div style={{ marginTop: 8, padding: "8px 12px", background: "#fef2f2", color: "#dc2626", borderRadius: 8, fontSize: 13 }}>
                {error}
              </div>
            )}
          </div>

          <div style={{ padding: "16px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              {rawInput.length} chars · AI will auto-detect category & price
            </div>
            <button
              onClick={analyze}
              disabled={step === "analyzing" || rawInput.trim().length < 5}
              className="qst-btn-primary"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: step === "analyzing" || rawInput.trim().length < 5 ? "#e2e8f0" : "linear-gradient(135deg,#2563eb,#1d4ed8)",
                color: step === "analyzing" || rawInput.trim().length < 5 ? "#9ca3af" : "#fff",
                border: "none", borderRadius: 12, padding: "12px 22px",
                fontSize: 14, fontWeight: 600, cursor: step === "analyzing" || rawInput.trim().length < 5 ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                transition: "all 0.2s",
              }}
            >
              {step === "analyzing" ? (
                <><div style={{ width: 18, height: 18 }} className="qst-spin"><Icon.Loader /></div>Analyzing...</>
              ) : (
                <><div style={{ width: 18, height: 18 }}><Icon.Spark /></div>Optimize with AI</>
              )}
            </button>
          </div>

          {step === "analyzing" && (
            <div style={{ height: 3, background: "#eff6ff", position: "relative", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg,#2563eb,#7c3aed)", animation: "qst-progress 2s ease-in-out infinite" }}/>
            </div>
          )}
        </div>
      )}

      {/* ── Step: Result ── */}
      {step === "result" && result && (
        <div className="qst-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* AI Analysis Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "linear-gradient(135deg,#eff6ff,#f5f3ff)", borderRadius: 12, border: "1px solid #c7d2fe" }}>
            <div style={{ width: 16, height: 16, color: "#4f46e5" }}><Icon.Spark /></div>
            <span style={{ fontSize: 13, color: "#3730a3", fontWeight: 600 }}>AI analysis complete</span>
            <div style={{ marginLeft: "auto", fontSize: 12, color: "#6366f1" }}>
              {Math.round(result.confidence * 100)}% confidence
            </div>
            <div style={{
              width: 60, height: 6, background: "#e0e7ff", borderRadius: 99, overflow: "hidden",
            }}>
              <div style={{ width: `${result.confidence * 100}%`, height: "100%", background: "linear-gradient(90deg,#4f46e5,#7c3aed)", borderRadius: 99 }}/>
            </div>
          </div>

          {/* Detected Category + Urgency */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "6px 14px", borderRadius: 20,
              background: catStyle.bg, color: catStyle.text,
              fontSize: 13, fontWeight: 600, border: `1px solid ${catStyle.dot}30`,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: catStyle.dot, display: "inline-block" }}/>
              {result.category}
            </div>
            {result.urgencyLevel && (
              <div style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                background: urgencyColor[result.urgencyLevel]?.bg,
                color: urgencyColor[result.urgencyLevel]?.text,
              }}>
                {urgencyColor[result.urgencyLevel]?.label}
              </div>
            )}
          </div>

          {/* Title */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "16px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              Suggested Task Title
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>{result.suggestedTitle}</div>
          </div>

          {/* Description editor */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "16px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Optimized Description <span style={{ fontWeight: 400, color: "#c4b5fd" }}>(editable)</span>
            </div>
            <textarea
              className="qst-textarea"
              value={editedDesc}
              onChange={e => setEditedDesc(e.target.value)}
              style={{
                width: "100%", minHeight: 90, border: "1.5px solid #e2e8f0",
                borderRadius: 10, padding: "10px 12px", fontSize: 14, lineHeight: 1.6,
                fontFamily: "inherit", color: "#374151", background: "#f8fafc",
                resize: "vertical", boxSizing: "border-box", transition: "all 0.15s",
              }}
            />
          </div>

          {/* Time + Price */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 14, height: 14, color: "#64748b" }}><Icon.Clock /></div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Duration</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{result.estimatedDuration}</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 14, height: 14, color: "#64748b" }}><Icon.Taka /></div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Suggested Price</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>৳</span>
                <input
                  type="number"
                  className="qst-input"
                  value={editedPrice}
                  onChange={e => setEditedPrice(e.target.value)}
                  style={{
                    width: "100%", border: "1.5px solid #e2e8f0",
                    borderRadius: 8, padding: "6px 12px", fontSize: 16, fontWeight: 600,
                    fontFamily: "inherit", color: "#0f172a", background: "#f8fafc",
                  }}
                />
              </div>
            </div>
          </div>

          {/* AI Tips */}
          {result.tips && result.tips.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <div style={{ width: 14, height: 14, color: "#f59e0b" }}><Icon.Spark /></div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Pro Tips for Success</div>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {result.tips.map((tip, idx) => (
                  <li key={idx} className="qst-tip-item" style={{ display: "flex", gap: 8, fontSize: 13, color: "#475569", padding: "6px 8px", borderRadius: 6, transition: "background 0.15s" }}>
                    <span style={{ color: "#2563eb" }}>•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={reset} className="qst-btn-secondary" style={{
              flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #e2e8f0",
              background: "#fff", color: "#64748b", fontSize: 14, fontWeight: 600,
              cursor: "pointer", transition: "all 0.15s"
            }}>
              Start Over
            </button>
            <button onClick={() => setStep("posted")} className="qst-btn-primary" style={{
              flex: 2, padding: "12px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(37,99,235,0.3)", transition: "all 0.15s"
            }}>
              Post Task Now
            </button>
          </div>
        </div>
      )}

      {/* ── Step: Posted ── */}
      {step === "posted" && (
        <div className="qst-card" style={{
          background: "#fff", borderRadius: 20, border: "1.5px solid #e2e8f0",
          padding: "40px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center"
        }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <div style={{ width: 32, height: 32 }}><Icon.Check /></div>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 20, color: "#0f172a" }}>Task Posted Successfully!</h3>
          <p style={{ margin: 0, color: "#64748b", fontSize: 14, marginBottom: 24 }}>
            Nearby Runners will be notified shortly.
          </p>
          <button onClick={reset} className="qst-btn-secondary" style={{
            padding: "10px 20px", borderRadius: 12, border: "1.5px solid #e2e8f0",
            background: "#fff", color: "#3b82f6", fontSize: 14, fontWeight: 600,
            cursor: "pointer", transition: "all 0.15s"
          }}>
            Post Another Task
          </button>
        </div>
      )}
    </div>
  );
}

export default AIChatAssistant;
