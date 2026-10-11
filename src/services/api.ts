import {
  Vehicle,
  ExperienceService,
  CustomerInquiryDemo,
  VehicleAvailabilityRecord,
  FleetAvailabilityResponse,
} from '../types';

// Fallback in-memory cache to guarantee instant resilience
let inMemoryCustomers: CustomerInquiryDemo[] = [];

export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const res = await fetch('/api/vehicles');
    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('API /api/vehicles unavailable, trying static fallback:', err);
  }

  try {
    const res = await fetch('/data/vehicles.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Fallback fetch for vehicles:', err);
    const direct = await import('../../public/data/vehicles.json');
    return direct.default as Vehicle[];
  }
}

export async function fetchExperiences(): Promise<ExperienceService[]> {
  try {
    const res = await fetch('/api/experiences');
    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('API /api/experiences unavailable, trying static fallback:', err);
  }

  try {
    const res = await fetch('/data/experiences.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Fallback fetch for experiences:', err);
    const direct = await import('../../public/data/experiences.json');
    return direct.default as ExperienceService[];
  }
}

// ---------------------------------------------------------------
// Auth session + error helpers
// ---------------------------------------------------------------
const TOKEN_KEY = 'routeone_session_token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
export function setAuthToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}
function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getAuthToken();
  return token && token !== 'offline' ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

/** An error the server explained (validation, login, permission, rate limit). */
export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;
  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** True when the reply came from our API (static hosts answer /api/* with HTML or 404 pages). */
function isApiResponse(res: Response) {
  return (res.headers.get('content-type') || '').includes('application/json');
}
async function toApiError(res: Response) {
  const body = await res.json().catch(() => ({}));
  return new ApiError(body.error || `Request failed (${res.status}).`, res.status, body.errors);
}

export interface AuthUser {
  login: string;
  name: string;
  email: string;
  role: 'member' | 'admin';
  profileId: string;
}

// Used only when there is no API server (static hosting): the two demo accounts still work.
const OFFLINE_DEMO: Record<string, AuthUser & { password: string }> = {
  user: { login: 'user', name: 'Member User', email: 'user@routeone.club', role: 'member', profileId: 'user', password: 'user' },
  admin: { login: 'admin', name: 'Marcus Vance', email: 'director@routeone.club', role: 'admin', profileId: 'admin', password: 'admin' },
};

export async function apiLogin(login: string, password: string): Promise<{ token: string; user: AuthUser }> {
  let res: Response | null = null;
  try {
    res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
  } catch {
    res = null;
  }
  if (res && isApiResponse(res)) {
    if (!res.ok) throw await toApiError(res);
    return res.json();
  }
  const demo = Object.values(OFFLINE_DEMO).find(
    (d) => d.login === login.trim().toLowerCase() || d.email === login.trim().toLowerCase()
  );
  if (!demo || demo.password !== password) throw new ApiError('Wrong login ID or password.', 401);
  const { password: _pw, ...user } = demo;
  return { token: 'offline', user };
}

export async function apiSignup(name: string, login: string, password: string): Promise<{ token: string; user: AuthUser }> {
  let res: Response | null = null;
  try {
    res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, login, password }),
    });
  } catch {
    res = null;
  }
  if (res && isApiResponse(res)) {
    if (!res.ok) throw await toApiError(res);
    return res.json();
  }
  if (password.length < 8) throw new ApiError('Use at least 8 characters for your password.', 400);
  const clean = login.trim().toLowerCase();
  return {
    token: 'offline',
    user: {
      login: clean,
      name: name.trim(),
      email: clean.includes('@') ? clean : `${clean}@members.routeone.club`,
      role: 'member',
      profileId: `R1-${clean.replace(/[^a-z0-9]/g, '').slice(0, 10).toUpperCase()}`,
    },
  };
}

/** Confirms a saved session with the server. Returns null when it has expired. */
export async function apiMe(): Promise<AuthUser | null | 'offline'> {
  const token = getAuthToken();
  if (!token) return null;
  if (token === 'offline') return 'offline';
  try {
    const res = await fetch('/api/auth/me', { headers: authHeaders() });
    if (!isApiResponse(res)) return 'offline';
    if (!res.ok) return null;
    return (await res.json()).user as AuthUser;
  } catch {
    return 'offline';
  }
}

export async function apiLogout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST', headers: authHeaders() });
  } catch {
    /* ignore */
  }
  setAuthToken(null);
}

export async function fetchCustomerInquiries(): Promise<CustomerInquiryDemo[]> {
  try {
    const res = await fetch('/api/customers', { headers: authHeaders() });
    if (res.ok && isApiResponse(res)) {
      const json = await res.json();
      const records = json.data || json;
      if (inMemoryCustomers.length > 0) {
        // Merge session records not yet in backend
        const existingIds = new Set(records.map((r: any) => r.id));
        const unpersisted = inMemoryCustomers.filter((r) => !existingIds.has(r.id));
        return [...unpersisted, ...records];
      }
      return records;
    }
  } catch (err) {
    console.warn('API /api/customers unavailable, trying static fallback:', err);
  }

  // Static fallback (public copy is privacy-masked)
  try {
    const res = await fetch('/data/customers.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: CustomerInquiryDemo[] = await res.json();
    return [...inMemoryCustomers, ...data];
  } catch (err) {
    console.warn('Fallback fetch for customers:', err);
    const direct = await import('../../public/data/customers.json');
    const base = direct.default as CustomerInquiryDemo[];
    return [...inMemoryCustomers, ...base];
  }
}

/** Admin inbox: full records. Throws if the admin session is missing or expired. */
export async function fetchAdminInquiries(): Promise<CustomerInquiryDemo[]> {
  let res: Response | null = null;
  try {
    res = await fetch('/api/customers', { headers: authHeaders() });
  } catch {
    res = null;
  }
  if (res && isApiResponse(res)) {
    if (!res.ok) throw await toApiError(res);
    const json = await res.json();
    if (json.access !== 'full') {
      throw new ApiError('Your admin session has expired. Log out and log in again.', 401);
    }
    return json.data as CustomerInquiryDemo[];
  }
  // No server (static hosting): show the masked public copy plus this session's submissions
  return fetchCustomerInquiries();
}

export async function submitInquiry(
  inquiry: Omit<CustomerInquiryDemo, 'id' | 'status'> & { channel?: string }
): Promise<{ success: boolean; data: CustomerInquiryDemo; routingHop?: string }> {
  const payload = { ...inquiry, channel: inquiry.channel || getCampaignSource() };
  let res: Response | null = null;
  try {
    res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('POST /api/inquiries unreachable, keeping the request in this session:', err);
  }

  if (res && isApiResponse(res)) {
    // The server checked the form; show its message (bad email, past date, too many requests…)
    if (!res.ok) throw await toApiError(res);
    const result = await res.json();
    const record: CustomerInquiryDemo = result.record;
    inMemoryCustomers.unshift(record);
    return {
      success: true,
      data: record,
      routingHop: 'Client -> Express API Gateway -> Data Access Layer -> Backend Storage',
    };
  }

  // No API server (static hosting): keep it in this browser session
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newRecord: CustomerInquiryDemo = {
    id: Date.now(),
    name: inquiry.name,
    email: inquiry.email,
    preferredExperience: inquiry.preferredExperience,
    vehicleInterest: inquiry.vehicleInterest,
    date: inquiry.date,
    status: 'Inquiry',
    location: inquiry.location || 'Silverstone GP Proving Ground',
    createdAt: new Date().toISOString(),
    channel: payload.channel,
    subject: inquiry.subject,
    message: inquiry.message,
  };

  inMemoryCustomers.unshift(newRecord);
  return {
    success: true,
    data: newRecord,
    routingHop: 'Client -> Browser In-Memory Cache (Fallback Mode)',
  };
}

// ---------------------------------------------------------------
// Campaign source tracking (?source=email, ?source=instagram …)
// ---------------------------------------------------------------
export const CAMPAIGN_CHANNELS = ['website', 'email', 'instagram', 'facebook', 'tiktok', 'youtube'] as const;
export type CampaignChannel = (typeof CAMPAIGN_CHANNELS)[number];
export const CHANNEL_LABEL: Record<CampaignChannel, string> = {
  website: 'Website',
  email: 'Email campaign',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};
const SOURCE_KEY = 'routeone_campaign_source';

/** Call once on load: remembers which campaign link brought the visitor here. */
export function captureCampaignSource() {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = (params.get('source') || params.get('utm_source') || '').toLowerCase();
    if ((CAMPAIGN_CHANNELS as readonly string[]).includes(raw)) sessionStorage.setItem(SOURCE_KEY, raw);
  } catch {
    /* ignore */
  }
}
export function setCampaignSource(channel: CampaignChannel) {
  try {
    sessionStorage.setItem(SOURCE_KEY, channel);
  } catch {
    /* ignore */
  }
}
export function getCampaignSource(): CampaignChannel {
  try {
    const v = sessionStorage.getItem(SOURCE_KEY) as CampaignChannel | null;
    return v && (CAMPAIGN_CHANNELS as readonly string[]).includes(v) ? v : 'website';
  } catch {
    return 'website';
  }
}
export function campaignLink(channel: CampaignChannel) {
  return `${window.location.origin}/?source=${channel}`;
}

export async function fetchVehicleAvailability(): Promise<FleetAvailabilityResponse> {
  try {
    const res = await fetch('/api/vehicles/availability');
    if (res.ok) {
      const json: FleetAvailabilityResponse = await res.json();
      return json;
    }
  } catch (err) {
    console.warn('API /api/vehicles/availability unavailable, building dynamic client fallback:', err);
  }

  // Resilient fallback logic for client-side evaluation
  const vehicles = await fetchVehicles();
  const inquiries = await fetchCustomerInquiries();

  const privateCollectionSet = new Set([
    'mclaren-mp4-4',
    'ferrari-f2004',
    'williams-fw14b',
    'ferrari-250-gto',
    'mclaren-f1',
    'bugatti-chiron',
    'koenigsegg-jesko',
    'pagani-huayra-r',
    'aston-martin-valkyrie-amr',
    'lamborghini-aventador-svj',
    'ferrari-sf24',
  ]);

  const availabilityMap: Record<string, VehicleAvailabilityRecord> = {};
  let countAvailable = 0;
  let countPrivate = 0;

  vehicles.forEach((vehicle, idx) => {
    const activeRes = inquiries.filter((inq) => {
      const target = (inq.vehicleInterest || '').toLowerCase();
      return (
        target.includes(vehicle.id.toLowerCase()) ||
        target.includes(vehicle.name.toLowerCase()) ||
        vehicle.name.toLowerCase().includes(target)
      );
    }).length;

    const isDesignatedPrivate = privateCollectionSet.has(vehicle.id);
    const isInPrivateCollection = isDesignatedPrivate || activeRes >= 2;
    const status = isInPrivateCollection ? 'In Private Collection' : 'Currently Available';

    if (status === 'Currently Available') {
      countAvailable++;
    } else {
      countPrivate++;
    }

    const availableSlots = status === 'Currently Available' ? (activeRes > 0 ? 1 : ((idx % 3) === 0 ? 1 : 2)) : 0;
    const urgencyLabel = status === 'Currently Available'
      ? (availableSlots === 1 ? 'Only 1 Track Allocation Left' : '2 Track Allocations Open')
      : 'Allocated: Private Vault';

    availabilityMap[vehicle.id] = {
      vehicleId: vehicle.id,
      status,
      urgencyLabel,
      activeReservationsCount: activeRes,
      availableSlots,
      vaultLocation: status === 'In Private Collection' ? 'Geneva Private Vault' : undefined,
      lastUpdated: new Date().toISOString(),
    };
  });

  return {
    source: 'CLIENT_FALLBACK_ALLOCATION_MATRIX',
    lastSync: new Date().toISOString(),
    summary: {
      total: vehicles.length,
      currentlyAvailable: countAvailable,
      inPrivateCollection: countPrivate,
    },
    availability: availabilityMap,
  };
}

// ---------------------------------------------------------------
// Inquiry pipeline helpers (admin inbox + member "My bookings")
// ---------------------------------------------------------------
export type InquiryStatus = CustomerInquiryDemo['status'];

/** Friendly labels shown in the UI for each stored status value. */
export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  Inquiry: 'New',
  'In Review': 'Contacted',
  Confirmed: 'Booked',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
};
export const INQUIRY_STATUS_ORDER: InquiryStatus[] = ['Inquiry', 'In Review', 'Confirmed', 'Completed', 'Cancelled'];

/** GET /api/customers?email= — only one person's inquiries (needs their login). */
export async function fetchInquiriesByEmail(email: string): Promise<CustomerInquiryDemo[]> {
  const target = email.trim().toLowerCase();
  let res: Response | null = null;
  try {
    res = await fetch(`/api/customers?email=${encodeURIComponent(target)}`, { headers: authHeaders() });
  } catch {
    res = null;
  }
  if (res && isApiResponse(res)) {
    if (!res.ok) throw await toApiError(res);
    const json = await res.json();
    return (json.data || json) as CustomerInquiryDemo[];
  }
  // No server: only this session's own submissions are known
  return inMemoryCustomers.filter((c) => String(c.email).toLowerCase() === target);
}

/** PATCH /api/inquiries/:id — change an inquiry's status (admin, or a member cancelling their own). */
export async function updateInquiryStatus(id: number, status: InquiryStatus): Promise<CustomerInquiryDemo> {
  let res: Response | null = null;
  try {
    res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status }),
    });
  } catch {
    res = null;
  }
  if (res && isApiResponse(res)) {
    if (!res.ok) throw await toApiError(res);
    return (await res.json()).record as CustomerInquiryDemo;
  }
  // No server: update this session's copy so the screen reflects the change
  const local = inMemoryCustomers.find((c) => c.id === id);
  if (!local) throw new ApiError('Changes can only be saved when the API server is running.', 503);
  local.status = status;
  return local;
}

/** PATCH /api/vehicles/:id/availability — admin sets a car as available or in the private collection. */
export async function updateVehicleAvailability(
  id: string,
  status: 'Currently Available' | 'In Private Collection'
): Promise<void> {
  let res: Response | null = null;
  try {
    res = await fetch(`/api/vehicles/${encodeURIComponent(id)}/availability`, {
      method: 'PATCH',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status }),
    });
  } catch {
    res = null;
  }
  if (res && isApiResponse(res)) {
    if (!res.ok) throw await toApiError(res);
    return;
  }
  throw new ApiError('Availability can only be changed when the API server is running.', 503);
}
