import React from 'react';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { Project } from '../../types';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Project[];
  onRemoveFavorite: (id: string) => void;
  onSelectProject: (id: string) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectProject
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-neutral-900 border-l border-white/10 h-full p-6 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h3 className="text-base font-bold text-white tracking-tight">Saved Projects ({favorites.length})</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3 text-xs">
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 space-y-2">
              <Heart className="w-8 h-8 text-neutral-600 mx-auto opacity-50" />
              <p>No saved favorite projects yet.</p>
              <p className="text-[11px]">Click the heart icon on any project to bookmark it here.</p>
            </div>
          ) : (
            favorites.map((proj) => (
              <div 
                key={proj.id}
                className="p-3 rounded-2xl bg-neutral-800/60 border border-white/5 hover:border-blue-500/30 flex items-center space-x-3 group transition-all"
              >
                <img src={proj.coverImage} alt={proj.title} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium group-hover:text-blue-400 truncate">{proj.title}</h4>
                  <p className="text-neutral-400 text-[11px] truncate">{proj.categoryName}</p>
                  <button
                    onClick={() => { onSelectProject(proj.id); onClose(); }}
                    className="text-blue-400 text-[11px] font-semibold mt-1 flex items-center gap-1 hover:underline"
                  >
                    View Project <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() => onRemoveFavorite(proj.id)}
                  className="p-2 text-neutral-500 hover:text-red-400 transition-colors shrink-0"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-white/10 text-neutral-500 text-[11px] text-center">
          Favorites stored locally on your device
        </div>
      </div>
    </div>
  );
};
