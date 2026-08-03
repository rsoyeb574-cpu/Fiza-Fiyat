import React from 'react';
import { ArrowLeft, Clock, Calendar, User, Share2, Sparkles, BookOpen } from 'lucide-react';
import { BlogArticle } from '../types';

interface BlogPostPageProps {
  blog: BlogArticle;
  onBack: () => void;
  onSelectBlog: (id: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ blog, onBack, onSelectBlog }) => {
  return (
    <div className="pt-28 pb-20 space-y-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Journal</span>
      </button>

      {/* Header Info */}
      <div className="space-y-4 text-center">
        <span className="px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
          {blog.category}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center justify-center space-x-6 text-xs text-neutral-400 pt-2">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-blue-400" /> {blog.author}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-400" /> {blog.readTime}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-400" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-[380px] sm:h-[480px] rounded-3xl overflow-hidden border border-white/10">
        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
      </div>

      {/* Main Body */}
      <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 text-neutral-300 text-sm leading-relaxed space-y-6 whitespace-pre-line">
        {blog.content}
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
          <span className="text-xs text-neutral-400 font-semibold mr-2">Tags:</span>
          {blog.tags.map((t) => (
            <span key={t} className="px-3 py-1 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 text-xs">
              #{t}
            </span>
          ))}
        </div>
      )}

    </div>
  );
};
