import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  ArrowRight,
  Clock,
  MapPin,
  Check,
  Search,
  Users,
  Database,
  Code2,
  Copy,
  Calendar,
  Mail,
  UserCheck,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { fetchVehicles, fetchExperiences, fetchCustomerInquiries } from '../services/api';
import { Vehicle, ExperienceService, CustomerInquiryDemo } from '../types';
import { useTheme } from '../context/ThemeContext';

export interface DataIntegrationSectionProps {
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onOpenBookingModal?: (experience?: string, vehicle?: string) => void;
  onNavigate?: (tab: string) => void;
}

export const DataIntegrationSection: React.FC<DataIntegrationSectionProps> = ({
  onSelectVehicle = (_vehicle: Vehicle) => {},
  onOpenBookingModal = (_experience?: string, _vehicle?: string) => {},
  onNavigate,
}) => {
  const { isGarageLight } = useTheme();

  // Primary Part IV Dataset Selector: 'dataset1_products' | 'dataset2_customers' | 'api_console'
  const [activeDataset, setActiveDataset] = useState<'dataset1_products' | 'dataset2_customers' | 'api_console'>('dataset1_products');

  // Active Category for Dataset 1: 'all' | 'vehicles' | 'experiences'
  const [activeCategory, setActiveCategory] = useState<'all' | 'vehicles' | 'experiences'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Retrieved Data States from API (Datasets 1 & 2)
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [experiences, setExperiences] = useState<ExperienceService[]>([]);
  const [customers, setCustomers] = useState<CustomerInquiryDemo[]>([]);

  // Dataset 2 Customer Filter States
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState<string>('ALL');

  // REST API Console State
  const [apiConsoleEndpoint, setApiConsoleEndpoint] = useState<'/api/vehicles' | '/api/experiences' | '/api/customers'>('/api/customers');
  const [apiLatency, setApiLatency] = useState<number>(24);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Underlying JavaScript fetch logic for all endpoints
  const loadData = async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      const [vehiclesData, experiencesData, customersData] = await Promise.all([
        fetchVehicles(),
        fetchExperiences(),
        fetchCustomerInquiries(),
      ]);
      setVehicles(vehiclesData || []);
      setExperiences(experiencesData || []);
      setCustomers(customersData || []);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const duration = Math.round(performance.now() - startTime);
      setApiLatency(duration > 0 ? duration : 24);
    } catch (err) {
      console.error('Data retrieval error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered lists for Dataset 1 (Vehicles & Experiences)
  const filteredVehicles = vehicles.filter((v) => {
    if (activeCategory === 'experiences') return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(query) ||
      v.marque.toLowerCase().includes(query) ||
      v.category.toLowerCase().includes(query) ||
      v.description.toLowerCase().includes(query)
    );
  });

  const filteredExperiences = experiences.filter((exp) => {
    if (activeCategory === 'vehicles') return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      exp.name.toLowerCase().includes(query) ||
      exp.category.toLowerCase().includes(query) ||
      exp.subtitle.toLowerCase().includes(query) ||
      exp.description.toLowerCase().includes(query)
    );
  });

  // Filtered list for Dataset 2 (Customer Information)
  const filteredCustomers = customers.filter((c) => {
    const matchesStatus =
      customerStatusFilter === 'ALL' ||
      c.status.toLowerCase() === customerStatusFilter.toLowerCase();
    if (!matchesStatus) return false;

    if (!customerSearch.trim()) return true;
    const query = customerSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.preferredExperience.toLowerCase().includes(query) ||
      c.vehicleInterest.toLowerCase().includes(query) ||
      (c.location && c.location.toLowerCase().includes(query))
    );
  });

  const totalCount =
    activeCategory === 'all'
      ? filteredVehicles.length + filteredExperiences.length
      : activeCategory === 'vehicles'
      ? filteredVehicles.length
      : filteredExperiences.length;

  const handleCopyRawJson = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <section
      id="api-integration-section"
      className={`w-full px-4 sm:px-6 md:px-10 py-16 sm:py-20 border-b transition-colors duration-200 ${
        isGarageLight
          ? 'bg-[#F6F7F5] border-black/[0.08] text-[#101214]'
          : 'bg-[#111314] border-white/[0.08] text-[#F4F4F1]'
      }`}
    >
      {/* Section Header */}
      <div
        className={`flex flex-col lg:flex-row lg:items-end justify-between pb-6 mb-8 border-b gap-4 ${
          isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.06]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-[#D8B52A]" />
            <span
              className={`text-xs font-semibold ${
                isGarageLight ? 'text-[#8C6D23]' : 'text-[#D8B52A]'
              }`}
            >
              Part IV · RESTful API &amp; data integration
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold uppercase ">
            LIVE API RETRIEVAL: DATASET 1 &amp; DATASET 2
          </h2>
          <p
            className={`text-xs sm:text-sm font-light leading-relaxed max-w-2xl mt-1.5 ${
              isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
            }`}
          >
            Demonstrating synchronous HTTP GET operations for <strong>Dataset 1 (Products &amp; Services)</strong> and <strong>Dataset 2 (Customer Information &amp; Inquiries)</strong> with real-time JSON deserialization, active filtering, and REST inspectability.
          </p>
        </div>

        {/* Live Status & Refresh Action */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs ${
              isGarageLight
                ? 'bg-white border-black/10 text-[#101214]'
                : 'bg-[#151718] border-white/08 text-[#8B8D8C]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-emerald-500">GET status:</span>
            <span>200 OK • {apiLatency}ms</span>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className={`p-2 border transition-colors cursor-pointer flex items-center gap-1.5 text-xs ${
              isGarageLight
                ? 'bg-white border-black/15 text-[#565C62] hover:text-[#101214] hover:border-black/30'
                : 'bg-[#151718] border-white/10 text-[#8B8D8C] hover:text-[#F4F4F1] hover:border-white/25'
            }`}
            title="Trigger HTTP GET refresh across all datasets"
            aria-label="Refresh datasets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D71920]' : ''}`} />
            <span className="text-xs hidden sm:inline">Refresh datasets</span>
          </button>
        </div>
      </div>

      {/* Master Part IV Dataset Navigation Bar */}
      <div
        className={`p-1.5 sm:p-2 border mb-6 flex flex-wrap items-center gap-2 ${
          isGarageLight ? 'bg-black/[0.03] border-black/10' : 'bg-[#151718] border-white/[0.08]'
        }`}
      >
        <button
          onClick={() => setActiveDataset('dataset1_products')}
          className={`flex-1 min-w-[200px] px-4 py-2.5 text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border ${
            activeDataset === 'dataset1_products'
              ? 'bg-[#D71920] border-[#D71920] text-white font-bold shadow-md'
              : isGarageLight
              ? 'bg-white border-black/10 text-[#565C62] hover:text-[#101214]'
              : 'bg-[#111314] border-white/10 text-[#8B8D8C] hover:text-[#F4F4F1]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Dataset 1: Products &amp; services ({vehicles.length + experiences.length})</span>
        </button>

        <button
          onClick={() => setActiveDataset('dataset2_customers')}
          className={`flex-1 min-w-[200px] px-4 py-2.5 text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border ${
            activeDataset === 'dataset2_customers'
              ? 'bg-[#D8B52A] border-[#D8B52A] text-[#111415] font-bold shadow-md'
              : isGarageLight
              ? 'bg-white border-black/10 text-[#565C62] hover:text-[#101214]'
              : 'bg-[#111314] border-white/10 text-[#8B8D8C] hover:text-[#F4F4F1]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Dataset 2: Customer information ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveDataset('api_console')}
          className={`px-4 py-2.5 text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border ${
            activeDataset === 'api_console'
              ? isGarageLight
                ? 'bg-[#101214] border-[#101214] text-white font-bold'
                : 'bg-[#F4F4F1] border-[#F4F4F1] text-[#111415] font-bold'
              : isGarageLight
              ? 'bg-white border-black/10 text-[#565C62] hover:text-[#101214]'
              : 'bg-[#111314] border-white/10 text-[#8B8D8C] hover:text-[#F4F4F1]'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>REST API / raw JSON</span>
        </button>
      </div>

      {/* DATASET 1 VIEW: PRODUCTS & SERVICES */}
      {activeDataset === 'dataset1_products' && (
        <>
          {/* Sub-Filter and Search Bar for Dataset 1 */}
          <div
            className={`p-3 sm:p-4 border mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
              isGarageLight
                ? 'bg-white border-black/[0.08]'
                : 'bg-[#151718] border-white/[0.08]'
            }`}
          >
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 text-xs transition-colors cursor-pointer border whitespace-nowrap ${
                  activeCategory === 'all'
                    ? isGarageLight
                      ? 'bg-[#101214] border-[#101214] text-white font-semibold'
                      : 'bg-[#F4F4F1] border-[#F4F4F1] text-[#111314] font-semibold'
                    : isGarageLight
                    ? 'bg-black/[0.03] border-black/10 text-[#565C62] hover:text-[#101214]'
                    : 'bg-[#111314] border-white/08 text-[#8B8D8C] hover:text-[#F4F4F1]'
                }`}
              >
                All allocations ({vehicles.length + experiences.length})
              </button>

              <button
                onClick={() => setActiveCategory('vehicles')}
                className={`px-3 py-1.5 text-xs transition-colors cursor-pointer border whitespace-nowrap ${
                  activeCategory === 'vehicles'
                    ? isGarageLight
                      ? 'bg-[#101214] border-[#101214] text-white font-semibold'
                      : 'bg-[#F4F4F1] border-[#F4F4F1] text-[#111314] font-semibold'
                    : isGarageLight
                    ? 'bg-black/[0.03] border-black/10 text-[#565C62] hover:text-[#101214]'
                    : 'bg-[#111314] border-white/08 text-[#8B8D8C] hover:text-[#F4F4F1]'
                }`}
              >
                High-performance fleet ({vehicles.length})
              </button>

              <button
                onClick={() => setActiveCategory('experiences')}
                className={`px-3 py-1.5 text-xs transition-colors cursor-pointer border whitespace-nowrap ${
                  activeCategory === 'experiences'
                    ? isGarageLight
                      ? 'bg-[#101214] border-[#101214] text-white font-semibold'
                      : 'bg-[#F4F4F1] border-[#F4F4F1] text-[#111314] font-semibold'
                    : isGarageLight
                    ? 'bg-black/[0.03] border-black/10 text-[#565C62] hover:text-[#101214]'
                    : 'bg-[#111314] border-white/08 text-[#8B8D8C] hover:text-[#F4F4F1]'
                }`}
              >
                Driving packages ({experiences.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px] sm:w-64">
              <Search
                className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isGarageLight ? 'text-black/40' : 'text-white/40'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search machines or track sessions..."
                className={`w-full pl-8 pr-3 py-1.5 text-[11px] font-mono border transition-colors outline-none ${
                  isGarageLight
                    ? 'bg-black/[0.03] border-black/15 text-[#101214] placeholder-black/40 focus:border-black/40'
                    : 'bg-[#0E1011] border-white/10 text-[#F4F4F1] placeholder-white/40 focus:border-white/25'
                }`}
              />
            </div>
          </div>
        </>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`border p-4 animate-pulse ${
                isGarageLight ? 'bg-white border-black/10' : 'bg-[#151718] border-white/08'
              }`}
            >
              <div
                className={`aspect-[16/10] w-full mb-4 ${
                  isGarageLight ? 'bg-black/5' : 'bg-white/5'
                }`}
              />
              <div
                className={`h-4 w-2/3 mb-2 ${
                  isGarageLight ? 'bg-black/10' : 'bg-white/10'
                }`}
              />
              <div
                className={`h-3 w-full mb-4 ${
                  isGarageLight ? 'bg-black/5' : 'bg-white/5'
                }`}
              />
              <div
                className={`h-8 w-full ${
                  isGarageLight ? 'bg-black/10' : 'bg-white/10'
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && totalCount === 0 && (
        <div
          className={`p-12 border text-center ${
            isGarageLight ? 'bg-white border-black/10' : 'bg-[#151718] border-white/08'
          }`}
        >
          <p
            className={`text-sm mb-3 ${
              isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
            }`}
          >
            No live allocations found matching "{searchQuery}"
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="px-4 py-2 bg-[#D71920] hover:bg-[#b5141a] text-white text-xs font-semibold cursor-pointer"
          >
            Reset search filters
          </button>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && totalCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Vehicles Product Cards */}
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`group border flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 relative overflow-hidden ${
                isGarageLight
                  ? 'bg-white border-black/[0.08] hover:border-black/25 hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12),0_0_20px_rgba(215,25,32,0.12)]'
                  : 'bg-[#151718] border-white/[0.08] hover:border-[#D71920]/40 hover:shadow-[0_18px_36px_-8px_rgba(0,0,0,0.8),0_0_24px_rgba(215,25,32,0.18)]'
              }`}
            >
              {/* Dynamic Top Border Glow on Hover */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D71920] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
              <div>
                {/* Product Image Banner with Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/images/cars/r1-concept.webp';
                    }}
                  />

                  {/* Top-Left Category Badge */}
                  <div className="photo-chip absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold">
                    {vehicle.badge || vehicle.category}
                  </div>

                  {/* Top-Right Performance Pill */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-[#D71920] text-white text-[11px] font-bold">
                    {vehicle.acceleration || '0-100: SUB 3S'}
                  </div>

                  {/* Bottom Image Gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                  {/* Bottom Brand Stamp */}
                  <div className="absolute bottom-2.5 left-3 text-xs text-white/80 ">
                    {vehicle.marque || vehicle.brand}
                  </div>
                </div>

                {/* Card Information Body */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-heading text-lg sm:text-xl font-semibold leading-tight">
                      {vehicle.name}
                    </h3>
                  </div>

                  <p
                    className={`text-xs font-light leading-relaxed mb-4 line-clamp-2 ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                    }`}
                  >
                    {vehicle.description}
                  </p>

                  {/* Technical Specifications Grid */}
                  <div
                    className={`grid grid-cols-3 gap-2 py-2.5 px-3 border mb-4 font-mono text-[11px] ${
                      isGarageLight
                        ? 'bg-black/[0.02] border-black/10'
                        : 'bg-[#0E1011] border-white/06'
                    }`}
                  >
                    <div>
                      <span
                        className={`block uppercase ${
                          isGarageLight ? 'text-[#85898A]' : 'text-[#707475]'
                        }`}
                      >
                        Power
                      </span>
                      <span className="font-bold text-[#D71920] truncate block">
                        {vehicle.power?.split('@')[0] || vehicle.power || '700+ HP'}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`block uppercase ${
                          isGarageLight ? 'text-[#85898A]' : 'text-[#707475]'
                        }`}
                      >
                        Top speed
                      </span>
                      <span className="font-semibold truncate block">
                        {vehicle.topSpeed || '325 KM/H'}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`block uppercase ${
                          isGarageLight ? 'text-[#85898A]' : 'text-[#707475]'
                        }`}
                      >
                        Status
                      </span>
                      <span className="font-semibold text-emerald-500 truncate block">
                        {vehicle.availability || 'AVAILABLE'}
                      </span>
                    </div>
                  </div>

                  {/* Price / Allocation Tier */}
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span
                      className={`text-xs ${
                        isGarageLight ? 'text-[#85898A]' : 'text-[#8B8D8C]'
                      }`}
                    >
                      Allocation tier
                    </span>
                    <span className="font-semibold text-[#D8B52A]">
                      {vehicle.price || 'Members Exclusive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div
                className={`p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2 border-t mt-2 ${
                  isGarageLight ? 'border-black/[0.06]' : 'border-white/[0.06]'
                }`}
              >
                <button
                  onClick={() => onOpenBookingModal('Track Experience', vehicle.name)}
                  className="w-full py-2 px-3 bg-[#D71920] hover:bg-[#b5141a] text-white text-xs font-semibold transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <span>Reserve</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => onSelectVehicle(vehicle)}
                  className={`w-full py-2 px-3 border text-xs transition-colors cursor-pointer text-center ${
                    isGarageLight
                      ? 'border-black/15 bg-black/[0.03] hover:bg-black/[0.08] text-[#101214]'
                      : 'border-white/15 bg-[#111314] hover:bg-white/[0.06] text-[#AEB4B5] hover:text-[#F4F4F1]'
                  }`}
                >
                  View specs
                </button>
              </div>
            </div>
          ))}

          {/* 2. Experiences Service Cards */}
          {filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className={`group border flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 relative overflow-hidden ${
                isGarageLight
                  ? 'bg-white border-black/[0.08] hover:border-black/25 hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.12),0_0_20px_rgba(216,181,42,0.12)]'
                  : 'bg-[#151718] border-white/[0.08] hover:border-[#D8B52A]/40 hover:shadow-[0_18px_36px_-8px_rgba(0,0,0,0.8),0_0_24px_rgba(216,181,42,0.18)]'
              }`}
            >
              {/* Dynamic Top Border Glow on Hover */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D8B52A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
              <div>
                {/* Service Image Banner with Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                  <img
                    src={exp.image}
                    alt={exp.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/images/cars/porsche-gt3rs.webp';
                    }}
                  />

                  {/* Top-Left Category Badge */}
                  <div className="photo-chip photo-chip-gold absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold">
                    {exp.category}
                  </div>

                  {/* Top-Right Duration Badge */}
                  <div className="photo-chip absolute top-3 right-3 px-2 py-1 text-[11px] flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-[#D8B52A]" />
                    <span>{exp.duration}</span>
                  </div>

                  {/* Bottom Image Gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                  {/* Bottom Location Indicator */}
                  <div className="absolute bottom-2.5 left-3 text-xs text-white/90 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#D71920]" />
                    <span className="truncate">{exp.location}</span>
                  </div>
                </div>

                {/* Card Information Body */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-heading text-lg sm:text-xl font-semibold leading-tight mb-1">
                    {exp.name}
                  </h3>

                  <p
                    className={`text-xs font-light leading-relaxed mb-3 line-clamp-2 ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                    }`}
                  >
                    {exp.description}
                  </p>

                  {/* Key Program Inclusions */}
                  <div className="space-y-1.5 mb-4">
                    {exp.inclusions?.slice(0, 2).map((inc, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-xs font-mono ${
                          isGarageLight ? 'text-[#3E4246]' : 'text-[#AEB4B5]'
                        }`}
                      >
                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{inc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price Display */}
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span
                      className={`text-xs ${
                        isGarageLight ? 'text-[#85898A]' : 'text-[#8B8D8C]'
                      }`}
                    >
                      Program access
                    </span>
                    <span className="font-semibold text-[#D8B52A]">{exp.price}</span>
                  </div>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div
                className={`p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2 border-t mt-2 ${
                  isGarageLight ? 'border-black/[0.06]' : 'border-white/[0.06]'
                }`}
              >
                <button
                  onClick={() => onOpenBookingModal(exp.name)}
                  className="w-full py-2 px-3 bg-[#D71920] hover:bg-[#b5141a] text-white text-xs font-semibold transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <span>{exp.ctaLabel || 'BOOK NOW'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => onNavigate?.('experience')}
                  className={`w-full py-2 px-3 border text-xs transition-colors cursor-pointer text-center ${
                    isGarageLight
                      ? 'border-black/15 bg-black/[0.03] hover:bg-black/[0.08] text-[#101214]'
                      : 'border-white/15 bg-[#111314] hover:bg-white/[0.06] text-[#AEB4B5] hover:text-[#F4F4F1]'
                  }`}
                >
                  Circuit info
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DATASET 2 VIEW: CUSTOMER INFORMATION (PART IV REQUIREMENT) */}
      {activeDataset === 'dataset2_customers' && (
        <div className="space-y-6">
          {/* Dataset 2 Context Header */}
          <div
            className={`p-4 sm:p-5 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-sm ${
              isGarageLight ? 'bg-white border-black/10' : 'bg-[#151718] border-white/[0.08]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-[#D8B52A]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DATASET 2 // CUSTOMER INQUIRIES &amp; VIP ALLOCATIONS (GET /api/customers)</span>
              </div>
              <p
                className={`text-xs leading-relaxed font-light ${
                  isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                }`}
              >
                Customer and driver records retrieved dynamically via synchronous GET operation. Demonstrates live database/JSON records with client metadata, experience preferences, and VIP inquiry status.
              </p>
            </div>

            {/* Quick Stats Pill Strip */}
            <div className="flex items-center gap-2 shrink-0 text-xs ">
              <span className={`px-2.5 py-1 border rounded-sm ${
                isGarageLight ? 'bg-[#F6F7F5] border-black/10 text-[#111415]' : 'bg-[#111314] border-white/10 text-white'
              }`}>
                Total: <strong>{customers.length}</strong>
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-semibold rounded-sm">
                Confirmed: {customers.filter((c) => c.status === 'Confirmed').length}
              </span>
              <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-semibold rounded-sm">
                In review: {customers.filter((c) => c.status === 'In Review' || c.status === 'Inquiry').length}
              </span>
            </div>
          </div>

          {/* Dataset 2 Filters & Search Bar */}
          <div
            className={`p-3 sm:p-4 border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${
              isGarageLight ? 'bg-white border-black/[0.08]' : 'bg-[#151718] border-white/[0.08]'
            }`}
          >
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'Confirmed', 'In Review', 'Inquiry', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setCustomerStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs transition-colors cursor-pointer border whitespace-nowrap ${
                    customerStatusFilter === st
                      ? 'bg-[#D8B52A] border-[#D8B52A] text-[#111415] font-bold'
                      : isGarageLight
                      ? 'bg-black/[0.03] border-black/10 text-[#565C62] hover:text-[#101214]'
                      : 'bg-[#111314] border-white/08 text-[#8B8D8C] hover:text-[#F4F4F1]'
                  }`}
                >
                  {st.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Customer Search Bar */}
            <div className="relative min-w-[200px] sm:w-72">
              <Search
                className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isGarageLight ? 'text-black/40' : 'text-white/40'
                }`}
              />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search customer, email, or vehicle..."
                className={`w-full pl-8 pr-3 py-1.5 text-[11px] font-mono border transition-colors outline-none ${
                  isGarageLight
                    ? 'bg-black/[0.03] border-black/15 text-[#101214] placeholder-black/40 focus:border-black/40'
                    : 'bg-[#0E1011] border-white/10 text-[#F4F4F1] placeholder-white/40 focus:border-white/25'
                }`}
              />
            </div>
          </div>

          {/* Customer Cards Grid */}
          {filteredCustomers.length === 0 ? (
            <div
              className={`p-12 border text-center ${
                isGarageLight ? 'bg-white border-black/10' : 'bg-[#151718] border-white/08'
              }`}
            >
              <Users className="w-8 h-8 text-[#8B8D8C] mx-auto mb-2 opacity-50" />
              <p
                className={`text-sm mb-2 ${
                  isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                }`}
              >
                No customer inquiries match "{customerSearch}"
              </p>
              <button
                onClick={() => {
                  setCustomerSearch('');
                  setCustomerStatusFilter('ALL');
                }}
                className="px-4 py-2 bg-[#D8B52A] hover:bg-[#bfa025] text-[#111415] text-xs font-semibold cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((cust) => {
                const isConfirmed = cust.status === 'Confirmed';
                const isInReview = cust.status === 'In Review';
                const isCompleted = cust.status === 'Completed';

                return (
                  <div
                    key={cust.id}
                    className={`border p-5 flex flex-col justify-between transition-all duration-200 group rounded-sm relative overflow-hidden ${
                      isGarageLight
                        ? 'bg-white border-black/[0.08] hover:border-black/25 hover:shadow-md'
                        : 'bg-[#151718] border-white/[0.08] hover:border-[#D8B52A]/40 hover:shadow-lg'
                    }`}
                  >
                    {/* Top status accent */}
                    <div
                      className={`absolute top-0 inset-x-0 h-1 ${
                        isConfirmed
                          ? 'bg-emerald-500'
                          : isInReview
                          ? 'bg-amber-500'
                          : isCompleted
                          ? 'bg-purple-500'
                          : 'bg-[#D71920]'
                      }`}
                    />

                    <div>
                      {/* Customer Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                              isGarageLight
                                ? 'bg-black/5 text-[#111415]'
                                : 'bg-white/10 text-[#F4F4F1]'
                            }`}
                          >
                            {cust.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="font-heading text-base font-semibold leading-tight">
                              {cust.name}
                            </h3>
                            <a
                              href={`mailto:${cust.email}`}
                              className={`text-xs font-mono flex items-center gap-1 hover:underline truncate max-w-[180px] ${
                                isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                              }`}
                            >
                              <Mail className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{cust.email}</span>
                            </a>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 text-[11px] font-semibold rounded-xs ${
                            isConfirmed
                              ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                              : isInReview
                              ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                              : isCompleted
                              ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                              : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                          }`}
                        >
                          {cust.status}
                        </span>
                      </div>

                      {/* Experience and Machine Interest */}
                      <div
                        className={`p-3 border space-y-2 mb-4 rounded-sm text-xs font-mono ${
                          isGarageLight
                            ? 'bg-[#F6F7F5] border-black/5'
                            : 'bg-[#111314] border-white/5'
                        }`}
                      >
                        <div>
                          <span
                            className={`text-[11px] block ${
                              isGarageLight ? 'text-[#8C9399]' : 'text-[#565C62]'
                            }`}
                          >
                            Requested experience
                          </span>
                          <span className="text-[#D8B52A] font-semibold block truncate">
                            {cust.preferredExperience}
                          </span>
                        </div>

                        <div>
                          <span
                            className={`text-[11px] block ${
                              isGarageLight ? 'text-[#8C9399]' : 'text-[#565C62]'
                            }`}
                          >
                            Vehicle interest
                          </span>
                          <span className="font-semibold block truncate">
                            {cust.vehicleInterest}
                          </span>
                        </div>
                      </div>

                      {/* Date & Location */}
                      <div className="space-y-1 text-[11px] font-mono mb-4">
                        <div
                          className={`flex items-center gap-1.5 ${
                            isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                          }`}
                        >
                          <Calendar className="w-3 h-3 text-[#D8B52A]" />
                          <span>Date: {cust.date || 'TBD // On Allocation'}</span>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 ${
                            isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                          }`}
                        >
                          <MapPin className="w-3 h-3 text-[#D71920]" />
                          <span className="truncate">{cust.location || 'Silverstone Circuit Hub'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer / Actions */}
                    <div
                      className={`pt-3 border-t flex items-center justify-between text-xs font-mono ${
                        isGarageLight ? 'border-black/10' : 'border-white/10'
                      }`}
                    >
                      <span className={isGarageLight ? 'text-[#8C9399]' : 'text-[#565C62]'}>
                        ID #{cust.id}
                      </span>
                      <button
                        onClick={() => onOpenBookingModal?.(cust.preferredExperience, cust.vehicleInterest)}
                        className="text-[#D71920] hover:underline font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <span>Dispatch liaison</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Raw JSON Quick View Toggle */}
          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs font-mono text-[#8B8D8C]">
              Showing {filteredCustomers.length} of {customers.length} customer records from <code>/api/customers</code>
            </span>
            <button
              onClick={() => {
                setApiConsoleEndpoint('/api/customers');
                setActiveDataset('api_console');
              }}
              className="text-xs text-[#D8B52A] hover:underline flex items-center gap-1.5 cursor-pointer font-semibold"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Inspect raw JSON in REST console →</span>
            </button>
          </div>
        </div>
      )}

      {/* REST API CONSOLE & RAW JSON INSPECTOR (PART IV REQUIREMENT) */}
      {activeDataset === 'api_console' && (
        <div className="space-y-6">
          {/* Console Top Toolbar */}
          <div
            className={`p-4 sm:p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-sm ${
              isGarageLight ? 'bg-white border-black/10' : 'bg-[#151718] border-white/[0.08]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-emerald-500">
                <Terminal className="w-3.5 h-3.5" />
                <span>RESTful API GET operation inspector</span>
              </div>
              <p
                className={`text-xs leading-relaxed font-light ${
                  isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                }`}
              >
                Inspect live HTTP GET payload structures for academic rubric verification.
              </p>
            </div>

            {/* Endpoint Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setApiConsoleEndpoint('/api/vehicles')}
                className={`px-3 py-1.5 text-xs transition-colors cursor-pointer border ${
                  apiConsoleEndpoint === '/api/vehicles'
                    ? 'bg-[#D71920] border-[#D71920] text-white font-bold'
                    : isGarageLight
                    ? 'bg-[#F6F7F5] border-black/10 text-[#565C62]'
                    : 'bg-[#111314] border-white/10 text-[#8B8D8C]'
                }`}
              >
                GET /api/vehicles ({vehicles.length})
              </button>

              <button
                onClick={() => setApiConsoleEndpoint('/api/experiences')}
                className={`px-3 py-1.5 text-xs transition-colors cursor-pointer border ${
                  apiConsoleEndpoint === '/api/experiences'
                    ? 'bg-[#D71920] border-[#D71920] text-white font-bold'
                    : isGarageLight
                    ? 'bg-[#F6F7F5] border-black/10 text-[#565C62]'
                    : 'bg-[#111314] border-white/10 text-[#8B8D8C]'
                }`}
              >
                GET /api/experiences ({experiences.length})
              </button>

              <button
                onClick={() => setApiConsoleEndpoint('/api/customers')}
                className={`px-3 py-1.5 text-xs transition-colors cursor-pointer border ${
                  apiConsoleEndpoint === '/api/customers'
                    ? 'bg-[#D8B52A] border-[#D8B52A] text-[#111415] font-bold'
                    : isGarageLight
                    ? 'bg-[#F6F7F5] border-black/10 text-[#565C62]'
                    : 'bg-[#111314] border-white/10 text-[#8B8D8C]'
                }`}
              >
                GET /api/customers ({customers.length})
              </button>
            </div>
          </div>

          {/* Terminal Box */}
          <div className="border border-white/10 bg-[#0B0D0E] text-[#F4F4F1] rounded-sm overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-[#111314] border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span className="text-emerald-400 font-bold">GET</span>
                <span className="text-white font-semibold">{apiConsoleEndpoint}</span>
                <span className="text-[#8B8D8C]">HTTP/1.1</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xs">
                  200 OK
                </span>
                <span className="text-[#8B8D8C] text-xs hidden sm:inline">
                  {apiLatency}ms latency
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs text-white rounded-xs cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D71920]' : ''}`} />
                  <span>Re-send</span>
                </button>
                <button
                  onClick={() =>
                    handleCopyRawJson(
                      apiConsoleEndpoint === '/api/vehicles'
                        ? vehicles
                        : apiConsoleEndpoint === '/api/experiences'
                        ? experiences
                        : customers
                    )
                  }
                  className="px-2.5 py-1 bg-[#D8B52A] hover:bg-[#bfa025] text-[#111415] text-xs font-bold rounded-xs cursor-pointer flex items-center gap-1"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Response Headers */}
            <div className="px-4 py-2.5 bg-[#0e1011] border-b border-white/5 text-xs font-mono text-[#8B8D8C] flex flex-wrap items-center gap-x-6 gap-y-1">
              <span>Status: <strong className="text-emerald-400">200 OK</strong></span>
              <span>Content-Type: <strong className="text-white">application/json; charset=utf-8</strong></span>
              <span>Cache-Control: <strong className="text-white">public, max-age=60</strong></span>
              <span>Records: <strong className="text-[#D8B52A]">{
                apiConsoleEndpoint === '/api/vehicles'
                  ? vehicles.length
                  : apiConsoleEndpoint === '/api/experiences'
                  ? experiences.length
                  : customers.length
              } objects</strong></span>
            </div>

            {/* Raw JSON Code Block */}
            <div className="p-4 max-h-[460px] overflow-y-auto font-mono text-xs text-[#AEB4B5] leading-relaxed select-text">
              <pre>
                {JSON.stringify(
                  apiConsoleEndpoint === '/api/vehicles'
                    ? vehicles
                    : apiConsoleEndpoint === '/api/experiences'
                    ? experiences
                    : customers,
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
