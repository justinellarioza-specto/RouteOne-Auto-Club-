import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  ShieldCheck,
  Award,
  ChevronRight,
  ArrowRight,
  Compass,
  Gauge,
  Truck,
  Warehouse,
  Flame,
  Check,
  Star,
  Users,
  Clock,
  Sparkles,
  PhoneCall,
  FileText,
  UserCheck,
  Lock,
} from 'lucide-react';
import { Vehicle } from '../types';
import { useMember } from '../context/MemberContext';
import { useTheme } from '../context/ThemeContext';

interface ServicesCatalogPageProps {
  onNavigate?: (tab: string) => void;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onOpenBookingModal?: (experience?: string, vehicle?: string) => void;
}

type ServiceCategory = 'ALL' | 'TRACK' | 'MEMBERSHIP' | 'TOURS' | 'ACADEMY' | 'CONCIERGE';

interface ServiceOffering {
  id: string;
  category: 'TRACK' | 'MEMBERSHIP' | 'TOURS' | 'ACADEMY' | 'CONCIERGE';
  badge: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  pricing: string;
  durationOrCommitment: string;
  highlights: string[];
  ctaLabel: string;
  ctaAction: string;
  secondaryCta?: string;
  featured?: boolean;
}

export const ServicesCatalogPage: React.FC<ServicesCatalogPageProps> = ({
  onNavigate = (_tab: string) => {},
  onOpenBookingModal = (_experience?: string, _vehicle?: string) => {},
}) => {
  const { isMember, memberProfile, toggleMember } = useMember();
  const { isGarageLight } = useTheme();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('ALL');

  const categories: { id: ServiceCategory; label: string }[] = [
    { id: 'ALL', label: 'All offerings' },
    { id: 'TRACK', label: 'Track allocations' },
    { id: 'MEMBERSHIP', label: 'Membership tiers' },
    { id: 'TOURS', label: 'Continental tours' },
    { id: 'ACADEMY', label: 'Race academy' },
    { id: 'CONCIERGE', label: 'Vault & logistics' },
  ];

  const offerings: ServiceOffering[] = [
    {
      id: 'private-track-allocation',
      category: 'TRACK',
      badge: 'Circuit access · FIA grade 1',
      title: 'Private Circuit Track Allocations',
      tagline: 'Exclusive pit-lane access at Silverstone, Spa, and Monza with telemetry support',
      description:
        'Step directly onto premier international circuits without public track-day congestion. Every allocation includes a dedicated pit box, fresh Michelin Cup 2R tires, race fuel, and our factory-trained pit technicians.',
      image:
        '/images/cars/porsche-gt3rs.webp',
      pricing: 'From $3,800',
      durationOrCommitment: 'Full-Day Pit Allocation',
      highlights: [
        'Guaranteed low-density circuit session (maximum 12 vehicles on tarmac)',
        'Live MoTeC / VBOX data logging and telemetry telemetry engineer debrief',
        'Turnkey tire temperature management and brake cooling cycle support',
        'Private hospitality suite for driver and up to 3 paddock guests',
      ],
      ctaLabel: 'Reserve track allocation',
      ctaAction: 'Track Day Session',
      secondaryCta: 'EXPLORE CIRCUITS',
      featured: true,
    },
    {
      id: 'membership-syndicate',
      category: 'MEMBERSHIP',
      badge: 'Annual fleet access · unlimited thrill',
      title: 'Club Syndicate & Paddock Memberships',
      tagline: 'Fractional hypercar access without insurance burdens or capital depreciation',
      description:
        'Our flagship annual membership granting tier-based driving days across our complete fleet of exotic supercars and track weapons. Enjoy uncapped mileage, instant app reservations, and access to private club paddocks worldwide.',
      image:
        '/images/cars/koenigsegg-jesko.webp',
      pricing: 'From $45,000 / year',
      durationOrCommitment: 'Annual Tier Program',
      highlights: [
        'Direct keys to modern Ferrari, McLaren, Porsche GT, and Aston Martin allocations',
        'Zero depreciation, insurance deductibles, or routine maintenance expense',
        'Priority bookings for European Grand Tour rallies and private track days',
        'Access to our London, Geneva, and Milan private member clubhouses',
      ],
      ctaLabel: 'Apply for membership',
      ctaAction: 'Club Membership Tier',
      secondaryCta: 'VIEW TIERS',
      featured: true,
    },
    {
      id: 'continental-grand-tour',
      category: 'TOURS',
      badge: 'Bespoke rally · European itinerary',
      title: 'Bespoke Continental Grand Tours',
      tagline: 'Multi-day Alpine passes, Amalfi Coast, and Scottish Highlands rallies',
      description:
        'Curated driving odysseys engineered for those who demand majestic scenic roads, 5-star Michelin gastronomy, and flawless automotive support. We provide luxury hotel bookings, luggage transport, and a support chase van with spare tires and tools.',
      image:
        '/images/cars/aston-martin-db12.webp',
      pricing: 'From $12,500 / Team',
      durationOrCommitment: '4 to 7 Day Expeditions',
      highlights: [
        'Pre-programmed turn-by-turn satellite GPS route guidance through iconic switchbacks',
        'White-glove door-to-door luggage courier between 5-star luxury boutique châteaux',
        'Dedicated chase vehicle with factory technician, spare wheels, and fuel supplies',
        'Full comprehensive international transit insurance and local police escorts where applicable',
      ],
      ctaLabel: 'Inquire about tours',
      ctaAction: 'Alpine Pass Rally',
      secondaryCta: 'DOWNLOAD DOSSIER',
    },
    {
      id: 'driver-development-academy',
      category: 'ACADEMY',
      badge: 'Racecraft instruction · FIA pro coaching',
      title: 'Driver Development & Telemetry Academy',
      tagline: 'One-on-one instruction by active GT3 and LMP2 championship drivers',
      description:
        'Bridge the gap between fast street driving and precision racecraft. Utilizing dual-cockpit telemetry and professional pro-racing coaching, analyze throttle modulation, threshold braking, and apex geometry to slice seconds off your lap times.',
      image:
        '/images/cars/alpine-a524.webp',
      pricing: 'From $2,200',
      durationOrCommitment: '1-Day Intensive Session',
      highlights: [
        'Dedicated professional racing driver instructor assigned exclusively to you',
        'Side-by-side MoTeC telemetry overlay against benchmark professional lap profiles',
        'High-speed car-control skidpad maneuvers and trail-braking mastery exercises',
        'FIA track certification and circuit competition license preparation support',
      ],
      ctaLabel: 'Book driver coaching',
      ctaAction: 'Racecraft Academy',
      secondaryCta: 'VIEW CURRICULUM',
    },
    {
      id: 'enclosed-logistics-support',
      category: 'CONCIERGE',
      badge: 'Trackside logistics · white-glove',
      title: 'Enclosed Transport & Paddock Pit Crew',
      tagline: 'Door-to-circuit hauler transport and comprehensive trackside management',
      description:
        'Whether your personal track car or a RouteOne club vehicle, our climate-controlled enclosed transporters deliver directly to the paddock. Upon arrival, your vehicle is fueled, tires are warmed, and your pit stall is ready.',
      image:
        '/images/f1/f1-pit-lane-garage.webp',
      pricing: 'Custom Bespoke Quote',
      durationOrCommitment: 'On-Demand Nationwide / EU',
      highlights: [
        'Single and multi-car air-ride hydraulic enclosed car carriers with GPS tracking',
        'Full pre-track inspection: brake fluid boiling check, suspension torque check, alignment verify',
        'Trackside mechanical support, hot tire pressure bleeds, and post-session detailing',
        'Seamless customs and Carnet de Passages handling for cross-border European circuits',
      ],
      ctaLabel: 'Request transport quote',
      ctaAction: 'Track Logistics & Transport',
      secondaryCta: 'SPEAK WITH CONCIERGE',
    },
    {
      id: 'private-vault-storage',
      category: 'CONCIERGE',
      badge: 'Asset management · climate-controlled',
      title: 'Private Vault Storage & Asset Management',
      tagline: 'Dehumidified, ultra-secure automotive sanctuary with active maintenance',
      description:
        'More than parking—our high-security facility maintains your automotive investments in competition-ready condition. We manage continuous battery trickle conditioning, nitrogen tire stabilization, and scheduled fluid exercise run-ups.',
      image:
        '/images/cars/pagani-huayra-r.webp',
      pricing: 'From $950 / month',
      durationOrCommitment: 'Flexible Monthly / Annual',
      highlights: [
        'Strict 50% relative humidity, dust-filtered air with 24/7 biometric armed monitoring',
        'Bi-weekly engine warm-up cycle, transmission roll-over, and brake wipe protocol',
        'Full concierge dispatch: have your car delivered washed and fueled to any airport or track',
        'Comprehensive maintenance logging and collector asset valuation record keeping',
      ],
      ctaLabel: 'Inquire about vault space',
      ctaAction: 'Vault Storage & Care',
      secondaryCta: 'SCHEDULE PRIVATE TOUR',
    },
  ];

  const filteredOfferings =
    activeCategory === 'ALL'
      ? offerings
      : offerings.filter((o) => o.category === activeCategory);

  const coreStrengths = [
    {
      icon: ShieldCheck,
      title: 'Zero maintenance or depreciation',
      description:
        'Drive the finest modern supercars and classic GTs without worrying about insurance underwriting, annual major servicing, or multimillion-dollar capital depreciation.',
    },
    {
      icon: Gauge,
      title: 'Uncapped circuit performance',
      description:
        'Unlike restrictive rental companies, our track allocations are built for true performance. Push the cars hard with telemetry support and fresh Michelin Cup 2R tires provided.',
    },
    {
      icon: Compass,
      title: 'Guaranteed circuit availability',
      description:
        'Exclusive private track bookings at Silverstone, Monza, Spa, and the Nürburgring Nordschleife with capped paddock density for supreme speed and driver safety.',
    },
    {
      icon: Award,
      title: 'White-glove concierge response',
      description:
        'From personalized seat-inserts and tire setup to private paddock helicopter transfers and bespoke luggage transport, your dedicated coordinator handles every detail.',
    },
  ];

  const membershipTiers = [
    {
      name: 'CLUB TIER',
      price: '$45,000',
      period: 'annually',
      allocation: '12 Fleet Days / Year',
      description: 'Ideal for enthusiasts seeking weekend road tours and select circuit track allocations.',
      benefits: [
        'Access to Tier 1 Supercar Fleet (Porsche GT3, McLaren 720S, Ferrari F8)',
        '4 Private Track-Day Allocations at UK Circuits',
        '1 Invitational Continental Tour allocation',
        'Standard concierge & enclosed delivery up to 100 miles',
        'Access to Clubhouse member dining lounges',
      ],
      cta: 'Select club tier',
    },
    {
      name: 'PADDOCK TIER',
      price: '$85,000',
      period: 'annually',
      popular: true,
      allocation: '24 Fleet Days / Year',
      description: 'Our most sought-after membership. Complete access to track weapons, hypercars, and European Grand Tours.',
      benefits: [
        'Full Hypercar Access (Ferrari 812, McLaren 765LT, Porsche GT3 RS)',
        '10 Private Track Allocations including Spa & Monza',
        '2 Continental Rallies with complimentary co-driver',
        'Unlimited UK & European enclosed transport allocations',
        'VIP Paddock hospitality pass for Goodwood & F1 Grand Prix',
        'Dedicated 24/7 personal club concierge officer',
      ],
      cta: 'Select paddock tier',
    },
    {
      name: 'SYNDICATE FOUNDER',
      price: '$140,000',
      period: 'annually',
      allocation: 'Unlimited Priority Days',
      description: 'Unrestricted bespoke automotive syndicate with private garage allocations and custom commissions.',
      benefits: [
        'Priority keys across the entire fleet including Vintage & Concept R1',
        'Unlimited private circuit track hire days with personal pit crew',
        'Custom route planning for private multi-country rallies',
        'Complimentary vault storage for up to two personal vehicles',
        'Monaco GP Yacht & Le Mans 24 VIP Hospitality suite access',
        'Seat on the RouteOne Automotive Commission Advisory Board',
      ],
      cta: 'Inquire founder circle',
    },
  ];

  return (
    <div id="services-catalog-page" className="w-full bg-[#0B0D0E] text-[#F4F3EF] pb-24">
      {/* 1. HERO HEADER SECTION */}
      <section className="w-full px-6 md:px-12 pt-16 pb-12 border-b border-white/[0.08] bg-gradient-to-b from-[#131517] to-[#0B0D0E]">
        <div className="max-w-7xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 bg-[#D71920]" />
            <span className="text-xs text-[#C9B37E]">
              Official service catalog · 2026 fleet & programs
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="max-w-3xl">
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-[#F4F4F1] font-semibold uppercase mb-4">
                SERVICES &amp; MEMBER PROGRAMS.
              </h1>
              <p className="text-sm sm:text-base text-[#AEB4B5] font-light leading-relaxed">
                From private FIA-grade circuit allocations and enclosed vehicle logistics to curated continental driving tours and tailored membership syndicate programs—discover the full spectrum of RouteOne Auto Club.
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {isMember ? (
                <>
                  <button
                    id="hero-member-dispatch-btn"
                    onClick={() => onOpenBookingModal('Track Experience', 'RouteOne R1 Concept')}
                    className="px-5 py-3 bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-semibold transition-all duration-200 shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Claim 0% deposit session</span>
                  </button>

                  <button
                    onClick={toggleMember}
                    className="px-4 py-3 bg-[#181B1C] hover:bg-[#202426] border border-white/20 text-[#AEB4B5] hover:text-white text-xs transition-all duration-200 cursor-pointer flex items-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Switch to guest view</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    id="hero-inquire-membership-btn"
                    onClick={() => onOpenBookingModal('Club Membership Tier', 'RouteOne R1 Concept')}
                    className="px-5 py-3 bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-semibold transition-all duration-200 shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <span>Apply for membership</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={toggleMember}
                    className="px-4 py-3 bg-[#181B1C] hover:bg-[#202426] border border-[#D71920]/40 text-[#F4F4F1] text-xs transition-all duration-200 cursor-pointer flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#D71920]" />
                    <span>Simulate member login</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Member Telemetry Status Ribbon when logged in with Smooth Animation */}
          <AnimatePresence>
            {isMember && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden mb-6"
              >
                <div className="p-4 bg-[#181112] border border-[#D71920]/50 rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                    <div>
                      <div className="text-xs text-[#D71920] font-bold">
                        Active VIP credentials · Apex Syndicate
                      </div>
                      <div className="text-xs text-white/90">
                        Welcome, <strong>{memberProfile.name}</strong> [Member ID: {memberProfile.id}] • {memberProfile.trackDaysRemaining} Priority Track Days Remaining
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#C9B37E] bg-black/40 px-3 py-1.5 border border-white/10 shrink-0">
                    0% Deposit Booking Active
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Key Metric Highlights Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-white/[0.08]">
            <div className="p-4 bg-[#111415] border border-white/[0.08]">
              <span className="text-xs text-[#85898A] block mb-1">
                Curated fleet
              </span>
              <span className="font-heading block text-base sm:text-2xl leading-tight break-words text-[#F4F4F1] font-bold">45+ supercars &amp; hypercars</span>
            </div>

            <div className="p-4 bg-[#111415] border border-white/[0.08]">
              <span className="text-xs text-[#85898A] block mb-1">
                Circuit allocations
              </span>
              <span className="font-heading block text-base sm:text-2xl leading-tight break-words text-[#D8B52A] font-bold">14 FIA grade 1 tracks</span>
            </div>

            <div className="p-4 bg-[#111415] border border-white/[0.08]">
              <span className="text-xs text-[#85898A] block mb-1">
                Ownership burden
              </span>
              <span className="font-heading block text-base sm:text-2xl leading-tight break-words text-emerald-400 font-bold">0% depreciation</span>
            </div>

            <div className="p-4 bg-[#111415] border border-white/[0.08]">
              <span className="text-xs text-[#85898A] block mb-1">
                Paddock response
              </span>
              <span className="font-heading block text-base sm:text-2xl leading-tight break-words text-[#F4F4F1] font-bold">100% white-glove</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER TABS & SERVICE CATALOG GRID */}
      <section className="w-full px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-white/[0.08]">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-xs transition-all duration-200 cursor-pointer border ${
                    activeCategory === cat.id
                      ? 'bg-[#D71920] border-[#D71920] text-white font-semibold shadow-xs'
                      : 'bg-[#151718] border-white/[0.08] text-[#8B8D8C] hover:text-[#F4F4F1] hover:border-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-[#8B8D8C]">
              Showing <strong className="text-white">{filteredOfferings.length}</strong> Programs
            </span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOfferings.map((service) => (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="bg-[#111415] border border-white/[0.08] hover:border-[#D71920]/50 hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.85),0_0_26px_rgba(215,25,32,0.2)] hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Dynamic Top Glow Line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D71920] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

                <div>
                  {/* Card Imagery with Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111415] via-transparent to-transparent opacity-85" />

                    {/* Top Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0B0D0E]/90 border border-white/10 text-[11px] text-[#C9B37E] font-semibold">
                      {service.badge}
                    </div>

                    {/* Pricing Pill */}
                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#0B0D0E]/95 border border-white/20 text-xs font-bold text-white">
                      {service.pricing}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2 text-xs text-[#85898A] ">
                      <Clock className="w-3 h-3 text-[#D8B52A]" />
                      <span>{service.durationOrCommitment}</span>
                    </div>

                    <h2 className="font-heading text-xl text-[#F4F4F1] font-semibold mb-2 group-hover:text-white transition-colors">
                      {service.title}
                    </h2>

                    <p className="text-xs text-[#C9B37E] mb-3 leading-relaxed">
                      {service.tagline}
                    </p>

                    <p className="text-xs text-[#AEB4B5] font-light leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Key Highlights Checklist */}
                    <div className="pt-4 border-t border-white/[0.08] space-y-2 mb-6">
                      <span className="text-[11px] text-[#85898A] block mb-2 font-semibold">
                        Program inclusions:
                      </span>
                      {service.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#AEB4B5]">
                          <Check className="w-3.5 h-3.5 text-[#D71920] shrink-0 mt-0.5" />
                          <span className="leading-snug">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card CTA Footer */}
                <div className="p-6 pt-0 border-t border-white/[0.06] bg-[#0E1011] mt-auto">
                  <div className="flex flex-col gap-2 pt-4">
                    <button
                      onClick={() => onOpenBookingModal(service.ctaAction, 'RouteOne R1 Concept')}
                      className="w-full py-3 bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>{service.ctaLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {service.secondaryCta && (
                      <button
                        onClick={() => {
                          if (service.category === 'TRACK') onNavigate('experience');
                          else if (service.category === 'MEMBERSHIP') onNavigate('collection');
                          else onOpenBookingModal(service.ctaAction, 'RouteOne R1 Concept');
                        }}
                        className="w-full py-2 bg-transparent hover:bg-white/[0.04] border border-white/10 hover:border-white/20 text-[#85898A] hover:text-[#F4F4F1] text-xs transition-colors cursor-pointer"
                      >
                        {service.secondaryCta}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE BENEFITS & INSTITUTIONAL STRENGTHS */}
      <section className="w-full px-6 md:px-12 py-16 bg-[#0E1011] border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs text-[#D8B52A] block mb-2">
              Why RouteOne Auto Club
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#F4F4F1] font-semibold mb-4">
              The uncompromising advantages of membership.
            </h2>
            <p className="text-xs sm:text-sm text-[#8B8D8C] font-light leading-relaxed">
              We engineered RouteOne to liberate passionate drivers from the frictions of traditional supercar ownership while multiplying circuit access and peer camaraderie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreStrengths.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#151718] border border-white/[0.08] hover:border-[#D8B52A]/40 hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.8),0_0_20px_rgba(216,181,42,0.15)] hover:-translate-y-1.5 transition-all duration-300 ease-out p-6 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D8B52A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

                  <div>
                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-[#C9B37E] mb-6 group-hover:border-[#C9B37E]/40 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="font-heading text-base text-[#F4F4F1] font-semibold mb-3">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#8B8D8C] font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#505251]">
                    <span>Pillar 0{idx + 1}</span>
                    <span className="text-[#C9B37E]">Standard</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. MEMBERSHIP TIERS COMPARISON */}
      <section className="w-full px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs text-[#D71920] block mb-2">
                Structured commitment
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl text-[#F4F4F1] font-semibold ">
                Annual membership tiers.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#AEB4B5] font-light max-w-md">
              Choose the program that matches your seasonal racing calendar and continental touring aspirations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {membershipTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`bg-[#111415] border p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  tier.popular
                    ? 'border-[#D71920] shadow-[0_20px_40px_-8px_rgba(0,0,0,0.9),0_0_26px_rgba(215,25,32,0.22)] -translate-y-1'
                    : 'border-white/[0.08] hover:border-white/20'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#D71920] text-white text-[11px] font-semibold">
                    Most sought-after
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-[#C9B37E]">
                      {tier.name}
                    </span>
                    <span className="text-xs text-[#85898A] ">
                      {tier.allocation}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="font-heading text-3xl sm:text-4xl text-[#F4F4F1] font-bold">
                      {tier.price}
                    </span>
                    <span className="text-xs text-[#85898A] ml-2">/ {tier.period}</span>
                  </div>

                  <p className="text-xs text-[#AEB4B5] font-light leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  <div className="space-y-3 pt-6 border-t border-white/[0.08] mb-8">
                    <span className="text-[11px] text-[#85898A] block font-semibold">
                      Tier privileges:
                    </span>
                    {tier.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs text-[#AEB4B5]">
                        <Check className="w-3.5 h-3.5 text-[#D8B52A] shrink-0 mt-0.5" />
                        <span className="leading-snug">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onOpenBookingModal(tier.name, 'RouteOne R1 Concept')}
                  className={`w-full py-3.5 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                    tier.popular
                      ? 'bg-[#D71920] hover:bg-[#B5141A] text-white shadow-md'
                      : 'bg-[#181B1C] hover:bg-[#202426] border border-white/20 text-[#F4F4F1]'
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="w-full px-6 md:px-12 pt-8">
        <div className="max-w-7xl mx-auto p-8 sm:p-12 bg-gradient-to-r from-[#181B1C] via-[#111415] to-[#181B1C] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs text-[#C9B37E] block mb-2">
              Bespoke advisory
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl text-[#F4F4F1] font-semibold mb-3">
              Ready to elevate your driving horizon?
            </h3>
            <p className="text-xs sm:text-sm text-[#AEB4B5] font-light leading-relaxed">
              Our paddock directors and concierge team are available to design custom driving programs, schedule private garage viewings, or arrange enclosed vehicle transport.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenBookingModal('Membership Consultation', 'RouteOne R1 Concept')}
              className="px-6 py-3.5 bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-semibold transition-colors shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Inquire about allocation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('collection')}
              className="px-6 py-3.5 bg-transparent hover:bg-white/[0.05] border border-white/20 text-[#F4F4F1] text-xs transition-colors cursor-pointer"
            >
              Explore the fleet
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
