"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, Sparkles, TrendingUp, Clock, X, ArrowRight } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Suggestion {
  text: string;
  type: "ai" | "trending" | "recent" | "recommendation";
  icon?: string;
}

interface AISmartSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  context?: "runners" | "tasks";
  data?: any[]; // The loaded data to analyze
  className?: string;
}

// ─── Static trending & recommendation data per context ────────────────────────
const TRENDING: Record<string, Suggestion[]> = {
  runners: [
    { text: "Verified runners", type: "trending", icon: "🏅" },
    { text: "Top-rated near campus", type: "trending", icon: "⭐" },
    { text: "Available today", type: "trending", icon: "🔥" },
    { text: "Grocery specialists", type: "trending", icon: "🛒" },
    { text: "Tech support runners", type: "trending", icon: "💻" },
  ],
  tasks: [
    { text: "Grocery & Shopping", type: "trending", icon: "🛒" },
    { text: "Queue & Waiting", type: "trending", icon: "⏳" },
    { text: "Document Handling", type: "trending", icon: "📄" },
    { text: "Household Help", type: "trending", icon: "🏠" },
    { text: "Tech Help", type: "trending", icon: "💻" },
    { text: "High paying tasks", type: "trending", icon: "💰" },
  ],
};

const RECOMMENDATIONS: Record<string, Suggestion[]> = {
  runners: [
    { text: "5★ rated runners", type: "recommendation", icon: "✨" },
    { text: "Lowest hourly rate", type: "recommendation", icon: "💸" },
    { text: "Most tasks completed", type: "recommendation", icon: "🏆" },
  ],
  tasks: [
    { text: "Easy earn tasks", type: "recommendation", icon: "✨" },
    { text: "Urgent tasks nearby", type: "recommendation", icon: "🚨" },
    { text: "Flexible timing", type: "recommendation", icon: "🕐" },
  ],
};

// ─── Gemini AI suggestions ─────────────────────────────────────────────────────
async function getAISuggestions(
  query: string,
  context: "runners" | "tasks",
  data: any[]
): Promise<string[]> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined" || !query.trim() || query.length < 2) {
    return [];
  }

  const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-flash-latest"];
  const genAI = new GoogleGenerativeAI(apiKey);

  const dataSnapshot =
    context === "runners"
      ? data
          .slice(0, 8)
          .map((r) => ({
            name: r.user?.name || r.name,
            university: r.runnerProfile?.university,
            skills: r.runnerProfile?.skills?.join(", "),
            rate: r.runnerProfile?.hourlyRate,
          }))
      : data
          .slice(0, 8)
          .map((t) => ({
            title: t.title,
            category: t.category?.name,
            price: t.offerPrice,
          }));

  const systemPrompt =
    context === "runners"
      ? `You are a smart search assistant for HelpMate, a task marketplace. Based on the user's partial query and available runners, return exactly 4 short, specific search suggestions (2-5 words each). Return ONLY a JSON array of strings, no explanation.`
      : `You are a smart search assistant for HelpMate, a task marketplace. Based on the user's partial query and available tasks, return exactly 4 short, specific search suggestions (2-5 words each). Return ONLY a JSON array of strings, no explanation.`;

  const userPrompt = `Query: "${query}"
Available ${context}: ${JSON.stringify(dataSnapshot)}
Return 4 relevant search suggestions as JSON array.`;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
        generationConfig: { maxOutputTokens: 200, temperature: 0.6 },
      });
      const result = await model.generateContent(userPrompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) return parsed.slice(0, 4);
    } catch {
      continue;
    }
  }
  return [];
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function AISmartSearch({
  placeholder = "Search...",
  value,
  onChange,
  context = "tasks",
  data = [],
  className = "",
}: AISmartSearchProps) {
  const [focused, setFocused] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Suggestion[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(`hm_recent_${context}`) || "[]"
      );
      setRecentSearches(stored.slice(0, 3));
    } catch {}
  }, [context]);

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    try {
      const stored = JSON.parse(
        localStorage.getItem(`hm_recent_${context}`) || "[]"
      );
      const updated = [
        query,
        ...stored.filter((s: string) => s !== query),
      ].slice(0, 5);
      localStorage.setItem(`hm_recent_${context}`, JSON.stringify(updated));
      setRecentSearches(updated.slice(0, 3));
    } catch {}
  };

  // Debounce AI suggestions fetch
  const fetchAISuggestions = useCallback(
    async (query: string) => {
      if (!query || query.length < 2 || data.length === 0) {
        setAiSuggestions([]);
        return;
      }
      setAiLoading(true);
      try {
        const results = await getAISuggestions(query, context, data);
        setAiSuggestions(
          results.map((text) => ({ text, type: "ai" as const }))
        );
      } catch {
        setAiSuggestions([]);
      } finally {
        setAiLoading(false);
      }
    },
    [context, data]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchAISuggestions(value);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchAISuggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setFocused(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (text: string) => {
    onChange(text);
    saveRecentSearch(text);
    setFocused(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange("");
    setAiSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allSuggestions = buildAllSuggestions();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(allSuggestions[activeIndex].text);
    } else if (e.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
    }
  };

  const buildAllSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    if (value.length >= 2) {
      suggestions.push(...aiSuggestions);
    }
    if (!value) {
      suggestions.push(
        ...recentSearches.map((s) => ({ text: s, type: "recent" as const }))
      );
      suggestions.push(...(TRENDING[context] || []));
      suggestions.push(...(RECOMMENDATIONS[context] || []));
    }
    return suggestions;
  };

  const allSuggestions = buildAllSuggestions();
  const showDropdown = focused && (allSuggestions.length > 0 || aiLoading || value.length === 0);

  const typeConfig = {
    ai: { label: "AI Suggestion", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
    trending: { label: "Trending", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
    recent: { label: "Recent", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    recommendation: { label: "For You", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  };

  // Group suggestions by type for display
  const groups: { title: string; icon: React.ReactNode; items: Suggestion[] }[] = [];

  if (value.length >= 2 && (aiSuggestions.length > 0 || aiLoading)) {
    groups.push({
      title: "AI Suggestions",
      icon: <Sparkles className="w-3.5 h-3.5 text-violet-500" />,
      items: aiSuggestions,
    });
  }
  if (!value && recentSearches.length > 0) {
    groups.push({
      title: "Recent Searches",
      icon: <Clock className="w-3.5 h-3.5 text-blue-500" />,
      items: recentSearches.map((s) => ({ text: s, type: "recent" as const })),
    });
  }
  if (!value) {
    groups.push({
      title: "Trending Now",
      icon: <TrendingUp className="w-3.5 h-3.5 text-orange-500" />,
      items: TRENDING[context] || [],
    });
    groups.push({
      title: "Recommended for You",
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500" />,
      items: RECOMMENDATIONS[context] || [],
    });
  }

  let globalIndex = -1;

  return (
    <div className={`relative flex-1 ${className}`}>
      {/* Input */}
      <div
        className={`relative flex items-center transition-all duration-300 ${
          focused ? "ring-2 ring-primary/30 rounded-2xl" : ""
        }`}
      >
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
            focused ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => {}, 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-14 pl-12 pr-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary transition-all duration-300 font-medium text-gray-900 dark:text-white placeholder:text-muted-foreground shadow-sm"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
        {/* Right indicators */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {aiLoading && (
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
          {!aiLoading && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-50 dark:bg-violet-500/10 border border-violet-200/50 dark:border-violet-500/20">
              <Sparkles className="w-3 h-3 text-violet-500" />
              <span className="text-[10px] font-bold text-violet-500 hidden sm:block">AI</span>
            </div>
          )}
          {value && (
            <button
              onClick={handleClear}
              className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full mt-2 left-0 right-0 z-50 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
            style={{ maxHeight: 420, overflowY: "auto" }}
          >
            {/* AI loading placeholder */}
            {aiLoading && value.length >= 2 && aiSuggestions.length === 0 && (
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
                  <span className="text-xs font-semibold text-violet-500">AI Suggestions</span>
                </div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse"
                      style={{ width: `${70 + i * 10}%` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Groups */}
            {groups.map((group) => {
              if (group.items.length === 0) return null;
              return (
                <div key={group.title} className="border-b border-gray-100 dark:border-white/5 last:border-0">
                  <div className="flex items-center gap-1.5 px-4 pt-3 pb-1.5">
                    {group.icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {group.title}
                    </span>
                  </div>
                  {group.items.map((item) => {
                    globalIndex++;
                    const idx = globalIndex;
                    const cfg = typeConfig[item.type];
                    const isActive = activeIndex === idx;
                    return (
                      <button
                        key={`${item.type}-${item.text}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelect(item.text);
                        }}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-100 group ${
                          isActive
                            ? "bg-primary/5 dark:bg-primary/10"
                            : "hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}
                      >
                        {item.icon ? (
                          <span className="text-base w-6 text-center flex-shrink-0">{item.icon}</span>
                        ) : (
                          <div className={`w-6 h-6 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                            <Search className={`w-3 h-3 ${cfg.color}`} />
                          </div>
                        )}
                        <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {item.text}
                        </span>
                        <ArrowRight
                          className={`w-3.5 h-3.5 text-muted-foreground transition-all duration-150 ${
                            isActive
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-1"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {/* Footer */}
            <div className="px-4 py-2 flex items-center gap-1.5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span className="text-[10px] text-muted-foreground font-medium">
                Powered by Gemini AI · Suggestions update as you type
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
