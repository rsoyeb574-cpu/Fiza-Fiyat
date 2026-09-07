import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Film, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Camera, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldAlert, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Download, 
  X, 
  Info,
  FastForward
} from 'lucide-react';
import { VideoFinding, ConcernLevel, DamageCategory } from '../../types/structuralInspector';

interface VideoFindingsTimelineProps {
  findings: VideoFinding[];
  videoUrl?: string | null;
  videoDurationSeconds?: number;
  extractedFrames?: { data: string; mimeType: string; label: string; seconds: number }[];
  onSelectTimestamp?: (timestampSeconds: number) => void;
  activeTimestampSeconds?: number;
  onSelectFinding?: (findingId: string) => void;
}

export const VideoFindingsTimeline: React.FC<VideoFindingsTimelineProps> = ({
  findings = [],
  videoUrl,
  videoDurationSeconds,
  extractedFrames = [],
  onSelectTimestamp,
  activeTimestampSeconds,
  onSelectFinding
}) => {
  // Determine duration from props, findings, or fallback
  const calculatedDuration = useMemo(() => {
    if (videoDurationSeconds && videoDurationSeconds > 0) return videoDurationSeconds;
    if (findings.length > 0) {
      const maxTime = Math.max(...findings.map(f => f.timestampSeconds));
      return Math.max(15, maxTime + 5);
    }
    return 20;
  }, [videoDurationSeconds, findings]);

  const [duration, setDuration] = useState<number>(calculatedDuration);
  const [currentTime, setCurrentTime] = useState<number>(activeTimestampSeconds || 0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [hoveredFinding, setHoveredFinding] = useState<VideoFinding | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{ xPercent: number; second: number } | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high_critical' | 'moderate_low'>('all');
  const [capturedSnapshot, setCapturedSnapshot] = useState<{ url: string; timestamp: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubberTrackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Synchronize duration if prop changes
  useEffect(() => {
    setDuration(calculatedDuration);
  }, [calculatedDuration]);

  // Sync activeTimestampSeconds from parent if changed externally
  useEffect(() => {
    if (activeTimestampSeconds !== undefined && Math.abs(activeTimestampSeconds - currentTime) > 0.5) {
      seekToTime(activeTimestampSeconds);
    }
  }, [activeTimestampSeconds]);

  // Handle video element time updates
  const handleVideoTimeUpdate = () => {
    if (videoRef.current && !isScrubbing) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      syncSelectedFinding(time);
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration && !isNaN(videoRef.current.duration) && videoRef.current.duration !== Infinity) {
      setDuration(videoRef.current.duration);
    }
  };

  // Simulated playback when video URL is not present (e.g. frame walkthrough simulation)
  useEffect(() => {
    let interval: any;
    if (isPlaying && !videoUrl) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.25 * playbackRate;
          if (next >= duration) {
            setIsPlaying(false);
            return 0;
          }
          syncSelectedFinding(next);
          return next;
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, videoUrl, duration, playbackRate]);

  // Synchronize finding with current timestamp
  const syncSelectedFinding = useCallback((time: number) => {
    if (findings.length === 0) return;
    // Find finding closest to this time within 3.5s window
    let bestIdx = 0;
    let minDiff = Infinity;
    findings.forEach((f, idx) => {
      const diff = Math.abs(f.timestampSeconds - time);
      if (diff < minDiff) {
        minDiff = diff;
        bestIdx = idx;
      }
    });
    if (minDiff <= 3.5) {
      setSelectedIdx(bestIdx);
    }
  }, [findings]);

  // Seek handler
  const seekToTime = (targetSeconds: number) => {
    const clamped = Math.max(0, Math.min(targetSeconds, duration));
    setCurrentTime(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
    syncSelectedFinding(clamped);
    if (onSelectTimestamp) {
      onSelectTimestamp(clamped);
    }
  };

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (videoUrl && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          // Fallback to simulated playback
          setIsPlaying(true);
        });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Cycle playback speed
  const cyclePlaybackRate = () => {
    const speeds = [0.5, 1, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  // Scrubber drag / click interaction
  const handleScrubberPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrubberTrackRef.current) return;
    const rect = scrubberTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(clickX / rect.width, 1));
    const targetSecond = percentage * duration;
    seekToTime(targetSecond);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    handleScrubberPointer(e);
    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!scrubberTrackRef.current) return;
      const rect = scrubberTrackRef.current.getBoundingClientRect();
      const clickX = moveEvent.clientX - rect.left;
      const percentage = Math.max(0, Math.min(clickX / rect.width, 1));
      const targetSecond = percentage * duration;
      seekToTime(targetSecond);
    };
    const onPointerUp = () => {
      setIsScrubbing(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleMouseMoveOverTrack = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberTrackRef.current) return;
    const rect = scrubberTrackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(x / rect.width, 1));
    const second = percentage * duration;
    setHoverInfo({ xPercent: percentage * 100, second });
  };

  // Jump to Next / Previous Anomaly
  const jumpToNextAnomaly = () => {
    if (findings.length === 0) return;
    const sorted = [...findings].sort((a, b) => a.timestampSeconds - b.timestampSeconds);
    const next = sorted.find(f => f.timestampSeconds > currentTime + 0.5);
    if (next) {
      seekToTime(next.timestampSeconds);
    } else {
      // Loop to first
      seekToTime(sorted[0].timestampSeconds);
    }
  };

  const jumpToPrevAnomaly = () => {
    if (findings.length === 0) return;
    const sorted = [...findings].sort((a, b) => a.timestampSeconds - b.timestampSeconds);
    const prev = [...sorted].reverse().find(f => f.timestampSeconds < currentTime - 0.5);
    if (prev) {
      seekToTime(prev.timestampSeconds);
    } else {
      seekToTime(sorted[sorted.length - 1].timestampSeconds);
    }
  };

  // Capture frame snapshot
  const handleCaptureSnapshot = () => {
    const timeFormatted = formatTime(currentTime);
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedSnapshot({ url: dataUrl, timestamp: timeFormatted });
          return;
        }
      } catch (err) {
        console.warn('Direct frame capture restricted:', err);
      }
    }

    // Fallback to active finding thumbnail or extracted frame
    const currentFrame = extractedFrames.find(f => Math.abs(f.seconds - currentTime) < 2.5);
    if (currentFrame) {
      setCapturedSnapshot({ url: currentFrame.data, timestamp: timeFormatted });
    } else if (findings[selectedIdx]?.frameThumbnail) {
      setCapturedSnapshot({ url: findings[selectedIdx].frameThumbnail!, timestamp: findings[selectedIdx].timestamp });
    }
  };

  // Helpers
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConcernBadge = (concern: ConcernLevel) => {
    if (concern.includes('Critical')) {
      return { 
        bg: 'bg-red-500/20 text-red-400 border-red-500/40', 
        pinBg: 'bg-red-500', 
        glow: 'shadow-red-500/50',
        icon: AlertOctagon 
      };
    }
    if (concern.includes('High')) {
      return { 
        bg: 'bg-orange-500/20 text-orange-400 border-orange-500/40', 
        pinBg: 'bg-orange-500', 
        glow: 'shadow-orange-500/50',
        icon: AlertTriangle 
      };
    }
    if (concern.includes('Moderate')) {
      return { 
        bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', 
        pinBg: 'bg-amber-500', 
        glow: 'shadow-amber-500/50',
        icon: AlertTriangle 
      };
    }
    return { 
      bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40', 
      pinBg: 'bg-cyan-500', 
      glow: 'shadow-cyan-500/50',
      icon: CheckCircle2 
    };
  };

  // Filtered findings for anomaly strip
  const filteredFindings = useMemo(() => {
    if (severityFilter === 'high_critical') {
      return findings.filter(f => f.concernLevel.includes('Critical') || f.concernLevel.includes('High'));
    }
    if (severityFilter === 'moderate_low') {
      return findings.filter(f => f.concernLevel.includes('Moderate') || f.concernLevel.includes('Low'));
    }
    return findings;
  }, [findings, severityFilter]);

  // Is current time directly on an anomaly?
  const activeAnomalyInFrame = useMemo(() => {
    return findings.find(f => Math.abs(f.timestampSeconds - currentTime) <= 1.2);
  }, [findings, currentTime]);

  const activeFinding = findings[selectedIdx] || findings[0];

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 border border-white/10 bg-slate-900/90 shadow-2xl space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base sm:text-lg">Video Structural Anomaly Scrubber</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                Timeline Sync
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Scrub through the walkthrough video to pinpoint detected cracks, spalling, and joint distress mapped to exact timestamps.
            </p>
          </div>
        </div>

        {/* Severity Count Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/10">
          <span className="text-[11px] px-2.5 py-1 rounded-lg font-mono text-slate-300">
            Total Anomalies: <strong className="text-cyan-400">{findings.length}</strong>
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
            {findings.filter(f => f.concernLevel.includes('Critical') || f.concernLevel.includes('High')).length} High/Critical
          </span>
        </div>
      </div>

      {/* VIDEO PLAYER & INSPECTION HUD */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video max-h-[420px] flex items-center justify-center group shadow-2xl">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            muted={isMuted}
            onTimeUpdate={handleVideoTimeUpdate}
            onLoadedMetadata={handleVideoLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          />
        ) : (
          // Walkthrough frame preview when direct video file is unavailable
          <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
            {(() => {
              // Find matching frame near current time
              const matchingFrame = extractedFrames.find(f => Math.abs(f.seconds - currentTime) < 2.0)
                || extractedFrames[0];
              const displayUrl = matchingFrame?.data || activeFinding?.frameThumbnail || findings[0]?.frameThumbnail;

              return displayUrl ? (
                <img 
                  src={displayUrl} 
                  alt="Video frame preview" 
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="text-center p-8 text-slate-500">
                  <Film className="w-12 h-12 mx-auto mb-2 opacity-40 text-cyan-400" />
                  <p className="text-xs">Video walkthrough stream ready for timeline inspection</p>
                </div>
              );
            })()}

            {/* Grid overlay for technical inspection look */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
          </div>
        )}

        {/* HUD OVERLAY: Top Status Bar */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-lg">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Current Anomaly Warning Pill in HUD */}
            {activeAnomalyInFrame && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 rounded-lg bg-red-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-red-400 shadow-xl shadow-red-600/30"
              >
                <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
                <span className="truncate max-w-[200px]">{activeAnomalyInFrame.problem}</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/40">
                  {activeAnomalyInFrame.timestamp}
                </span>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleCaptureSnapshot}
              title="Capture Current Frame Snapshot"
              className="p-2 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-slate-200 hover:text-white border border-white/15 transition-all cursor-pointer shadow-lg"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* HUD OVERLAY: Center Big Play Button on hover / paused */}
        {!isPlaying && (
          <button
            onClick={togglePlayPause}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-cyan-600/90 hover:bg-cyan-500 text-white flex items-center justify-center backdrop-blur-md shadow-2xl shadow-cyan-600/50 hover:scale-110 transition-all cursor-pointer z-10"
          >
            <Play className="w-7 h-7 ml-1 fill-white" />
          </button>
        )}

        {/* HUD OVERLAY: Bottom Gradient Bar */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* ========================================================= */}
      {/* THE VISUAL TIMELINE SCRUBBER WITH ANOMALY MAPPINGS */}
      {/* ========================================================= */}
      <div className="space-y-2 pt-1">
        
        {/* Timeline Time Labels & Quick Navigation */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">{formatTime(currentTime)}</span>
            <span className="text-slate-600">/</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={jumpToPrevAnomaly}
              className="text-[11px] font-sans px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" /> Prev Flaw
            </button>
            <button
              onClick={jumpToNextAnomaly}
              className="text-[11px] font-sans px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
            >
              Next Flaw <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Interactive Scrubber Track Box */}
        <div 
          ref={scrubberTrackRef}
          onPointerDown={handlePointerDown}
          onMouseMove={handleMouseMoveOverTrack}
          onMouseLeave={() => setHoverInfo(null)}
          className="relative h-14 bg-slate-950 rounded-2xl border border-white/15 p-2 flex items-center cursor-pointer select-none overflow-visible group/track shadow-inner"
        >
          {/* Subtle Grid Ruler Ticks along the track */}
          <div className="absolute inset-x-4 inset-y-0 flex justify-between items-center pointer-events-none opacity-20">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-0.5 h-3 bg-white rounded-full" />
            ))}
          </div>

          {/* Anomaly Distress Heatmap Underlay: Highlighted danger zones on the track */}
          {findings.map((finding, idx) => {
            const centerPercent = (finding.timestampSeconds / duration) * 100;
            const isCritical = finding.concernLevel.includes('Critical') || finding.concernLevel.includes('High');
            return (
              <div
                key={`heat-${idx}`}
                style={{
                  left: `${Math.max(0, centerPercent - 3)}%`,
                  width: '6%'
                }}
                className={`absolute top-0 bottom-0 pointer-events-none rounded-lg opacity-25 blur-sm transition-opacity ${
                  isCritical ? 'bg-red-500' : 'bg-amber-500'
                }`}
              />
            );
          })}

          {/* Track Bar Background */}
          <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/10">
            {/* Played Progress Bar */}
            <div 
              style={{ width: `${(currentTime / duration) * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-400 transition-all duration-75"
            />
          </div>

          {/* Hover indicator bar when moving mouse across track */}
          {hoverInfo && (
            <div
              style={{ left: `${hoverInfo.xPercent}%` }}
              className="absolute top-1 bottom-1 w-0.5 bg-white/40 pointer-events-none z-20 flex flex-col items-center"
            >
              <div className="absolute -top-7 px-1.5 py-0.5 rounded bg-slate-900 border border-white/20 text-[10px] font-mono text-slate-200 shadow-lg whitespace-nowrap">
                {formatTime(hoverInfo.second)}
              </div>
            </div>
          )}

          {/* MAPPED ANOMALY PINS ON TIMELINE */}
          {findings.map((finding, idx) => {
            const leftPercent = Math.min(97, Math.max(3, (finding.timestampSeconds / duration) * 100));
            const badge = getConcernBadge(finding.concernLevel);
            const Icon = badge.icon;
            const isCurrent = Math.abs(finding.timestampSeconds - currentTime) <= 1.0;
            const isSelected = selectedIdx === idx;

            return (
              <div
                key={idx}
                style={{ left: `${leftPercent}%` }}
                onMouseEnter={() => setHoveredFinding(finding)}
                onMouseLeave={() => setHoveredFinding(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  seekToTime(finding.timestampSeconds);
                  setSelectedIdx(idx);
                  if (onSelectFinding) onSelectFinding(finding.problem);
                }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 cursor-pointer group/pin"
              >
                {/* Visual Pin Pulse on Current / Critical */}
                {(isCurrent || isSelected) && (
                  <span className={`absolute -inset-1.5 rounded-full ${badge.pinBg} opacity-75 animate-ping pointer-events-none`} />
                )}

                {/* The Pin Body */}
                <div className={`relative flex items-center justify-center transition-transform duration-200 ${
                  isSelected || isCurrent ? 'scale-125' : 'hover:scale-125'
                }`}>
                  <div className={`w-6 h-6 rounded-full ${badge.pinBg} border-2 border-white text-white flex items-center justify-center shadow-lg ${badge.glow}`}>
                    <Icon className="w-3 h-3 stroke-[2.5]" />
                  </div>

                  {/* Timestamp Chip Tag above pin */}
                  <div className={`absolute -bottom-6 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap border transition-all ${
                    isSelected || isCurrent
                      ? 'bg-white text-slate-950 border-white shadow-md'
                      : 'bg-slate-950/90 text-slate-300 border-white/10 group-hover/pin:text-white'
                  }`}>
                    {finding.timestamp}
                  </div>
                </div>

                {/* Floating Interactive Hover Tooltip */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 p-3 rounded-xl bg-slate-950/95 border border-white/20 shadow-2xl backdrop-blur-xl opacity-0 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:pointer-events-auto transition-all duration-200 z-50 space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {finding.timestamp}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${badge.bg}`}>
                      {finding.concernLevel}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-white leading-snug">
                    {finding.problem}
                  </h5>

                  <p className="text-[11px] text-slate-300 leading-tight line-clamp-2">
                    {finding.evidence}
                  </p>

                  <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-cyan-400 font-semibold">
                    <span>Click to jump video</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* PLAYHEAD SCRUBBER THUMB */}
          <div
            style={{ left: `${(currentTime / duration) * 100}%` }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-40 pointer-events-none"
          >
            <div className="w-4 h-9 rounded-md bg-white border border-slate-400 shadow-xl flex items-center justify-center">
              <div className="w-0.5 h-4 bg-slate-600 rounded-full" />
            </div>
            {/* Vertical scanning laser line */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-2 bg-cyan-400 opacity-60" />
          </div>
        </div>
      </div>

      {/* PLAYBACK CONTROLS STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/80 border border-white/10">
        
        {/* Left Controls: Play/Pause, Replay, Frame Step */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={togglePlayPause}
            className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-600/20 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => seekToTime(0)}
            title="Replay from 00:00"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => seekToTime(currentTime - 1)}
            title="Step Back 1s"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
          >
            -1s
          </button>

          <button
            onClick={() => seekToTime(currentTime + 1)}
            title="Step Forward 1s"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
          >
            +1s
          </button>
        </div>

        {/* Middle: Speed Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden md:inline">Speed:</span>
          <button
            onClick={cyclePlaybackRate}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{playbackRate}x</span>
          </button>

          {videoUrl && (
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (videoRef.current) videoRef.current.muted = !isMuted;
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Right: Snapshot & Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCaptureSnapshot}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Snapshot Frame</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SYNCHRONIZED ACTIVE ANOMALY INSPECTION CARD */}
      {/* ========================================================= */}
      {activeFinding && (
        <motion.div
          key={activeFinding.timestamp}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-white/15 space-y-4 shadow-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => seekToTime(activeFinding.timestampSeconds)}
                className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-cyan-600/30"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Jump to {activeFinding.timestamp}</span>
              </button>

              <h4 className="text-base font-bold text-white">
                {activeFinding.problem}
              </h4>
            </div>

            {(() => {
              const badge = getConcernBadge(activeFinding.concernLevel);
              const Icon = badge.icon;
              return (
                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.bg}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {activeFinding.concernLevel}
                </span>
              );
            })()}
          </div>

          {/* Location & Evidence Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {activeFinding.location && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400 font-semibold block mb-0.5">Observed Structural Location:</span>
                <span className="text-slate-200 font-medium">{activeFinding.location}</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-slate-400 font-semibold block mb-0.5">Timeline Position:</span>
              <span className="text-cyan-300 font-mono">
                {activeFinding.timestamp} ({activeFinding.timestampSeconds}s mark)
              </span>
            </div>
          </div>

          {/* Visible Evidence */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block mb-1">Visual Evidence in Video Frame:</strong>
            {activeFinding.evidence}
          </div>

          {/* Possible Contributing Causes */}
          {activeFinding.possibleCauses && activeFinding.possibleCauses.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Possible Engineering Causes (Subject to on-site testing):
              </span>
              <div className="flex flex-wrap gap-2">
                {activeFinding.possibleCauses.map((cause, cIdx) => (
                  <span 
                    key={cIdx}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-1.5"
                  >
                    <span className="text-cyan-400">&bull;</span>
                    {cause}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Engineering Action */}
          {activeFinding.recommendedAction && (
            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 block mb-0.5">Recommended Field Action:</strong>
                <span>{activeFinding.recommendedAction}</span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* FILTERABLE TIMESTAMPED ANOMALY CARDS CAROUSEL / STRIP */}
      {/* ========================================================= */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>All Timestamped Video Findings ({filteredFindings.length})</span>
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setSeverityFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                severityFilter === 'all' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSeverityFilter('high_critical')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                severityFilter === 'high_critical' ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              High & Critical
            </button>
            <button
              onClick={() => setSeverityFilter('moderate_low')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                severityFilter === 'moderate_low' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Moderate/Low
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {filteredFindings.map((item, idx) => {
            const isSelected = selectedIdx === idx || Math.abs(item.timestampSeconds - currentTime) <= 1.5;
            const badge = getConcernBadge(item.concernLevel);
            const Icon = badge.icon;

            return (
              <div
                key={idx}
                onClick={() => {
                  seekToTime(item.timestampSeconds);
                  setSelectedIdx(idx);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                    : 'bg-slate-950/60 hover:bg-slate-950 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Thumbnail if present */}
                {item.frameThumbnail && (
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-white/10">
                    <img 
                      src={item.frameThumbnail} 
                      alt={item.problem}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-cyan-300">
                      {item.timestamp}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${badge.bg}`}>
                      {item.concernLevel.replace(' concern', '')}
                    </span>
                  </div>

                  <h6 className="text-xs font-bold text-white line-clamp-2">
                    {item.problem}
                  </h6>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {item.evidence}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-cyan-400 font-medium">
                  <span>Scrub to frame</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FRAME SNAPSHOT MODAL */}
      <AnimatePresence>
        {capturedSnapshot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full rounded-3xl bg-slate-900 border border-white/20 overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-white text-base">
                    Captured Video Frame ({capturedSnapshot.timestamp})
                  </h4>
                </div>
                <button
                  onClick={() => setCapturedSnapshot(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video flex items-center justify-center">
                <img
                  src={capturedSnapshot.url}
                  alt="Captured Frame"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 font-mono">
                  Timestamp: {capturedSnapshot.timestamp} &bull; Ready for damage audit
                </span>
                <a
                  href={capturedSnapshot.url}
                  download={`structural-video-frame-${capturedSnapshot.timestamp.replace(':', '-')}.jpg`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download Frame Snapshot
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
