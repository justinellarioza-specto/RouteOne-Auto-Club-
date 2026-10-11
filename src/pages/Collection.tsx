import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Scale,
  X,
  Sparkles,
  Check,
  Plus,
  ArrowUpRight,
  Search,
  BookOpen,
  Flag,
  Wind,
  Layers,
  Crosshair,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  RefreshCw,
  Lock,
  Radio,
} from 'lucide-react';
import { Vehicle, VehicleAvailabilityRecord } from '../types';
import { VehicleCompareModal } from '../components/VehicleCompareModal';
import { JOURNAL_ARTICLES, Article } from '../data/marketingData';
import { fetchVehicleAvailability } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface CollectionPageProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenBookingModal: (experience?: string, vehicle?: string) => void;
  onSelectArticle?: (article: Article) => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  vehicles,
  onSelectVehicle,
  onOpenBookingModal,
  onSelectArticle,
}) => {
  const { isGarageLight } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const gridSectionRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Real-Time Availability & Reservation Allocation State
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, VehicleAvailabilityRecord>>({});
  const [availabilitySummary, setAvailabilitySummary] = useState<{
    total: number;
    currentlyAvailable: number;
    inPrivateCollection: number;
  } | null>(null);
  const [isRefreshingAvailability, setIsRefreshingAvailability] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'AVAILABLE' | 'PRIVATE'>('ALL');

  const loadAvailability = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshingAvailability(true);
    try {
      const data = await fetchVehicleAvailability();
      if (data && data.availability) {
        setAvailabilityMap(data.availability);
        setAvailabilitySummary(data.summary);
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to load vehicle availability:', err);
    } finally {
      if (isManual) {
        setTimeout(() => setIsRefreshingAvailability(false), 450);
      }
    }
  }, []);

  useEffect(() => {
    loadAvailability();
    const interval = setInterval(() => {
      loadAvailability();
    }, 25000); // Polling every 25s for real-time reservation updates
    return () => clearInterval(interval);
  }, [loadAvailability]);

  // Comparison State
  const [compareVehicleIds, setCompareVehicleIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [selectedCarA, setSelectedCarA] = useState<Vehicle | null>(null);
  const [selectedCarB, setSelectedCarB] = useState<Vehicle | null>(null);

  // Exact Primary Categories for Horizontal Navigation & Dynamic Filtering
  const categories = [
    { id: 'ALL', label: 'ALL', desc: 'Curated exotic automotive catalog across all vehicle categories.', badge: '32 cars' },
    { id: 'SUPERCARS', label: 'Supercars', desc: 'High-performance exotic road cars engineered for luxury, presence, and visceral performance.', badge: 'Exotic / performance' },
    { id: 'HYPERCARS', label: 'Hypercars', desc: 'Extreme-performance vehicles designed around maximum speed, cutting-edge technology, and rare engineering.', badge: 'Extreme / pinnacle' },
    { id: 'FORMULA 1', label: 'Formula 1', desc: 'Authentic 2024 FIA World Championship single-seater race cars with 1,000+ HP hybrid powertrains and official liveries.', badge: 'FIA F1 grid' },
    { id: 'F1 HERITAGE', label: 'F1 heritage', desc: 'Championship-winning classic F1 single-seaters from legendary turbo, V10, and active-suspension eras.', badge: 'Historic monocoques' },
    { id: 'TRACK', label: 'Track', desc: 'Circuit-focused track specials engineered strictly for aerodynamic downforce, telemetry, and lap times.', badge: 'Circuit only' },
    { id: 'SPORTS CARS', label: 'Sports cars', desc: 'Driver-focused performance cars prioritizing agile handling, analog engagement, and balanced chassis dynamics.', badge: 'Analog precision' },
    { id: 'FAST CARS', label: 'Fast cars', desc: 'High-output sports machinery combining daily usability with blistering acceleration.', badge: 'Velocity / saloons' },
    { id: 'GRAND TOURERS', label: 'Grand tourers', desc: 'Effortless continental luxury grand tourers powered by bespoke high-displacement engines.', badge: 'Continental V12' },
    { id: 'ELECTRIC', label: 'Electric', desc: 'Instant-torque all-electric hyper-propulsion featuring quad-motor vectoring and ultra-high output.', badge: 'Hyper-EV' },
  ];

  // Specific visual color accents for tiny indicators (never color entire card)
  const categoryColorMap: Record<string, string> = {
    'SUPERCARS': '#C9B37E', // Champagne
    'HYPERCARS': '#AEB4B5', // Silver
    'FORMULA 1': '#D71920', // Racing red
    'F1 HERITAGE': '#D4AF37', // Champagne gold
    'TRACK': '#9E1217', // Dark red
    'SPORTS CARS': '#F4F3EF', // White
    'FAST CARS': '#D71920', // Red
    'GRAND TOURERS': '#AEB4B5', // Silver
    'ELECTRIC': '#94A3B8', // Cool silver
  };

  // Helper to check vehicle category match
  const checkVehicleMatchesCategory = (car: Vehicle, categoryId: string): boolean => {
    const cat = (car.category || '').toUpperCase();
    const sub = (car.subcategory || '').toUpperCase();
    const badge = (car.badge || '').toUpperCase();

    if (categoryId === 'ALL') return true;
    if (categoryId === 'SUPERCARS') return cat === 'SUPERCARS' || cat.includes('SUPERCAR');
    if (categoryId === 'HYPERCARS') return cat === 'HYPERCARS' || cat.includes('HYPERCAR');
    if (categoryId === 'FORMULA 1') return cat === 'FORMULA 1' || sub.includes('SINGLE-SEATER') || badge === 'FORMULA 1';
    if (categoryId === 'F1 HERITAGE') return cat === 'F1 HERITAGE' || sub.includes('CLASSIC ERA') || sub.includes('MODERN ERA');
    if (categoryId === 'TRACK') return cat === 'TRACK' || badge.includes('TRACK SPEC') || badge.includes('TRACK CONCEPT');
    if (categoryId === 'SPORTS CARS') return cat === 'SPORTS CARS';
    if (categoryId === 'FAST CARS') return cat === 'FAST CARS';
    if (categoryId === 'GRAND TOURERS') return cat === 'GRAND TOURERS' || cat.includes('TOURER');
    if (categoryId === 'ELECTRIC') return cat === 'ELECTRIC';
    return cat === categoryId;
  };

  // Live count of vehicles per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: vehicles.length };
    categories.forEach((cat) => {
      if (cat.id !== 'ALL') {
        counts[cat.id] = vehicles.filter((v) => checkVehicleMatchesCategory(v, cat.id)).length;
      }
    });
    return counts;
  }, [vehicles]);

  // Unique marques or teams available in the currently selected category
  const availableMarquesForCategory = useMemo(() => {
    if (selectedCategory === 'ALL') return [];
    const matchingVehicles = vehicles.filter((v) => checkVehicleMatchesCategory(v, selectedCategory));
    const marques = Array.from(
      new Set(matchingVehicles.map((v) => v.marque || v.brand).filter(Boolean))
    );
    return marques.sort();
  }, [vehicles, selectedCategory]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((car) => {
      const matchesCategory = checkVehicleMatchesCategory(car, selectedCategory);

      const matchesSubFilter =
        selectedSubFilter === 'ALL' ||
        (car.marque || car.brand || '').toUpperCase() === selectedSubFilter.toUpperCase() ||
        (car.team || '').toUpperCase().includes(selectedSubFilter.toUpperCase());

      // Real-time reservation availability filter
      const carStatus = availabilityMap[car.id]?.status || 'Currently Available';
      const matchesAvailability =
        availabilityFilter === 'ALL' ||
        (availabilityFilter === 'AVAILABLE' && carStatus === 'Currently Available') ||
        (availabilityFilter === 'PRIVATE' && carStatus === 'In Private Collection');

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory && matchesSubFilter && matchesAvailability;

      // Real-time matching by Brand, Model, Category, or technical specifications
      const brandStr = `${car.brand || ''} ${car.marque || ''} ${car.team || ''}`.toLowerCase();
      const matchesBrand = brandStr.includes(q);

      const modelStr = `${car.model || ''} ${car.name || ''}`.toLowerCase();
      const matchesModel = modelStr.includes(q);

      const catStr = `${car.category || ''} ${car.badge || ''} ${car.subcategory || ''} ${car.era || ''}`.toLowerCase();
      const matchesCategoryName = catStr.includes(q);

      const extraStr = `${car.engine || ''} ${car.driver || ''}`.toLowerCase();
      const matchesExtra = extraStr.includes(q);

      const matchesSearch = matchesBrand || matchesModel || matchesCategoryName || matchesExtra;

      return matchesCategory && matchesSubFilter && matchesAvailability && matchesSearch;
    });
  }, [vehicles, selectedCategory, selectedSubFilter, searchQuery, availabilityFilter, availabilityMap]);

  // Global search count across the entire vehicle catalog regardless of category filter
  const totalGlobalSearchMatches = useMemo(() => {
    if (!searchQuery.trim()) return vehicles.length;
    const q = searchQuery.toLowerCase().trim();
    return vehicles.filter((car) => {
      const brandStr = `${car.brand || ''} ${car.marque || ''} ${car.team || ''}`.toLowerCase();
      const modelStr = `${car.model || ''} ${car.name || ''}`.toLowerCase();
      const catStr = `${car.category || ''} ${car.badge || ''} ${car.subcategory || ''} ${car.era || ''}`.toLowerCase();
      const extraStr = `${car.engine || ''} ${car.driver || ''}`.toLowerCase();
      return (
        brandStr.includes(q) ||
        modelStr.includes(q) ||
        catStr.includes(q) ||
        extraStr.includes(q)
      );
    }).length;
  }, [vehicles, searchQuery]);

  // Handle toggling category tags: clicking an active category toggles back to ALL
  const handleToggleCategory = (catId: string) => {
    setSelectedSubFilter('ALL');
    if (selectedCategory === catId && catId !== 'ALL') {
      setSelectedCategory('ALL');
    } else {
      setSelectedCategory(catId);
    }
  };

  // Horizontal scroll helpers for category tags
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollOffset = direction === 'left' ? -280 : 280;
      categoryScrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const toggleCompare = (id: string) => {
    setCompareVehicleIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[0], id];
      }
      return [...prev, id];
    });
  };

  const handleOpenComparison = (overrideA?: Vehicle, overrideB?: Vehicle) => {
    if (overrideA && overrideB) {
      setSelectedCarA(overrideA);
      setSelectedCarB(overrideB);
      setIsCompareModalOpen(true);
      return;
    }

    if (compareVehicleIds.length === 2) {
      const vA = vehicles.find((v) => v.id === compareVehicleIds[0]) || vehicles[0];
      const vB = vehicles.find((v) => v.id === compareVehicleIds[1]) || vehicles[1];
      setSelectedCarA(vA);
      setSelectedCarB(vB);
    } else if (compareVehicleIds.length === 1) {
      const vA = vehicles.find((v) => v.id === compareVehicleIds[0]) || vehicles[0];
      const vB = vehicles.find((v) => v.id !== vA.id) || vehicles[1] || vehicles[0];
      setSelectedCarA(vA);
      setSelectedCarB(vB);
    } else {
      setSelectedCarA(vehicles[0] || null);
      setSelectedCarB(vehicles[1] || vehicles[0] || null);
    }
    setIsCompareModalOpen(true);
  };

  const handlePresetCompare = (idA: string, idB: string) => {
    const carA = vehicles.find((v) => v.id === idA) || vehicles[0];
    const carB = vehicles.find((v) => v.id === idB) || vehicles[1];
    setCompareVehicleIds([carA.id, carB.id]);
    setSelectedCarA(carA);
    setSelectedCarB(carB);
    setIsCompareModalOpen(true);
  };

  const handleExploreF1 = () => {
    setSelectedCategory('FORMULA 1');
    gridSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReadStory = (articleId: string) => {
    const article = JOURNAL_ARTICLES.find((a) => a.id === articleId) || JOURNAL_ARTICLES[0];
    if (onSelectArticle) {
      onSelectArticle(article);
    } else {
      // Fallback: trigger booking modal with story context
      onOpenBookingModal('Track Experience', article.title);
    }
  };

  const dockCarA = vehicles.find((v) => v.id === compareVehicleIds[0]);
  const dockCarB = vehicles.find((v) => v.id === compareVehicleIds[1]);

  return (
    <div
      id="collection-page"
      className={`w-full px-4 sm:px-8 md:px-12 py-12 md:py-16 relative min-h-screen transition-colors duration-300 ${
        isGarageLight
          ? 'bg-[#F4F3EF] text-[#111415]'
          : 'bg-[#0B0D0E] text-[#F4F3EF]'
      }`}
    >
      {/* 17. COLLECTION PAGE HEADER */}
      <div className={`pb-8 mb-10 border-b ${isGarageLight ? 'border-black/10' : 'border-white/[0.08]'}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 bg-[#D71920]" />
          <span className={`text-xs ${isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'}`}>
            RouteOne Auto Club
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div className="max-w-3xl">
            <h1 className={`font-heading text-4xl sm:text-6xl font-semibold uppercase mb-4 ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
              THE COLLECTION.
            </h1>
            <p className={`text-sm sm:text-base font-light leading-relaxed ${isGarageLight ? 'text-[#3E4347]' : 'text-[#CBD5E1]'}`}>
              From road-bred icons to machines born for the circuit. Explore the world of performance through the RouteOne lens.
            </p>
          </div>

          {/* 13. COLLECTION COUNTER — Motorsport Technical Specification */}
          <div className={`border p-4 shrink-0 min-w-[240px] rounded-sm transition-colors ${
            isGarageLight
              ? 'bg-white border-black/10 shadow-sm'
              : 'bg-[#111415] border-white/[0.12]'
          }`}>
            <span className={`text-[11px] block mb-2 ${isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'}`}>
              The fleet at a glance
            </span>
            <div className={`grid grid-cols-3 gap-3 text-center border-t pt-2 ${isGarageLight ? 'border-black/10' : 'border-white/[0.06]'}`}>
              <div>
                <span className={`font-heading text-xl block font-bold ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                  {vehicles.length}
                </span>
                <span className={`text-[11px] ${isGarageLight ? 'text-[#565C62]' : 'text-[#94A3B8]'}`}>Cars</span>
              </div>
              <div className={`border-x ${isGarageLight ? 'border-black/10' : 'border-white/[0.08]'}`}>
                <span className="font-heading text-xl text-[#D71920] block font-bold">
                  {categories.filter((c) => c.id !== 'ALL').length}
                </span>
                <span className={`text-[11px] ${isGarageLight ? 'text-[#565C62]' : 'text-[#94A3B8]'}`}>Categories</span>
              </div>
              <div>
                <span className="font-heading text-xl text-[#C9B37E] block font-bold">01</span>
                <span className={`text-[11px] ${isGarageLight ? 'text-[#565C62]' : 'text-[#94A3B8]'}`}>Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* DEDICATED HEADER SEARCH FIELD: Real-Time Brand, Model, or Category Filter */}
        <div className={`my-6 p-4 sm:p-5 border transition-all rounded-sm ${
          isGarageLight
            ? 'bg-white border-black/15 shadow-sm focus-within:border-[#D71920]'
            : 'bg-[#0E1012] border-white/[0.14] focus-within:border-[#D71920]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#D71920]" />
              <label
                htmlFor="collection-header-search-input"
                className={`text-xs font-semibold flex items-center gap-2 ${
                  isGarageLight ? 'text-[#2B3035]' : 'text-[#CBD5E1]'
                }`}
              >
                <span>Find a car</span>
              </label>
            </div>

            {/* Live Real-Time Match Counter & Context Scope */}
            <div className="flex items-center gap-2 text-xs ">
              {searchQuery ? (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#D71920]/20 border border-[#D71920]/50 text-[#D71920] tracking-wider font-semibold">
                    {filteredVehicles.length} {filteredVehicles.length === 1 ? 'car found' : 'cars found'}
                  </span>
                  {selectedCategory !== 'ALL' && totalGlobalSearchMatches > filteredVehicles.length && (
                    <button
                      onClick={() => {
                        setSelectedCategory('ALL');
                        setSelectedSubFilter('ALL');
                      }}
                      className={`underline underline-offset-2 transition-colors cursor-pointer text-[11px] ${
                        isGarageLight ? 'text-[#3E4347] hover:text-[#111415]' : 'text-[#AEB4B5] hover:text-white'
                      }`}
                      title="Show all matching cars across all categories"
                    >
                      ({totalGlobalSearchMatches} in all categories)
                    </button>
                  )}
                </div>
              ) : (
                <span className={`tracking-wider text-[11px] flex items-center gap-1.5 ${isGarageLight ? 'text-[#565C62]' : 'text-[#94A3B8]'}`}>
                  Results update as you type
                </span>
              )}

              {selectedCategory !== 'ALL' && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[11px] rounded-xs ${
                  isGarageLight ? 'bg-black/5 border-black/10 text-[#2B3035]' : 'bg-white/[0.06] border-white/[0.12] text-[#CBD5E1]'
                }`}>
                  <span>Showing: <strong className={isGarageLight ? 'text-[#111415]' : 'text-white'}>{selectedCategory}</strong></span>
                  <button
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSelectedSubFilter('ALL');
                    }}
                    className="text-[#D71920] hover:text-red-700 ml-0.5 cursor-pointer font-bold"
                    title="Reset to all categories"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative flex items-center">
            <div className="absolute left-3.5 sm:left-4 text-[#D71920] pointer-events-none flex items-center justify-center">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <input
              id="collection-header-search-input"
              type="text"
              placeholder="Search by brand, model or category, e.g. Ferrari, SF-24, hypercars"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-11 sm:pl-12 pr-24 sm:pr-28 py-3 border text-xs sm:text-sm focus:outline-none focus:border-[#D71920] transition-colors rounded-sm ${
                isGarageLight
                  ? 'bg-[#F6F7F5] border-black/15 text-[#111415] placeholder-[#8C9399]'
                  : 'bg-[#141719] border-white/[0.14] text-[#F4F3EF] placeholder-[#94A3B8]'
              }`}
            />

            {/* Clear button and live feedback */}
            <div className="absolute right-3 sm:right-4 flex items-center gap-2">
              {searchQuery && (
                <button
                  id="header-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  className={`px-2 py-1 text-xs transition-colors flex items-center gap-1 cursor-pointer rounded-xs ${
                    isGarageLight
                      ? 'bg-black/10 hover:bg-[#D71920] hover:text-white text-[#2B3035]'
                      : 'bg-white/[0.12] hover:bg-[#D71920] hover:text-white text-[#CBD5E1]'
                  }`}
                  title="Clear search query"
                >
                  <X className="w-3 h-3" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Query Filters / Shortcuts */}
          <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 pt-3 border-t ${
            isGarageLight ? 'border-black/10' : 'border-white/[0.06]'
          }`}>
            <span className={`text-[11px] mr-1 ${
              isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'
            }`}>
              Popular:
            </span>
            {[
              { label: 'Ferrari', type: 'brand' },
              { label: 'McLaren', type: 'brand' },
              { label: 'Red Bull', type: 'brand' },
              { label: 'Porsche', type: 'brand' },
              { label: 'Bugatti', type: 'brand' },
              { label: 'Formula 1', type: 'category' },
              { label: 'Hypercars', type: 'category' },
              { label: 'Supercars', type: 'category' },
              { label: 'Track', type: 'category' },
            ].map((tag) => {
              const isSelected =
                searchQuery.toUpperCase() === tag.label.toUpperCase() ||
                (tag.type === 'category' && selectedCategory === tag.label.toUpperCase() && !searchQuery);
              return (
                <button
                  key={tag.label}
                  onClick={() => {
                    if (tag.type === 'category') {
                      setSelectedCategory(tag.label.toUpperCase());
                      setSelectedSubFilter('ALL');
                      setSearchQuery('');
                    } else {
                      setSearchQuery(tag.label);
                    }
                  }}
                  className={`px-2 py-0.5 text-[11px] sm:text-xs border transition-colors cursor-pointer rounded-xs ${
                    isSelected
                      ? 'bg-[#D71920] text-white border-[#D71920] font-semibold'
                      : isGarageLight
                      ? 'bg-[#F6F7F5] text-[#2B3035] hover:text-[#111415] border-black/10 hover:border-black/25'
                      : 'bg-[#111415] text-[#CBD5E1] hover:text-[#F4F3EF] border-white/[0.10] hover:border-white/30'
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Benchmark Matrix Quick Action */}
        <div className={`flex flex-wrap items-center justify-between gap-4 pt-4 border-t ${
          isGarageLight ? 'border-black/10' : 'border-white/[0.06]'
        }`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs flex items-center gap-1 mr-1 ${
              isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'
            }`}>
              <Sparkles className="w-3 h-3 text-[#C9B37E]" />
              Compare:
            </span>
            <button
              onClick={() => handlePresetCompare('ferrari-sf24', 'redbull-rb20')}
              className={`px-2.5 py-1 text-xs transition-colors cursor-pointer border rounded-xs ${
                isGarageLight
                  ? 'bg-white text-[#2B3035] hover:text-[#111415] border-black/10 hover:border-black/30'
                  : 'bg-[#111415] text-[#CBD5E1] hover:text-[#F4F3EF] border-white/[0.10] hover:border-white/30'
              }`}
            >
              Ferrari SF-24 vs Red Bull RB20
            </button>
            <button
              onClick={() => handlePresetCompare('koenigsegg-jesko', 'bugatti-tourbillon')}
              className={`px-2.5 py-1 text-xs transition-colors cursor-pointer border rounded-xs ${
                isGarageLight
                  ? 'bg-white text-[#2B3035] hover:text-[#111415] border-black/10 hover:border-black/30'
                  : 'bg-[#111415] text-[#CBD5E1] hover:text-[#F4F3EF] border-white/[0.10] hover:border-white/30'
              }`}
            >
              Jesko Attack vs Tourbillon V16
            </button>
            <button
              onClick={() => handlePresetCompare('r1-concept', 'porsche-gt3rs')}
              className={`px-2.5 py-1 text-xs transition-colors cursor-pointer border rounded-xs ${
                isGarageLight
                  ? 'bg-white text-[#2B3035] hover:text-[#111415] border-black/10 hover:border-black/30'
                  : 'bg-[#111415] text-[#CBD5E1] hover:text-[#F4F3EF] border-white/[0.10] hover:border-white/30'
              }`}
            >
              RouteOne R1 vs 911 GT3 RS
            </button>
          </div>

          <button
            id="header-spec-matrix-btn"
            onClick={() => handleOpenComparison()}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 border text-xs transition-colors cursor-pointer rounded-xs ${
              isGarageLight
                ? 'bg-white border-black/15 text-[#111415] hover:border-[#D71920]'
                : 'bg-[#111415] border-white/[0.14] text-[#F4F3EF] hover:border-[#D71920]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Compare specs</span>
            {compareVehicleIds.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#D71920] text-white text-xs font-bold">
                {compareVehicleIds.length}/2
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 14. FEATURED CATEGORY: THE RACING DNA (Formula 1 Section) */}
      <section className={`mb-14 border overflow-hidden relative group transition-colors rounded-sm ${
        isGarageLight
          ? 'bg-white border-black/10 shadow-sm'
          : 'bg-[#111415] border-white/[0.12]'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Visual Pit-Lane / Carbon / F1 Machine */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[320px] bg-black overflow-hidden collection-card-media">
            <img
 loading="lazy"
 decoding="async"
              src="/images/f1/f1-racing-dna.webp"
              alt="Formula 1 single-seater racing machine cornering under track lights"
              className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.12] transition-transform duration-700 group-hover:scale-105"
            />
            <div className={`absolute inset-0 hidden lg:block ${
              isGarageLight
                ? 'bg-gradient-to-r from-transparent via-white/20 to-white'
                : 'bg-gradient-to-r from-transparent via-[#111415]/40 to-[#111415]'
            }`} />
            <div className={`absolute inset-0 lg:hidden ${
              isGarageLight
                ? 'bg-gradient-to-t from-white via-transparent to-transparent'
                : 'bg-gradient-to-t from-[#111415] via-transparent to-transparent'
            }`} />

            {/* Pit-Lane Telemetry Overlay Tag */}
            <div className="photo-badge absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 bg-black/85 border border-white/20 rounded-xs shadow-md">
              <span className="w-1.5 h-1.5 bg-[#D71920]" />
              <span className="text-[11px] text-white font-semibold">
                Editorial showcase · F1 heritage
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 bg-black/75 backdrop-blur-md p-2.5 border border-white/15 rounded-xs shadow-md">
              <span>Circuit ground-effect telemetry</span>
              <span className="text-[#D71920] font-semibold">Venturi downforce envelope</span>
            </div>
          </div>

          {/* Right: Editorial Narrative & Small Technical Labels */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 bg-[#D71920]" />
                <span className="text-xs text-[#D71920] font-semibold">
                  Featured category
                </span>
              </div>

              <h2 className={`font-heading text-3xl sm:text-4xl uppercase font-semibold mb-3 ${
                isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
              }`}>
                THE RACING DNA.
              </h2>

              <p className={`text-xs sm:text-sm font-light leading-relaxed mb-6 ${
                isGarageLight ? 'text-[#3E4347]' : 'text-[#CBD5E1]'
              }`}>
                From the circuit to the showroom, performance begins with engineering.
                Explore the technological discipline of open-wheel single seaters, ground-effect aero, and screaming high-RPM power units.
              </p>

              {/* Small Technical Labels: AERODYNAMICS 01 / DOWNFORCE 02 / PRECISION 03 */}
              <div className={`grid grid-cols-3 gap-2.5 mb-6 py-4 border-y ${
                isGarageLight ? 'border-black/10' : 'border-white/[0.08]'
              }`}>
                <div className={`p-2 border rounded-xs ${isGarageLight ? 'bg-[#F6F7F5] border-black/10' : 'bg-[#0B0D0E] border-white/[0.06]'}`}>
                  <span className={`text-[11px] block ${isGarageLight ? 'text-[#565C62]' : 'text-[#94A3B8]'}`}>01</span>
                  <span className={` text-xs block font-semibold ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                    Aerodynamics
                  </span>
                </div>
                <div className={`p-2 border rounded-xs ${isGarageLight ? 'bg-[#F6F7F5] border-black/10' : 'bg-[#0B0D0E] border-white/[0.06]'}`}>
                  <span className={`text-[11px] block ${isGarageLight ? 'text-[#565C62]' : 'text-[#94A3B8]'}`}>02</span>
                  <span className=" text-xs text-[#D71920] block font-semibold">
                    Downforce
                  </span>
                </div>
                <div className={`p-2 border rounded-xs ${isGarageLight ? 'bg-[#F6F7F5] border-black/10' : 'bg-[#0B0D0E] border-white/[0.06]'}`}>
                  <span className={`text-[11px] block ${isGarageLight ? 'text-[#565C62]' : 'text-[#94A3B8]'}`}>03</span>
                  <span className=" text-xs text-[#C9B37E] block font-semibold">
                    Precision
                  </span>
                </div>
              </div>

              <p className={`text-xs leading-relaxed mb-6 ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#94A3B8]'
              }`}>
                Editorial showcase for motorsport history appreciation. RouteOne maintains no commercial affiliation with Formula 1 constructors.
              </p>
            </div>

            <div>
              <button
                id="explore-f1-heritage-dna-cta"
                onClick={handleExploreF1}
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#D71920] hover:bg-[#B51218] text-white text-xs font-semibold transition-all cursor-pointer shadow-md group/btn rounded-xs"
              >
                <span>Explore F1 heritage</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CATEGORY FILTERING UI & DYNAMIC HORIZONTAL TAGS */}
      <div ref={gridSectionRef} className="mb-8 pt-4">
        {/* Header Telemetry and Quick Reset Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D71920]" />
            <span className={`text-xs font-semibold ${
              isGarageLight ? 'text-[#2B3035]' : 'text-[#CBD5E1]'
            }`}>
              Browse by category
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Filter Counter */}
            <span className={`text-xs whitespace-nowrap ${
              isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'
            }`}>
              Showing <span className={`font-bold ${isGarageLight ? 'text-[#111415]' : 'text-white'}`}>{filteredVehicles.length}</span> of <span className={isGarageLight ? 'text-[#111415]' : 'text-white'}>{vehicles.length}</span> cars
            </span>

            {/* Reset All Filters Button */}
            {(selectedCategory !== 'ALL' || selectedSubFilter !== 'ALL' || searchQuery) && (
              <button
                id="reset-category-filter-btn"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedSubFilter('ALL');
                  setSearchQuery('');
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 border text-xs transition-colors cursor-pointer rounded-xs ${
                  isGarageLight
                    ? 'bg-black/5 hover:bg-[#D71920]/15 border-black/15 hover:border-[#D71920] text-[#111415]'
                    : 'bg-white/[0.04] hover:bg-[#D71920]/20 border-white/[0.12] hover:border-[#D71920] text-[#CBD5E1] hover:text-white'
                }`}
                title="Reset all filters to show full collection"
              >
                <RotateCcw className="w-2.5 h-2.5 text-[#D71920]" />
                <span>Reset all</span>
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Tags Container with Scroll Controls */}
        <div className={`relative border p-2 sm:p-2.5 mb-3 transition-colors rounded-sm ${
          isGarageLight
            ? 'bg-white border-black/10 shadow-sm'
            : 'bg-[#0E1012] border-white/[0.12]'
        }`}>
          <div className="flex items-center gap-2">
            {/* Left Scroll Arrow Button */}
            <button
              id="category-scroll-left-btn"
              onClick={() => scrollCategories('left')}
              className={`hidden sm:flex items-center justify-center w-7 h-9 border transition-colors shrink-0 cursor-pointer rounded-xs ${
                isGarageLight
                  ? 'bg-[#F6F7F5] hover:bg-[#EBECE7] border-black/10 text-[#2B3035] hover:text-[#111415]'
                  : 'bg-[#141719] hover:bg-[#1C2023] border-white/[0.08] text-[#AEB4B5] hover:text-white'
              }`}
              aria-label="Scroll category tags left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Horizontal Scrollable Category Tags */}
            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 flex-1"
              role="tablist"
              aria-label="Car categories"
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const accent = categoryColorMap[cat.id] || '#D71920';
                const count = categoryCounts[cat.id] ?? 0;
                const tagId = `category-tag-${cat.id.toLowerCase().replace(/\s+/g, '-')}`;

                return (
                  <button
                    key={cat.id}
                    id={tagId}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Toggle category ${cat.label} (${count} vehicles)`}
                    onClick={() => handleToggleCategory(cat.id)}
                    className={`group relative inline-flex items-center gap-2 px-3.5 py-2 text-xs whitespace-nowrap transition-all duration-200 cursor-pointer select-none shrink-0 border rounded-xs ${
                      isActive
                        ? 'bg-[#D71920] border-[#D71920] text-white shadow-[0_0_15px_rgba(215,25,32,0.3)] font-semibold'
                        : isGarageLight
                        ? 'bg-[#F6F7F5] hover:bg-black/5 border-black/10 hover:border-black/25 text-[#2B3035] hover:text-[#111415]'
                        : 'bg-[#14171A] hover:bg-[#1C2024] border-white/[0.10] hover:border-white/30 text-[#CBD5E1] hover:text-white'
                    }`}
                  >
                    {/* Category Accent Indicator Dot */}
                    {cat.id !== 'ALL' ? (
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-transform ${
                          isActive ? 'scale-125 ring-2 ring-white/50 bg-white' : 'opacity-80 group-hover:opacity-100'
                        }`}
                        style={{ backgroundColor: isActive ? '#FFFFFF' : accent }}
                      />
                    ) : (
                      <SlidersHorizontal className={`w-3 h-3 shrink-0 ${isActive ? 'text-white' : isGarageLight ? 'text-[#2B3035]' : 'text-[#CBD5E1]'}`} />
                    )}

                    {/* Category Label */}
                    <span className="font-semibold">{cat.label}</span>

                    {/* Live Category Vehicle Count Badge */}
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-xs transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white font-bold'
                          : isGarageLight
                          ? 'bg-black/[0.06] text-[#2B3035] group-hover:text-[#111415]'
                          : 'bg-white/[0.08] text-[#AEB4B5] group-hover:text-white'
                      }`}
                    >
                      {count}
                    </span>

                    {/* Active Accent Highlight Line */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/60" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow Button */}
            <button
              id="category-scroll-right-btn"
              onClick={() => scrollCategories('right')}
              className={`hidden sm:flex items-center justify-center w-7 h-9 border transition-colors shrink-0 cursor-pointer rounded-xs ${
                isGarageLight
                  ? 'bg-[#F6F7F5] hover:bg-[#EBECE7] border-black/10 text-[#2B3035] hover:text-[#111415]'
                  : 'bg-[#141719] hover:bg-[#1C2023] border-white/[0.08] text-[#AEB4B5] hover:text-white'
              }`}
              aria-label="Scroll category tags right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Category Dossier & Sub-Filter Strip */}
        {selectedCategory !== 'ALL' && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3.5 sm:p-4 border flex flex-col md:flex-row md:items-center justify-between gap-3 relative rounded-sm ${
              isGarageLight
                ? 'bg-white border-black/10 shadow-sm'
                : 'bg-[#111415] border-white/[0.10]'
            }`}
          >
            <div className="flex items-start sm:items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 sm:mt-0 shadow-[0_0_10px_currentColor]"
                style={{
                  backgroundColor: categoryColorMap[selectedCategory] || '#D71920',
                  color: categoryColorMap[selectedCategory] || '#D71920',
                }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${
                    isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
                  }`}>
                    {categories.find((c) => c.id === selectedCategory)?.label || selectedCategory}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 border rounded-xs font-medium ${
                    isGarageLight
                      ? 'bg-black/5 border-black/10 text-[#2B3035]'
                      : 'bg-white/[0.06] border-white/10 text-[#CBD5E1]'
                  }`}>
                    {filteredVehicles.length} cars
                  </span>
                </div>
                <p className={`text-[11px] font-light mt-0.5 max-w-2xl leading-relaxed ${
                  isGarageLight ? 'text-[#3E4347]' : 'text-[#CBD5E1]'
                }`}>
                  {categories.find((c) => c.id === selectedCategory)?.desc}
                </p>
              </div>
            </div>

            {/* Sub-Filters / Marque Chips for Active Category */}
            {availableMarquesForCategory.length > 1 && (
              <div className={`flex flex-wrap items-center gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 ${
                isGarageLight ? 'border-black/10' : 'border-white/[0.06]'
              }`}>
                <span className={`text-[11px] mr-1 ${
                  isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'
                }`}>
                  Marque:
                </span>
                <button
                  onClick={() => setSelectedSubFilter('ALL')}
                  className={`px-2 py-0.5 text-xs border transition-colors cursor-pointer rounded-xs ${
                    selectedSubFilter === 'ALL'
                      ? 'bg-[#D71920] text-white border-[#D71920] font-semibold'
                      : isGarageLight
                      ? 'bg-[#F6F7F5] text-[#2B3035] hover:text-[#111415] border-black/10'
                      : 'bg-[#141719] text-[#CBD5E1] hover:text-[#F4F3EF] border-white/[0.10]'
                  }`}
                >
                  All
                </button>
                {availableMarquesForCategory.map((marque) => (
                  <button
                    key={marque}
                    onClick={() => setSelectedSubFilter(marque === selectedSubFilter ? 'ALL' : marque)}
                    className={`px-2 py-0.5 text-xs border transition-colors cursor-pointer rounded-xs ${
                      selectedSubFilter === marque
                        ? 'bg-[#D71920] text-white border-[#D71920] font-semibold'
                        : isGarageLight
                        ? 'bg-[#F6F7F5] text-[#2B3035] hover:text-[#111415] border-black/10'
                        : 'bg-[#141719] text-[#CBD5E1] hover:text-[#F4F3EF] border-white/[0.10]'
                    }`}
                  >
                    {marque}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Real-Time Live Allocation & Availability Status Dispatch Bar */}
        <div className={`mb-6 border p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-sm transition-colors ${
          isGarageLight
            ? 'bg-white border-black/10 shadow-sm'
            : 'bg-[#0E1012] border-white/[0.12]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-semibold ${
                  isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
                }`}>
                  Live fleet allocation feed
                </span>
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold rounded-xs">
                  Real-time sync
                </span>
                {lastSyncTime && (
                  <span className={`text-xs ${isGarageLight ? 'text-[#565C62]' : 'text-[#94A3B8]'}`}>
                    Sync: {lastSyncTime}
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 ${isGarageLight ? 'text-[#3E4347]' : 'text-[#CBD5E1]'}`}>
                Availability: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{availabilitySummary?.currentlyAvailable ?? 21} Currently Available</span> for track allocation • <span className="text-[#B39343] dark:text-[#C9B37E] font-semibold">{availabilitySummary?.inPrivateCollection ?? 11} In Private Collection</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto justify-between md:justify-end">
            {/* Quick Status Filter Controls */}
            <div className={`inline-flex border p-0.5 text-xs rounded-xs ${
              isGarageLight
                ? 'bg-[#F6F7F5] border-black/10'
                : 'bg-[#141718] border-white/[0.12]'
            }`}>
              <button
                onClick={() => setAvailabilityFilter('ALL')}
                className={`px-2.5 py-1 transition-colors cursor-pointer rounded-xs ${
                  availabilityFilter === 'ALL'
                    ? isGarageLight
                      ? 'bg-black/10 text-[#111415] font-bold'
                      : 'bg-white/15 text-white font-semibold'
                    : isGarageLight
                    ? 'text-[#565C62] hover:text-[#111415]'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                All ({vehicles.length})
              </button>
              <button
                onClick={() => setAvailabilityFilter('AVAILABLE')}
                className={`px-2.5 py-1 transition-colors cursor-pointer flex items-center gap-1.5 rounded-xs ${
                  availabilityFilter === 'AVAILABLE'
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/40'
                    : 'text-emerald-600/80 dark:text-emerald-400/80 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Available ({availabilitySummary?.currentlyAvailable ?? 21})</span>
              </button>
              <button
                onClick={() => setAvailabilityFilter('PRIVATE')}
                className={`px-2.5 py-1 transition-colors cursor-pointer flex items-center gap-1.5 rounded-xs ${
                  availabilityFilter === 'PRIVATE'
                    ? 'bg-[#C9B37E]/20 text-[#9C7D2B] dark:text-[#C9B37E] font-semibold border border-[#C9B37E]/40'
                    : 'text-[#9C7D2B]/80 dark:text-[#C9B37E]/80 hover:text-[#9C7D2B] dark:hover:text-[#C9B37E]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9B37E]"></span>
                <span>In vault ({availabilitySummary?.inPrivateCollection ?? 11})</span>
              </button>
            </div>

            {/* Manual Sync Button */}
            <button
              onClick={() => loadAvailability(true)}
              disabled={isRefreshingAvailability}
              className={`p-1.5 border transition-colors cursor-pointer flex items-center gap-1.5 text-xs rounded-xs ${
                isGarageLight
                  ? 'bg-white hover:bg-black/5 border-black/10 text-[#2B3035] hover:text-[#111415]'
                  : 'bg-white/[0.04] hover:bg-white/[0.1] border-white/[0.12] text-[#CBD5E1] hover:text-white'
              }`}
              title="Refresh real-time allocation telemetry"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingAvailability ? 'animate-spin text-[#D71920]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Dynamic Filter Context & Search Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4 mb-6">
          {/* Active Filter Tags & Context */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#85898A] flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#D71920]" />
              Active Filter:
            </span>

            {selectedCategory !== 'ALL' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#D71920]/10 border border-[#D71920]/40 text-[#F4F3EF] text-[11px] ">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: categoryColorMap[selectedCategory] || '#D71920' }}
                />
                <span>{selectedCategory}</span>
                <span className="text-[11px] text-[#AEB4B5]">({filteredVehicles.length})</span>
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className="ml-1 text-[#AEB4B5] hover:text-white cursor-pointer"
                  title="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : (
              <span className="text-[11px] text-[#AEB4B5] ">
                All cars ({vehicles.length})
              </span>
            )}

            {selectedSubFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/[0.06] border border-white/[0.14] text-[#F4F3EF] text-[11px] ">
                <span>Marque: {selectedSubFilter}</span>
                <button
                  onClick={() => setSelectedSubFilter('ALL')}
                  className="ml-1 text-[#85898A] hover:text-white cursor-pointer"
                  title="Remove marque filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/[0.06] border border-white/[0.14] text-[#F4F3EF] text-xs ">
                <span>Query: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 text-[#85898A] hover:text-white cursor-pointer"
                  title="Clear search query"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
          </div>

          {/* 12. SEARCH FIELD: ⌕ SEARCH VEHICLE */}
          <div className="relative w-full sm:w-64 shrink-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85898A] text-xs ">
              ⌕
            </span>
            <input
              id="search-collection-input"
              type="text"
              placeholder="Search brand, model or category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-7 py-1.5 bg-[#111415] border border-white/[0.12] text-[#F4F3EF] text-xs placeholder-[#85898A] focus:outline-none focus:border-[#D71920] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#85898A] hover:text-white cursor-pointer"
                title="Clear search input"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 7. COLLECTION GRID (3 Columns Desktop, Generous Spacing, 12-24 Vehicles) */}
      {filteredVehicles.length === 0 ? (
        <div className="p-12 text-center bg-[#111415] border border-white/[0.08] my-8">
          <p className=" text-sm text-[#AEB4B5] mb-2 ">
            No machines matching {searchQuery ? `query "${searchQuery}"` : 'the active filter'}
            {selectedCategory !== 'ALL' && totalGlobalSearchMatches > 0 && (
              <span className="block mt-1 text-xs text-[#85898A] normal-case">
                Found {totalGlobalSearchMatches} matching {totalGlobalSearchMatches === 1 ? 'car' : 'cars'} in other categories.
              </span>
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            {selectedCategory !== 'ALL' && totalGlobalSearchMatches > 0 && (
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedSubFilter('ALL');
                }}
                className="px-4 py-2 bg-[#D71920] hover:bg-[#B51419] text-white text-xs transition-colors cursor-pointer font-semibold"
              >
                Search All Categories ({totalGlobalSearchMatches} Matches)
              </button>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedSubFilter('ALL');
              }}
              className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-[#F4F3EF] border border-white/[0.12] text-xs transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {filteredVehicles.map((car, index) => {
            const isCompared = compareVehicleIds.includes(car.id);
            const categoryAccent = categoryColorMap[car.category.toUpperCase()] || '#D71920';
            const availabilityInfo = availabilityMap[car.id];
            const availabilityStatus = availabilityInfo?.status || 'Currently Available';
            const isCurrentlyAvailable = availabilityStatus === 'Currently Available';

            // Insert 18. EDITORIAL FEATURES between vehicle cards
            const showEditorial1 = index === 3 && selectedCategory === 'ALL' && !searchQuery;
            const showEditorial2 = index === 9 && selectedCategory === 'ALL' && !searchQuery;

            return (
              <React.Fragment key={car.id}>
                {/* Editorial Feature 1: THE ART OF DOWNFORCE (Section 18) */}
                {showEditorial1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`col-span-1 md:col-span-2 lg:col-span-3 border p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden my-4 group rounded-sm transition-all duration-300 ${
                      isGarageLight
                        ? 'bg-white border-black/10 hover:border-black/30 shadow-sm hover:shadow-lg'
                        : 'bg-[#111415] border-white/[0.12] hover:border-white/30 hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.8),0_0_22px_rgba(201,179,126,0.16)]'
                    }`}
                  >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9B37E] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
                    <div className="relative w-full md:w-1/2 h-52 sm:h-64 overflow-hidden bg-black rounded-xs collection-card-media">
                      <img
 loading="lazy"
 decoding="async"
                        src="/images/f1/f1-racing-dna.webp"
                        alt="The Art of Downforce"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="photo-badge absolute top-3 left-3 px-2 py-0.5 bg-black/85 border border-white/20 text-[11px] text-[#FCD34D] font-semibold rounded-xs shadow-md">
                        Editorial feature · dossier
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-[#D71920] block mb-1 font-semibold">
                          Aerodynamic architecture
                        </span>
                        <h3 className={`font-heading text-2xl sm:text-3xl font-semibold mb-3 ${
                          isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
                        }`}>
                          The art of downforce.
                        </h3>
                        <p className={`text-xs sm:text-sm font-light leading-relaxed mb-6 ${
                          isGarageLight ? 'text-[#3E4347]' : 'text-[#CBD5E1]'
                        }`}>
                          How aerodynamic engineering and ground-effect Venturi tunnels changed the way we understand high-speed stability and circuit cornering velocity.
                        </p>
                      </div>

                      <button
                        onClick={() => handleReadStory('aerodynamics')}
                        className={`self-start inline-flex items-center gap-2 text-xs transition-colors cursor-pointer group/read font-semibold ${
                          isGarageLight ? 'text-[#111415] hover:text-[#D71920]' : 'text-[#F4F3EF] hover:text-[#D71920]'
                        }`}
                      >
                        <span>Read story</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/read:translate-x-1 text-[#D71920]" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Editorial Feature 2: THE 1,000 HORSEPOWER HYBRID ERA */}
                {showEditorial2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`col-span-1 md:col-span-2 lg:col-span-3 border p-6 sm:p-8 flex flex-col md:flex-row-reverse items-center justify-between gap-6 relative overflow-hidden my-4 group rounded-sm transition-all duration-300 ${
                      isGarageLight
                        ? 'bg-white border-black/10 hover:border-black/30 shadow-sm hover:shadow-lg'
                        : 'bg-[#111415] border-white/[0.12] hover:border-white/30 hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.8),0_0_22px_rgba(148,163,184,0.16)]'
                    }`}
                  >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#94A3B8] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
                    <div className="relative w-full md:w-1/2 h-52 sm:h-64 overflow-hidden bg-black rounded-xs collection-card-media">
                      <img
 loading="lazy"
 decoding="async"
                        src="/images/f1/f1-performance.webp"
                        alt="Electric Hybrid Era"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="photo-badge absolute top-3 left-3 px-2 py-0.5 bg-black/85 border border-white/20 text-[11px] text-[#94A3B8] font-semibold rounded-xs shadow-md">
                        Telemetry study · hybrid power
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-[#C9B37E] block mb-1 font-semibold">
                          Electrified powertrains
                        </span>
                        <h3 className={`font-heading text-2xl sm:text-3xl font-semibold mb-3 ${
                          isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
                        }`}>
                          The 1,000 horsepower era.
                        </h3>
                        <p className={`text-xs sm:text-sm font-light leading-relaxed mb-6 ${
                          isGarageLight ? 'text-[#3E4347]' : 'text-[#CBD5E1]'
                        }`}>
                          From Formula 1 kinetic energy recovery systems (MGU-K) to quad-motor instant torque vectoring: the modern transition of raw velocity.
                        </p>
                      </div>

                      <button
                        onClick={() => handleReadStory('behind-the-machine')}
                        className={`self-start inline-flex items-center gap-2 text-xs transition-colors cursor-pointer group/read font-semibold ${
                          isGarageLight ? 'text-[#111415] hover:text-[#D71920]' : 'text-[#F4F3EF] hover:text-[#D71920]'
                        }`}
                      >
                        <span>Read story</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/read:translate-x-1 text-[#D71920]" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 8. FEATURED VEHICLE CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: Math.min(index * 0.02, 0.3) }}
                  id={`vehicle-card-${car.id}`}
                  className={`border transition-all duration-300 ease-out flex flex-col justify-between group relative hover:-translate-y-1.5 rounded-sm overflow-hidden ${
                    isCompared
                      ? 'border-[#D71920] shadow-[0_18px_36px_-8px_rgba(0,0,0,0.85),0_0_26px_rgba(215,25,32,0.3)]'
                      : isGarageLight
                      ? 'bg-white border-black/10 hover:border-black/30 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)]'
                      : 'bg-[#111415] border-white/[0.08] hover:border-white/30 hover:shadow-[0_18px_36px_-8px_rgba(0,0,0,0.8),0_0_24px_rgba(215,25,32,0.18)]'
                  }`}
                >
                  {/* Dynamic Top Border Glow on Hover */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D71920] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

                  {/* Large Photography with Clean Natural Presentation */}
                  <div className="collection-card-media relative h-64 sm:h-72 overflow-hidden bg-[#060809]">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/cars/r1-concept.webp';
                      }}
                    />

                    {/* Top Badges & Compare Toggle */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                      <span className="photo-badge px-2.5 py-1 bg-black/85 backdrop-blur-md border border-white/20 text-[11px] text-white font-semibold flex items-center gap-1.5 shadow-md rounded-xs">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: categoryAccent }}
                        />
                        <span>{car.badge || car.category}</span>
                      </span>

                      {/* Compare toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(car.id);
                        }}
                        className={`px-2.5 py-1 text-xs transition-all flex items-center gap-1 border cursor-pointer rounded-xs shadow-md ${
                          isCompared
                            ? 'bg-[#D71920] text-white border-[#D71920] font-bold'
                            : 'bg-black/85 backdrop-blur-md text-white/90 hover:text-white hover:border-white/40 border-white/20'
                        }`}
                        title={isCompared ? 'Remove from benchmark comparison' : 'Add to benchmark comparison'}
                      >
                        {isCompared ? (
                          <>
                            <Check className="w-3 h-3 text-white" />
                            <span>In Compare</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 text-[#D71920]" />
                            <span>Compare</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Live Availability Status Pill on Photo */}
                    <div className="absolute top-12 left-3.5 z-10 pointer-events-none">
                      {isCurrentlyAvailable ? (
                        <div className="px-2 py-0.5 bg-black/90 backdrop-blur-md border border-emerald-400/60 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 shadow-md rounded-xs">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span>Currently available</span>
                        </div>
                      ) : (
                        <div className="px-2 py-0.5 bg-black/90 backdrop-blur-md border border-[#FCD34D]/60 text-[11px] text-[#FCD34D] font-semibold flex items-center gap-1.5 shadow-md rounded-xs">
                          <span className="inline-flex rounded-full h-2 w-2 bg-[#FCD34D]"></span>
                          <span>In private collection</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Specs Overlay Preview (High-Contrast Dark Glass Bar) */}
                    <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-xs bg-black/80 backdrop-blur-md px-3 py-1 border border-white/15 rounded-xs shadow-md">
                      <span className="text-white text-[11px] font-medium tracking-wide">{car.acceleration} (0–100)</span>
                      <span className="text-[#FCD34D] font-bold text-[11px] tracking-wide">{car.power.split('@')[0]}</span>
                    </div>
                  </div>

                  {/* Card Content Matching Section 8 */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Number + Category line */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold ${
                          isGarageLight ? 'text-[#565C62]' : 'text-[#94A3B8]'
                        }`}>
                        </span>
                        <span
                          className="text-[11px] font-semibold"
                          style={{ color: categoryAccent }}
                        >
                          {car.category}
                        </span>
                      </div>

                      {/* Dedicated Live Availability Status Bar */}
                      <div
                        className={`mb-3.5 px-2.5 py-1.5 border flex items-center justify-between gap-2 text-xs transition-colors rounded-xs ${
                          isCurrentlyAvailable
                            ? isGarageLight
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-emerald-500/[0.12] border-emerald-500/30 text-emerald-300'
                            : isGarageLight
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : 'bg-[#C9B37E]/[0.12] border-[#C9B37E]/35 text-[#C9B37E]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isCurrentlyAvailable ? (
                            <>
                              <span className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                              <span className={`text-xs font-semibold truncate ${
                                isGarageLight ? 'text-emerald-800' : 'text-emerald-300'
                              }`}>
                                Currently Available
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="inline-flex rounded-full h-2 w-2 bg-[#C9B37E] shrink-0"></span>
                              <span className={`text-xs font-semibold truncate ${
                                isGarageLight ? 'text-amber-900' : 'text-[#C9B37E]'
                              }`}>
                                In Private Collection
                              </span>
                            </>
                          )}
                        </div>

                        <span className={`text-[11px] shrink-0 font-medium ${
                          isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'
                        }`}>
                          {availabilityInfo?.urgencyLabel || (isCurrentlyAvailable ? '1 Allocation Left' : 'Vault Allocated')}
                        </span>
                      </div>

                      {/* Marque / Manufacturer */}
                      <span className={`text-[11px] block mb-1 font-medium ${
                        isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'
                      }`}>
                        {car.marque || car.brand}
                      </span>

                      {/* Model designation */}
                      <h3 className={`font-heading text-xl sm:text-2xl font-semibold mb-2 leading-tight transition-colors ${
                        isGarageLight ? 'text-[#111415] group-hover:text-[#D71920]' : 'text-[#F4F3EF] group-hover:text-white'
                      }`}>
                        {car.name}
                      </h3>

                      {/* Era / Subcategory Tag if present */}
                      {car.era && (
                        <span className="inline-block text-[11px] text-[#C9B37E] mb-2 font-semibold">
                          {car.era}
                        </span>
                      )}

                      <p className={`text-xs leading-relaxed mb-5 font-light line-clamp-2 ${
                        isGarageLight ? 'text-[#3E4347]' : 'text-[#CBD5E1]'
                      }`}>
                        {car.description}
                      </p>
                    </div>

                    {/* Bottom CTA Bar: EXPLORE → and Actions */}
                    <div className={`pt-4 border-t flex items-center justify-between gap-3 ${
                      isGarageLight ? 'border-black/10' : 'border-white/[0.06]'
                    }`}>
                      <button
                        onClick={() => onSelectVehicle(car)}
                        className={`group/cta inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                          isGarageLight ? 'text-[#111415] hover:text-[#D71920]' : 'text-[#F4F3EF] hover:text-[#D71920]'
                        }`}
                      >
                        <span className="font-semibold">Explore</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-1 text-[#D71920]" />
                      </button>

                      {isCurrentlyAvailable ? (
                        <button
                          onClick={() => onOpenBookingModal('Track Experience', car.name)}
                          className="px-3 py-1.5 bg-[#D71920] hover:bg-[#B5141A] text-white border border-[#D71920] text-[11px] font-semibold transition-all shadow-sm cursor-pointer flex items-center gap-1 rounded-xs"
                        >
                          <span>Book slot</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenBookingModal('Private Collection Allocation Inquiry', car.name)}
                          className={`px-3 py-1.5 border text-[11px] transition-colors cursor-pointer flex items-center gap-1 rounded-xs font-medium ${
                            isGarageLight
                              ? 'bg-[#F6F7F5] hover:bg-[#EBECE7] text-[#9C7D2B] border-[#9C7D2B]/35'
                              : 'bg-[#1C1813] hover:bg-[#28221B] text-[#C9B37E] hover:text-[#F4F3EF] border-[#C9B37E]/40'
                          }`}
                          title="Request private vault allocation or join the syndicate waitlist"
                        >
                          <Lock className="w-3 h-3 text-[#C9B37E]" />
                          <span>Waitlist</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Floating Compare Dock - Fixed Bottom Bar */}
      <AnimatePresence>
        {compareVehicleIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#111415] border border-white/20 p-3 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex items-center gap-3 sm:gap-4 max-w-2xl w-[94%]"
          >
            <div className="flex items-center gap-2 shrink-0">
              <div className="p-1.5 bg-[#0B0D0E] border border-white/[0.1] text-[#D71920]">
                <Scale className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xs text-[#85898A] block ">Benchmark</span>
                <span className="text-xs text-[#F4F3EF] font-bold">
                  {compareVehicleIds.length}/2 chosen
                </span>
              </div>
            </div>

            {/* Slots */}
            <div className="flex-1 flex items-center gap-2 overflow-hidden">
              {/* Slot 1 */}
              {dockCarA ? (
                <div className="flex-1 min-w-0 px-2.5 py-1.5 bg-[#0B0D0E] border border-[#D71920]/40 text-xs text-[#F4F3EF] flex items-center justify-between gap-2">
                  <div className="truncate flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#D71920] shrink-0" />
                    <span className="truncate">{dockCarA.name}</span>
                  </div>
                  <button
                    onClick={() => toggleCompare(dockCarA.id)}
                    className="text-[#85898A] hover:text-white p-0.5"
                    title="Remove from comparison"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex-1 border border-dashed border-white/[0.14] px-2.5 py-1.5 text-xs text-[#85898A] text-center truncate">
                  + Select Car 1
                </div>
              )}

              {/* Slot 2 */}
              {dockCarB ? (
                <div className="flex-1 min-w-0 px-2.5 py-1.5 bg-[#0B0D0E] border border-[#D71920]/40 text-xs text-[#F4F3EF] flex items-center justify-between gap-2">
                  <div className="truncate flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#D71920] shrink-0" />
                    <span className="truncate">{dockCarB.name}</span>
                  </div>
                  <button
                    onClick={() => toggleCompare(dockCarB.id)}
                    className="text-[#85898A] hover:text-white p-0.5"
                    title="Remove from comparison"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex-1 border border-dashed border-white/[0.14] px-2.5 py-1.5 text-xs text-[#85898A] text-center truncate">
                  + Select Car 2
                </div>
              )}
            </div>

            {/* Launch CTA */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="floating-compare-now-btn"
                onClick={() => handleOpenComparison()}
                className="px-4 py-2 bg-[#D71920] hover:bg-[#B51218] text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span>Compare now</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCompareVehicleIds([])}
                className="p-1 text-[#85898A] hover:text-white cursor-pointer"
                title="Clear comparison selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side-by-Side Comparison Overlay Modal */}
      <VehicleCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        vehicleA={selectedCarA}
        vehicleB={selectedCarB}
        allVehicles={vehicles}
        onSelectVehicleA={setSelectedCarA}
        onSelectVehicleB={setSelectedCarB}
        onViewDossier={(v) => {
          setIsCompareModalOpen(false);
          onSelectVehicle(v);
        }}
        onBookVehicle={(vName) => {
          setIsCompareModalOpen(false);
          onOpenBookingModal('Track Experience', vName);
        }}
      />
    </div>
  );
};
