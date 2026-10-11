export type VehicleCategory =
  | 'ALL'
  | 'SUPERCARS'
  | 'HYPERCARS'
  | 'SPORTS CARS'
  | 'FAST CARS'
  | 'TRACK'
  | 'FORMULA 1'
  | 'F1 HERITAGE'
  | 'GRAND TOURERS'
  | 'ELECTRIC'
  | string;

export interface Vehicle {
  id: string;
  name: string;
  marque: string; // Brand / Manufacturer
  brand?: string; // Optional alias for marque
  model?: string; // Model designation
  category: VehicleCategory;
  subcategory?: string;
  badge: string;
  era?: string; // For historic / classic racing eras
  type?: string; // e.g. 'Single-Seater Race Car', 'Production Road Car', 'Track Special'
  team?: string; // For F1 constructors
  season?: string; // e.g. '1988 Season', '2004 Championship'
  driver?: string; // e.g. 'Ayrton Senna', 'Michael Schumacher'
  engine: string;
  power: string;
  acceleration: string; // 0-100 km/h
  topSpeed: string;
  transmission: string;
  weight: string;
  availability: 'Private Viewing' | 'Showroom Floor' | 'Circuit Only' | 'By Allocation' | string;
  experience?: 'Showroom' | 'Track Experience' | 'Concept' | 'Heritage Showcase' | string;
  description: string;
  fictionalDisclaimer?: string;
  image: string;
  features: string[];
  price?: string;
}

export interface ExperienceService {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  duration: string;
  location: string;
  availability: 'Immediate Booking' | 'Limited Slots' | 'By Invitation' | 'Seasonal';
  price: string;
  description: string;
  image: string;
  inclusions: string[];
  ctaLabel: string;
}

export interface CustomerInquiryDemo {
  id: number;
  name: string;
  email: string;
  preferredExperience: string;
  vehicleInterest: string;
  date: string;
  status: 'Inquiry' | 'Confirmed' | 'In Review' | 'Completed' | 'Cancelled';
  location: string;
  createdAt?: string;
  channel?: string;
  subject?: string;
  message?: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  date: string;
  category: string;
  image: string;
  summary: string;
  content: string[];
}

export interface SocialPost {
  id: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook';
  author: string;
  handle: string;
  tag: string;
  caption: string;
  likes: string;
  comments: string;
  image: string;
  date: string;
  views?: string;
}

export type ThemeMode = 'circuit-dark' | 'garage-light';

export interface ThemeConfig {
  id: ThemeMode;
  name: 'Circuit Dark' | 'Garage Light';
  description: string;
  cssVariables: Record<string, string>;
}

export type VehicleAvailabilityStatus = 'Currently Available' | 'In Private Collection';

export interface VehicleAvailabilityRecord {
  vehicleId: string;
  status: VehicleAvailabilityStatus;
  urgencyLabel: string;
  activeReservationsCount: number;
  availableSlots: number;
  vaultLocation?: string;
  lastUpdated: string;
}

export interface FleetAvailabilityResponse {
  source: string;
  lastSync: string;
  summary: {
    total: number;
    currentlyAvailable: number;
    inPrivateCollection: number;
  };
  availability: Record<string, VehicleAvailabilityRecord>;
}

export interface VideoMetadata {
  id: string;
  title: string;
  subtitle: string;
  driver: string;
  team: string;
  carModel: string;
  engine: string;
  soundtrack: {
    title: string;
    artist: string;
    album: string;
    bpm: number;
    genre: string;
  };
  technical: {
    resolution: string;
    aspectRatio: string;
    framerate: string;
    colorSpace: string;
    telemetryRate: string;
    audioCodec: string;
    bitrate: string;
  };
  location: string;
  duration: string;
  production: string;
  youtubeUrl: string;
  youtubeId: string;
}

