"use client";

import { useEffect, useState } from "react";
import { getBlogs, deleteBlog } from "@/src/services/blogs";
import { IBlog } from "@/src/types/blog";
import { Plus, Search, Trash2, Edit, ExternalLink, ListTodo } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const response = await getBlogs();
    if (response?.success) {
      setBlogs(response.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      const response = await deleteBlog(id);
      if (response?.success) {
        setBlogs(blogs.filter((b) => b.id !== id));
      }
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white tracking-tight">
            Blog Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage your blog posts.
          </p>
        </div>
        <Link
          href="/dashboard/admin/blogs/create"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-5 h-5" />
          Create New Blog
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-black dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Blog</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-black dark:text-white">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4" colSpan={5}>
                      <div className="h-12 bg-gray-100 dark:bg-white/5 rounded-xl"></div>
                    </td>
                  </tr>
                ))
              ) : filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={blog.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 flex-shrink-0">
                          {blog.coverImage ? (
                            <Image
                              src={blog.coverImage}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ListTodo className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold truncate">{blog.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-bold">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        blog.status === 'PUBLISHED' 
                          ? 'bg-green-100 dark:bg-green-500/10 text-green-600' 
                          : blog.status === 'DRAFT'
                          ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-600'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{blog.viewCount}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                          title="View Live"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/dashboard/admin/blogs/edit/${blog.id}`}
                          className="p-2 hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-500 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-12 text-center text-muted-foreground" colSpan={5}>
                    No blogs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
