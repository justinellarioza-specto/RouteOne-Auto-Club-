import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiSignup, apiMe, apiLogout, setAuthToken, AuthUser } from '../services/api';

export interface AllocatedVehicle {
  name: string;
  location: string;
  status: string;
  fuel: string;
  tires: string;
  telemetryId: string;
}

export interface MemberProfile {
  id: string;
  name: string;
  tier: string;
  badge: string;
  role: string;
  joined: string;
  email: string;
  activeGarageSlots: number;
  totalGarageSlots: number;
  trackDaysRemaining: number;
  conciergeCode: string;
  conciergePhone: string;
  paddockAccessLevel: string;
  allocatedCars: AllocatedVehicle[];
}

export const PRESET_MEMBER_PROFILES: MemberProfile[] = [
  {
    id: 'admin',
    name: 'Marcus Vance',
    tier: 'RACE DIRECTOR & PADDOCK CHIEF',
    badge: 'Circuit admin · full access',
    role: 'Race Director',
    joined: '2023',
    email: 'director@routeone.club',
    activeGarageSlots: 6,
    totalGarageSlots: 6,
    trackDaysRemaining: 99,
    conciergeCode: 'RACE-CONTROL-MASTER-01',
    conciergePhone: '+44 1327 850 001',
    paddockAccessLevel: 'FIA Race Director / Unrestricted Circuit & Pit Control',
    allocatedCars: [
      {
        name: 'RouteOne R1 Concept (Safety Car)',
        location: 'Pit Exit • Bay 01',
        status: 'Paddock Ready & Heated',
        fuel: '100% Race 102 Octane',
        tires: 'Pirelli P-Zero Wet / Dry',
        telemetryId: 'RACE-CONTROL-SC1',
      },
      {
        name: 'Porsche 911 GT3 RS (Weissach Spec)',
        location: 'Silverstone Pit Lane',
        status: 'Telemetry Test Bed',
        fuel: '98% Shell V-Power',
        tires: 'Michelin Cup 2R',
        telemetryId: 'MOTEC-GT3-ADMIN',
      },
      {
        name: 'Aston Martin Valkyrie AMR Pro',
        location: 'Hangar Bay A',
        status: 'Race Control Track Sweep Ready',
        fuel: '100% VP Racing Fuel',
        tires: 'Michelin Slick Blanketed',
        telemetryId: 'AMR-DIRECTOR-001',
      },
    ],
  },
  {
    id: 'user',
    name: 'Member User',
    tier: 'VIP CLUB MEMBER',
    badge: 'Verified member',
    role: 'VIP Club Member',
    joined: '2026',
    email: 'user@routeone.club',
    activeGarageSlots: 3,
    totalGarageSlots: 3,
    trackDaysRemaining: 15,
    conciergeCode: 'VIP-USER-2026',
    conciergePhone: '+44 1327 850 099',
    paddockAccessLevel: 'Full Circuit & Paddock Clearance',
    allocatedCars: [
      {
        name: 'RouteOne R1 Concept',
        location: 'Silverstone HQ • Pit Box 04',
        status: 'Paddock Ready & Warmed',
        fuel: '100% Race 102 Octane',
        tires: 'Michelin Pilot Sport Cup 2R',
        telemetryId: 'MOTEC-R1-USER',
      },
      {
        name: 'Porsche 911 GT3 RS (Weissach)',
        location: 'Silverstone Pit Lane',
        status: 'Allocated for Telemetry Run',
        fuel: '95% Shell V-Power',
        tires: 'Pirelli Trofeo R',
        telemetryId: 'MOTEC-GT3-LIVE',
      },
      {
        name: 'Ferrari SF90 XX Stradale',
        location: 'Spa-Francorchamps • Paddock Bay 02',
        status: 'Ready in Climate Bay',
        fuel: '100% Race Octane',
        tires: 'Pirelli Trofeo RS',
        telemetryId: 'VBOX-SF90-USER',
      },
    ],
  },
  {
    id: 'R1-APEX-084',
    name: 'Sir Alexander Vance',
    tier: 'APEX SYNDICATE',
    badge: 'VIP circuit allocation',
    role: 'Founding Circuit Member',
    joined: '2024',
    email: 'a.vance@syndicate.routeone.club',
    activeGarageSlots: 3,
    totalGarageSlots: 4,
    trackDaysRemaining: 14,
    conciergeCode: 'APEX-PRIORITY-084',
    conciergePhone: '+44 1327 850 099',
    paddockAccessLevel: 'FIA Grade 1 Unrestricted Pit Access',
    allocatedCars: [
      {
        name: 'RouteOne R1 Concept',
        location: 'Silverstone HQ • Pit Box 04',
        status: 'Ready for Telemetry Run',
        fuel: '100% Race 102 Octane',
        tires: 'Michelin Pilot Sport Cup 2R (Fresh)',
        telemetryId: 'MOTEC-R1-084',
      },
      {
        name: 'Ferrari SF90 XX Stradale',
        location: 'Spa-Francorchamps • Paddock Bay 02',
        status: 'Pre-Warmed on Slick Blankets',
        fuel: '95% (Hybrid Fully Charged)',
        tires: 'Pirelli P Zero Trofeo RS',
        telemetryId: 'VBOX-SF90-12',
      },
      {
        name: 'Porsche 911 GT3 RS (Weissach)',
        location: 'Nürburgring Nordschleife • Bay 11',
        status: 'Aero Configured for Dry High-Downforce',
        fuel: '100% Shell V-Power Racing',
        tires: 'Michelin Cup 2R N0 Spec',
        telemetryId: 'AIM-GT3RS-99',
      },
    ],
  },
  {
    id: 'R1-SCUDERIA-019',
    name: 'Elena Rostova',
    tier: 'SCUDERIA PADDOCK',
    badge: 'High-downforce division',
    role: 'Formula Pro-Am Member',
    joined: '2025',
    email: 'e.rostova@scuderia.routeone.club',
    activeGarageSlots: 2,
    totalGarageSlots: 3,
    trackDaysRemaining: 9,
    conciergeCode: 'SCUDERIA-019',
    conciergePhone: '+39 0536 949 111',
    paddockAccessLevel: 'Monza & Mugello VIP Pit-Lane Access',
    allocatedCars: [
      {
        name: 'Ferrari 499P Modificata',
        location: 'Autodromo Nazionale Monza • Box 01',
        status: 'Engine Pre-Heated to 80°C',
        fuel: '100% TotalEnergies Hypercar Mix',
        tires: 'Michelin Pilot Sport Endurance',
        telemetryId: 'MAGNETI-499P-19',
      },
      {
        name: 'McLaren Senna GTR',
        location: 'Silverstone HQ • Pit Box 02',
        status: 'Telemetry Calibration Complete',
        fuel: '88% Race Fuel',
        tires: 'Pirelli P Zero Slick Medium',
        telemetryId: 'TAG320-GTR-19',
      },
    ],
  },
  {
    id: 'R1-WERK-007',
    name: 'Marcus von Berg',
    tier: 'WORKS DRIVER',
    badge: 'Factory endurance racer',
    role: 'Development Test Driver',
    joined: '2023',
    email: 'm.vonberg@works.routeone.club',
    activeGarageSlots: 4,
    totalGarageSlots: 4,
    trackDaysRemaining: 22,
    conciergeCode: 'WERK-TEAM-007',
    conciergePhone: '+49 2691 302 0',
    paddockAccessLevel: 'Global Unlimited 24H Pit Box Clearance',
    allocatedCars: [
      {
        name: 'Mercedes-AMG ONE',
        location: 'Nürburgring Nordschleife • Werk Bay 1',
        status: 'F1 V6 Turbo Hybrid Prepped',
        fuel: '100% Petronas Primax 100',
        tires: 'Michelin Pilot Sport Cup 2 R MO1',
        telemetryId: 'BOSCH-MS7-007',
      },
      {
        name: 'Aston Martin Valkyrie AMR Pro',
        location: 'Silverstone National • Box 08',
        status: 'Aerodynamic Zero-Stall Trim Active',
        fuel: '92% VP Racing',
        tires: 'Michelin Slick Soft',
        telemetryId: 'COSWORTH-V12-007',
      },
    ],
  },
];

export const DEFAULT_MEMBER_PROFILE = PRESET_MEMBER_PROFILES[0];

export type TrackConditionType = 'GREEN' | 'YELLOW' | 'RED' | 'CHECKERED' | 'WET';

export interface FleetVehicle {
  id: string;
  name: string;
  category: 'Hypercar' | 'GT3 Race' | 'Prototype' | 'Speedster';
  chassisNo: string;
  location: string;
  status: 'Ready on Blankets' | 'Active on Track' | 'In Pit Service' | 'Fueling Octane' | 'Telemetry Diagnostic';
  fuelPercent: number;
  tireWearPercent: number;
  tireCycles: number;
  brakePadLife: number;
  engineOilTempC: number;
  telemetryId: string;
  allocatedMemberName?: string;
  powerOutput: string;
}

export interface TrackBooking {
  id: string;
  memberName: string;
  memberId: string;
  circuit: 'Silverstone GP Circuit' | 'Spa-Francorchamps' | 'Nürburgring Nordschleife';
  date: string;
  slot: string;
  vehicleName: string;
  status: 'Confirmed' | 'Pending Scrutineering' | 'Completed' | 'Waitlisted';
  telemetryUplink: boolean;
  instructor: string;
  pitBox: string;
}

export const INITIAL_FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: 'FLEET-001',
    name: 'RouteOne R1 Concept #001',
    category: 'Hypercar',
    chassisNo: 'R1-PROTOTYPE-01',
    location: 'Silverstone HQ • Pit Box 04',
    status: 'Active on Track',
    fuelPercent: 92,
    tireWearPercent: 88,
    tireCycles: 3,
    brakePadLife: 94,
    engineOilTempC: 98,
    telemetryId: 'MOTEC-R1-084',
    allocatedMemberName: 'Sir Alexander Vance',
    powerOutput: '1,020 HP Twin-Turbo Hybrid',
  },
  {
    id: 'FLEET-002',
    name: 'Ferrari SF90 XX Stradale',
    category: 'Hypercar',
    chassisNo: 'SF90-XX-019',
    location: 'Spa-Francorchamps • Bay 02',
    status: 'Ready on Blankets',
    fuelPercent: 96,
    tireWearPercent: 100,
    tireCycles: 1,
    brakePadLife: 98,
    engineOilTempC: 88,
    telemetryId: 'VBOX-SF90-XX',
    allocatedMemberName: 'Elena Rostova',
    powerOutput: '1,030 HP V8 Turbo Hybrid',
  },
  {
    id: 'FLEET-003',
    name: 'Porsche 911 GT3 RS (Weissach)',
    category: 'GT3 Race',
    chassisNo: '992-GT3RS-088',
    location: 'Silverstone Pit Lane • Box 02',
    status: 'Active on Track',
    fuelPercent: 78,
    tireWearPercent: 82,
    tireCycles: 4,
    brakePadLife: 89,
    engineOilTempC: 102,
    telemetryId: 'AIM-GT3RS-99',
    allocatedMemberName: 'Member User',
    powerOutput: '525 HP Naturally Aspirated Boxer-6',
  },
  {
    id: 'FLEET-004',
    name: 'McLaren 765LT Spider',
    category: 'Hypercar',
    chassisNo: 'MCL-765LT-14',
    location: 'Silverstone Hangar Bay 03',
    status: 'Fueling Octane',
    fuelPercent: 48,
    tireWearPercent: 95,
    tireCycles: 2,
    brakePadLife: 96,
    engineOilTempC: 68,
    telemetryId: 'MOTEC-765-UK',
    allocatedMemberName: 'Unassigned',
    powerOutput: '765 HP 4.0L Twin-Turbo V8',
  },
  {
    id: 'FLEET-005',
    name: 'Aston Martin Valkyrie AMR Pro',
    category: 'Prototype',
    chassisNo: 'AMR-PRO-004',
    location: 'Nürburgring Nordschleife • Bay 11',
    status: 'In Pit Service',
    fuelPercent: 85,
    tireWearPercent: 72,
    tireCycles: 6,
    brakePadLife: 84,
    engineOilTempC: 92,
    telemetryId: 'COSWORTH-V12-AMR',
    allocatedMemberName: 'Lord Julian Sterling',
    powerOutput: '1,000 HP Cosworth 6.5L V12',
  },
  {
    id: 'FLEET-006',
    name: 'Mercedes-AMG GT Black Series',
    category: 'GT3 Race',
    chassisNo: 'AMG-GTBS-021',
    location: 'Silverstone HQ • Pit Box 05',
    status: 'Ready on Blankets',
    fuelPercent: 100,
    tireWearPercent: 100,
    tireCycles: 0,
    brakePadLife: 100,
    engineOilTempC: 82,
    telemetryId: 'BOSCH-AMG-GTBS',
    allocatedMemberName: 'Unassigned',
    powerOutput: '730 HP Flat-Plane V8 Biturbo',
  },
];

export const INITIAL_TRACK_BOOKINGS: TrackBooking[] = [
  {
    id: 'BK-8901',
    memberName: 'Sir Alexander Vance',
    memberId: 'R1-APEX-084',
    circuit: 'Silverstone GP Circuit',
    date: 'Today',
    slot: '10:00 - 12:30 (Session 1)',
    vehicleName: 'RouteOne R1 Concept #001',
    status: 'Confirmed',
    telemetryUplink: true,
    instructor: 'J. Palmer (F1 Test Driver)',
    pitBox: 'Pit Box 04',
  },
  {
    id: 'BK-8902',
    memberName: 'Member User',
    memberId: 'user',
    circuit: 'Silverstone GP Circuit',
    date: 'Today',
    slot: '14:00 - 16:30 (Session 2)',
    vehicleName: 'Porsche 911 GT3 RS (Weissach)',
    status: 'Confirmed',
    telemetryUplink: true,
    instructor: 'A. Davidson (FIA Gold)',
    pitBox: 'Pit Box 02',
  },
  {
    id: 'BK-8903',
    memberName: 'Elena Rostova',
    memberId: 'R1-SCUDERIA-019',
    circuit: 'Spa-Francorchamps',
    date: 'Tomorrow',
    slot: '09:00 - 11:30 (Morning Run)',
    vehicleName: 'Ferrari SF90 XX Stradale',
    status: 'Confirmed',
    telemetryUplink: true,
    instructor: 'R. Dumas (WEC Champion)',
    pitBox: 'Paddock Bay 02',
  },
  {
    id: 'BK-8904',
    memberName: 'Lord Julian Sterling',
    memberId: 'R1-APEX-007',
    circuit: 'Nürburgring Nordschleife',
    date: 'Tomorrow',
    slot: '13:00 - 15:30 (High Downforce)',
    vehicleName: 'Aston Martin Valkyrie AMR Pro',
    status: 'Pending Scrutineering',
    telemetryUplink: false,
    instructor: 'D. Bell (Le Mans Winner)',
    pitBox: 'Bay 11',
  },
  {
    id: 'BK-8905',
    memberName: 'Sarah Jenkins (VIP Applicant)',
    memberId: 'GUEST-REQ-44',
    circuit: 'Silverstone GP Circuit',
    date: 'Friday',
    slot: '11:00 - 12:30 (Trial Track Day)',
    vehicleName: 'Mercedes-AMG GT Black Series',
    status: 'Waitlisted',
    telemetryUplink: false,
    instructor: 'Track Marshal Staff',
    pitBox: 'Pit Box 05',
  },
];

export interface WelcomeToastData {
  name: string;
  id: string;
  tier: string;
  badge: string;
  allocatedFleetCount: number;
}

interface MemberContextType {
  isMember: boolean;
  isAdmin: boolean;
  memberProfile: MemberProfile;
  allProfiles: MemberProfile[];
  login: (idOrEmail?: string, password?: string) => Promise<boolean>;
  signUp: (name: string, idOrEmail: string, password?: string) => Promise<boolean>;
  logout: () => void;
  toggleMember: () => void;
  setMemberStatus: (status: boolean) => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  toastMessage: string | null;
  dismissToast: () => void;
  welcomeToast: WelcomeToastData | null;
  dismissWelcomeToast: () => void;
  // Race Control & Admin State
  trackCondition: TrackConditionType;
  setTrackCondition: (cond: TrackConditionType) => void;
  trackAnnouncement: string;
  setTrackAnnouncement: (announcement: string) => void;
  fleetVehicles: FleetVehicle[];
  updateVehicleStatus: (id: string, status: FleetVehicle['status'], location?: string) => void;
  addFleetVehicle: (vehicle: Omit<FleetVehicle, 'id'>) => void;
  deleteFleetVehicle: (id: string) => void;
  trackBookings: TrackBooking[];
  updateBookingStatus: (id: string, status: TrackBooking['status']) => void;
  addTrackBooking: (booking: Omit<TrackBooking, 'id'>) => void;
  deleteTrackBooking: (id: string) => void;
  updateMemberTrackDays: (memberId: string, deltaDays: number) => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

const STORAGE_AUTH_KEY = 'routeone_member_authenticated';
const STORAGE_PROFILE_KEY = 'routeone_member_profile_id';

export const MemberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMember, setIsMember] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_AUTH_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_PROFILE_KEY) || DEFAULT_MEMBER_PROFILE.id;
    } catch {
      return DEFAULT_MEMBER_PROFILE.id;
    }
  });

  const [customProfile, setCustomProfile] = useState<MemberProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [welcomeToast, setWelcomeToast] = useState<WelcomeToastData | null>(null);

  // Race Control & Circuit Operations state
  const [trackCondition, setTrackCondition] = useState<TrackConditionType>('GREEN');
  const [trackAnnouncement, setTrackAnnouncement] = useState<string>(
    'CIRCUIT STATUS // TRACK OPEN • SILVERSTONE GP DRY CONDITIONS'
  );
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>(INITIAL_FLEET_VEHICLES);
  const [trackBookings, setTrackBookings] = useState<TrackBooking[]>(INITIAL_TRACK_BOOKINGS);
  const [membersRoster, setMembersRoster] = useState<MemberProfile[]>(PRESET_MEMBER_PROFILES);

  // Derive current member profile
  const memberProfile: MemberProfile = customProfile || (
    membersRoster.find((p) => p.id === activeProfileId) || DEFAULT_MEMBER_PROFILE
  );

  // Determine if the current active session has Administrator / Race Control privileges
  const isAdmin = isMember && (
    memberProfile.id.toLowerCase() === 'admin' ||
    memberProfile.role.toLowerCase().includes('director') ||
    memberProfile.role.toLowerCase().includes('admin') ||
    memberProfile.tier.toLowerCase().includes('director')
  );

  const updateVehicleStatus = (id: string, status: FleetVehicle['status'], location?: string) => {
    setFleetVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status,
              ...(location ? { location } : {}),
            }
          : v
      )
    );
    setToastMessage(`SUPERCAR INVENTORY // ${id} status updated to [${status}].`);
  };

  const addFleetVehicle = (newCar: Omit<FleetVehicle, 'id'>) => {
    const id = `FLEET-${Math.floor(100 + Math.random() * 900)}`;
    const created: FleetVehicle = {
      ...newCar,
      id,
    };
    setFleetVehicles((prev) => [created, ...prev]);
    setToastMessage(`SUPERCAR INVENTORY // ${newCar.name} registered into paddock fleet.`);
  };

  const deleteFleetVehicle = (id: string) => {
    setFleetVehicles((prev) => prev.filter((v) => v.id !== id));
    setToastMessage(`SUPERCAR INVENTORY // Asset ${id} decommissioned from fleet.`);
  };

  const updateBookingStatus = (id: string, status: TrackBooking['status']) => {
    setTrackBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    setToastMessage(`BOOKING ROSTER // Session ${id} marked as [${status}].`);
  };

  const addTrackBooking = (booking: Omit<TrackBooking, 'id'>) => {
    const id = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const created: TrackBooking = {
      ...booking,
      id,
    };
    setTrackBookings((prev) => [created, ...prev]);
    setToastMessage(`BOOKING ROSTER // Circuit reservation ${id} approved and slotted.`);
  };

  const deleteTrackBooking = (id: string) => {
    setTrackBookings((prev) => prev.filter((b) => b.id !== id));
    setToastMessage(`BOOKING ROSTER // Booking ${id} cancelled and slot released.`);
  };

  const updateMemberTrackDays = (memberId: string, deltaDays: number) => {
    setMembersRoster((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, trackDaysRemaining: Math.max(0, m.trackDaysRemaining + deltaDays) }
          : m
      )
    );
    if (customProfile && customProfile.id === memberId) {
      setCustomProfile((prev) =>
        prev
          ? { ...prev, trackDaysRemaining: Math.max(0, prev.trackDaysRemaining + deltaDays) }
          : null
      );
    }
    setToastMessage(`MEMBER REGISTRY // Track allocations updated for ${memberId}.`);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_AUTH_KEY, String(isMember));
      if (activeProfileId) {
        localStorage.setItem(STORAGE_PROFILE_KEY, activeProfileId);
      }
    } catch (e) {
      console.warn('Unable to persist member auth state:', e);
    }
  }, [isMember, activeProfileId]);

  // Auto-dismiss standard toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Auto-dismiss sophisticated 'Welcome Back' toast strictly after 3.0 seconds
  useEffect(() => {
    if (welcomeToast) {
      const timer = setTimeout(() => {
        setWelcomeToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [welcomeToast]);

  const triggerWelcomeToast = (profile: MemberProfile) => {
    setWelcomeToast({
      name: profile.name,
      id: profile.id,
      tier: profile.tier,
      badge: profile.badge,
      allocatedFleetCount: profile.allocatedCars.length,
    });
  };

  const dismissWelcomeToast = () => setWelcomeToast(null);

  // Turns a server account into the profile shape the UI uses
  const applyAccount = (user: AuthUser, greet: boolean) => {
    const preset = membersRoster.find((p) => p.id.toLowerCase() === user.profileId.toLowerCase());
    if (preset) {
      setCustomProfile(null);
      setActiveProfileId(preset.id);
      if (greet) triggerWelcomeToast(preset);
    } else {
      const profile: MemberProfile = {
        id: user.profileId,
        name: user.name,
        tier: 'CLUB MEMBER',
        badge: 'Verified member',
        role: 'Club Member',
        joined: '2026',
        email: user.email,
        activeGarageSlots: 2,
        totalGarageSlots: 3,
        trackDaysRemaining: 12,
        conciergeCode: `R1-${user.profileId.slice(-4)}`,
        conciergePhone: '+44 1327 850 099',
        paddockAccessLevel: 'Full Paddock & Circuit Privileges',
        allocatedCars: [
          {
            name: 'RouteOne R1 Concept',
            location: 'Silverstone HQ • Pit Box 01',
            status: 'Allocated & Ready',
            fuel: '100% Race Octane',
            tires: 'Michelin Cup 2R',
            telemetryId: 'MOTEC-NEW-01',
          },
        ],
      };
      setCustomProfile(profile);
      setActiveProfileId(profile.id);
      if (greet) triggerWelcomeToast(profile);
    }
    setIsMember(true);
  };

  // On load, confirm the saved session with the server; log out if it is missing or expired
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await apiMe();
      if (cancelled) return;
      if (result && result !== 'offline') applyAccount(result, false);
      else if (result === null) {
        setAuthToken(null);
        setIsMember(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Checks the login ID and password with the server. Throws with a readable message if wrong. */
  const login = async (idOrEmail?: string, password?: string): Promise<boolean> => {
    const { token, user } = await apiLogin(idOrEmail || '', password || '');
    setAuthToken(token);
    applyAccount(user, true);
    setIsLoginModalOpen(false);
    return true;
  };

  const signUp = async (name: string, idOrEmail: string, password?: string): Promise<boolean> => {
    const { token, user } = await apiSignup(name, idOrEmail, password || '');
    setAuthToken(token);
    applyAccount(user, true);
    setIsLoginModalOpen(false);
    return true;
  };

  const logout = () => {
    apiLogout();
    setIsMember(false);
    setCustomProfile(null);
    setToastMessage('You have been logged out.');
    setWelcomeToast(null);
    setIsLoginModalOpen(false);
  };

  const toggleMember = () => {
    if (isMember) {
      logout();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const setMemberStatus = (status: boolean) => {
    if (status) {
      setIsLoginModalOpen(true); // becoming a member always goes through the login form
    } else {
      logout();
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const dismissToast = () => setToastMessage(null);

  return (
    <MemberContext.Provider
      value={{
        isMember,
        isAdmin,
        memberProfile,
        allProfiles: membersRoster,
        login,
        signUp,
        logout,
        toggleMember,
        setMemberStatus,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        toastMessage,
        dismissToast,
        welcomeToast,
        dismissWelcomeToast,
        trackCondition,
        setTrackCondition,
        trackAnnouncement,
        setTrackAnnouncement,
        fleetVehicles,
        updateVehicleStatus,
        addFleetVehicle,
        deleteFleetVehicle,
        trackBookings,
        updateBookingStatus,
        addTrackBooking,
        deleteTrackBooking,
        updateMemberTrackDays,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = (): MemberContextType => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMember must be used within a MemberProvider');
  }
  return context;
};
