import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, Sun, Moon, ArrowRight, ShieldCheck, Lock, UserCheck, User, CalendarPlus, LayoutDashboard } from 'lucide-react';
import { Breadcrumbs, BreadcrumbNode } from './Breadcrumbs';
import { useTheme } from '../context/ThemeContext';
import { useMember } from '../context/MemberContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenBookingModal: () => void;
  onOpenSearchModal: () => void;
  onReplayLoading?: () => void;
  breadcrumbTrail?: BreadcrumbNode[];
  onBreadcrumbClick?: (node: BreadcrumbNode, index: number) => void;
  onGoBack?: () => void;
  onResetToHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenBookingModal,
  onOpenSearchModal,
  onReplayLoading,
  breadcrumbTrail,
  onBreadcrumbClick,
  onGoBack,
  onResetToHome,
}) => {
  const { toggleTheme, isGarageLight } = useTheme();
  const { isMember, toggleMember, memberProfile, openLoginModal, isAdmin } = useMember();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener: Press [Escape] to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // Close drawer on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawerOpen]);

  // Primary navigation links visible on desktop
  const navLinks = [
    { id: 'collection', label: 'Collection' },
    { id: 'experience', label: 'Experience' },
    { id: 'performance', label: 'Performance' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  const primaryPages = [
    { id: 'home', label: 'Overview', desc: 'Circuit club entry & vehicle showcase' },
    { id: 'collection', label: 'The collection', desc: 'Exotic & track vehicle roster' },
    { id: 'experience', label: 'Track experience', desc: 'Circuit telemetry & driver sessions' },
    { id: 'performance', label: 'Performance division', desc: 'Aero, engine & dyno engineering' },
  ];

  const secondaryPages = [
    { id: 'services', label: 'Services & catalog', desc: 'Membership tiers, track days & grand tours' },
    { id: 'contact', label: 'Contact', desc: 'Get in touch, our campaigns and the journal' },
    { id: 'api-data', label: 'Live API data', desc: 'Products & customer datasets from our REST API' },
    // Only shown to someone logged in as admin
    ...(isAdmin
      ? [{ id: 'admin', label: 'Race control · admin', desc: 'Inquiries inbox, fleet and bookings' }]
      : []),
  ];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Backdrop overlay for mobile/drawer navigation */}
      {drawerOpen && (
        <div
          id="nav-drawer-backdrop"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      <header
        id="main-navbar"
        className={`w-full sticky top-0 z-40 transition-colors duration-200 border-b ${
          isGarageLight
            ? 'bg-[#F6F7F5] border-black/[0.08] text-[#101214]'
            : 'bg-[#0B0D0E] border-white/[0.08] text-[#F4F3EF]'
        }`}
      >
        <div className="w-full px-4 sm:px-6 md:px-10 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: ROUTEONE AUTO CLUB Logo */}
          <button
            id="nav-brand-logo"
            onClick={() => handleNavClick('home')}
            className="logo-container group text-left cursor-pointer focus:outline-none shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] flex flex-row items-center gap-2 sm:gap-3"
            aria-label="RouteOne Auto Club Home"
          >
            {/* Non-stretching logo wrapper div with strict 54x36 dimensions (1.5:1 natural aspect ratio) */}
            <div className="logo-wrapper shrink-0 inline-flex items-center">
              <img
                src="/images/brand/routeone-logo.png"
                alt="RouteOne Logo"
                width={485}
                height={246}
                style={{ height: '30px', width: 'auto', aspectRatio: '485 / 246' }}
                className="block max-w-none select-none transition-transform duration-300 group-hover:scale-105"
                loading="eager"
                draggable={false}
              />
            </div>
            {/* Brand typography block */}
            <div className="flex flex-col text-left justify-center shrink-0">
              <span
                className={`font-heading text-sm sm:text-base font-medium leading-none transition-colors ${
                  isGarageLight ? 'text-[#101214]' : 'text-[#F4F3EF]'
                }`}
              >
                RouteOne
              </span>
              <span
                className={`text-[11px] sm:text-[11px] leading-none mt-1 transition-colors ${
                  isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                }`}
              >
                Auto Club
              </span>
            </div>
          </button>

          {/* Center: Desktop Navigation Links (Cleanly hidden on tablet/mobile to eliminate collision) */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-8">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative text-sm transition-colors duration-200 cursor-pointer flex items-center py-1.5 ${
                    isActive
                      ? isGarageLight
                        ? 'text-[#101214] font-semibold'
                        : 'text-[#F4F3EF] font-semibold'
                      : isGarageLight
                      ? 'text-[#565C62] hover:text-[#101214]'
                      : 'text-[#85898A] hover:text-[#F4F3EF]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] bg-[#D71920] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Theme Toggle, Search, and Menu Controls */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* User Theme Toggle: Circuit Dark vs Garage Light */}
            <div className="relative group/theme shrink-0 hidden sm:block">
              <button
                id="nav-theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch theme. Current theme: ${isGarageLight ? 'Garage Light' : 'Circuit Dark'}`}
                title={`Switch to ${isGarageLight ? 'Circuit Dark' : 'Garage Light'}`}
                className={`h-9 w-9 border transition-all duration-200 flex items-center justify-center cursor-pointer select-none ${
                  isGarageLight
                    ? 'bg-white border-black/12 text-[#101214] hover:border-black/30'
                    : 'bg-[#111415] border-white/10 text-[#AEB4B5] hover:text-[#F4F3EF] hover:border-white/25'
                }`}
              >
                {isGarageLight ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Member Login / Guest State Simulator Toggle Button */}
            <div className="relative group/member shrink-0">
              <button
                id="nav-member-toggle"
                onClick={openLoginModal}
                aria-label={
                  isMember
                    ? `Logged in as ${memberProfile.name} (${memberProfile.tier}). Click to open Member Dossier or switch profile.`
                    : 'Guest View. Click to open Member Login portal.'
                }
                title={
                  isMember
                    ? `Member Mode: ${memberProfile.name} • ${memberProfile.tier} (Click to open dossier / switch profile)`
                    : 'Guest Mode: Click to open Member Login portal'
                }
                className={`h-9 px-2.5 sm:px-3.5 border transition-all duration-200 flex items-center gap-2 cursor-pointer select-none text-sm font-medium ${
                  isMember
                    ? isGarageLight
                      ? 'bg-white border-[#D71920]/70 text-[#D71920]'
                      : 'bg-[#180E10] border-[#D71920]/70 text-[#F4F3EF]'
                    : isGarageLight
                    ? 'bg-white border-black/15 text-[#101214] hover:border-black/40'
                    : 'bg-transparent border-white/20 text-[#F4F3EF] hover:border-white/50'
                }`}
              >
                {isMember ? (
                  <ShieldCheck className="w-4 h-4 text-[#D71920] shrink-0" />
                ) : (
                  <User className="w-4 h-4 shrink-0" />
                )}
                <span className="hidden sm:inline">
                  {isMember ? memberProfile.name.split(' ')[0] : 'Log in'}
                </span>
              </button>

            </div>

            {/* Primary action, always one click away */}
            <button
              id="nav-book-button"
              onClick={onOpenBookingModal}
              className="h-9 px-2.5 sm:px-4 bg-[#D71920] hover:bg-[#B5141A] text-white text-sm font-semibold flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
              aria-label="Book a drive"
            >
              <CalendarPlus className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Book a drive</span>
            </button>

            {/* Direct Race Control Portal Button (visible when logged in as Admin / Race Director) */}
            {isAdmin && (
              <button
                id="nav-admin-portal-button"
                onClick={() => handleNavClick('admin')}
                className={`h-8 sm:h-8.5 px-2.5 sm:px-3 bg-[#D71920] hover:bg-[#B5141A] text-white border border-[#D71920] text-[11px] font-bold rounded-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(215,25,32,0.35)] shrink-0 active:scale-95 ${
                  currentTab === 'admin' ? 'ring-2 ring-white/50' : ''
                }`}
                title="Race control (admin dashboard)"
                aria-label="Race control (admin dashboard)"
              >
                <LayoutDashboard className="w-4 h-4 sm:hidden" aria-hidden="true" />
                <span className="hidden sm:inline">Race control</span>
              </button>
            )}

            {/* Search Button */}
            <button
              id="nav-search-button"
              onClick={onOpenSearchModal}
              className={`p-2 sm:p-2.5 transition-colors cursor-pointer rounded-xs shrink-0 ${
                isGarageLight
                  ? 'text-[#565C62] hover:text-[#101214] hover:bg-black/[0.04]'
                  : 'text-[#85898A] hover:text-[#F4F3EF] hover:bg-white/[0.04]'
              }`}
              title="Search catalog (⌘K)"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Menu Toggle Button */}
            <button
              id="nav-menu-toggle"
              onClick={() => setDrawerOpen((prev) => !prev)}
              className={`p-2 sm:p-2.5 transition-colors cursor-pointer flex items-center gap-1.5 rounded-xs shrink-0 ${
                isGarageLight
                  ? 'text-[#565C62] hover:text-[#101214] hover:bg-black/[0.04]'
                  : 'text-[#85898A] hover:text-[#F4F3EF] hover:bg-white/[0.04]'
              }`}
              aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={drawerOpen}
            >
              {drawerOpen ? (
                <X className="w-4 h-4 text-[#D71920]" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Breadcrumb Navigation Trail */}
        {breadcrumbTrail && breadcrumbTrail.length > 0 && (
          <Breadcrumbs
            trail={breadcrumbTrail}
            onNavigateToNode={onBreadcrumbClick || (() => {})}
            onGoBack={onGoBack || (() => {})}
            onResetToHome={onResetToHome || (() => {})}
          />
        )}

        {/* Slide-Down Navigation Drawer */}
        {drawerOpen && (
          <div
            id="nav-drawer-menu"
            ref={drawerRef}
            className={`border-t w-full px-4 sm:px-6 md:px-10 py-6 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 transition-colors shadow-2xl ${
              isGarageLight
                ? 'bg-[#F6F7F5] border-black/[0.08] text-[#101214]'
                : 'bg-[#111415] border-white/[0.08] text-[#F4F3EF]'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Pages Column */}
              <div>
                <span
                  className={`text-xs block mb-3 ${
                    isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                  }`}
                >
                  Showroom & circuit
                </span>
                <div className="space-y-1.5">
                  {primaryPages.map((link) => {
                    const isActive = currentTab === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => handleNavClick(link.id)}
                        className={`w-full text-left p-2.5 transition-colors cursor-pointer border flex flex-col group ${
                          isActive
                            ? isGarageLight
                              ? 'bg-white border-[#D71920]/40 text-[#101214] shadow-xs'
                              : 'bg-[#181B1C] border-[#D71920]/50 text-[#F4F3EF]'
                            : isGarageLight
                            ? 'bg-white/60 hover:bg-white border-transparent hover:border-black/10 text-[#101214]'
                            : 'bg-white/[0.02] hover:bg-white/[0.05] border-transparent hover:border-white/10 text-[#F4F3EF]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-heading font-semibold ${
                              isActive ? 'text-[#D71920]' : ''
                            }`}
                          >
                            {link.label}
                          </span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D71920]" />
                          )}
                        </div>
                        <span
                          className={`text-xs font-light mt-0.5 ${
                            isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                          }`}
                        >
                          {link.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Pages Column */}
              <div>
                <span
                  className={`text-xs block mb-3 ${
                    isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                  }`}
                >
                  Programs & dispatches
                </span>
                <div className="space-y-1.5">
                  {secondaryPages.map((link) => {
                    const isActive = currentTab === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => handleNavClick(link.id)}
                        className={`w-full text-left p-2.5 transition-colors cursor-pointer border flex flex-col group ${
                          isActive
                            ? isGarageLight
                              ? 'bg-white border-[#D71920]/40 text-[#101214] shadow-xs'
                              : 'bg-[#181B1C] border-[#D71920]/50 text-[#F4F3EF]'
                            : isGarageLight
                            ? 'bg-white/60 hover:bg-white border-transparent hover:border-black/10 text-[#101214]'
                            : 'bg-white/[0.02] hover:bg-white/[0.05] border-transparent hover:border-white/10 text-[#F4F3EF]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-heading font-semibold ${
                              isActive ? 'text-[#D71920]' : ''
                            }`}
                          >
                            {link.label}
                          </span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D71920]" />
                          )}
                        </div>
                        <span
                          className={`text-xs font-light mt-0.5 ${
                            isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                          }`}
                        >
                          {link.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Concierge & System Controls Column */}
              <div
                className={`border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 flex flex-col justify-between gap-4 ${
                  isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.08]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 bg-[#D71920]" />
                    <span className="text-xs text-[#C9B37E]">
                      Private paddock allocation
                    </span>
                  </div>
                  <p
                    className={`text-xs font-light leading-relaxed mb-4 ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                    }`}
                  >
                    Arrange an exclusive private showroom walkthrough or register for FIA-grade closed-circuit seat time.
                  </p>

                  {/* Drawer Member Login / Guest State Simulator Toggle */}
                  <div
                    className={`p-3 border mb-3 flex items-center justify-between transition-colors ${
                      isMember
                        ? isGarageLight
                          ? 'bg-[#F2ECEC] border-[#D71920]/40 text-[#101214]'
                          : 'bg-[#180E10] border-[#D71920]/50 text-[#F4F3EF]'
                        : isGarageLight
                        ? 'bg-white border-black/[0.08]'
                        : 'bg-[#0B0D0E] border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isMember ? (
                        <ShieldCheck className="w-4 h-4 text-[#D71920]" />
                      ) : (
                        <Lock className={`w-4 h-4 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`} />
                      )}
                      <div>
                        <span
                          className={`text-[11px] block ${
                            isMember ? 'text-[#D71920] font-bold' : isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                          }`}
                        >
                          {isMember ? 'Member authenticated' : 'Access protocol'}
                        </span>
                        <span className="text-[11px] font-semibold">
                          {isMember ? `${memberProfile.name} (#084)` : 'Guest visitor'}
                        </span>
                      </div>
                    </div>

                    <button
                      id="drawer-member-toggle"
                      onClick={() => {
                        setDrawerOpen(false);
                        openLoginModal();
                      }}
                      className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer font-bold ${
                        isMember
                          ? 'border-[#D71920] bg-[#D71920]/15 text-[#D71920] hover:bg-[#D71920] hover:text-white'
                          : isGarageLight
                          ? 'bg-black/[0.04] border-black/20 hover:border-black/40 text-[#101214]'
                          : 'bg-white/[0.04] border-white/20 hover:border-white/40 text-[#F4F3EF]'
                      }`}
                    >
                      {isMember ? 'VIP dossier' : 'Member login'}
                    </button>
                  </div>

                  {/* Drawer Theme Quick Toggle */}
                  <div
                    className={`p-3 border mb-3 flex items-center justify-between ${
                      isGarageLight
                        ? 'bg-white border-black/[0.08]'
                        : 'bg-[#0B0D0E] border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isGarageLight ? (
                        <Sun className="w-3.5 h-3.5 text-[#9C7D2B]" />
                      ) : (
                        <Moon className="w-3.5 h-3.5 text-[#AEB4B5]" />
                      )}
                      <div>
                        <span
                          className={`text-[11px] block ${
                            isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                          }`}
                        >
                          Studio theme
                        </span>
                        <span className="text-[11px] font-semibold">
                          {isGarageLight ? 'Garage light' : 'Circuit dark'}
                        </span>
                      </div>
                    </div>

                    <button
                      id="drawer-theme-toggle"
                      onClick={toggleTheme}
                      className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                        isGarageLight
                          ? 'border-black/20 hover:border-black/40 text-[#101214]'
                          : 'border-white/20 hover:border-white/40 text-[#F4F3EF]'
                      }`}
                    >
                      Switch
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      onOpenBookingModal();
                    }}
                    className="w-full py-2.5 px-3 bg-[#D71920] hover:bg-[#b5141a] text-white text-xs transition-colors cursor-pointer text-center font-semibold flex items-center justify-center gap-2"
                  >
                    <span>Get behind the wheel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

