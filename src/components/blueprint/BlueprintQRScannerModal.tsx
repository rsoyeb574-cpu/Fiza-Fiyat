import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  QrCode, 
  Camera, 
  Upload, 
  FileText, 
  X, 
  Zap, 
  ZapOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  Building2, 
  Compass, 
  FileCode2,
  Sparkles,
  Maximize2
} from 'lucide-react';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import { Project } from '../../types';
import { parseBlueprintQR, ParsedBlueprintResult, playBlueprintBeepSound } from '../../utils/blueprintQR';
import { SAMPLE_BLUEPRINT_SHEETS, SampleBlueprintSheet } from '../../data/sampleBlueprints';
import { BlueprintStampGenerator } from './BlueprintStampGenerator';

interface BlueprintQRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  initialTab?: 'camera' | 'upload' | 'samples' | 'stamp';
  preselectedProjectId?: string;
}

export const BlueprintQRScannerModal: React.FC<BlueprintQRScannerModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  initialTab = 'camera',
  preselectedProjectId
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'samples' | 'stamp'>(initialTab);
  
  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchAvailable, setTorchAvailable] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isScanningActive, setIsScanningActive] = useState<boolean>(false);
  const animationFrameIdRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Scan result state
  const [detectedResult, setDetectedResult] = useState<ParsedBlueprintResult | null>(null);
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState<number | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Upload state
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sample blueprint QR images cache
  const [sampleQrUrls, setSampleQrUrls] = useState<Record<string, string>>({});

  // Generate sample QR codes on mount
  useEffect(() => {
    SAMPLE_BLUEPRINT_SHEETS.forEach(sheet => {
      QRCode.toDataURL(JSON.stringify(sheet.payload), {
        width: 200,
        margin: 1,
        color: { dark: '#02182B', light: '#FFFFFF' }
      })
        .then(url => {
          setSampleQrUrls(prev => ({ ...prev, [sheet.id]: url }));
        })
        .catch(err => console.error('Error generating sample QR:', err));
    });
  }, []);

  // Update activeTab when initialTab prop changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setDetectedResult(null);
      setAutoRedirectCountdown(null);
      setUploadedImagePreview(null);
      setUploadError(null);
    }
  }, [isOpen, initialTab]);

  // Clean up auto redirect timer
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // Handle successful detection
  const handleSuccessfulScan = useCallback((result: ParsedBlueprintResult) => {
    // Play high-tech audio chime
    playBlueprintBeepSound();

    // Haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 60, 80]);
      } catch {
        // Ignore
      }
    }

    setDetectedResult(result);
    setIsScanningActive(false);

    // If recognized, set up auto-navigation countdown
    if (result.isRecognized && result.project) {
      let secondsLeft = 2;
      setAutoRedirectCountdown(secondsLeft);

      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

      countdownTimerRef.current = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft <= 0) {
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          onSelectProject(result.project!.id);
          onClose();
        } else {
          setAutoRedirectCountdown(secondsLeft);
        }
      }, 1000);
    }
  }, [onSelectProject, onClose]);

  // Stop camera media tracks
  const stopCamera = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanningActive(false);
    setIsTorchOn(false);
  }, []);

  // Continuous Camera Frame Processing Loop
  const scanVideoFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameIdRef.current = requestAnimationFrame(scanVideoFrame);
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      animationFrameIdRef.current = requestAnimationFrame(scanVideoFrame);
      return;
    }

    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Grab image data from canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Attempt standard QR decode
    let code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });

    // If not found, try inverted (crucial for blueprints with light-colored line art on dark/blue paper)
    if (!code) {
      code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'onlyInvert'
      });
    }

    if (code && code.data) {
      // Recognized QR code in video stream!
      const parsed = parseBlueprintQR(code.data, projects);
      handleSuccessfulScan(parsed);
      return; // Stop animation loop
    }

    // Continue scanning next frame
    animationFrameIdRef.current = requestAnimationFrame(scanVideoFrame);
  }, [projects, handleSuccessfulScan]);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setHasCameraPermission(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device API is not supported in this browser environment.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      // Check torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const capabilities = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as any;
        setTorchAvailable(!!capabilities.torch);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS Safari
        await videoRef.current.play();
        setHasCameraPermission(true);
        setIsScanningActive(true);
        // Start animation frame loop
        animationFrameIdRef.current = requestAnimationFrame(scanVideoFrame);
      }
    } catch (err: unknown) {
      console.warn('Camera stream error:', err);
      const message = err instanceof Error ? err.message : 'Unable to access camera.';
      setCameraError(message);
      setHasCameraPermission(false);
    }
  }, [facingMode, scanVideoFrame, stopCamera]);

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!mediaStreamRef.current) return;
    const track = mediaStreamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !isTorchOn;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }]
        });
        setIsTorchOn(nextState);
      } catch (err) {
        console.warn('Torch constraint error:', err);
      }
    }
  };

  // Toggle Camera Front / Back
  const switchCameraFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Manage camera lifecycle based on modal open state and active tab
  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !detectedResult) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, detectedResult, facingMode, startCamera, stopCamera]);

  // Handle Image File Upload Decoding
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingUpload(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImagePreview(img.src);

        // Render to offscreen canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          setIsProcessingUpload(false);
          setUploadError('Canvas context initialization failed.');
          return;
        }

        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        // Try decoding with jsQR
        let code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth'
        });

        if (code && code.data) {
          const parsed = parseBlueprintQR(code.data, projects);
          setIsProcessingUpload(false);
          handleSuccessfulScan(parsed);
        } else {
          setIsProcessingUpload(false);
          setUploadError(
            'No valid blueprint QR code could be detected in this image. Please ensure the drawing title block QR code is clearly visible, well-lit, and not cropped.'
          );
        }
      };

      img.onerror = () => {
        setIsProcessingUpload(false);
        setUploadError('Failed to load drawing file as an image.');
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  // Trigger simulated scan from a sample blueprint sheet
  const handleTestSampleSheet = (sheet: SampleBlueprintSheet) => {
    const rawPayload = JSON.stringify(sheet.payload);
    const parsed = parseBlueprintQR(rawPayload, projects);
    handleSuccessfulScan(parsed);
  };

  // Reset and scan again
  const handleResetScan = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setDetectedResult(null);
    setAutoRedirectCountdown(null);
    setUploadedImagePreview(null);
    setUploadError(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  // Immediate navigate
  const handleImmediateNavigate = () => {
    if (detectedResult?.project) {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      onSelectProject(detectedResult.project.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#090F1E] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-neutral-900/60 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Blueprint QR Scanner
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                  BIM Sync
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Scan physical drawing sheets & CAD title blocks to automatically open digital project models.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-white/10 cursor-pointer transition-colors"
            title="Close scanner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-neutral-950/70 px-4 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('camera');
              if (detectedResult) setDetectedResult(null);
            }}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
              activeTab === 'camera'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera Scanner</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upload');
              stopCamera();
              if (detectedResult) setDetectedResult(null);
            }}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
              activeTab === 'upload'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Blueprint Photo</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('samples');
              stopCamera();
              if (detectedResult) setDetectedResult(null);
            }}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
              activeTab === 'samples'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sample Drawing Sheets</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono">
              Quick Test
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('stamp');
              stopCamera();
              if (detectedResult) setDetectedResult(null);
            }}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
              activeTab === 'stamp'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Blueprint Stamp Generator</span>
          </button>
        </div>

        {/* Modal Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* ========================================================================= */}
          {/* DETECTED RESULT SCREEN (When a QR is recognized)                          */}
          {/* ========================================================================= */}
          {detectedResult && (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              <div className={`p-5 rounded-2xl border ${
                detectedResult.isRecognized 
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100 shadow-xl shadow-emerald-950/50' 
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-100'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      detectedResult.isRecognized ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {detectedResult.isRecognized ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <AlertTriangle className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white">
                        {detectedResult.isRecognized ? 'Physical Blueprint Drawing Verified!' : 'QR Code Read — No Matching Project'}
                      </h4>
                      <p className="text-xs opacity-80 mt-0.5">
                        {detectedResult.confidenceMessage}
                      </p>
                    </div>
                  </div>

                  {autoRedirectCountdown !== null && (
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider block text-emerald-300">
                        Opening Details in
                      </span>
                      <span className="text-2xl font-black text-white font-mono">
                        {autoRedirectCountdown}s
                      </span>
                    </div>
                  )}
                </div>

                {/* Auto redirect progress bar */}
                {autoRedirectCountdown !== null && (
                  <div className="mt-3 w-full bg-emerald-950 rounded-full h-1.5 overflow-hidden border border-emerald-500/30">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${((2 - autoRedirectCountdown) / 2) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Matched Project Card */}
              {detectedResult.project ? (
                <div className="bg-neutral-900/90 rounded-2xl border border-white/10 p-5 shadow-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <img 
                      src={detectedResult.project.coverImage || detectedResult.project.images?.[0]} 
                      alt={detectedResult.project.title}
                      className="w-full sm:w-44 h-32 object-cover rounded-xl border border-white/10 shadow-md"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                          SHEET {detectedResult.sheetNumber || 'A-101'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                          {detectedResult.revision || 'REV-01'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px]">
                          {detectedResult.project.categoryName}
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-white">
                        {detectedResult.project.title}
                      </h3>

                      <p className="text-xs text-neutral-300 line-clamp-2">
                        {detectedResult.project.description}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
                        <div className="bg-neutral-950/60 p-2 rounded-lg border border-white/5">
                          <span className="text-[10px] text-neutral-400 block font-mono">CLIENT</span>
                          <span className="font-semibold text-white">{detectedResult.project.clientName}</span>
                        </div>
                        <div className="bg-neutral-950/60 p-2 rounded-lg border border-white/5">
                          <span className="text-[10px] text-neutral-400 block font-mono">LOCATION</span>
                          <span className="font-semibold text-white">{detectedResult.project.location || 'Global'}</span>
                        </div>
                        <div className="bg-neutral-950/60 p-2 rounded-lg border border-white/5">
                          <span className="text-[10px] text-neutral-400 block font-mono">BIM LEVEL</span>
                          <span className="font-semibold text-cyan-300 font-mono">{detectedResult.project.bimLevel || 'LOD 400'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                    <button
                      onClick={handleResetScan}
                      className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-white/10 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Scan Another Sheet</span>
                    </button>

                    <button
                      onClick={handleImmediateNavigate}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 cursor-pointer transition-all"
                    >
                      <span>Open Project Details Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-900/80 rounded-2xl border border-white/10 p-5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-neutral-400">RAW SCANNED CONTENT:</span>
                    <pre className="p-3 bg-neutral-950 rounded-xl text-xs text-cyan-300 font-mono overflow-x-auto whitespace-pre-wrap break-all border border-white/5">
                      {detectedResult.rawText}
                    </pre>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleResetScan}
                      className="px-4 py-2 rounded-xl bg-cyan-600 text-neutral-950 font-bold text-xs cursor-pointer"
                    >
                      Retry Scan
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: LIVE CAMERA SCANNER VIEW                                            */}
          {/* ========================================================================= */}
          {activeTab === 'camera' && !detectedResult && (
            <div className="space-y-4">
              {/* Live Viewport Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full max-h-[460px] bg-[#030712] rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-inner flex items-center justify-center">
                
                {/* Hidden processing canvas */}
                <canvas ref={canvasRef} className="hidden" />

                {/* HTML5 Video Feed */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />

                {/* Technical Blueprint Reticle Overlay */}
                {isScanningActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    
                    {/* Darkened corner vignettes */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60" />
                    
                    {/* Targeting Box */}
                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 border border-cyan-400/40 rounded-2xl shadow-2xl backdrop-blur-[1px]">
                      
                      {/* High-tech corner bracket guides */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-cyan-400 rounded-tl-lg" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-cyan-400 rounded-tr-lg" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-cyan-400 rounded-bl-lg" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-cyan-400 rounded-br-lg" />

                      {/* Center Crosshairs */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-400/80" />
                        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan-400/80" />
                      </div>

                      {/* Moving Laser Scanner Line */}
                      <div className="absolute left-1 right-1 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00F0FF] animate-pulse"
                        style={{
                          animation: 'scanLaser 2.2s ease-in-out infinite alternate',
                          top: '10%'
                        }}
                      />

                      {/* HUD Technical Status */}
                      <div className="absolute -bottom-9 left-0 right-0 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-extrabold tracking-wider shadow-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          SEEKING BLUEPRINT TITLE BLOCK QR
                        </span>
                      </div>
                    </div>

                    {/* Scale and Calibration Marks */}
                    <div className="absolute top-3 left-4 text-[10px] font-mono text-cyan-400/80 flex items-center gap-2">
                      <Compass className="w-3 h-3" />
                      <span>OPTICAL CAD SCANNER • 1:1 RESOLUTION</span>
                    </div>

                    <div className="absolute bottom-3 right-4 text-[10px] font-mono text-cyan-400/80">
                      <span>AUTO-INVERT ENABLED</span>
                    </div>
                  </div>
                )}

                {/* Camera Permission or Error Fallback */}
                {cameraError && (
                  <div className="absolute inset-0 bg-[#090F1E]/95 p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="max-w-md space-y-1">
                      <h4 className="text-sm font-bold text-white">
                        Camera Feed Unavailable
                      </h4>
                      <p className="text-xs text-neutral-400">
                        {cameraError.includes('denied') 
                          ? 'Camera permission was not granted. You can still scan drawings by uploading a photo or test using pre-loaded blueprint sheets.' 
                          : cameraError}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <button
                        onClick={startCamera}
                        className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Camera</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Blueprint Image</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('samples')}
                        className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 border border-cyan-500/30 cursor-pointer transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Test Sample Blueprint</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-white/10 text-xs">
                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Aim camera at bottom-right corner title block of physical drawing.</span>
                </div>

                <div className="flex items-center gap-2">
                  {torchAvailable && (
                    <button
                      onClick={toggleTorch}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isTorchOn 
                          ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-md shadow-amber-400/40' 
                          : 'bg-neutral-800 text-neutral-300 border-white/10 hover:text-white'
                      }`}
                      title={isTorchOn ? 'Turn Flashlight Off' : 'Turn Flashlight On'}
                    >
                      {isTorchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                    </button>
                  )}

                  <button
                    onClick={switchCameraFacingMode}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-white/10 flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Switch between front and rear cameras"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Flip Camera ({facingMode === 'environment' ? 'Rear' : 'Front'})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: UPLOAD BLUEPRINT PHOTO VIEW                                         */}
          {/* ========================================================================= */}
          {activeTab === 'upload' && !detectedResult && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 rounded-3xl p-8 text-center bg-neutral-900/40 hover:bg-neutral-900/60 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="space-y-4 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    {isProcessingUpload ? (
                      <RefreshCw className="w-8 h-8 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8" />
                    )}
                  </div>

                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-base font-bold text-white">
                      Drop or Select Blueprint Drawing File
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Supports PNG, JPG, WEBP, or high-res photographs taken on construction job sites.
                    </p>
                  </div>

                  <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
                    Browse File
                  </span>
                </div>
              </div>

              {/* Upload Error Banner */}
              {uploadError && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold">{uploadError}</p>
                    <p className="text-[11px] opacity-80">
                      Tip: You can also generate a digital title block stamp in the &ldquo;Blueprint Stamp Generator&rdquo; tab or test with sample sheets below.
                    </p>
                  </div>
                </div>
              )}

              {/* Image Preview if loaded */}
              {uploadedImagePreview && !detectedResult && (
                <div className="bg-neutral-900 p-4 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase">Uploaded Drawing Image</span>
                  <img 
                    src={uploadedImagePreview} 
                    alt="Uploaded blueprint" 
                    className="max-h-60 rounded-xl object-contain mx-auto border border-white/10"
                  />
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SAMPLE BLUEPRINT SHEETS (Instant Test & Mobile Scan)                 */}
          {/* ========================================================================= */}
          {activeTab === 'samples' && !detectedResult && (
            <div className="space-y-5">
              <div className="bg-neutral-900/60 p-4 rounded-2xl border border-white/10">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-cyan-400" />
                  <span>Pre-Generated Blueprint Title Block Sheets</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Don&apos;t have a paper drawing in hand? Click &ldquo;Simulate Physical Scan&rdquo; on any drawing sheet below to test the automatic project navigation flow, or scan the QR code with your mobile camera.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SAMPLE_BLUEPRINT_SHEETS.map((sheet) => {
                  const project = projects.find(p => p.id === sheet.projectId);
                  const qrUrl = sampleQrUrls[sheet.id];

                  return (
                    <div 
                      key={sheet.id}
                      className="group relative rounded-2xl border border-cyan-500/30 hover:border-cyan-400 bg-[#08182B] p-4 flex flex-col justify-between shadow-xl transition-all"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, rgba(0, 240, 255, 0.04) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0, 240, 255, 0.04) 1px, transparent 1px)
                        `,
                        backgroundSize: '16px 16px'
                      }}
                    >
                      <div className="space-y-3">
                        {/* Title Block Header */}
                        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                          <span className="text-[10px] font-mono font-extrabold text-cyan-400">
                            SHEET {sheet.sheetNumber}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {sheet.revision.split(' ')[0]}
                          </span>
                        </div>

                        {/* QR Code preview */}
                        <div className="bg-white p-2 rounded-xl shadow-md border border-cyan-400/40 w-fit mx-auto">
                          {qrUrl ? (
                            <img 
                              src={qrUrl} 
                              alt={`QR for ${sheet.sheetNumber}`} 
                              className="w-28 h-28 object-contain"
                            />
                          ) : (
                            <div className="w-28 h-28 flex items-center justify-center bg-neutral-100">
                              <RefreshCw className="w-5 h-5 animate-spin text-neutral-400" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 text-left">
                          <h5 className="text-xs font-bold text-white line-clamp-1">
                            {project ? project.title : sheet.projectTitle}
                          </h5>
                          <p className="text-[11px] font-mono text-cyan-300 font-semibold line-clamp-1">
                            {sheet.sheetTitle}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {sheet.discipline} • Scale {sheet.scale}
                          </p>
                        </div>
                      </div>

                      {/* Simulation Button */}
                      <button
                        onClick={() => handleTestSampleSheet(sheet)}
                        className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-neutral-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20 cursor-pointer transition-all"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Simulate Physical Scan</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: BLUEPRINT STAMP GENERATOR                                           */}
          {/* ========================================================================= */}
          {activeTab === 'stamp' && (
            <BlueprintStampGenerator 
              projects={projects}
              defaultProjectId={preselectedProjectId}
              onSelectProjectForScan={(projId) => {
                const targetProj = projects.find(p => p.id === projId);
                if (targetProj) {
                  const raw = JSON.stringify({ projectId: targetProj.id, sheet: 'A-101' });
                  const parsed = parseBlueprintQR(raw, projects);
                  handleSuccessfulScan(parsed);
                }
              }}
            />
          )}

        </div>

        {/* Footer Quick Info */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-neutral-950/80 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Standard CAD Blueprint Resolution • ISO 216 & ANSI Compliant</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-neutral-500">
              Active Catalog: {projects.length} Projects
            </span>
          </div>
        </div>

      </div>

      {/* Laser scan keyframe styling */}
      <style>{`
        @keyframes scanLaser {
          0% { top: 8%; opacity: 0.8; }
          50% { opacity: 1; }
          100% { top: 88%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
