import React from 'react';
import { ChevronRight, ChevronLeft, Home, RotateCcw } from 'lucide-react';
import { Vehicle } from '../types';
import { Article } from '../data/marketingData';
import { useTheme } from '../context/ThemeContext';

export interface BreadcrumbNode {
  id: string;
  label: string;
  category?: string;
  tab: string;
  type: 'tab' | 'vehicle' | 'article' | 'booking';
  metadata?: {
    vehicle?: Vehicle;
    article?: Article;
    experience?: string;
  };
}

interface BreadcrumbsProps {
  trail: BreadcrumbNode[];
  onNavigateToNode: (node: BreadcrumbNode, index: number) => void;
  onGoBack: () => void;
  onResetToHome: () => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  trail,
  onNavigateToNode,
  onGoBack,
  onResetToHome,
}) => {
  const { isGarageLight } = useTheme();
  const canGoBack = trail.length > 1;
  const activeIndex = trail.length - 1;
  const previousNode = canGoBack ? trail[trail.length - 2] : null;

  // Nothing to show on the home page itself
  if (!canGoBack) return null;

  const muted = isGarageLight ? 'text-[#5F656B] hover:text-[#101214]' : 'text-[#8E9394] hover:text-[#F4F3EF]';

  return (
    <nav
      id="routeone-breadcrumb-trail"
      aria-label="Breadcrumb"
      className={`w-full border-t select-none transition-colors duration-200 ${
        isGarageLight ? 'border-black/[0.06]' : 'border-white/[0.06]'
      }`}
    >
      <div className="w-full px-4 sm:px-6 md:px-10 py-2 flex items-center gap-3 text-[13px] min-w-0">
        <button
          id="breadcrumb-back-button"
          onClick={onGoBack}
          className={`flex items-center gap-1 transition-colors cursor-pointer shrink-0 ${muted}`}
          title={previousNode ? `Back to ${previousNode.label}` : 'Back'}
          aria-label={previousNode ? `Back to ${previousNode.label}` : 'Back'}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className={`h-4 w-px shrink-0 ${isGarageLight ? 'bg-black/10' : 'bg-white/10'}`} aria-hidden="true" />
        <ol className="flex items-center gap-1.5 min-w-0 overflow-x-auto no-scrollbar">
          {trail.map((node, index) => {
            const isLast = index === activeIndex;
            return (
              <li key={`${node.id}-${index}`} className="flex items-center gap-1.5 shrink-0 min-w-0">
                {index > 0 && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 ${isGarageLight ? 'text-black/25' : 'text-white/25'}`}
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    aria-current="page"
                    className={`font-medium truncate max-w-[180px] sm:max-w-[320px] ${
                      isGarageLight ? 'text-[#101214]' : 'text-[#F4F3EF]'
                    }`}
                  >
                    {node.label}
                  </span>
                ) : (
                  <button
                    onClick={() => (index === 0 ? onResetToHome() : onNavigateToNode(node, index))}
                    className={`transition-colors cursor-pointer truncate max-w-[120px] sm:max-w-[180px] ${muted}`}
                  >
                    {index === 0 ? 'Home' : node.label}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

