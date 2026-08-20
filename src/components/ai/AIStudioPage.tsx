import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Wand2, 
  Download, 
  Eye, 
  RefreshCw, 
  AlertTriangle, 
  Crown, 
  Building2, 
  Layers, 
  CheckCircle2, 
  Upload, 
  Film, 
  Maximize2, 
  X, 
  Info,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlan } from '../../context/PlanContext';
import { Project } from '../../types';
import { AIGenerationRecord } from '../../types/userProfile';
import { PLANS } from '../../config/plans';
import { fetchAndDiagnoseAI } from '../../utils/aiDiagnostics';

interface AIStudioPageProps {
  projects: Project[];
  onNavigateToPricing?: () => void;
}

const PRESET_CONTEXTS = [
  'Modern 3BHK House',
  'Luxury Villa',
  'Interior Design',
  'Building Elevation',
  'Construction Project',
  'Floor Plan',
  'Commercial Building',
  'Landscape & Garden Design',
  'BIM 3D Model Rendering'
];

const STYLES = [
  'Photorealistic',
  'Architectural',
  'Interior',
  'Exterior',
  'Modern',
  'Luxury',
  'Cinematic',
  'Day',
  'Night'
];

const IMAGE_PROMPT_SUGGESTIONS = [
  'Photorealistic exterior elevation of a modern 3-storey villa with wood louvers, glass balconies, and warm evening spotlighting',
  'Contemporary luxury living room interior with double-height ceiling, Italian grey marble flooring, and panoramic glass walls',
  '3D architectural floor plan layout for a modern 3BHK house with master suite, open kitchen, and balcony garden',
  'Modern commercial glass facade building entrance with sleek canopy and outdoor landscape design'
];

const VIDEO_PROMPT_SUGGESTIONS = [
  'Smooth 3D camera walkthrough moving through a luxury open-plan living room into a sunlit courtyard garden',
  'Cinematic drone swoop over a modern luxury villa showing the building elevation, infinity pool, and surrounding landscape at sunset',
  'Slow pan architectural animation highlighting the facade materials, glass reflections, and ambient lighting of a modern house'
];

export const AIStudioPage: React.FC<AIStudioPageProps> = ({ projects, onNavigateToPricing }) => {
  const { user } = useAuth();
  const { plan, usage, refreshPlan } = usePlan();

  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  // Shared Form State
  const [selectedContext, setSelectedContext] = useState<string>(PRESET_CONTEXTS[0]);
  const [customContext, setCustomContext] = useState<string>('');

  // Image Form State
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageStyle, setImageStyle] = useState<string>('Photorealistic');
  const [imageAspectRatio, setImageAspectRatio] = useState<string>('16:9');
  const [imageResolution, setImageResolution] = useState<string>('1K');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [generatedImageResult, setGeneratedImageResult] = useState<AIGenerationRecord | null>(null);

  // Video Form State
  const [videoPrompt, setVideoPrompt] = useState<string>('');
  const [videoAspectRatio, setVideoAspectRatio] = useState<string>('16:9');
  const [includeAudio, setIncludeAudio] = useState<boolean>(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState<string>('');
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [generatedVideoResult, setGeneratedVideoResult] = useState<AIGenerationRecord | null>(null);

  // History state
  const [history, setHistory] = useState<AIGenerationRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [modalMedia, setModalMedia] = useState<AIGenerationRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProjectContext = customContext.trim() || selectedContext;

  const currentPlanConfig = PLANS[plan] || PLANS.free;
  const imageLimit = currentPlanConfig.limits.imageGenerationsLimit;
  const imageUsed = usage.imageGenerationsUsed || 0;
  const imageRemaining = Math.max(0, imageLimit - imageUsed);

  const videoLimit = currentPlanConfig.limits.videoGenerationsLimit;
  const videoUsed = usage.videoGenerationsUsed || 0;
  const videoRemaining = Math.max(0, videoLimit - videoUsed);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const diag = await fetchAndDiagnoseAI<any>('/api/ai/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.uid })
      }, 'AI History');
      const data = diag.data;
      if (data && data.status === 'success' && Array.isArray(data.history)) {
        setHistory(data.history);
      }
    } catch (err) {
      console.warn('Failed to load generation history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Image Generation Handler
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setImageError('Please enter a prompt for image generation.');
      return;
    }

    if (imageRemaining <= 0) {
      setImageError('You have reached your AI generation limit. Upgrade your plan to continue.');
      return;
    }

    if (imageResolution === '4K' && !currentPlanConfig.limits.allow4kImage) {
      setImageError('4K Image Generation is available on the PRO plan. Upgrade your plan to generate 4K images.');
      return;
    }

    setIsGeneratingImage(true);
    setImageError(null);
    setGeneratedImageResult(null);

    try {
      const diag = await fetchAndDiagnoseAI<any>('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || null,
          userEmail: user?.email || null,
          projectId: 'current_studio_project',
          projectContext: activeProjectContext,
          prompt: imagePrompt.trim(),
          style: imageStyle,
          aspectRatio: imageAspectRatio,
          resolution: imageResolution
        })
      }, 'AI Image Generation');

      const data = diag.data || {};

      if (diag.status === 429 || data.code === 'LIMIT_REACHED' || data.error === 'LIMIT_REACHED') {
        setImageError('You have reached your AI generation limit. Upgrade your plan to continue.');
        await refreshPlan();
        return;
      }

      if (data.status === 'error') {
        setImageError(data.message || 'Image generation failed. Please try again.');
        return;
      }

      if (diag.ok && data.status === 'success' && data.data) {
        setGeneratedImageResult(data.data);
        setHistory(prev => [data.data, ...prev]);
        await refreshPlan();
      } else {
        const fallbackMsg = diag.nonJsonType === 'html_error' 
          ? 'AI image engine is preparing. Please try again in a few seconds.'
          : (data.message || 'Unexpected error during image generation.');
        setImageError(fallbackMsg);
      }
    } catch (err: any) {
      console.error('Image generation client error:', err);
      setImageError(err.message || 'Network error generating image.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Video Generation Handler with Polling
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) {
      setVideoError('Please enter a prompt for video generation.');
      return;
    }

    if (videoRemaining <= 0) {
      setVideoError('You have reached your AI generation limit. Upgrade your plan to continue.');
      return;
    }

    if (includeAudio && !currentPlanConfig.limits.allowVideoAudio) {
      setVideoError('AI Video Audio is available on the PRO plan. Upgrade your plan to generate video audio.');
      return;
    }

    setIsGeneratingVideo(true);
    setVideoError(null);
    setGeneratedVideoResult(null);
    setVideoProgress(10);
    setVideoStatusMessage('Validating project context and initiating Veo video engine...');

    try {
      // 1. Start Video Generation
      const diagStart = await fetchAndDiagnoseAI<any>('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || null,
          userEmail: user?.email || null,
          projectId: 'current_studio_project',
          projectContext: activeProjectContext,
          prompt: videoPrompt.trim(),
          referenceImage,
          aspectRatio: videoAspectRatio,
          includeAudio
        })
      }, 'AI Video Start');

      const startData = diagStart.data || {};

      if (startData.code === 'QUOTA_EXHAUSTED' || startData.error === 'QUOTA_EXHAUSTED') {
        setVideoError(startData.message || 'AI video generation is temporarily unavailable because the video generation quota is exhausted. Please try again later or contact support.');
        setIsGeneratingVideo(false);
        return;
      }

      if (diagStart.status === 429 && (startData.code === 'LIMIT_REACHED' || startData.error === 'LIMIT_REACHED')) {
        setVideoError('You have reached your AI generation limit. Upgrade your plan to continue.');
        setIsGeneratingVideo(false);
        await refreshPlan();
        return;
      }

      if (startData.status === 'error' || !startData.operationName) {
        setVideoError(startData.message || (diagStart.nonJsonType === 'html_error' ? 'AI video engine is initializing. Please try again in a moment.' : 'Video generation failed.'));
        setIsGeneratingVideo(false);
        return;
      }

      const { operationName, generationId, record } = startData;

      // 2. Poll Status
      let done = false;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max

      const statusMessages = [
        'Analyzing architectural geometry & project context...',
        'Synthesizing 3D camera trajectory with Veo 3.1...',
        'Applying photorealistic PBR shaders & daylight ray tracing...',
        'Rendering 8-second high-definition MP4 video frames...',
        'Finalizing media encoding & stream payload...'
      ];

      while (!done && attempts < maxAttempts) {
        attempts++;
        await new Promise(r => setTimeout(r, 5000)); // wait 5s

        const msgIdx = Math.min(attempts % statusMessages.length, statusMessages.length - 1);
        setVideoStatusMessage(statusMessages[msgIdx]);
        setVideoProgress(Math.min(92, 15 + attempts * 4));

        const pollDiag = await fetchAndDiagnoseAI<any>('/api/ai/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.uid || null,
            userEmail: user?.email || null,
            operationName,
            generationId
          })
        }, 'AI Video Poll');

        const pollData = pollDiag.data || {};

        if (pollData.status === 'completed' && pollData.done && pollData.resultUrl) {
          done = true;
          setVideoProgress(100);
          setVideoStatusMessage('Video rendering completed successfully!');

          const completedRecord: AIGenerationRecord = {
            ...record,
            status: 'completed',
            resultUrl: pollData.resultUrl
          };

          setGeneratedVideoResult(completedRecord);
          setHistory(prev => [completedRecord, ...prev]);
          await refreshPlan();
          break;
        }

        if (pollData.status === 'error') {
          setVideoError(pollData.message || 'Video generation status failed.');
          break;
        }
      }

      if (!done && !videoError) {
        setVideoError('Video generation timed out. Please check your history later.');
      }
    } catch (err: any) {
      console.error('Video generation client error:', err);
      setVideoError(err.message || 'Network error generating video.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Reference image size must be under 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setReferenceImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Plan Counter Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-violet-900/40 via-indigo-900/30 to-blue-900/40 p-6 md:p-10 border border-violet-500/20 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>FIZA AI STUDIO • ARCHITECTURAL GENERATIVE ENGINE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                AI Image & Video Studio
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white uppercase shadow-sm">
                  Veo & Gemini 3.1
                </span>
              </h1>
              <p className="mt-2 text-slate-300 text-sm max-w-2xl leading-relaxed">
                Generate high-resolution 3D renders, BIM elevations, luxury interior concepts, and 8-second cinematic walkthrough animations tied directly to your project context.
              </p>
            </div>

            {/* Quotas & Upgrade Card */}
            <div className="bg-[#151B2E]/90 p-5 rounded-2xl border border-indigo-500/30 shadow-lg space-y-4 min-w-[280px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  Plan: <span className="text-white font-bold">{plan.toUpperCase()}</span>
                </span>
                {onNavigateToPricing && (
                  <button
                    onClick={onNavigateToPricing}
                    className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    Upgrade <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Image Limit</span>
                  <span className="text-white font-bold text-sm">
                    {imageRemaining} <span className="text-slate-400 font-normal">/ {imageLimit} left</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Video Limit</span>
                  <span className="text-white font-bold text-sm">
                    {videoRemaining} <span className="text-slate-400 font-normal">/ {videoLimit} left</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Workspace Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('image')}
            className={`px-6 py-3 rounded-2xl font-medium text-sm transition-all flex items-center space-x-2.5 cursor-pointer ${
              activeTab === 'image'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 border border-violet-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>AI IMAGE GENERATOR</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/30 border border-white/10">
              {imageRemaining} LEFT
            </span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-6 py-3 rounded-2xl font-medium text-sm transition-all flex items-center space-x-2.5 cursor-pointer ${
              activeTab === 'video'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 border border-violet-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Video className="w-4 h-4 text-violet-300" />
            <span>AI VIDEO GENERATOR (Veo 3.1)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/30 border border-white/10">
              {videoRemaining} LEFT
            </span>
          </button>
        </div>

        {/* Global Project Context Selector */}
        <div className="bg-[#151B2E] p-5 rounded-2xl border border-indigo-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-violet-300 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-violet-400" />
              <span>Project Context (Required for Validation)</span>
            </label>
            <span className="text-[11px] text-slate-400">
              All AI generations must be strictly related to your selected project.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <select
                value={selectedContext}
                onChange={(e) => {
                  setSelectedContext(e.target.value);
                  setCustomContext('');
                }}
                className="w-full bg-[#0B1020] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
              >
                {PRESET_CONTEXTS.map((ctx) => (
                  <option key={ctx} value={ctx}>{ctx}</option>
                ))}
                {projects.map((p) => (
                  <option key={p.id} value={p.title}>{p.title} ({p.categoryName || 'Project'})</option>
                ))}
              </select>
            </div>

            <div>
              <input
                type="text"
                placeholder="Or type custom project name / context..."
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                className="w-full bg-[#0B1020] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* TAB 1: IMAGE GENERATOR */}
        {activeTab === 'image' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Control Panel (7 Cols) */}
            <div className="lg:col-span-7 bg-[#151B2E] p-6 md:p-8 rounded-3xl border border-indigo-500/20 shadow-2xl space-y-6">
              
              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Image Generation Prompt</span>
                  <span className="text-slate-500 font-normal">High architectural precision</span>
                </label>
                <textarea
                  rows={4}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder={`Describe the architectural scene or interior for ${activeProjectContext}...`}
                  className="w-full bg-[#0B1020] border border-slate-700/80 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 leading-relaxed"
                />
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-medium">Quick Suggestions:</span>
                <div className="flex flex-wrap gap-2">
                  {IMAGE_PROMPT_SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImagePrompt(sug)}
                      className="text-xs text-slate-300 bg-slate-800/60 hover:bg-violet-600/20 hover:text-violet-200 border border-slate-700/50 rounded-xl px-3 py-1.5 transition-all text-left"
                    >
                      + {sug.slice(0, 45)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Style Preset</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setImageStyle(st)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        imageStyle === st
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                          : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700 border border-slate-700/50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio & Resolution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Aspect Ratio */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Aspect Ratio</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1:1', '4:5', '16:9', '9:16'].map((ar) => (
                      <button
                        key={ar}
                        type="button"
                        onClick={() => setImageAspectRatio(ar)}
                        className={`py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer text-center ${
                          imageAspectRatio === ar
                            ? 'bg-indigo-600 text-white border border-indigo-400/50'
                            : 'bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:bg-slate-700'
                        }`}
                      >
                        {ar}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resolution */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Resolution</span>
                    {!currentPlanConfig.limits.allow4kImage && (
                      <span className="text-[10px] text-amber-400 font-mono">4K = PRO Only</span>
                    )}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1K', '2K', '4K'].map((res) => {
                      const disabled = res === '4K' && !currentPlanConfig.limits.allow4kImage;
                      return (
                        <button
                          key={res}
                          type="button"
                          disabled={disabled}
                          onClick={() => setImageResolution(res)}
                          className={`py-2 rounded-xl text-xs font-mono font-medium transition-all text-center relative ${
                            imageResolution === res
                              ? 'bg-indigo-600 text-white border border-indigo-400/50'
                              : disabled
                              ? 'bg-slate-900/40 text-slate-600 border border-slate-800 cursor-not-allowed'
                              : 'bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:bg-slate-700'
                          }`}
                        >
                          {res}
                          {res === '4K' && disabled && (
                            <span className="absolute -top-1.5 -right-1 px-1 bg-amber-500 text-black text-[8px] font-bold rounded">
                              PRO
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {imageError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{imageError}</p>
                    {imageRemaining <= 0 && onNavigateToPricing && (
                      <button
                        onClick={onNavigateToPricing}
                        className="text-rose-200 underline font-medium hover:text-white cursor-pointer"
                      >
                        Upgrade your plan now to get more AI generations.
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || imageRemaining <= 0}
                className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl flex items-center justify-center space-x-2 cursor-pointer ${
                  isGeneratingImage || imageRemaining <= 0
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-violet-600/30'
                }`}
              >
                {isGeneratingImage ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Rendering Architectural Visual...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>GENERATE AI IMAGE</span>
                  </>
                )}
              </button>
            </div>

            {/* Preview Output (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#151B2E] p-6 rounded-3xl border border-indigo-500/20 shadow-2xl min-h-[420px] flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span>Generation Result</span>
                  </span>
                  {generatedImageResult && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      SUCCESS
                    </span>
                  )}
                </div>

                {isGeneratingImage ? (
                  <div className="my-auto py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center animate-pulse">
                      <Wand2 className="w-8 h-8 text-violet-400 animate-spin" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Synthesizing Architectural Geometry...</p>
                      <p className="text-slate-400 text-xs mt-1">Applying style presets for {activeProjectContext}</p>
                    </div>
                  </div>
                ) : generatedImageResult?.resultUrl ? (
                  <div className="my-auto space-y-4">
                    <div className="relative group rounded-2xl overflow-hidden border border-violet-500/30 bg-slate-900 shadow-xl">
                      <img
                        src={generatedImageResult.resultUrl}
                        alt={generatedImageResult.prompt}
                        className="w-full h-auto object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 p-4">
                        <button
                          onClick={() => setModalMedia(generatedImageResult)}
                          className="p-3 rounded-xl bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all cursor-pointer"
                          title="Full Screen View"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>
                        <a
                          href={generatedImageResult.resultUrl}
                          download={`fiza_render_${Date.now()}.png`}
                          className="p-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-lg transition-all cursor-pointer"
                          title="Download HD Image"
                        >
                          <Download className="w-5 h-5" />
                        </a>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
                      <p className="text-slate-300 font-medium line-clamp-2">"{generatedImageResult.prompt}"</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                        <span>Style: {generatedImageResult.style}</span>
                        <span>Res: {generatedImageResult.resolution || '1K'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="my-auto py-16 flex flex-col items-center justify-center text-center space-y-3 text-slate-500">
                    <ImageIcon className="w-12 h-12 text-slate-700" />
                    <p className="text-sm">Your generated architectural image will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VIDEO GENERATOR */}
        {activeTab === 'video' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Control Panel (7 Cols) */}
            <div className="lg:col-span-7 bg-[#151B2E] p-6 md:p-8 rounded-3xl border border-indigo-500/20 shadow-2xl space-y-6">
              
              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Video Motion Prompt (Veo 3.1 Model)</span>
                  <span className="text-slate-500 font-normal">8-Second Walkthrough</span>
                </label>
                <textarea
                  rows={4}
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder={`Describe camera motion and architectural walkthrough scene for ${activeProjectContext}...`}
                  className="w-full bg-[#0B1020] border border-slate-700/80 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 leading-relaxed"
                />
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-medium">Quick Walkthrough Suggestions:</span>
                <div className="flex flex-wrap gap-2">
                  {VIDEO_PROMPT_SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setVideoPrompt(sug)}
                      className="text-xs text-slate-300 bg-slate-800/60 hover:bg-violet-600/20 hover:text-violet-200 border border-slate-700/50 rounded-xl px-3 py-1.5 transition-all text-left"
                    >
                      + {sug.slice(0, 48)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference Image Upload (Image to Video) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Reference Image (Optional Image-to-Video)</span>
                  {referenceImage && (
                    <button
                      onClick={() => setReferenceImage(null)}
                      className="text-rose-400 text-[11px] hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {referenceImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-violet-500/30 h-32 bg-slate-900 flex items-center justify-center">
                    <img src={referenceImage} alt="Reference" className="h-full object-contain" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-24 rounded-2xl border-2 border-dashed border-slate-700 hover:border-violet-500/50 bg-[#0B1020] flex flex-col items-center justify-center space-y-1.5 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-violet-400" />
                    <span className="text-xs font-medium">Click to upload starting render / photo</span>
                  </button>
                )}
              </div>

              {/* Aspect Ratio, Duration & Audio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Aspect Ratio */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Aspect Ratio</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['16:9', '9:16'].map((ar) => (
                      <button
                        key={ar}
                        type="button"
                        onClick={() => setVideoAspectRatio(ar)}
                        className={`py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer text-center ${
                          videoAspectRatio === ar
                            ? 'bg-indigo-600 text-white border border-indigo-400/50'
                            : 'bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:bg-slate-700'
                        }`}
                      >
                        {ar}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Duration</label>
                  <div className="py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs font-mono text-center text-slate-200">
                    8 Seconds
                  </div>
                </div>

                {/* Audio Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Video Audio</span>
                    {!currentPlanConfig.limits.allowVideoAudio && (
                      <span className="text-[10px] text-amber-400 font-mono">PRO Only</span>
                    )}
                  </label>
                  <button
                    type="button"
                    disabled={!currentPlanConfig.limits.allowVideoAudio}
                    onClick={() => setIncludeAudio(!includeAudio)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      includeAudio
                        ? 'bg-indigo-600 text-white border border-indigo-400/50'
                        : !currentPlanConfig.limits.allowVideoAudio
                        ? 'bg-slate-900/40 text-slate-600 border border-slate-800 cursor-not-allowed'
                        : 'bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:bg-slate-700'
                    }`}
                  >
                    <span>Ambient Sound</span>
                    <span className="font-mono text-[10px] uppercase">{includeAudio ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {videoError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{videoError}</p>
                    {videoRemaining <= 0 && onNavigateToPricing && (
                      <button
                        onClick={onNavigateToPricing}
                        className="text-rose-200 underline font-medium hover:text-white cursor-pointer"
                      >
                        Upgrade your plan now to generate AI video animations.
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo || videoRemaining <= 0}
                className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl flex items-center justify-center space-x-2 cursor-pointer ${
                  isGeneratingVideo || videoRemaining <= 0
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-violet-600/30'
                }`}
              >
                {isGeneratingVideo ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Rendering Veo Video Animation...</span>
                  </>
                ) : (
                  <>
                    <Film className="w-5 h-5 text-violet-300" />
                    <span>GENERATE AI VIDEO</span>
                  </>
                )}
              </button>
            </div>

            {/* Video Preview Output (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#151B2E] p-6 rounded-3xl border border-indigo-500/20 shadow-2xl min-h-[420px] flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-4 h-4 text-violet-400" />
                    <span>Veo Video Result</span>
                  </span>
                  {generatedVideoResult && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      COMPLETED
                    </span>
                  )}
                </div>

                {isGeneratingVideo ? (
                  <div className="my-auto py-12 flex flex-col items-center justify-center text-center space-y-6 px-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center animate-pulse">
                        <Film className="w-10 h-10 text-violet-400 animate-bounce" />
                      </div>
                    </div>

                    <div className="w-full max-w-xs space-y-2">
                      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-violet-300 block">{videoProgress}% Rendered</span>
                    </div>

                    <p className="text-slate-300 text-xs font-medium max-w-xs leading-relaxed animate-pulse">
                      {videoStatusMessage}
                    </p>
                  </div>
                ) : generatedVideoResult?.resultUrl ? (
                  <div className="my-auto space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border border-violet-500/30 bg-black shadow-xl">
                      <video
                        controls
                        autoPlay
                        loop
                        src={generatedVideoResult.resultUrl}
                        className="w-full h-auto rounded-2xl max-h-[360px]"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-300 font-medium truncate max-w-[200px]">
                        "{generatedVideoResult.prompt}"
                      </span>
                      <a
                        href={generatedVideoResult.resultUrl}
                        download={`fiza_ai_walkthrough_${Date.now()}.mp4`}
                        className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download MP4</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="my-auto py-16 flex flex-col items-center justify-center text-center space-y-3 text-slate-500">
                    <Film className="w-12 h-12 text-slate-700" />
                    <p className="text-sm">Your generated 8-second architectural video will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Gallery Section */}
        <div className="bg-[#151B2E] p-6 md:p-8 rounded-3xl border border-indigo-500/20 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-violet-400" />
                <span>AI Media Generation History</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Saved in your persistent Fiza-Fiyat media library
              </p>
            </div>
            <button
              onClick={fetchHistory}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
              title="Refresh History"
            >
              <RefreshCw className={`w-4 h-4 ${loadingHistory ? 'animate-spin text-violet-400' : ''}`} />
            </button>
          </div>

          {loadingHistory ? (
            <div className="py-12 text-center text-slate-500 text-xs">Loading generation records...</div>
          ) : history.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((rec) => (
                <div
                  key={rec.id}
                  className="group bg-[#0B1020] rounded-2xl overflow-hidden border border-slate-800 hover:border-violet-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    {rec.type === 'video' ? (
                      rec.resultUrl ? (
                        <video src={rec.resultUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-mono">
                          VIDEO PENDING
                        </div>
                      )
                    ) : (
                      <img src={rec.resultUrl} alt={rec.prompt} className="w-full h-full object-cover" />
                    )}

                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white uppercase tracking-wider flex items-center gap-1">
                      {rec.type === 'video' ? <Film className="w-3 h-3 text-violet-400" /> : <ImageIcon className="w-3 h-3 text-indigo-400" />}
                      <span>{rec.type}</span>
                    </div>

                    {rec.resultUrl && (
                      <button
                        onClick={() => setModalMedia(rec)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                      >
                        <Eye className="w-6 h-6" />
                      </button>
                    )}
                  </div>

                  <div className="p-3 space-y-1.5 text-xs">
                    <p className="text-slate-200 font-medium line-clamp-2">"{rec.prompt}"</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{rec.projectContext}</span>
                      <span>{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              No previous AI media generations found. Generate your first image or video above!
            </div>
          )}
        </div>

      </div>

      {/* Full View Modal */}
      {modalMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#151B2E] rounded-3xl overflow-hidden border border-violet-500/30 p-6 space-y-4">
            <button
              onClick={() => setModalMedia(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-slate-300 hover:text-white transition-all cursor-pointer z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[70vh]">
              {modalMedia.type === 'video' ? (
                <video controls autoPlay src={modalMedia.resultUrl} className="max-h-[70vh] w-auto" />
              ) : (
                <img src={modalMedia.resultUrl} alt={modalMedia.prompt} className="max-h-[70vh] w-auto object-contain" />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div>
                <p className="font-semibold text-white">"{modalMedia.prompt}"</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Project: {modalMedia.projectContext}</p>
              </div>
              <a
                href={modalMedia.resultUrl}
                download={`fiza_ai_media_${Date.now()}.${modalMedia.type === 'video' ? 'mp4' : 'png'}`}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
