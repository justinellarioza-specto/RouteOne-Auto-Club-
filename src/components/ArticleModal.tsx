import React from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { motion } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { Article } from '../data/marketingData';
import { useTheme } from '../context/ThemeContext';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  onBookExperience: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onBookExperience,
}) => {
  useEscapeKey(!!article, onClose);
  const { isGarageLight } = useTheme();

  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className={`relative w-full max-w-2xl border shadow-2xl overflow-hidden my-6 rounded-sm transition-colors duration-200 ${
          isGarageLight
            ? 'bg-white border-black/15 shadow-[0_25px_60px_rgba(0,0,0,0.15)]'
            : 'bg-[#151718] border-white/[0.08]'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 p-2 border transition-colors cursor-pointer rounded-sm ${
            isGarageLight
              ? 'text-[#565C62] hover:text-[#111415] bg-white/90 border-black/15'
              : 'text-[#8B8D8C] hover:text-[#F4F4F1] bg-[#111314]/80 border-white/[0.08]'
          }`}
          aria-label="Close article"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-56 sm:h-64 overflow-hidden bg-black">
          <img
 loading="lazy"
 decoding="async"
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover filter brightness-90 contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-xs text-[#C9B37E] mb-1 block">
              {article.category.charAt(0) + article.category.slice(1).toLowerCase()} · {article.readTime}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl text-white ">
              {article.title}
            </h2>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <p className={`text-xs sm:text-sm font-light border-l-2 border-[#D71920] pl-3 ${
            isGarageLight ? 'text-[#111415] font-medium' : 'text-[#F4F4F1]'
          }`}>
            {article.subtitle}
          </p>

          <div className={`space-y-4 text-xs sm:text-sm font-light leading-relaxed ${
            isGarageLight ? 'text-[#3E4347]' : 'text-[#8B8D8C]'
          }`}>
            {article.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className={`pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isGarageLight ? 'border-black/10' : 'border-white/[0.06]'
          }`}>
            <div className={`text-xs ${isGarageLight ? 'text-[#565C62]' : 'text-[#505251]'}`}>
              Dispatch // {article.date}
            </div>

            <button
              onClick={() => {
                onBookExperience();
                onClose();
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#D71920] hover:bg-[#b5141a] text-white text-xs font-semibold transition-colors cursor-pointer rounded-sm shadow-sm"
            >
              <span>Discuss machine allocation</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
