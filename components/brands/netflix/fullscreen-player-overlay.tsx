"use client";

import { useEffect, useCallback, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { useConfig } from "@/lib/config-context";

const FlyingPosters = dynamic(
  () =>
    import("@/components/brands/netflix/flying-posters").then((m) => m.default),
  { ssr: false },
);

const FLYING_POSTERS_COUNT = 10;

const FADE_OUT_DURATION_MS = 500;
const HOLD_AT_SLOW_MS = 1000;

type Phase = "intro" | "fadeOut" | "text";

interface FullscreenPlayerOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function FullscreenPlayerOverlay({
  open,
  onClose,
}: FullscreenPlayerOverlayProps) {
  const config = useConfig();
  const [phase, setPhase] = useState<Phase>("intro");
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevOpenRef = useRef(false);

  const posterImages = useMemo(
    () =>
      config.shows
        .slice(0, FLYING_POSTERS_COUNT)
        .map((s) => s.image),
    [config.shows],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    const justOpened = open && !prevOpenRef.current;
    prevOpenRef.current = open;

    if (open) {
      if (justOpened) setPhase("intro");
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (phase !== "fadeOut") return;
    const t = setTimeout(() => setPhase("text"), FADE_OUT_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase]);

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
        className="absolute inset-0 bg-black animate-in fade-in-0 zoom-in-95 duration-200 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Video player"
      >
        {/* FlyingPosters - each image has polaroid border in shader; fades out then unmounts when Hello appears */}
        {phase !== "text" && (
          <div
            className={`flex-1 min-h-0 w-full relative transition-opacity duration-500 ${
              phase === "fadeOut" ? "opacity-0" : "opacity-100"
            }`}
          >
            <FlyingPosters
              items={posterImages}
              planeWidth={320}
              planeHeight={320}
              distortion={3}
              scrollEase={0.01}
              cameraFov={45}
              cameraZ={20}
              autoPlayIntro={{
                durationMs: 3500,
                totalScroll: 140,
                onComplete: () => {
                  holdTimeoutRef.current = setTimeout(
                    () => setPhase("fadeOut"),
                    HOLD_AT_SLOW_MS,
                  );
                },
              }}
              className="absolute inset-0"
            />
          </div>
        )}

        {/* Centered message - fades in when phase is text; line breaks respected; responsive */}
        <div
          className={`absolute inset-0 flex items-center justify-center z-[5] pointer-events-none transition-opacity duration-500 px-4 sm:px-6 md:px-8 ${
            phase === "text" ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={phase !== "text"}
        >
          <p
            className="text-foreground font-medium text-center whitespace-pre-line max-w-full text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed"
            style={{ wordBreak: "break-word" }}
          >
            {config.modal.fullscreenMessage?.trim() || "Hello"}
          </p>
        </div>

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
