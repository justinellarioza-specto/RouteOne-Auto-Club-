import React, { useCallback, useEffect, useState } from 'react';
import { CalendarDays, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchInquiriesByEmail, updateInquiryStatus, INQUIRY_STATUS_LABEL } from '../services/api';
import type { CustomerInquiryDemo } from '../types';

interface MyBookingsProps {
  email: string;
  onBookNew?: () => void;
}

const PILL: Record<CustomerInquiryDemo['status'], string> = {
  Inquiry: 'bg-[#D71920]/10 text-[#C0151C] border-[#D71920]/25',
  'In Review': 'bg-amber-400/15 text-amber-700 border-amber-400/30',
  Confirmed: 'bg-emerald-500/12 text-emerald-700 border-emerald-500/30',
  Completed: 'bg-black/[0.05] text-[#565C62] border-black/10',
  Cancelled: 'bg-black/[0.04] text-[#8C9399] border-black/10',
};
const PILL_DARK: Record<CustomerInquiryDemo['status'], string> = {
  Inquiry: 'bg-[#D71920]/15 text-[#FF6B6F] border-[#D71920]/35',
  'In Review': 'bg-amber-400/10 text-amber-300 border-amber-400/25',
  Confirmed: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25',
  Completed: 'bg-white/[0.06] text-[#C9CDCE] border-white/10',
  Cancelled: 'bg-white/[0.04] text-[#85898A] border-white/10',
};

function nextStep(b: CustomerInquiryDemo) {
  switch (b.status) {
    case 'Inquiry':
      return 'Received. Our concierge replies within 24 hours.';
    case 'In Review':
      return 'We replied by email. Check your inbox to confirm details.';
    case 'Confirmed':
      return `You're booked. See you at ${b.location || 'the circuit'}.`;
    case 'Completed':
      return 'Done. Thanks for driving with us.';
    case 'Cancelled':
      return 'You cancelled this request.';
    default:
      return '';
  }
}

function formatDate(value?: string) {
  if (!value) return 'Date to be confirmed';
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export const MyBookings: React.FC<MyBookingsProps> = ({ email, onBookNew }) => {
  const { isGarageLight } = useTheme();
  const [items, setItems] = useState<CustomerInquiryDemo[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInquiriesByEmail(email);
      data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime() || b.id - a.id);
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bookings could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = async (b: CustomerInquiryDemo) => {
    setBusyId(b.id);
    try {
      await updateInquiryStatus(b.id, 'Cancelled');
      setItems((xs) => xs.map((x) => (x.id === b.id ? { ...x, status: 'Cancelled' } : x)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That request could not be cancelled.');
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  };

  const muted = isGarageLight ? 'text-[#5F656B]' : 'text-[#8E9394]';
  const line = isGarageLight ? 'border-black/10' : 'border-white/10';
  const active = items.filter((b) => b.status !== 'Cancelled' && b.status !== 'Completed').length;

  return (
    <section aria-labelledby="my-bookings-title" className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 id="my-bookings-title" className="font-heading text-base">
          My bookings
        </h3>
        <div className="flex items-center gap-3">
          <span className={`text-xs ${muted}`}>{loading ? 'Loading…' : `${active} active`}</span>
          <button onClick={load} aria-label="Refresh bookings" className={`cursor-pointer ${muted} hover:text-[#D71920]`}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-[#D71920]" role="alert">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <div className={`p-5 border text-center ${line}`}>
          <CalendarDays className={`w-6 h-6 mx-auto mb-2 ${muted}`} />
          <p className="text-sm font-medium">No bookings yet</p>
          <p className={`text-xs mt-1 ${muted}`}>Requests you send while logged in will show up here.</p>
        </div>
      )}

      <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {items.map((b) => {
          const canCancel = b.status === 'Inquiry' || b.status === 'In Review';
          const experience = (b.preferredExperience || '').replace(/^\d+\s*/, '');
          return (
            <li key={b.id} className={`p-3.5 border ${line} ${b.status === 'Cancelled' ? 'opacity-70' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{experience}</p>
                  <p className={`text-xs truncate ${muted}`}>{b.vehicleInterest}</p>
                </div>
                <span
                  className={`shrink-0 px-2 py-0.5 text-[11px] font-medium border ${
                    isGarageLight ? PILL[b.status] : PILL_DARK[b.status]
                  }`}
                >
                  {INQUIRY_STATUS_LABEL[b.status]}
                </span>
              </div>
              <p className={`mt-2 text-xs flex items-center gap-1.5 ${muted}`}>
                <CalendarDays className="w-3.5 h-3.5" />
                {formatDate(b.date)}
              </p>
              <p className="mt-1 text-xs">{nextStep(b)}</p>

              {canCancel &&
                (confirmId === b.id ? (
                  <div className="mt-2.5 flex items-center gap-2 text-xs">
                    <span className={muted}>Cancel this request?</span>
                    <button
                      onClick={() => cancel(b)}
                      disabled={busyId === b.id}
                      className="px-2.5 py-1 bg-[#D71920] text-white font-medium cursor-pointer disabled:opacity-60"
                    >
                      {busyId === b.id ? 'Cancelling…' : 'Yes, cancel'}
                    </button>
                    <button onClick={() => setConfirmId(null)} className={`px-2.5 py-1 border cursor-pointer ${line}`}>
                      Keep it
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(b.id)}
                    className={`mt-2 text-xs underline underline-offset-2 cursor-pointer ${muted} hover:text-[#D71920]`}
                  >
                    Cancel request
                  </button>
                ))}
            </li>
          );
        })}
      </ul>

      {onBookNew && (
        <button
          onClick={onBookNew}
          className="w-full py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white text-sm font-semibold cursor-pointer"
        >
          Book a new session
        </button>
      )}
    </section>
  );
};

export default MyBookings;
