'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  autoplayOnScroll?: boolean;
  loop?: boolean;
  muted?: boolean;
  aspectRatio?: string;
  className?: string;
}

export default function VideoPlayer({
  src,
  poster,
  title,
  autoplayOnScroll = true,
  loop = true,
  muted = true,
  aspectRatio = '16/9',
  className,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const reducedMotion = useReducedMotion();

  // Scroll-triggered autoplay using Intersection Observer
  useEffect(() => {
    if (!autoplayOnScroll || !videoRef.current) return;

    const video = videoRef.current;
    const threshold = 0.5;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);

          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            if (!isPlaying && isLoaded) {
              video.play().catch(() => {});
            }
          } else {
            if (isPlaying) {
              video.pause();
            }
          }
        });
      },
      { threshold: [0, threshold, 1] }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [autoplayOnScroll, isLoaded, isPlaying]);

  // Controls visibility animation
  useGSAP(() => {
    if (!controlsRef.current || reducedMotion) return;

    gsap.to(controlsRef.current, {
      opacity: isHovering || !isPlaying ? 1 : 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, { dependencies: [isHovering, isPlaying, reducedMotion] });

  const handlePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !duration) return;
    setProgress((video.currentTime / duration) * 100);
    setCurrentTime(video.currentTime);
  }, [duration]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = progressRef.current;
    if (!video || !progressBar || !duration) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  }, [duration]);

  const handleMuteToggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };



  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative overflow-hidden rounded-lg bg-[var(--tn-bg-dark)]',
        className
      )}
      style={{ aspectRatio }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={loop}
        muted={isMuted}
        playsInline
        className="h-full w-full object-cover"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration);
          setIsLoaded(true);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        aria-label={title}
      >
        <track kind="captions" />
      </video>

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--tn-bg-dark)]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--tn-fg-muted)] border-t-[var(--accent-color)]" />
        </div>
      )}

      {/* Play button overlay (when paused) */}
      {isLoaded && !isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40"
          aria-label="Play video"
        >
          <div className="rounded-full bg-[var(--accent-color)] p-4 transition-transform hover:scale-110">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}

      {/* Controls overlay */}
      <div
        ref={controlsRef}
        className={cn(
          'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-16',
          reducedMotion ? (isHovering || !isPlaying ? 'opacity-100' : 'opacity-0') : ''
        )}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="group/progress relative mb-3 h-1 cursor-pointer rounded-full bg-white/30"
          onClick={handleSeek}
        >
          {/* Buffer progress */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/20"
            style={{ width: `${progress + 10}%` }}
          />
          {/* Current progress */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent-color)]"
            style={{ width: `${progress}%` }}
          />
          {/* Hover indicator */}
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[var(--accent-color)] opacity-0 transition-opacity group-hover/progress:opacity-100"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={handlePlay}
              className="rounded p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Mute/Unmute */}
            <button
              onClick={handleMuteToggle}
              className="rounded p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>

            {/* Time display */}
            <span className="text-sm text-white/70">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="rounded p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Toggle fullscreen"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll-to-play indicator */}
      {autoplayOnScroll && !isInView && isLoaded && (
        <div className="absolute bottom-4 left-4 rounded bg-black/60 px-2 py-1 text-xs text-white/70 backdrop-blur-sm">
          Scroll to play
        </div>
      )}
    </div>
  );
}
