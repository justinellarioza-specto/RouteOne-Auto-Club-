import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Car,
  FileText,
  Flag,
  ArrowUpRight,
  Sparkles,
  Clock,
  Gauge,
  MapPin,
  CornerDownLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Vehicle, ExperienceService } from '../types';
import { Article } from '../data/marketingData';
import { useTheme } from '../context/ThemeContext';
import { RouteOneLogo } from './RouteOneLogo';

export type SearchCategory = 'all' | 'vehicles' | 'services' | 'articles';

export interface SearchResultItem {
  id: string;
  type: 'vehicle' | 'service' | 'article';
  title: string;
  subtitle: string;
  categoryTag: string;
  meta: string[];
  image: string;
  badge?: string;
  rawVehicle?: Vehicle;
  rawService?: ExperienceService;
  rawArticle?: Article;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  experiences: ExperienceService[];
  articles: Article[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onSelectArticle: (article: Article) => void;
  onSelectService: (serviceName: string) => void;
  onNavigateTab: (tab: string) => void;
}

const POPULAR_SEARCHES = [
  'RouteOne R1',
  'Track Experience',
  'Aerodynamics',
  'Naturally Aspirated V12',
  'Porsche GT3 RS',
  'Silverstone Proving Ground',
  'Consultation',
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  experiences,
  articles,
  onSelectVehicle,
  onSelectArticle,
  onSelectService,
  onNavigateTab,
}) => {
  const { isGarageLight } = useTheme();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Build searchable index items
  const indexedItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. Vehicles
    vehicles.forEach((v) => {
      items.push({
        id: `vehicle-${v.id}`,
        type: 'vehicle',
        title: v.name || 'Vehicle',
        subtitle: `${v.engine || 'Powertrain Spec'}${v.power ? ` • ${v.power}` : ''}`,
        categoryTag: v.category || 'TRACK',
        meta: [v.acceleration, v.topSpeed, v.price || 'Allocation'].filter((m): m is string => Boolean(m)),
        image: v.image,
        badge: v.badge,
        rawVehicle: v,
      });
    });

    // 2. Services & Experiences
    experiences.forEach((exp) => {
      items.push({
        id: `service-${exp.id}`,
        type: 'service',
        title: exp.name || 'Experience',
        subtitle: exp.subtitle || exp.description || 'Exclusive Experience',
        categoryTag: exp.category || 'CIRCUIT',
        meta: [exp.duration, exp.location, exp.price].filter((m): m is string => Boolean(m)),
        image: exp.image,
        badge: exp.availability,
        rawService: exp,
      });
    });

    // 3. Articles
    articles.forEach((art) => {
      items.push({
        id: `article-${art.id}`,
        type: 'article',
        title: art.title || 'Article',
        subtitle: art.subtitle || art.excerpt || '',
        categoryTag: art.category || 'EDITORIAL',
        meta: [art.readTime, art.date].filter((m): m is string => Boolean(m)),
        image: art.image,
        rawArticle: art,
      });
    });

    return items;
  }, [vehicles, experiences, articles]);

  // Filtered results based on query and category tab
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    return indexedItems.filter((item) => {
      // Category filter
      if (activeCategory === 'vehicles' && item.type !== 'vehicle') return false;
      if (activeCategory === 'services' && item.type !== 'service') return false;
      if (activeCategory === 'articles' && item.type !== 'article') return false;

      // Empty query shows all or popular items
      if (!q) return true;

      // Query matching across titles, subtitles, tags, and item details
      const titleMatch = (item.title || '').toLowerCase().includes(q);
      const subtitleMatch = (item.subtitle || '').toLowerCase().includes(q);
      const categoryMatch = (item.categoryTag || '').toLowerCase().includes(q);
      const badgeMatch = item.badge ? item.badge.toLowerCase().includes(q) : false;
      const metaMatch = (item.meta || []).some((m) => m && m.toLowerCase().includes(q));

      let extraContentMatch = false;
      if (item.rawVehicle) {
        extraContentMatch =
          Boolean(item.rawVehicle.features?.some((f) => f && f.toLowerCase().includes(q))) ||
          Boolean(item.rawVehicle.description && item.rawVehicle.description.toLowerCase().includes(q)) ||
          Boolean(item.rawVehicle.marque && item.rawVehicle.marque.toLowerCase().includes(q));
      } else if (item.rawService) {
        extraContentMatch =
          Boolean(item.rawService.inclusions?.some((inc) => inc && inc.toLowerCase().includes(q))) ||
          Boolean(item.rawService.description && item.rawService.description.toLowerCase().includes(q));
      } else if (item.rawArticle) {
        extraContentMatch =
          Boolean(item.rawArticle.content?.some((c) => c && c.toLowerCase().includes(q))) ||
          Boolean(item.rawArticle.excerpt && item.rawArticle.excerpt.toLowerCase().includes(q));
      }

      return (
        titleMatch ||
        subtitleMatch ||
        categoryMatch ||
        badgeMatch ||
        metaMatch ||
        extraContentMatch
      );
    });
  }, [indexedItems, query, activeCategory]);

  // Counts for tabs
  const counts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filterFn = (type: 'vehicle' | 'service' | 'article') => {
      return indexedItems.filter((item) => {
        if (item.type !== type) return false;
        if (!q) return true;
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const subtitleMatch = (item.subtitle || '').toLowerCase().includes(q);
        const categoryMatch = (item.categoryTag || '').toLowerCase().includes(q);
        const badgeMatch = item.badge ? item.badge.toLowerCase().includes(q) : false;
        const metaMatch = (item.meta || []).some((m) => m && m.toLowerCase().includes(q));
        return titleMatch || subtitleMatch || categoryMatch || badgeMatch || metaMatch;
      }).length;
    };

    const vehiclesCount = filterFn('vehicle');
    const servicesCount = filterFn('service');
    const articlesCount = filterFn('article');

    return {
      all: vehiclesCount + servicesCount + articlesCount,
      vehicles: vehiclesCount,
      services: servicesCount,
      articles: articlesCount,
    };
  }, [indexedItems, query]);

  // Handle keyboard navigation
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (filteredResults.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
        scrollSelectedIntoView();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
        scrollSelectedIntoView();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const currentItem = filteredResults[selectedIndex];
        if (currentItem) {
          handleItemAction(currentItem);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  const scrollSelectedIntoView = () => {
    requestAnimationFrame(() => {
      const activeEl = resultsContainerRef.current?.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  };

  const handleItemAction = (item: SearchResultItem) => {
    onClose();
    if (item.type === 'vehicle' && item.rawVehicle) {
      onSelectVehicle(item.rawVehicle);
    } else if (item.type === 'article' && item.rawArticle) {
      onSelectArticle(item.rawArticle);
    } else if (item.type === 'service' && item.rawService) {
      onSelectService(item.rawService.name);
    }
  };

  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="text-[#D71920] font-semibold bg-[#D71920]/10 px-0.5 rounded-xs">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      id="routeone-search-modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Search RouteOne Ecosystem"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] rounded-sm transition-colors border ${
          isGarageLight
            ? 'bg-white border-black/15 shadow-[0_25px_60px_rgba(0,0,0,0.15)]'
            : 'bg-[#0A0A0A] border-[#262626]'
        }`}
      >
        {/* Top Header & Search Input */}
        <div className={`p-4 sm:p-5 border-b transition-colors ${
          isGarageLight ? 'bg-[#F6F7F5] border-black/10' : 'bg-[#0E0E0E] border-[#202020]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 border rounded-sm ${
              isGarageLight ? 'bg-white border-black/15 text-[#D71920]' : 'bg-[#141414] border-[#252525] text-[#D71920]'
            }`}>
              <Search className="w-5 h-5" />
            </div>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                id="search-palette-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vehicles, track experiences, engineering journal..."
                className={`w-full bg-transparent text-sm sm:text-base font-sans-ui focus:outline-none pr-8 tracking-wide ${
                  isGarageLight
                    ? 'text-[#111415] placeholder-[#8C9399]'
                    : 'text-white placeholder-[#606060]'
                }`}
                autoComplete="off"
                spellCheck="false"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 p-1 transition-colors cursor-pointer ${
                    isGarageLight ? 'text-[#8C9399] hover:text-[#111415]' : 'text-[#8A8A8A] hover:text-white'
                  }`}
                  aria-label="Clear search text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              id="search-palette-close-btn"
              onClick={onClose}
              className={`p-2 border transition-colors cursor-pointer rounded-sm ${
                isGarageLight
                  ? 'text-[#565C62] hover:text-[#111415] hover:bg-black/5 border-black/15'
                  : 'text-[#8A8A8A] hover:text-white hover:bg-[#1A1A1A] border-[#222]'
              }`}
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Category Chips */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className={`text-xs mr-1 hidden sm:inline ${
              isGarageLight ? 'text-[#8C9399]' : 'text-[#5A5A5A]'
            }`}>
              Filter:
            </span>
            {(
              [
                { id: 'all', label: 'All Results', count: counts.all },
                { id: 'vehicles', label: 'Vehicles', count: counts.vehicles },
                { id: 'services', label: 'Services & Track', count: counts.services },
                { id: 'articles', label: 'Journal', count: counts.articles },
              ] as const
            ).map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`search-tab-${tab.id}`}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 text-[11px] transition-all cursor-pointer flex items-center gap-1.5 border rounded-xs ${
                    isActive
                      ? isGarageLight
                        ? 'bg-[#111415] text-white font-semibold border-[#111415]'
                        : 'bg-white text-black font-semibold border-white'
                      : isGarageLight
                      ? 'bg-white text-[#565C62] border-black/15 hover:border-[#D71920] hover:text-[#111415]'
                      : 'bg-[#141414] text-[#8A8A8A] border-[#222] hover:border-[#333] hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[11px] px-1 py-0.2 rounded-none font-semibold ${
                      isActive
                        ? isGarageLight
                          ? 'bg-white/20 text-white'
                          : 'bg-black/15 text-black'
                        : isGarageLight
                        ? 'bg-black/5 text-[#565C62]'
                        : 'bg-[#202020] text-[#777]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular / Quick Suggestions (when query is empty) */}
        {!query && (
          <div className={`px-5 py-3.5 border-b flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none transition-colors ${
            isGarageLight ? 'bg-[#F0F2EE] border-black/10' : 'bg-[#080808] border-[#181818]'
          }`}>
            <span className={` flex items-center gap-1 shrink-0 ${
              isGarageLight ? 'text-[#565C62]' : 'text-[#555]'
            }`}>
              <Sparkles className="w-3 h-3 text-[#D71920]" />
              Popular:
            </span>
            <div className="flex items-center gap-1.5">
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className={`px-2.5 py-1 border transition-colors whitespace-nowrap cursor-pointer rounded-xs ${
                    isGarageLight
                      ? 'bg-white hover:bg-black/5 border-black/15 text-[#565C62] hover:text-[#111415] hover:border-[#D71920]'
                      : 'bg-[#121212] hover:bg-[#1C1C1C] border-[#202020] hover:border-[#D71920]/40 text-[#888] hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        <div
          ref={resultsContainerRef}
          id="search-results-list"
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 scrollbar-thin scrollbar-thumb-zinc-700"
        >
          {filteredResults.length > 0 ? (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-selected={isSelected ? 'true' : 'false'}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => handleItemAction(item)}
                  className={`group relative p-3 sm:p-4 border transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-3.5 rounded-sm ${
                    isSelected
                      ? isGarageLight
                        ? 'bg-white border-[#D71920] ring-1 ring-[#D71920]/40 shadow-sm'
                        : 'bg-[#121212] border-[#D71920]/70 ring-1 ring-[#D71920]/50'
                      : isGarageLight
                      ? 'bg-[#F6F7F5] border-black/10 hover:border-black/20'
                      : 'bg-[#0E0E0E] border-[#1C1C1C] hover:border-[#2C2C2C]'
                  }`}
                >
                  {/* Left thumbnail */}
                  <div className="relative w-full sm:w-28 h-24 sm:h-20 shrink-0 bg-black overflow-hidden border border-black/10 rounded-xs">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover filter brightness-[0.88] transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span
                      className={`absolute bottom-1.5 left-1.5 px-1.5 py-0.5 text-[11px] border ${
                        item.type === 'vehicle'
                          ? 'bg-[#D71920] text-white border-transparent'
                          : item.type === 'service'
                          ? 'bg-amber-500 text-black border-transparent font-bold'
                          : 'bg-zinc-700 text-white border-transparent'
                      }`}
                    >
                      {item.type === 'vehicle' ? 'Vehicle' : item.type === 'service' ? 'SERVICE' : 'ARTICLE'}
                    </span>
                  </div>

                  {/* Center Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs ${
                        isGarageLight ? 'text-[#8C9399]' : 'text-[#777]'
                      }`}>
                        {item.categoryTag}
                      </span>
                      {item.badge && (
                        <span className={`text-[11px] px-1.5 py-0.5 border rounded-xs ${
                          isGarageLight
                            ? 'bg-white border-black/15 text-[#565C62]'
                            : 'bg-[#1A1A1A] border-[#262626] text-[#AAA]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h4 className={`text-base font-medium group-hover:text-[#D71920] transition-colors truncate ${
                      isGarageLight ? 'text-[#111415]' : 'text-white'
                    }`}>
                      {highlightMatch(item.title, query)}
                    </h4>

                    <p className={`text-xs line-clamp-1 mt-0.5 font-light ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#8A8A8A]'
                    }`}>
                      {highlightMatch(item.subtitle, query)}
                    </p>

                    {/* Metadata tags */}
                    <div className={`flex items-center gap-3 mt-2 text-[11px] overflow-x-auto ${
                      isGarageLight ? 'text-[#8C9399]' : 'text-[#666]'
                    }`}>
                      {item.meta.map((m, mIdx) => (
                        <span key={mIdx} className="flex items-center gap-1 shrink-0">
                          {mIdx > 0 && <span className={isGarageLight ? 'text-black/20' : 'text-[#333]'}>•</span>}
                          <span className={isGarageLight ? 'text-[#3E4347]' : 'text-[#999]'}>
                            {highlightMatch(m, query)}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Action Hint / CTA */}
                  <div className={`shrink-0 flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 ${
                    isGarageLight ? 'border-black/10' : 'border-[#1F1F1F]'
                  }`}>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 border group-hover:border-[#D71920] text-xs transition-all rounded-xs ${
                      isGarageLight
                        ? 'bg-white border-black/15 text-[#111415] group-hover:bg-[#D71920] group-hover:text-white group-hover:border-[#D71920]'
                        : 'bg-black border-[#252525] text-[#AAA] group-hover:text-white'
                    }`}>
                      <span>
                        {item.type === 'vehicle'
                          ? 'View Dossier'
                          : item.type === 'service'
                          ? 'Reserve'
                          : 'Read Article'}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#D71920] group-hover:text-white" />
                    </div>

                    {isSelected && (
                      <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] ${
                        isGarageLight ? 'text-[#8C9399]' : 'text-[#555]'
                      }`}>
                        <CornerDownLeft className="w-2.5 h-2.5" />
                        Press Enter
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            /* Empty Search State */
            <div className="py-16 px-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 border flex items-center justify-center rounded-sm ${
                isGarageLight ? 'bg-[#F6F7F5] border-black/15' : 'bg-[#141414] border-[#222]'
              }`}>
                <Search className="w-6 h-6 text-[#D71920]" />
              </div>
              <h3 className={`text-lg font-medium mb-1 ${
                isGarageLight ? 'text-[#111415]' : 'text-white'
              }`}>
                No matching results for "{query}"
              </h3>
              <p className={`text-xs max-w-sm mx-auto mb-6 ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#777]'
              }`}>
                We couldn't find vehicles, articles, or services matching your criteria. Try adjusting your query or category filters.
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {['RouteOne R1', 'McLaren', 'Track Experience', 'Aerodynamics'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className={`px-3 py-1.5 border text-xs transition-colors rounded-xs ${
                      isGarageLight
                        ? 'bg-white hover:bg-black/5 border-black/15 text-[#3E4347] hover:text-[#111415]'
                        : 'bg-[#111] hover:bg-[#1A1A1A] border-[#242424] text-[#888] hover:text-white'
                    }`}
                  >
                    Try "{item}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Keyboard Bar */}
        <div className={`px-5 py-3 border-t flex items-center justify-between text-xs select-none transition-colors ${
          isGarageLight
            ? 'bg-[#F6F7F5] border-black/10 text-[#565C62]'
            : 'bg-[#080808] border-[#1C1C1C] text-[#5A5A5A]'
        }`}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 border rounded-xs ${
                isGarageLight ? 'bg-white border-black/15 text-[#111415]' : 'bg-[#141414] border-[#222] text-[#888]'
              }`}>↑</kbd>
              <kbd className={`px-1.5 py-0.5 border rounded-xs ${
                isGarageLight ? 'bg-white border-black/15 text-[#111415]' : 'bg-[#141414] border-[#222] text-[#888]'
              }`}>↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 border rounded-xs ${
                isGarageLight ? 'bg-white border-black/15 text-[#111415]' : 'bg-[#141414] border-[#222] text-[#888]'
              }`}>↵</kbd>
              <span>Select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 border rounded-xs ${
                isGarageLight ? 'bg-white border-black/15 text-[#111415]' : 'bg-[#141414] border-[#222] text-[#888]'
              }`}>Esc</kbd>
              <span>Dismiss</span>
            </span>
          </div>

          <div className={`hidden sm:flex items-center gap-2 ${
            isGarageLight ? 'text-[#8C9399]' : 'text-[#85898A]'
          }`}>
            <RouteOneLogo variant="emblem" className="h-3.5 w-auto" />
            <span className="tracking-wider">RouteOne index engine</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
