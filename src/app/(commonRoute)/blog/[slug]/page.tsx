import { Navbar } from "../../_components/shared/navbar/Navbar";
import { getBlogBySlug } from "@/src/services/blogs";
import { IBlog } from "@/src/types/blog";
import Image from "next/image";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
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
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 pt-16">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Articles
        </Link>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              {blog.category}
            </span>
            <span className="text-gray-400 text-sm">•</span>
            <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {blog.readTimeMin} min read
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-6 py-4 border-y border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/10">
                {blog.author.avatarUrl ? (
                  <Image src={blog.author.avatarUrl} alt={blog.author.name} width={48} height={48} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">
                    {blog.author.name[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{blog.author.name}</p>
                <p className="text-xs text-gray-500 font-medium">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-100 dark:border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{formattedDate}</p>
                <p className="text-xs text-gray-500 font-medium">Published</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-12 aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl">
          <Image 
            src={blog.coverImage || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200"} 
            alt={blog.title} 
            fill 
            className="object-cover"
          />
        </div>

        <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-img:rounded-3xl shadow-none">
          <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }} />
        </article>

        <div className="mt-20 p-10 rounded-[3rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">Did you find this helpful?</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Stay updated with the latest tips and guides by following our blog.
          </p>
          <div className="mt-8 flex justify-center gap-4">
             <Link href="/blog" className="px-8 py-4 bg-black dark:bg-white dark:text-black text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl">
               Explore More Articles
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
