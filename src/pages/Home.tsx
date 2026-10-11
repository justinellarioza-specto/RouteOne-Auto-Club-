import React from 'react';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Collection } from '../components/Collection';
import { TrackExperience } from '../components/TrackExperience';
import { PromotionalBanner } from '../components/PromotionalBanner';
import { Showreel } from '../components/Showreel';
import { ScrollReveal } from '../components/ScrollReveal';
import { Vehicle } from '../types';
import { Article } from '../data/marketingData';

// Landing page: hero, about, featured cars, how it works, showreel video, promotion.
// Deeper content lives on its own page (Performance, Journal, Contact).

interface HomeProps {
  vehicles: Vehicle[];
  onOpenBookingModal: (experience?: string, vehicle?: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onSelectArticle: (article: Article) => void;
  onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  vehicles,
  onOpenBookingModal,
  onSelectVehicle,
  onSelectArticle,
  onNavigate,
}) => {
  return (
    <div id="home-landing-page" className="w-full">
      {/* 1. Hero: 2-Column with F1 Car Centerpiece, Technical Lines, and Performance Data */}
      <ScrollReveal duration={800} distance={24}>
        <Hero
          onOpenBookingModal={() => onOpenBookingModal('Track Experience', 'RouteOne R1 Concept')}
          onExploreCollection={() => {
            const el = document.getElementById('collection-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </ScrollReveal>

      {/* About Section: Who We Are, Purpose, Mission & Visitor Journey */}
      <ScrollReveal duration={750} distance={32} threshold={0.06}>
        <About
          onOpenBookingModal={() => onOpenBookingModal('Private Showroom Viewing')}
          onLearnMore={() => onNavigate('features')}
        />
      </ScrollReveal>

      {/* 2. 01 / THE COLLECTION: Machines Without Compromise (3 Cards with Subtle Red Line) */}
      <ScrollReveal duration={750} distance={32} threshold={0.06}>
        <Collection
          vehicles={vehicles}
          onSelectVehicle={onSelectVehicle}
          onExploreAll={() => onNavigate('collection')}
        />
      </ScrollReveal>

      {/* 4. 03 / THE EXPERIENCE: Your Turn (3 Steps: Arrive, Prepare, Drive) */}
      <ScrollReveal duration={750} distance={32} threshold={0.06}>
        <TrackExperience
          onBookTrackSession={() => onOpenBookingModal('Track Experience')}
          onViewCircuitMap={() => onNavigate('experience')}
        />
      </ScrollReveal>

      {/* 7. 04 / SHOWREEL: RouteOne Showreel (Video Modal) */}
      <ScrollReveal duration={750} distance={32} threshold={0.06}>
        <Showreel />
      </ScrollReveal>

      {/* 6. Promotional Campaign: Experience The Thrill */}
      <ScrollReveal duration={750} distance={32} threshold={0.06}>
        <PromotionalBanner
          onOpenBookingModal={(pref) => onOpenBookingModal(pref || 'Track Experience')}
        />
      </ScrollReveal>
    </div>
  );
};

