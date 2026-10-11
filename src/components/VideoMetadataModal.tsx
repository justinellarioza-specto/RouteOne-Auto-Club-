import React, { useEffect, useState } from 'react';
import {
  X,
  Radio,
  Music,
  ExternalLink,
  ShieldCheck,
  Zap,
  Gauge,
  Film,
  Cpu,
  Volume2,
} from 'lucide-react';
import { HERO_VIDEO_METADATA } from '../data/videoMetadata';
import { useTheme } from '../context/ThemeContext';

interface VideoMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleAudio: () => void;
}

export const VideoMetadataModal: React.FC<VideoMetadataModalProps> = ({
  isOpen,
  onClose,
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleAudio,
}) => {
  const { isGarageLight } = useTheme();
  const meta = HERO_VIDEO_METADATA;

  // Real-time SMPTE Timecode generator (HH:MM:SS:FF at 60fps)
  const [frame, setFrame] = useState(14);
  const [seconds, setSeconds] = useState(48);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setFrame((prev) => {
        if (prev >= 59) {
          setSeconds((s) => (s >= 194 ? 0 : s + 1));
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const mm = pad(Math.floor(seconds / 60));
  const ss = pad(seconds % 60);
  const ff = pad(frame);
  const timecode = `00:${mm}:${ss}:${ff}`;

  return (
    <div
      id="video-metadata-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-meta-title"
    >
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border rounded-sm shadow-2xl p-5 sm:p-7 md:p-8 transition-colors duration-200 ${
          isGarageLight
            ? 'bg-[#F4F3EF] border-black/15 text-[#111415]'
            : 'bg-[#0F1113] border-white/15 text-[#F4F3EF]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-[#D71920] rounded-full" />
            <span className="text-xs font-semibold text-[#D71920]">
              Telemetry & footage metadata · rec 01
            </span>
          </div>
          <button
            id="video-meta-close-btn"
            onClick={onClose}
            className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
              isGarageLight
                ? 'border-black/10 hover:bg-black/5 text-[#111415]'
                : 'border-white/10 hover:bg-white/5 text-[#F4F3EF]'
            }`}
            aria-label="Close video metadata panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Stream Status Strip */}
        <div
          className={`p-3.5 mb-6 border rounded-sm flex flex-wrap items-center justify-between gap-3 ${
            isGarageLight
              ? 'bg-white/80 border-black/10'
              : 'bg-black/40 border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-[#D71920] animate-pulse" />
            <div>
              <span className="text-[11px] opacity-60 block">
                Live smpte timecode
              </span>
              <span className=" text-sm font-semibold text-[#D71920]">
                {timecode} <span className="text-xs font-normal opacity-70">({isPlaying ? 'Streaming' : 'Paused'})</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="meta-modal-toggle-play"
              onClick={onTogglePlay}
              className={`px-3 py-1 text-xs border rounded-full transition-colors cursor-pointer ${
                isGarageLight
                  ? 'border-black/15 hover:bg-black/5 text-[#111415]'
                  : 'border-white/20 hover:bg-white/10 text-[#F4F3EF]'
              }`}
            >
              {isPlaying ? 'Pause feed' : 'Play feed'}
            </button>
            <button
              id="meta-modal-toggle-audio"
              onClick={onToggleAudio}
              className={`px-3 py-1 text-xs border rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                isGarageLight
                  ? 'border-black/15 hover:bg-black/5 text-[#111415]'
                  : 'border-white/20 hover:bg-white/10 text-[#F4F3EF]'
              }`}
            >
              <Volume2 className="w-3 h-3 text-[#D71920]" />
              <span>{isMuted ? 'Unmute audio' : 'Mute audio'}</span>
            </button>
          </div>
        </div>

        {/* Main Film Title & Credits */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Film className="w-3.5 h-3.5 text-[#D71920]" />
            <span className="text-xs opacity-60">
              Featured title
            </span>
          </div>
          <h2
            id="video-meta-title"
            className="font-heading text-2xl sm:text-3xl font-bold leading-tight mb-1"
          >
            {meta.title}
          </h2>
          <p className="text-xs sm:text-sm opacity-70 font-light mb-3">
            {meta.subtitle} • {meta.production}
          </p>
          <div className="flex flex-wrap gap-2 text-xs ">
            <span className="px-2.5 py-1 rounded bg-[#D71920]/15 text-[#D71920] font-semibold border border-[#D71920]/25">
              4K cinema dci
            </span>
            <span className="px-2.5 py-1 rounded border border-current opacity-70">
              60 fps master
            </span>
            <span className="px-2.5 py-1 rounded border border-current opacity-70">
              2.39:1 Anamorphic
            </span>
            <span className="px-2.5 py-1 rounded border border-current opacity-70">
              100HZ telemetry
            </span>
          </div>
        </div>

        {/* 2-Column Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Box 1: Vehicle & Driver Telemetry */}
          <div
            className={`p-4 border rounded-sm ${
              isGarageLight ? 'bg-white/60 border-black/10' : 'bg-white/[0.02] border-white/10'
            }`}
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/5 dark:border-white/5">
              <Gauge className="w-4 h-4 text-[#D71920]" />
              <span className="text-xs font-semibold">
                Chassis & powertrain
              </span>
            </div>
            <dl className="space-y-2.5 text-xs">
              <div>
                <dt className="text-[11px] opacity-60">
                  Driver & world champion
                </dt>
                <dd className="font-semibold text-sm">{meta.driver}</dd>
              </div>
              <div>
                <dt className="text-[11px] opacity-60">
                  Constructor / team
                </dt>
                <dd className=" text-[11px]">{meta.team}</dd>
              </div>
              <div>
                <dt className="text-[11px] opacity-60">
                  Chassis specification
                </dt>
                <dd className=" text-[11px]">{meta.carModel}</dd>
              </div>
              <div>
                <dt className="text-[11px] opacity-60">
                  Power unit
                </dt>
                <dd className=" text-[11px]">{meta.engine}</dd>
              </div>
            </dl>
          </div>

          {/* Box 2: Audio Soundtrack & Technical Specs */}
          <div
            className={`p-4 border rounded-sm ${
              isGarageLight ? 'bg-white/60 border-black/10' : 'bg-white/[0.02] border-white/10'
            }`}
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/5 dark:border-white/5">
              <Music className="w-4 h-4 text-[#D71920]" />
              <span className="text-xs font-semibold">
                Soundtrack & master audio
              </span>
            </div>
            <dl className="space-y-2.5 text-xs">
              <div>
                <dt className="text-[11px] opacity-60">
                  Track & artist
                </dt>
                <dd className="font-semibold text-sm">
                  &ldquo;{meta.soundtrack.title}&rdquo; — {meta.soundtrack.artist}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] opacity-60">
                  Album & label
                </dt>
                <dd className=" text-[11px]">{meta.soundtrack.album}</dd>
              </div>
              <div className="flex gap-4">
                <div>
                  <dt className="text-[11px] opacity-60">
                    Tempo / bpm
                  </dt>
                  <dd className=" text-sm font-semibold text-[#D71920]">
                    {meta.soundtrack.bpm} Bpm
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] opacity-60">
                    Codec / sampling
                  </dt>
                  <dd className=" text-[11px]">{meta.technical.audioCodec}</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>

        {/* Technical Broadcast Specs Table */}
        <div
          className={`p-4 border rounded-sm mb-6 ${
            isGarageLight ? 'bg-white/60 border-black/10' : 'bg-white/[0.02] border-white/10'
          }`}
        >
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/5 dark:border-white/5">
            <Cpu className="w-4 h-4 text-[#D71920]" />
            <span className="text-xs font-semibold">
              Broadcast streaming specifications
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[11px] opacity-60 block">
                Resolution
              </span>
              <span className=" font-semibold text-[11px]">{meta.technical.resolution}</span>
            </div>
            <div>
              <span className="text-[11px] opacity-60 block">
                Aspect ratio
              </span>
              <span className=" font-semibold text-[11px]">{meta.technical.aspectRatio}</span>
            </div>
            <div>
              <span className="text-[11px] opacity-60 block">
                Framerate
              </span>
              <span className=" font-semibold text-[11px]">{meta.technical.framerate}</span>
            </div>
            <div>
              <span className="text-[11px] opacity-60 block">
                Color profile
              </span>
              <span className=" font-semibold text-[11px]">{meta.technical.colorSpace}</span>
            </div>
            <div>
              <span className="text-[11px] opacity-60 block">
                Bitrate
              </span>
              <span className=" font-semibold text-[11px]">{meta.technical.bitrate}</span>
            </div>
            <div>
              <span className="text-[11px] opacity-60 block">
                Telemetry refresh
              </span>
              <span className=" font-semibold text-[11px] text-[#D71920]">{meta.technical.telemetryRate}</span>
            </div>
            <div>
              <span className="text-[11px] opacity-60 block">
                Circuits
              </span>
              <span className=" font-semibold text-[11px]">{meta.location}</span>
            </div>
            <div>
              <span className="text-[11px] opacity-60 block">
                Streaming mode
              </span>
              <span className=" font-semibold text-[11px]">{meta.duration}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs opacity-60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Authenticated by RouteOne motorsports archive</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              id="meta-modal-youtube-link"
              href={meta.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#D71920] text-white text-xs font-semibold hover:bg-[#b5141a] transition-all cursor-pointer rounded-sm w-full sm:w-auto"
            >
              <span>Watch in 4K on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
