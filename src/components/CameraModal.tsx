import React, { useState, useRef, useEffect, useCallback } from "react";
import { Camera, X, RefreshCw, SwitchCamera, Timer, Sparkles, AlertCircle, FlipHorizontal } from "lucide-react";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isFlipped, setIsFlipped] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [useTimer, setUseTimer] = useState<boolean>(false);
  const [flash, setFlash] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Stop current media tracks
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Start video stream
  const startCamera = useCallback(async () => {
    setIsInitializing(true);
    setCameraError(null);

    // Stop existing stream first
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Live camera is not supported on this browser or platform.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera access permission was denied. Please allow camera access in your browser settings to take a live selfie.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera device was found on this device.");
      } else {
        setCameraError(err.message || "Unable to access live camera. Please check permissions or try uploading a file instead.");
      }
    } finally {
      setIsInitializing(false);
    }
  }, [facingMode]);

  // Handle open/close stream lifecycle
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopStream();
      setCountdown(null);
    }

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode]);

  const handleCaptureSnapshot = useCallback(() => {
    if (!videoRef.current) return;

    // Trigger visual flash
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    
    // Create a square aspect ratio capture centered around video stream
    const size = Math.min(video.videoWidth || 640, video.videoHeight || 640);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sx = ((video.videoWidth || size) - size) / 2;
    const sy = ((video.videoHeight || size) - size) / 2;

    ctx.save();
    // Mirror horizontal if facing camera & flipped
    if (facingMode === "user" && isFlipped) {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    
    // Stop camera and send image back
    stopStream();
    onCapture(dataUrl);
    onClose();
  }, [facingMode, isFlipped, onCapture, onClose, stopStream]);

  // Handle shutter press (with or without countdown)
  const triggerShutter = () => {
    if (useTimer) {
      setCountdown(3);
    } else {
      handleCaptureSnapshot();
    }
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (countdown === 0) {
      setCountdown(null);
      handleCaptureSnapshot();
    }
  }, [countdown, handleCaptureSnapshot]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#fffdf2] border-4 border-[#111827] rounded-3xl shadow-[8px_8px_0px_#111827] overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 bg-[#ffd200] border-b-2 border-[#111827]">
          <div className="flex items-center gap-2 text-[#111827]">
            <Camera className="w-5 h-5 text-[#ff007a]" />
            <h3 className="font-mono-retro font-black uppercase text-sm tracking-wider">
              Live Camera Selfie
            </h3>
          </div>
          <button
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white border-2 border-[#111827] hover:bg-[#ff007a] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff007a]"
            aria-label="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewfinder Box */}
        <div className="relative bg-black aspect-square w-full flex items-center justify-center overflow-hidden">
          {/* Flash Effect */}
          {flash && <div className="absolute inset-0 bg-white z-30 animate-ping" />}

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <span className="font-mono-retro font-black text-8xl text-[#ffd200] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] animate-bounce">
                {countdown}
              </span>
            </div>
          )}

          {/* Camera Error Message */}
          {cameraError ? (
            <div className="p-6 text-center text-white flex flex-col items-center gap-3 max-w-xs">
              <AlertCircle className="w-12 h-12 text-[#ff007a]" />
              <p className="text-xs font-mono-retro leading-relaxed">{cameraError}</p>
              <button
                type="button"
                onClick={startCamera}
                className="mt-2 px-4 py-2 rounded-xl bg-[#ffd200] text-[#111827] font-black text-xs border-2 border-white hover:bg-white transition-colors"
              >
                Retry Camera Access
              </button>
            </div>
          ) : (
            <>
              {/* Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => setIsInitializing(false)}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  facingMode === "user" && isFlipped ? "scale-x-[-1]" : ""
                }`}
              />

              {/* Viewfinder Target Guidelines */}
              <div className="absolute inset-0 border-2 border-dashed border-[#ffd200]/40 pointer-events-none rounded-full m-8" />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#ffd200]/30 animate-pulse" />
              </div>

              {/* Viewfinder Controls Top Bar */}
              <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setUseTimer((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl border-2 border-[#111827] text-xs font-mono-retro font-black flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#111827] ${
                    useTimer
                      ? "bg-[#ff007a] text-white"
                      : "bg-[#fffdf2] text-[#111827] hover:bg-[#ffd200]"
                  }`}
                >
                  <Timer className="w-3.5 h-3.5" />
                  <span>3s Timer: {useTimer ? "ON" : "OFF"}</span>
                </button>

                {facingMode === "user" && (
                  <button
                    type="button"
                    onClick={() => setIsFlipped((prev) => !prev)}
                    className="p-2 rounded-xl bg-[#fffdf2] border-2 border-[#111827] text-[#111827] hover:bg-[#ffd200] shadow-[2px_2px_0px_#111827] transition-all"
                    title="Mirror / Flip camera"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#fffdf2] border-t-2 border-[#111827] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setFacingMode((prev) => (prev === "user" ? "environment" : "user"))}
            disabled={!!cameraError}
            className="hh-btn-yellow px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 disabled:opacity-50"
          >
            <SwitchCamera className="w-4 h-4 text-[#ff007a]" />
            <span className="hidden sm:inline">Switch Camera</span>
          </button>

          <button
            type="button"
            onClick={triggerShutter}
            disabled={!!cameraError || isInitializing || countdown !== null}
            className="flex-1 max-w-xs hh-btn-pink py-3 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 shadow-[4px_4px_0px_#111827]"
          >
            <Camera className="w-5 h-5" />
            <span>{countdown !== null ? `Capturing in ${countdown}...` : "Snap Photo"}</span>
          </button>

          <button
            type="button"
            onClick={startCamera}
            disabled={!!cameraError}
            className="p-2.5 rounded-xl bg-white border-2 border-[#111827] hover:bg-[#ffd200] transition-colors"
            title="Refresh feed"
          >
            <RefreshCw className="w-4 h-4 text-[#111827]" />
          </button>
        </div>
      </div>
    </div>
  );
};
