import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InquiryModal } from './components/InquiryModal';
import { VehicleModal } from './components/VehicleModal';
import { ArticleModal } from './components/ArticleModal';
import { SearchModal } from './components/SearchModal';
import { BrandIdentityModal } from './components/BrandIdentityModal';
import { SpeedingCarLoader } from './components/SpeedingCarLoader';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { BreadcrumbNode } from './components/Breadcrumbs';

import { Home } from './pages/Home';

import { Vehicle, ExperienceService } from './types';
import { Article, JOURNAL_ARTICLES } from './data/marketingData';
import { fetchVehicles, fetchExperiences } from './services/api';
import { ThemeProvider } from './context/ThemeContext';
import { MemberProvider, useMember } from './context/MemberContext';
import { MemberStatusBar } from './components/MemberStatusBar';
import { MemberLoginModal } from './components/MemberLoginModal';
import { WelcomeBackToast } from './components/WelcomeBackToast';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

// Pages other than Home load their code only when opened (smaller first download)
const CollectionPage = lazy(() => import('./pages/Collection').then((m) => ({ default: m.CollectionPage })));
const ExperiencesPage = lazy(() => import('./pages/Experiences').then((m) => ({ default: m.ExperiencesPage })));
const FeaturesPage = lazy(() => import('./pages/Features').then((m) => ({ default: m.FeaturesPage })));
const JournalPage = lazy(() => import('./pages/JournalPage').then((m) => ({ default: m.JournalPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const ServicesCatalogPage = lazy(() => import('./pages/ServicesCatalogPage').then((m) => ({ default: m.ServicesCatalogPage })));
const ApiDataPage = lazy(() => import('./pages/ApiDataPage').then((m) => ({ default: m.ApiDataPage })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

const TAB_METADATA: Record<string, { label: string; category: string }> = {
  home: { label: 'Overview', category: 'HOME' },
  collection: { label: 'The collection', category: 'SHOWROOM' },
  experience: { label: 'Track experience', category: 'CIRCUIT' },
  experiences: { label: 'Track experience', category: 'CIRCUIT' },
  performance: { label: 'Performance division', category: 'ENGINEERING' },
  features: { label: 'Performance division', category: 'ENGINEERING' },
  contact: { label: 'Contact', category: 'CONCIERGE' },
  services: { label: 'Service catalog', category: 'PROGRAMS' },
  'api-data': { label: 'Live API data', category: 'DATA' },
  admin: { label: 'Race control · admin', category: 'OPERATIONS' },
};

// ---- Page addresses: each page has its own link (#/collection, #/contact …) ----
const ROUTABLE = new Set(Object.keys(TAB_METADATA));
function tabFromHash(): string {
  const raw = (typeof window !== 'undefined' ? window.location.hash : '').replace(/^#\/?/, '').split(/[?#]/)[0];
  if (raw === 'journal') {
    // The journal and campaigns now live on the Contact page; keep old links working
    try {
      window.history.replaceState(null, '', '#/contact');
    } catch {
      /* ignore */
    }
    return 'contact';
  }
  return raw && ROUTABLE.has(raw) ? raw : 'home';
}
function hashForTab(tab: string) {
  return tab === 'home' ? '#/' : `#/${tab}`;
}

function MainApp() {
  const { isMember } = useMember();
  const [currentTab, setCurrentTab] = useState<string>(() => tabFromHash());
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [experiences, setExperiences] = useState<ExperienceService[]>([]);
  // Race-start intro plays every time the site opens or is refreshed (skippable)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Transition tracking for Guest vs Member switch animation
  const [memberTransitionState, setMemberTransitionState] = useState<'idle' | 'entering-member' | 'entering-guest'>('idle');
  const prevIsMemberRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevIsMemberRef.current !== null && prevIsMemberRef.current !== isMember) {
      setMemberTransitionState(isMember ? 'entering-member' : 'entering-guest');
      const timer = setTimeout(() => {
        setMemberTransitionState('idle');
      }, 1300);
      return () => clearTimeout(timer);
    }
    prevIsMemberRef.current = isMember;
  }, [isMember]);

  // Breadcrumb Trail State: starts at Home Overview
  const [breadcrumbTrail, setBreadcrumbTrail] = useState<BreadcrumbNode[]>([
    {
      id: 'tab-home',
      label: 'Overview',
      category: 'HOME',
      tab: 'home',
      type: 'tab',
    },
  ]);

  // Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState<boolean>(false);
  const [bookingExperience, setBookingExperience] = useState<string>('Track Experience');
  const [bookingVehicle, setBookingVehicle] = useState<string>('RouteOne R1 Concept');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchVehicles()
      .then((data) => {
        setVehicles(data);
      })
      .catch((err) => {
        console.error('Error fetching initial vehicles:', err);
      });

    fetchExperiences()
      .then((data) => {
        setExperiences(data);
      })
      .catch((err) => {
        console.error('Error fetching initial experiences:', err);
      });
  }, []);

  // Global search keyboard shortcuts (⌘K, Ctrl+K, /), [L] for Launch Speeding Car, [Alt+Left] for breadcrumb back
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        (e.target as HTMLElement)?.tagName
      );

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      } else if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      } else if (e.key.toLowerCase() === 'l' && !isInputFocused && !e.metaKey && !e.ctrlKey) {
        // Press 'L' to trigger speeding car launch animation
        setIsLoading(true);
      } else if (e.altKey && e.key === 'ArrowLeft' && !isInputFocused) {
        e.preventDefault();
        handleGoBack();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [breadcrumbTrail]);

  /** Shows a page without touching browser history (used by the address listener). */
  const applyTab = (tab: string, scroll = true) => {
    setSelectedVehicle(null);
    setSelectedArticle(null);
    setIsBookingModalOpen(false);

    setCurrentTab(tab);
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab === 'home') {
      setBreadcrumbTrail([
        {
          id: 'tab-home',
          label: 'Overview',
          category: 'HOME',
          tab: 'home',
          type: 'tab',
        },
      ]);
    } else {
      const meta = TAB_METADATA[tab] || { label: tab.toUpperCase(), category: 'VIEW' };
      setBreadcrumbTrail([
        {
          id: 'tab-home',
          label: 'Overview',
          category: 'HOME',
          tab: 'home',
          type: 'tab',
        },
        {
          id: `tab-${tab}`,
          label: meta.label,
          category: meta.category,
          tab,
          type: 'tab',
        },
      ]);
    }
  };

  /** Go to a page: updates the address bar so Back/Forward and shared links work. */
  const handleNavigate = (tab: string) => {
    if (tab === 'journal') tab = 'contact'; // merged into Contact
    const target = hashForTab(tab);
    const current = window.location.hash || '#/';
    if (current !== target) {
      window.location.hash = target; // the hashchange listener below shows the page
    } else {
      applyTab(tab);
    }
  };

  // Back/Forward buttons and pasted links
  useEffect(() => {
    const onHashChange = () => applyTab(tabFromHash());
    window.addEventListener('hashchange', onHashChange);
    // Opened straight on a page link: build its breadcrumb without scrolling
    if (tabFromHash() !== 'home') applyTab(tabFromHash(), false);
    return () => window.removeEventListener('hashchange', onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Browser tab title follows the page
  useEffect(() => {
    const meta = TAB_METADATA[currentTab];
    document.title = currentTab === 'home' || !meta ? 'RouteOne Auto Club' : `${meta.label} · RouteOne Auto Club`;
  }, [currentTab]);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    const parentTab = currentTab === 'home' ? 'collection' : currentTab;
    const parentMeta = TAB_METADATA[parentTab] || { label: 'The collection', category: 'SHOWROOM' };

    setBreadcrumbTrail([
      {
        id: 'tab-home',
        label: 'Overview',
        category: 'HOME',
        tab: 'home',
        type: 'tab',
      },
      {
        id: `tab-${parentTab}`,
        label: parentMeta.label,
        category: parentMeta.category,
        tab: parentTab,
        type: 'tab',
      },
      {
        id: `vehicle-${vehicle.id}`,
        label: vehicle.name,
        category: 'SPEC',
        tab: currentTab,
        type: 'vehicle',
        metadata: { vehicle },
      },
    ]);
  };

  const handleCloseVehicleModal = () => {
    setSelectedVehicle(null);
    handleNavigate(currentTab);
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    const shortTitle =
      article.title.length > 26 ? `${article.title.slice(0, 26)}...` : article.title;

    setBreadcrumbTrail([
      {
        id: 'tab-home',
        label: 'Overview',
        category: 'HOME',
        tab: 'home',
        type: 'tab',
      },
      {
        id: 'tab-contact',
        label: 'Contact',
        category: 'CONCIERGE',
        tab: 'contact',
        type: 'tab',
      },
      {
        id: `article-${article.id}`,
        label: shortTitle,
        category: 'ARTICLE',
        tab: currentTab,
        type: 'article',
        metadata: { article },
      },
    ]);
  };

  const handleCloseArticleModal = () => {
    setSelectedArticle(null);
    handleNavigate(currentTab);
  };

  const handleBreadcrumbClick = (node: BreadcrumbNode, index: number) => {
    if (index === breadcrumbTrail.length - 1) return; // Already on current node

    if (node.type === 'tab') {
      handleNavigate(node.tab);
    } else if (node.type === 'vehicle' && node.metadata?.vehicle) {
      setSelectedArticle(null);
      setSelectedVehicle(node.metadata.vehicle);
      setBreadcrumbTrail((prev) => prev.slice(0, index + 1));
    } else if (node.type === 'article' && node.metadata?.article) {
      setSelectedVehicle(null);
      setSelectedArticle(node.metadata.article);
      setBreadcrumbTrail((prev) => prev.slice(0, index + 1));
    }
  };

  const handleGoBack = () => {
    if (breadcrumbTrail.length <= 1) return;
    const targetIndex = breadcrumbTrail.length - 2;
    const targetNode = breadcrumbTrail[targetIndex];

    if (targetNode.type === 'tab') {
      handleNavigate(targetNode.tab);
    } else if (targetNode.type === 'vehicle' && targetNode.metadata?.vehicle) {
      setSelectedArticle(null);
      setSelectedVehicle(targetNode.metadata.vehicle);
      setBreadcrumbTrail(breadcrumbTrail.slice(0, targetIndex + 1));
    } else if (targetNode.type === 'article' && targetNode.metadata?.article) {
      setSelectedVehicle(null);
      setSelectedArticle(targetNode.metadata.article);
      setBreadcrumbTrail(breadcrumbTrail.slice(0, targetIndex + 1));
    }
  };

  const handleResetToHome = () => {
    handleNavigate('home');
  };

  const handleOpenBookingModal = (experience?: string, vehicleName?: string) => {
    if (experience) setBookingExperience(experience);
    if (vehicleName) setBookingVehicle(vehicleName);
    setIsBookingModalOpen(true);
  };

  const handleReplayLoading = () => {
    setIsLoading(true);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg-body,#E2E5DF)] text-[var(--text-primary,#101214)] flex flex-col font-sans-ui selection:bg-[#D71920] selection:text-white antialiased transition-colors duration-200">
      {/* Subtle, Slim Top Scroll Progress Bar */}
      <ScrollProgressBar currentTab={currentTab} />

      {/* Dynamic Speeding Car Loading Page Animation */}
      <SpeedingCarLoader
        isLoading={isLoading}
        onFinish={() => setIsLoading(false)}
        minDurationMs={2400}
      />

      {/* 100% Zoom Default Full-Width Motorsport Container */}
      <div className="routeone-container w-full min-h-screen flex flex-col">
        {/* Private Member Status & Toast Notification Layer */}
        <MemberStatusBar
          onOpenBookingModal={handleOpenBookingModal}
          onNavigate={handleNavigate}
        />

        {/* Sticky Header Navigation with Integrated Breadcrumb Trail */}
        <Navbar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onOpenBookingModal={() => handleOpenBookingModal('Track Experience', 'RouteOne R1 Concept')}
          onOpenSearchModal={() => setIsSearchModalOpen(true)}
          onReplayLoading={handleReplayLoading}
          breadcrumbTrail={breadcrumbTrail}
          onBreadcrumbClick={handleBreadcrumbClick}
          onGoBack={handleGoBack}
          onResetToHome={handleResetToHome}
        />

        {/* Main View Container with Smooth Transition Animation on Member/Guest Switch & Tab Switch */}
        <div className="relative flex-grow flex flex-col">
          {/* Main View Container with Subtle Fade-In Entrance on Tab Switch and Smooth Atmosphere Transition */}
          <main
            key={currentTab}
            id="main-content-container"
            className={`flex-grow main-tab-enter transition-all duration-700 ease-out relative ${
              isMember
                ? 'shadow-[inset_0_0_120px_rgba(215,25,32,0.035)]'
                : ''
            } ${memberTransitionState === 'entering-member' ? 'member-atmosphere-flash' : ''}`}
          >
            <Suspense
              fallback={
                <div className="w-full min-h-[60vh] flex items-center justify-center" role="status">
                  <span className="w-6 h-6 rounded-full border-2 border-[#D71920]/25 border-t-[#D71920] animate-spin" />
                  <span className="sr-only">Loading page</span>
                </div>
              }
            >
            {currentTab === 'home' && (
              <Home
                vehicles={vehicles}
                onOpenBookingModal={handleOpenBookingModal}
                onSelectVehicle={handleSelectVehicle}
                onSelectArticle={handleSelectArticle}
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === 'collection' && (
              <CollectionPage
                vehicles={vehicles}
                onSelectVehicle={handleSelectVehicle}
                onOpenBookingModal={handleOpenBookingModal}
                onSelectArticle={handleSelectArticle}
              />
            )}

            {(currentTab === 'experience' || currentTab === 'experiences') && (
              <ExperiencesPage
                onOpenBookingModal={(serviceName) => handleOpenBookingModal(serviceName)}
              />
            )}

            {(currentTab === 'performance' || currentTab === 'features') && (
              <FeaturesPage
                onOpenBookingModal={(pref) => handleOpenBookingModal(pref || 'Track Experience')}
              />
            )}

            {currentTab === 'contact' && (
              <>
                {/* Contact form and details, then our campaigns and the journal */}
                <ContactPage />
                <JournalPage
                  onSelectArticle={handleSelectArticle}
                  onOpenBookingModal={(vehicle?: string) => handleOpenBookingModal('Track Experience', vehicle ?? 'Scuderia Ferrari SF-26 (email offer)')}
                />
              </>
            )}

            {currentTab === 'api-data' && (
              <ApiDataPage
                onNavigate={handleNavigate}
                onSelectVehicle={handleSelectVehicle}
                onOpenBookingModal={handleOpenBookingModal}
              />
            )}

            {currentTab === 'services' && (
              <ServicesCatalogPage
                onNavigate={handleNavigate}
                onSelectVehicle={handleSelectVehicle}
                onOpenBookingModal={handleOpenBookingModal}
              />
            )}

            {currentTab === 'admin' && (
              <AdminProtectedRoute onNavigate={handleNavigate}>
                <AdminDashboard onNavigate={handleNavigate} />
              </AdminProtectedRoute>
            )}
            </Suspense>
          </main>
        </div>

        {/* Footer */}
        <Footer
          onNavigate={handleNavigate}
          onOpenBookingModal={() => handleOpenBookingModal('Private Showroom Viewing')}
          onReplayLoading={handleReplayLoading}
          onOpenBrandModal={() => setIsBrandModalOpen(true)}
        />
      </div>

      {/* Brand Identity / Dual Mode Logo Dossier */}
      <BrandIdentityModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
      />

      {/* Primary "GET BEHIND THE WHEEL" Inquiry / Booking Modal */}
      <InquiryModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        defaultExperience={bookingExperience}
        defaultVehicle={bookingVehicle}
      />

      {/* Full Vehicle Dossier Modal */}
      <VehicleModal
        vehicle={selectedVehicle}
        onClose={handleCloseVehicleModal}
        onBookVehicle={(vName) => handleOpenBookingModal('Private Showroom Viewing', vName)}
      />

      {/* Journal Article Reader Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={handleCloseArticleModal}
        onBookExperience={() => handleOpenBookingModal('Track Experience')}
      />

      {/* Global RouteOne Ecosystem Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        vehicles={vehicles}
        experiences={experiences}
        articles={JOURNAL_ARTICLES}
        onSelectVehicle={(vehicle) => {
          handleSelectVehicle(vehicle);
        }}
        onSelectArticle={(article) => {
          handleSelectArticle(article);
        }}
        onSelectService={(serviceName) => {
          handleOpenBookingModal(serviceName);
        }}
        onNavigateTab={handleNavigate}
      />

      {/* Apex Syndicate Private Member Login Portal Modal */}
      <MemberLoginModal onNavigate={handleNavigate} />

      {/* Sophisticated 3-second Welcome Back Toast Notification */}
      <WelcomeBackToast />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MemberProvider>
        <MainApp />
      </MemberProvider>
    </ThemeProvider>
  );
}

