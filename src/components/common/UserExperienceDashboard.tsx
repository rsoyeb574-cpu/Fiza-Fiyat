import React, { useState } from 'react';
import { Bookmark, Clock, ArrowLeftRight, Heart, History, Trash2, X, Building2, Package } from 'lucide-react';
import { Project } from '../../types';

interface UserExperienceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Project[];
  onRemoveFavorite: (id: string) => void;
  onSelectProject: (id: string) => void;
}

export const UserExperienceDashboard: React.FC<UserExperienceDashboardProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectProject
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'recent' | 'compare' | 'history'>('bookmarks');

  const [recentHistory] = useState([
    { action: 'Calculated 30x40 Plot Plan in Kolkata', time: '10 mins ago' },
    { action: 'Viewed Grand Azure Villa 3D BIM Model', time: '25 mins ago' },
    { action: 'Downloaded Quotation FH-QT-2026-089 PDF', time: '1 hour ago' }
  ]);

  const [comparisonList] = useState([
    { item1: 'AAC Blocks (6")', item2: 'Red Clay Bricks', diff: 'AAC saves 20% foundation dead load and speeds up masonry by 3x.' },
    { item1: 'PPC Cement', item2: 'OPC 53 Cement', diff: 'PPC provides superior waterproofing with zero thermal micro-cracking.' }
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-fadeIn text-xs">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-white/10 shadow-2xl h-full flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-5 bg-slate-950 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-white text-base">Personal Dashboard & Saved Items</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TABS */}
        <div className="p-3 bg-slate-900 border-b border-white/10 flex gap-1">
          {[
            { id: 'bookmarks', label: `Saved (${favorites.length})`, icon: Heart },
            { id: 'recent', label: 'Recent', icon: Clock },
            { id: 'compare', label: 'Comparisons', icon: ArrowLeftRight },
            { id: 'history', label: 'Activity', icon: History }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === t.id ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'bookmarks' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-400 uppercase text-[10px]">Saved Favorite Projects</h4>
              {favorites.length === 0 ? (
                <div className="text-center text-slate-500 py-10">No saved projects yet. Click the heart icon on any project to bookmark it!</div>
              ) : (
                favorites.map(p => (
                  <div key={p.id} className="p-3 rounded-2xl bg-slate-950 border border-white/10 flex justify-between items-center">
                    <div className="flex gap-3 items-center cursor-pointer" onClick={() => { onSelectProject(p.id); onClose(); }}>
                      <img src={p.heroImage} alt={p.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div>
                        <div className="text-white font-bold text-xs">{p.title}</div>
                        <div className="text-slate-400 text-[10px]">{p.location}</div>
                      </div>
                    </div>
                    <button onClick={() => onRemoveFavorite(p.id)} className="p-2 rounded-xl bg-slate-900 text-rose-400 hover:bg-rose-950 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-400 uppercase text-[10px]">Recently Viewed</h4>
              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-white font-bold text-xs">Grand Azure Villa 3D BIM Walkthrough</div>
                    <div className="text-slate-500 text-[10px]">Viewed today at 02:15 PM</div>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 flex items-center gap-3">
                  <Package className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-white font-bold text-xs">AAC Lightweight Blocks vs Red Bricks Comparison</div>
                    <div className="text-slate-500 text-[10px]">Viewed yesterday</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-400 uppercase text-[10px]">Active Material Comparisons</h4>
              {comparisonList.map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="text-amber-400 font-bold text-xs flex items-center justify-between">
                    <span>{c.item1}</span>
                    <span className="text-slate-500 text-[10px]">vs</span>
                    <span>{c.item2}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{c.diff}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-400 uppercase text-[10px]">Activity History</h4>
              <div className="space-y-2">
                {recentHistory.map((h, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex justify-between items-center text-[11px]">
                    <span className="text-slate-200">{h.action}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
