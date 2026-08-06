import React, { useState } from 'react';
import { ImageIcon, Filter, Folder, Tag, Calendar, Building, Upload, Sparkles, Check } from 'lucide-react';

interface MediaAsset {
  id: string;
  url: string;
  title: string;
  category: 'Architectural' | 'Interior' | 'Exterior' | 'BIM 3D' | 'Site Photo';
  project: string;
  room: string;
  buildingType: string;
  date: string;
  tags: string[];
}

export const AIImageOrganizer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mediaList, setMediaList] = useState<MediaAsset[]>([
    {
      id: 'm-1',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      title: 'Grand Azure Villa Facade',
      category: 'Exterior',
      project: 'Grand Azure Villa',
      room: 'Main Elevation',
      buildingType: 'Residential Villa',
      date: '2026-08-01',
      tags: ['Cantilever', 'Modern Facade', '3D Render']
    },
    {
      id: 'm-2',
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
      title: 'Double-Height Living Hall',
      category: 'Interior',
      project: 'Grand Azure Villa',
      room: 'Living Room',
      buildingType: 'Residential Villa',
      date: '2026-08-02',
      tags: ['Warm Luxury', 'Italian Marble', '3000K Lighting']
    },
    {
      id: 'm-3',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
      title: 'Revit BIM Mechanical Clash Model',
      category: 'BIM 3D',
      project: 'Zurich Office Tower',
      room: 'MEP Plant Room',
      buildingType: 'Commercial Tower',
      date: '2026-08-04',
      tags: ['BIM LOD 500', 'Revit', 'Clash Free']
    }
  ]);

  const [simulatedTitle, setSimulatedTitle] = useState('');

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedTitle.trim()) return;

    const newMedia: MediaAsset = {
      id: `m-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
      title: simulatedTitle,
      category: 'Interior',
      project: 'Smart Residential Project',
      room: 'Master Bedroom',
      buildingType: 'Residential Villa',
      date: new Date().toISOString().split('T')[0],
      tags: ['AI Auto-Tagged', 'Interior Design', 'Lighting']
    };

    setMediaList([newMedia, ...mediaList]);
    setSimulatedTitle('');
    alert('Image auto-tagged and organized by AI Engine!');
  };

  const filtered = selectedCategory === 'All' 
    ? mediaList 
    : mediaList.filter(m => m.category === selectedCategory);

  return (
    <div className="space-y-6 text-xs">
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-cyan-400" />
            <span>AI Automated Media & Image Asset Organizer</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Auto-categorizes uploaded architectural renders & site photos by project, room type, date & computer vision tags.
          </p>
        </div>
      </div>

      {/* UPLOAD SIMULATION & FILTERS */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
        <form onSubmit={handleSimulateUpload} className="flex gap-2">
          <input 
            type="text" 
            value={simulatedTitle}
            onChange={e => setSimulatedTitle(e.target.value)}
            placeholder="Simulate media upload (e.g. Master_Bathroom_Vanity_3D.jpg)"
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-white font-bold"
          />
          <button type="submit" className="px-5 py-2.5 rounded-2xl bg-cyan-600 text-white font-bold flex items-center gap-1 cursor-pointer">
            <Upload className="w-4 h-4" /> AI Upload & Auto-Tag
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <span className="text-slate-400 font-bold uppercase text-[10px] mr-2">Categories:</span>
          {(['All', 'Architectural', 'Interior', 'Exterior', 'BIM 3D', 'Site Photo'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedCategory === cat ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MEDIA GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(media => (
          <div key={media.id} className="p-4 rounded-3xl bg-slate-900 border border-white/10 space-y-3">
            <div className="h-44 rounded-2xl overflow-hidden relative border border-white/10">
              <img src={media.url} alt={media.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                {media.category}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm">{media.title}</h4>
              <div className="text-slate-400 text-[10px] mt-1 space-y-0.5">
                <div>Project: <strong className="text-slate-200">{media.project}</strong></div>
                <div>Room: <strong className="text-slate-200">{media.room}</strong> • {media.buildingType}</div>
                <div>Date Uploaded: <span className="font-mono text-slate-400">{media.date}</span></div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10">
              {media.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-950 border border-white/10 text-slate-400 text-[9px]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
