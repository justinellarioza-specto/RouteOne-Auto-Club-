import React, { useState } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Sparkles, Check, Layers, Sliders, ExternalLink } from 'lucide-react';
import { RouteOneLogo } from './RouteOneLogo';
import { useTheme } from '../context/ThemeContext';

interface BrandIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandIdentityModal: React.FC<BrandIdentityModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEscapeKey(isOpen, onClose);
  const { isGarageLight, toggleTheme } = useTheme();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyColorCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedColor(code);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  const handleDownloadSvg = (mode: 'light' | 'dark') => {
    const link = document.createElement('a');
    link.href = '/images/brand/routeone-logo.png';
    link.download = `routeone-logo-${mode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="brand-identity-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="RouteOne Brand Identity Dossier"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className={`w-full max-w-4xl rounded-sm border shadow-2xl overflow-hidden my-auto ${
          isGarageLight
            ? 'bg-white border-black/15 text-[#111415]'
            : 'bg-[#0B0D0E] border-white/15 text-[#F4F3EF]'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isGarageLight ? 'bg-[#F6F7F5] border-black/10' : 'bg-[#121516] border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <RouteOneLogo variant="emblem" className="h-5 w-auto" />
            <div>
              <h2 className="font-heading text-sm sm:text-base font-semibold">
                RouteOne Brand Identity
              </h2>
              <p className="text-xs text-[#85898A] ">
                Dual-Palette Aerodynamic Emblem Specification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
              isGarageLight ? 'text-[#565C62] hover:text-black' : 'text-[#85898A] hover:text-white'
            }`}
            aria-label="Close brand identity dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Side-by-Side Light & Dark Mode Comparison (Matches Reference Design) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-[#D71920] font-semibold flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                Dual-theme emblem colorways
              </span>
              <span className="text-xs text-[#85898A]">
                1:1 Dynamic Rendering
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-sm overflow-hidden">
              {/* Garage Light Panel */}
              <div className="p-8 sm:p-10 bg-[#FFFFFF] border-b md:border-b-0 md:border-r border-black/10 flex flex-col items-center justify-center relative group">
                <span className="absolute top-4 left-4 text-[11px] px-2 py-0.5 bg-black/5 text-black/70 border border-black/10 font-bold">
                  Garage light mode
                </span>
                <span className="absolute top-4 right-4 text-[11px] text-black/40">
                  #Ffffff canvas
                </span>

                <div className="my-8 py-4">
                  <RouteOneLogo mode="light" variant="emblem" className="w-40 sm:w-48 h-auto" />
                </div>

                <div className="w-full flex items-center justify-between pt-4 border-t border-black/10 text-xs ">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8A080D] border border-black/20" />
                    <span className="text-black/70 font-semibold text-xs">#8A080D Deep Crimson</span>
                  </div>
                  <button
                    onClick={() => handleDownloadSvg('light')}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-black text-white hover:bg-[#D71920] transition-colors rounded-xs cursor-pointer uppercase"
                  >
                    <Download className="w-3 h-3" />
                    Png
                  </button>
                </div>
              </div>

              {/* Circuit Dark Panel */}
              <div className="p-8 sm:p-10 bg-[#000000] flex flex-col items-center justify-center relative group">
                <span className="absolute top-4 left-4 text-[11px] px-2 py-0.5 bg-white/10 text-white/90 border border-white/15 font-bold">
                  Circuit dark mode
                </span>
                <span className="absolute top-4 right-4 text-[11px] text-white/40">
                  #000000 canvas
                </span>

                <div className="my-8 py-4">
                  <RouteOneLogo mode="dark" variant="emblem" className="w-40 sm:w-48 h-auto" />
                </div>

                <div className="w-full flex items-center justify-between pt-4 border-t border-white/10 text-xs ">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF202A] border border-white/20" />
                    <span className="text-white/80 font-semibold text-xs">#FF202A Race Scarlet</span>
                  </div>
                  <button
                    onClick={() => handleDownloadSvg('dark')}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-white text-black hover:bg-[#D71920] hover:text-white transition-colors rounded-xs cursor-pointer uppercase"
                  >
                    <Download className="w-3 h-3" />
                    Png
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Aerodynamic Anatomy Breakdown */}
          <div>
            <span className="text-[11px] text-[#D71920] font-semibold flex items-center gap-2 mb-3">
              <Sliders className="w-3.5 h-3.5" />
              Aerodynamic anatomy
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                className={`p-4 border rounded-sm ${
                  isGarageLight ? 'bg-[#F6F7F5] border-black/10' : 'bg-[#121516] border-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#D71920]" />
                  <h4 className="font-heading text-xs font-semibold">
                    1. Forward Airfoil Rake
                  </h4>
                </div>
                <p className="text-[11px] font-light leading-relaxed text-[#85898A]">
                  The left stem is set at a 32° velocity slant, mimicking high-speed front wing endplates and intake diffusers.
                </p>
              </div>

              <div
                className={`p-4 border rounded-sm ${
                  isGarageLight ? 'bg-[#F6F7F5] border-black/10' : 'bg-[#121516] border-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#D71920]" />
                  <h4 className="font-heading text-xs font-semibold">
                    2. Supersonic Dart Notch
                  </h4>
                </div>
                <p className="text-[11px] font-light leading-relaxed text-[#85898A]">
                  An aerodynamic forward-pointing wedge inside the counter creates an optical speedmark pointing dynamically toward the finish line.
                </p>
              </div>

              <div
                className={`p-4 border rounded-sm ${
                  isGarageLight ? 'bg-[#F6F7F5] border-black/10' : 'bg-[#121516] border-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#D71920]" />
                  <h4 className="font-heading text-xs font-semibold">
                    3. 3D Ribbon Diffuser
                  </h4>
                </div>
                <p className="text-[11px] font-light leading-relaxed text-[#85898A]">
                  A looping 3D aerofoil fold with a deep shadow underbelly and specular ridge highlight, grounding the emblem on the track baseline.
                </p>
              </div>
            </div>
          </div>

          {/* Color Tokens Matrix */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-[#D71920] font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Primary brand color matrix
              </span>
              <span className="text-xs text-[#85898A]">Click token to copy HEX</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Garage crimson', hex: '#8A080D', desc: 'Light mode base stem' },
                { label: 'Racing red', hex: '#D71920', desc: 'Core brand accent' },
                { label: 'Circuit scarlet', hex: '#FF202A', desc: 'Dark mode luminous foil' },
                { label: 'Chassis noir', hex: '#0B0D0E', desc: 'Track tarmac foundation' },
              ].map((token) => (
                <button
                  key={token.hex}
                  onClick={() => copyColorCode(token.hex)}
                  className={`p-3 border rounded-sm text-left transition-all cursor-pointer group hover:scale-[1.02] ${
                    isGarageLight
                      ? 'bg-[#F6F7F5] border-black/10 hover:border-black/30'
                      : 'bg-[#121516] border-white/10 hover:border-white/30'
                  }`}
                >
                  <div
                    className="w-full h-8 rounded-xs mb-2 border border-black/20 relative flex items-center justify-end px-2"
                    style={{ backgroundColor: token.hex }}
                  >
                    {copiedColor === token.hex && (
                      <span className="text-[11px] bg-black/80 text-white px-1 py-0.5 rounded-xs">
                        Copied
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold ">
                      {token.label}
                    </span>
                    <span className="text-xs text-[#85898A] group-hover:text-[#D71920]">
                      {token.hex}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#85898A] block mt-0.5">
                    {token.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isGarageLight ? 'bg-[#F6F7F5] border-black/10' : 'bg-[#121516] border-white/10'
          }`}
        >
          <div className="flex items-center gap-2 text-xs text-[#85898A]">
            <span>Current Theme:</span>
            <span className="font-bold text-[#D71920] uppercase">
              {isGarageLight ? 'Garage Light' : 'Circuit Dark'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`px-3 py-1.5 text-xs border rounded-xs transition-colors cursor-pointer ${
                isGarageLight
                  ? 'bg-white border-black/15 text-black hover:border-black/40'
                  : 'bg-[#1A1E20] border-white/15 text-white hover:border-white/40'
              }`}
            >
              Switch Theme
            </button>
            <button
              onClick={onClose}
              className="px-5 py-1.5 text-xs font-semibold bg-[#D71920] hover:bg-[#B5141A] text-white rounded-xs transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BrandIdentityModal;
