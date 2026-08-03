import React, { useState } from 'react';
import { Image, Video, Box, Sparkles, Eye, X } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryPageProps {
  items: GalleryItem[];
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ items }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = filterType === 'all' 
    ? items 
    : items.filter(i => i.type === filterType);

  return (
    <div className="pt-28 pb-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block">
          Media Hub
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Visual Media Gallery
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          High-resolution architectural renders, 3D wireframes, video walkthroughs, and generative AI visual experiments.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Media' },
          { id: 'image', label: '8K Renders & Photos' },
          { id: 'video', label: 'Video Walkthroughs' },
          { id: '3d', label: '3D Wireframes & BIM' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              filterType === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group relative h-64 rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 cursor-pointer hover:border-blue-500/40 transition-all"
          >
            <img src={item.thumbnailUrl || item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80"></div>
            
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-neutral-950/80 text-blue-400 text-[10px] font-bold border border-blue-500/30 uppercase">
              {item.type}
            </div>

            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <h3 className="text-white font-bold text-sm truncate">{item.title}</h3>
              <p className="text-neutral-400 text-[11px]">{item.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md animate-fadeIn" onClick={() => setActiveItem(null)}>
          <div className="relative max-w-4xl w-full bg-neutral-900 border border-white/10 rounded-3xl p-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              {activeItem.type === 'video' ? (
                <video src={activeItem.url} controls autoPlay className="w-full max-h-[70vh] rounded-2xl object-cover" />
              ) : (
                <img src={activeItem.url} alt={activeItem.title} className="w-full max-h-[70vh] rounded-2xl object-contain" />
              )}
              
              <div className="p-2">
                <h3 className="text-white font-bold text-lg">{activeItem.title}</h3>
                <p className="text-neutral-400 text-xs">{activeItem.category} • Added {activeItem.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
