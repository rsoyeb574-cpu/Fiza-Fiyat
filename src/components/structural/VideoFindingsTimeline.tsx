import React, { useState } from 'react';
import { 
  Film, 
  Play, 
  Clock, 
  AlertTriangle, 
  ChevronRight,
  Eye
} from 'lucide-react';
import { VideoFinding } from '../../types/structuralInspector';

interface VideoFindingsTimelineProps {
  findings: VideoFinding[];
  onSelectTimestamp?: (timestampSeconds: number) => void;
  activeTimestampSeconds?: number;
}

export const VideoFindingsTimeline: React.FC<VideoFindingsTimelineProps> = ({
  findings,
  onSelectTimestamp,
  activeTimestampSeconds
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  if (!findings || findings.length === 0) {
    return null;
  }

  const getConcernBadge = (concern: string) => {
    if (concern.includes('Critical') || concern.includes('High')) {
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
    if (concern.includes('Moderate')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
    return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/80 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-sm sm:text-base">Video Timestamp Keyframe Analysis</h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
          {findings.length} Timestamped Events
        </span>
      </div>

      {/* Interactive Timeline Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {findings.map((item, idx) => {
          const isSelected = selectedIdx === idx || (activeTimestampSeconds !== undefined && item.timestampSeconds === activeTimestampSeconds);
          return (
            <button
              key={idx}
              onClick={() => {
                setSelectedIdx(idx);
                if (onSelectTimestamp) onSelectTimestamp(item.timestampSeconds);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shrink-0 transition-all border ${
                isSelected
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30 scale-105'
                  : 'bg-white/5 text-slate-300 hover:text-white border-white/10 hover:bg-white/10'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{item.timestamp}</span>
              <span className={`w-2 h-2 rounded-full ${item.concernLevel.includes('Critical') || item.concernLevel.includes('High') ? 'bg-red-400' : 'bg-amber-400'}`}></span>
            </button>
          );
        })}
      </div>

      {/* Active Video Finding Card */}
      {findings[selectedIdx] && (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {findings[selectedIdx].timestamp}
              </span>
              <span className="text-sm font-bold text-white">
                {findings[selectedIdx].problem}
              </span>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getConcernBadge(findings[selectedIdx].concernLevel)}`}>
              {findings[selectedIdx].concernLevel}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Visible Evidence:</strong> {findings[selectedIdx].evidence}
          </p>
        </div>
      )}
    </div>
  );
};
