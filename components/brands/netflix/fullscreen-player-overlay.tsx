"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface FullscreenPlayerOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function FullscreenPlayerOverlay({ open, onClose }: FullscreenPlayerOverlayProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
        role="button"
        tabIndex={0}
        aria-label="Close"
      />

      {/* Fullscreen panel */}
      <div
        className="absolute inset-0 bg-black animate-in fade-in-0 zoom-in-95 duration-200 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Video player"
      >
        {/* Placeholder content */}
        <p className="text-foreground/50 text-lg">Playing...</p>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-foreground hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
