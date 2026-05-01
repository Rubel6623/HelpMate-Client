"use client";

import { BlogCard } from "@/src/components/blogs/BlogCard";
import { BlogHero } from "@/src/components/blogs/BlogHero";
import { Navbar } from "../_components/shared/navbar/Navbar";
import { useEffect, useState } from "react";
import { getBlogs } from "@/src/services/blogs";
import { IBlog } from "@/src/types/blog";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      let query = "";
      const params = new URLSearchParams();
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (category && category !== "All Categories") params.append("category", category);
      
      query = params.toString();
      
      const response = await getBlogs(query);
      if (response?.success) {
        setBlogs(response.data);
      }
      setLoading(false);
    };

    const timer = setTimeout(() => {
      fetchBlogs();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, category]);

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <Navbar />
      <BlogHero />

      {/* Search & Filter Toolbar */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-y border-gray-100 dark:border-white/5 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for tips, guides..."
              className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 md:w-48 px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option>All Categories</option>
              <option value="EARNING">Earning</option>
              <option value="PRODUCTIVITY">Productivity</option>
              <option value="SAFETY">Safety</option>
              <option value="LIFESTYLE">Lifestyle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {loading ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 dark:bg-white/5 rounded-2xl h-[400px]"></div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-300 dark:text-gray-600">No blogs found</h2>
            <p className="text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Simple Pagination or Load More (Optional) */}
        {!loading && blogs.length >= 10 && (
          <div className="mt-20 text-center">
            <button className="px-8 py-3 bg-black dark:bg-white dark:text-black text-white rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition">
              Load More Articles
            </button>
          </div>
        )}
      </main>
    </div>
  );
}