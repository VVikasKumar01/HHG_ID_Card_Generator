import React, { useRef, useState } from "react";
import { Upload, Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import { processImageFile } from "../utils/heicConverter";
import { SAMPLE_AVATARS } from "../data/builderTitles";
import { CameraModal } from "./CameraModal";

interface PhotoUploaderProps {
  onImageSelected: (base64Image: string) => void;
  currentImage: string | null;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onImageSelected,
  currentImage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    setIsLoading(true);
    try {
      const dataUrl = await processImageFile(file);
      onImageSelected(dataUrl);
    } catch (error) {
      console.error("Failed to load image:", error);
      alert("Unable to process this photo. Please try a different image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleKeyDownDropzone = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="bg-[#fffdf2] border-2 border-[#111827] rounded-2xl p-4 sm:p-5 text-[#111827] shadow-[2px_2px_0px_#111827]">
      <div className="flex items-center justify-between mb-3">
        <label htmlFor="photo-file-input" className="text-xs font-mono-retro font-black uppercase tracking-wider text-[#ff007a] flex items-center gap-1.5 cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Your Photo</span>
        </label>
        <span className="text-[11px] font-mono-retro text-[#111827]/70 font-semibold">
          JPG, PNG, HEIC, WEBP
        </span>
      </div>

      {/* Main Dropzone / Upload Trigger */}
      <div
        tabIndex={0}
        role="button"
        aria-label={currentImage ? "Change photo" : "Drop photo here or press Enter to select file"}
        onKeyDown={handleKeyDownDropzone}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-xl p-5 text-center transition-all focus:outline-none focus:ring-2 focus:ring-[#ff007a] ${
          isDragging
            ? "border-[#ff007a] bg-[#ff007a]/10"
            : "border-[#111827]/40 hover:border-[#ff007a] bg-[#ffd200]/10 hover:bg-[#ffd200]/20"
        }`}
      >
        {isLoading ? (
          <div className="py-6 flex flex-col items-center justify-center gap-2 text-[#ff007a]">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-mono-retro font-bold">Processing photo...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#ffd200] border-2 border-[#111827] flex items-center justify-center text-[#111827] shadow-[2px_2px_0px_#111827]">
              <ImageIcon className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-black text-[#111827]">
                {currentImage ? "Change Selected Photo" : "Drop photo here or click to select"}
              </p>
              <p className="text-xs text-[#111827]/70 mt-0.5 font-medium">
                Auto-fit & crop optimized for X profile pictures & event passes
              </p>
            </div>

            {/* Hidden Input Handles */}
            <input
              id="photo-file-input"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
            <input
              id="camera-file-input"
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
          </div>
        )}
      </div>

      {/* Mobile Camera Option & Sample Avatars */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#111827]/10">
        <button
          type="button"
          onClick={() => setIsCameraOpen(true)}
          className="w-full sm:w-auto hh-btn-yellow px-3.5 py-2 rounded-xl text-xs flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4 text-[#ff007a]" />
          <span>Live Camera Selfie</span>
        </button>

        {/* 1-Click Sample Avatars */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] font-mono-retro font-bold text-[#111827]/70 whitespace-nowrap">
            Sample Avatars:
          </span>
          {SAMPLE_AVATARS.map((avatar) => (
            <button
              key={avatar.name}
              type="button"
              onClick={() => onImageSelected(avatar.url)}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#111827] hover:border-[#ff007a] hover:scale-105 transition-all flex-shrink-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff007a]"
              title={avatar.label}
              aria-label={`Select sample avatar ${avatar.label}`}
            >
              <img
                src={avatar.url}
                alt={avatar.label}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={onImageSelected}
      />
    </div>
  );
};
