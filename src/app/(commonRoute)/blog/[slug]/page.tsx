import { Navbar } from "../../_components/shared/navbar/Navbar";
import { getBlogBySlug } from "@/src/services/blogs";
import { IBlog } from "@/src/types/blog";
import Image from "next/image";
import { Clock, Calendar, ArrowLeft, User, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await getBlogBySlug(slug);

  if (!response?.success || !response.data) {
    notFound();
  }

  const blog: IBlog = response.data;
  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-20 transition-colors">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 pt-16">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>
          
          <button className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-primary transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary/10">
              {blog.category}
            </span>
            <span className="text-gray-300 dark:text-gray-700 mx-1">•</span>
            <span className="text-gray-400 text-sm font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              {blog.readTimeMin} min read
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-4 gap-x-8 py-6 border-y border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/10">
                {blog.author.avatarUrl ? (
                  <Image 
                    src={blog.author.avatarUrl} 
                    alt={blog.author.name} 
                    width={48} 
                    height={48} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-black text-gray-900 dark:text-white">{blog.author.name}</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Expert Author</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:pl-8 md:border-l border-gray-100 dark:border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-blue-500">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-black text-gray-900 dark:text-white">{formattedDate}</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Published Date</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
          <Image 
            src={blog.coverImage || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200"} 
            alt={blog.title} 
            fill 
            priority
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        <article className="mt-16 prose prose-lg md:prose-xl dark:prose-invert max-w-none 
          prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-300
          prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-img:rounded-[2rem] prose-img:shadow-2xl
          prose-a:text-primary prose-a:font-bold hover:prose-a:text-primary/80
          prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-2xl prose-blockquote:not-italic prose-blockquote:font-medium">
          <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }} />
        </article>

        <div className="mt-20 p-12 rounded-[3rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[5rem] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Did you find this helpful?</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto text-lg">
              Stay updated with the latest gig economy tips, safety guides, and earning strategies.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
               <Link href="/blog" className="px-10 py-5 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20 dark:shadow-white/10">
                 Explore More Articles
               </Link>
               <button className="px-10 py-5 bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl font-black hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                 Share Article
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
