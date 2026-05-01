import { IBlog } from "@/src/types/blog";
import Image from "next/image";
import Link from "next/link";

export function BlogCard({ blog }: { blog: IBlog }) {
  const formattedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative overflow-hidden aspect-[16/10]">
        <Image
          src={blog.coverImage || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600"}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {blog.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
           {blog.author.avatarUrl && (
             <Image src={blog.author.avatarUrl} alt={blog.author.name} width={20} height={20} className="rounded-full" />
           )}
           <span className="text-xs text-gray-400 font-medium">{blog.author.name} • {formattedDate}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-sm mt-3 line-clamp-3 flex-grow">
          {blog.excerpt}
        </p>

        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
          <Link href={`/blog/${blog.slug}`} className="flex items-center text-sm font-bold text-gray-900 group-hover:gap-2 transition-all">
            Read Article <span className="ml-1">→</span>
          </Link>
          <span className="text-[10px] text-gray-400 font-medium">{blog.readTimeMin} min read</span>
        </div>
      </div>
    </div>
  );
}