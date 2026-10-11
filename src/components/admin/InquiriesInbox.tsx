import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw, Download, ChevronDown, Inbox, Mail, Calendar, Car, Share2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import {
  fetchAdminInquiries,
  updateInquiryStatus,
  INQUIRY_STATUS_LABEL,
  INQUIRY_STATUS_ORDER,
  InquiryStatus,
  CHANNEL_LABEL,
  CampaignChannel,
} from '../../services/api';
import type { CustomerInquiryDemo } from '../../types';

type Filter = 'ALL' | InquiryStatus;

const STATUS_STYLE: Record<InquiryStatus, { light: string; dark: string; dot: string }> = {
  Inquiry: { light: 'bg-[#D71920]/10 text-[#B5141A] border-[#D71920]/25', dark: 'bg-[#D71920]/15 text-[#FF6B6F] border-[#D71920]/35', dot: 'bg-[#D71920]' },
  'In Review': { light: 'bg-amber-50 text-amber-800 border-amber-200', dark: 'bg-amber-400/10 text-amber-300 border-amber-400/25', dot: 'bg-amber-500' },
  Confirmed: { light: 'bg-emerald-50 text-emerald-800 border-emerald-200', dark: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25', dot: 'bg-emerald-500' },
  Completed: { light: 'bg-black/[0.04] text-[#3E4347] border-black/10', dark: 'bg-white/[0.06] text-[#C9CDCE] border-white/10', dot: 'bg-[#8C9399]' },
  Cancelled: { light: 'bg-black/[0.03] text-[#7F878D] border-black/10', dark: 'bg-white/[0.04] text-[#85898A] border-white/10', dot: 'bg-[#B5BBBF]' },
};

function formatDate(value?: string) {
  if (!value) return '—';
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(value?: string) {
  if (!value) return '';
  const diff = Date.now() - new Date(value).getTime();
  if (Number.isNaN(diff)) return '';
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? 'yesterday' : `${days} days ago`;
}

function toCsv(rows: CustomerInquiryDemo[]) {
  const cols: [string, (r: CustomerInquiryDemo) => unknown][] = [
    ['ID', (r) => r.id],
    ['Name', (r) => r.name],
    ['Email', (r) => r.email],
    ['Experience', (r) => r.preferredExperience],
    ['Car / subject', (r) => r.vehicleInterest],
    ['Preferred date', (r) => r.date],
    ['Status', (r) => INQUIRY_STATUS_LABEL[r.status] || r.status],
    ['Came from', (r) => CHANNEL_LABEL[(r.channel || 'website') as CampaignChannel] || r.channel],
    ['Received', (r) => r.createdAt || ''],
    ['Message', (r) => r.message || ''],
  ];
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [cols.map(([h]) => esc(h)).join(','), ...rows.map((r) => cols.map(([, f]) => esc(f(r))).join(','))].join('\n');
}

export const InquiriesInbox: React.FC = () => {
  const { isGarageLight } = useTheme();
  const [rows, setRows] = useState<CustomerInquiryDemo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');
  const [openId, setOpenId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const data = await fetchAdminInquiries();
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime() || b.id - a.id
      );
      setRows(sorted);
      setError(null);
      setLastSync(new Date());
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'Inquiries could not be loaded. Check that the server is running, then refresh.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load, then refresh every 15 s so new form submissions appear on their own
  useEffect(() => {
    load();
    const t = setInterval(() => load(true), 15000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: rows.length };
    INQUIRY_STATUS_ORDER.forEach((s) => (c[s] = rows.filter((r) => r.status === s).length));
    return c;
  }, [rows]);

  const byExperience = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => {
      const k = (r.preferredExperience || 'Other').replace(/^\d+\s*/, '');
      m.set(k, (m.get(k) || 0) + 1);
    });
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [rows]);

  // Which campaign brought each inquiry (website, email, instagram…)
  const bySource = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => {
      const k = r.channel || 'website';
      m.set(k, (m.get(k) || 0) + 1);
    });
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);
  const booked = (channel: string) =>
    rows.filter((r) => (r.channel || 'website') === channel && (r.status === 'Confirmed' || r.status === 'Completed')).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== 'ALL' && r.status !== filter) return false;
      if (!q) return true;
      return [r.name, r.email, r.vehicleInterest, r.preferredExperience, r.subject, r.message]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [rows, filter, query]);

  const changeStatus = async (row: CustomerInquiryDemo, status: InquiryStatus) => {
    if (row.status === status) return;
    setSavingId(row.id);
    const prev = row.status;
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status } : r))); // optimistic
    try {
      await updateInquiryStatus(row.id, status);
      setToast(`${row.name} marked as ${INQUIRY_STATUS_LABEL[status]}`);
    } catch (err) {
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status: prev } : r)));
      setToast(err instanceof Error ? err.message : 'Status could not be saved. Try again.');
    } finally {
      setSavingId(null);
    }
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(visible)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `routeone-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const card = isGarageLight ? 'bg-white border-black/10' : 'bg-[#111415] border-white/10';
  const muted = isGarageLight ? 'text-[#5F656B]' : 'text-[#8E9394]';
  const strong = isGarageLight ? 'text-[#101214]' : 'text-[#F4F3EF]';
  const maxExp = byExperience[0]?.[1] || 1;

  const tiles: { key: Filter; label: string; hint: string }[] = [
    { key: 'Inquiry', label: 'New', hint: 'Waiting for a reply' },
    { key: 'In Review', label: 'Contacted', hint: 'Concierge replied' },
    { key: 'Confirmed', label: 'Booked', hint: 'Session confirmed' },
    { key: 'ALL', label: 'All inquiries', hint: 'Since launch' },
  ];

  return (
    <div className="space-y-5" id="admin-inquiries-inbox">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className={`font-heading text-2xl ${strong}`}>Inquiries</h2>
          <p className={`text-sm mt-1 ${muted}`}>
            Everything sent through the contact and booking forms, loaded live from{' '}
            <code className={`text-[12px] px-1.5 py-0.5 rounded ${isGarageLight ? 'bg-black/[0.05]' : 'bg-white/10'}`}>GET /api/customers</code>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${muted} hidden md:inline`}>
            {lastSync ? `Updated ${lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
          </span>
          <button
            onClick={() => load()}
            className={`h-9 px-3 border text-sm flex items-center gap-2 cursor-pointer transition-colors ${card} ${strong} hover:border-[#D71920]/50`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportCsv}
            disabled={!visible.length}
            className="h-9 px-3 bg-[#D71920] hover:bg-[#B5141A] disabled:opacity-50 text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary tiles + experience breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tiles.map((t) => {
          const active = filter === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setFilter(active && t.key !== 'ALL' ? 'ALL' : t.key)}
              aria-pressed={active}
              className={`text-left p-4 border transition-all cursor-pointer flex flex-col justify-between ${card} ${
                active ? 'ring-2 ring-[#D71920] border-transparent' : 'hover:border-[#D71920]/40'
              }`}
            >
              <span className={`text-sm ${muted} flex items-center gap-2`}>
                {t.key !== 'ALL' && <span className={`w-2 h-2 rounded-full ${STATUS_STYLE[t.key as InquiryStatus].dot}`} />}
                {t.label}
              </span>
              <span className={`block font-heading text-3xl mt-1 ${strong}`}>{counts[t.key] ?? 0}</span>
              <span className={`block text-xs mt-0.5 ${muted}`}>{t.hint}</span>
            </button>
          );
        })}
        <div className={`col-span-2 p-4 border ${card}`}>
          <span className={`text-sm ${muted}`}>Most requested</span>
          <ul className="mt-2 space-y-2">
            {byExperience.map(([name, n]) => (
              <li key={name} className="text-xs">
                <div className="flex justify-between mb-1">
                  <span className={strong}>{name}</span>
                  <span className={muted}>{n}</span>
                </div>
                <div className={`h-1.5 rounded-full ${isGarageLight ? 'bg-black/[0.06]' : 'bg-white/10'}`}>
                  <div className="h-1.5 rounded-full bg-[#D71920]" style={{ width: `${(n / maxExp) * 100}%` }} />
                </div>
              </li>
            ))}
            {!byExperience.length && <li className={`text-xs ${muted}`}>No data yet</li>}
          </ul>
        </div>
        <div className={`col-span-2 p-4 border ${card}`}>
          <div className="flex items-baseline justify-between">
            <span className={`text-sm ${muted}`}>Where inquiries come from</span>
            <span className={`text-xs ${muted}`}>inquiries · booked</span>
          </div>
          <ul className="mt-2 space-y-2">
            {bySource.map(([channel, n]) => (
              <li key={channel} className="text-xs">
                <div className="flex justify-between mb-1">
                  <span className={strong}>{CHANNEL_LABEL[channel as CampaignChannel] || channel}</span>
                  <span className={muted}>
                    {n} · {booked(channel)}
                  </span>
                </div>
                <div className={`h-1.5 rounded-full ${isGarageLight ? 'bg-black/[0.06]' : 'bg-white/10'}`}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${(n / (bySource[0]?.[1] || 1)) * 100}%`, background: isGarageLight ? '#2B3035' : '#C9CDCE' }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <label className="relative flex-1 max-w-md">
          <span className="sr-only">Search inquiries</span>
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${muted}`} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, car or message"
            className={`w-full h-10 pl-9 pr-3 border text-sm outline-none focus:border-[#D71920] ${card} ${strong}`}
          />
        </label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
          {(['ALL', ...INQUIRY_STATUS_ORDER] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`h-8 px-3 text-xs font-medium border cursor-pointer transition-colors ${
                filter === f
                  ? 'bg-[#D71920] border-[#D71920] text-white'
                  : `${card} ${muted} hover:border-[#D71920]/40`
              }`}
            >
              {f === 'ALL' ? 'All' : INQUIRY_STATUS_LABEL[f]} <span className="opacity-70">{counts[f] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className={`border overflow-hidden ${card}`}>
        <div
          className={`hidden md:grid grid-cols-[1.4fr_1.3fr_0.8fr_0.8fr_150px] gap-4 px-5 py-3 text-xs font-medium border-b ${muted} ${
            isGarageLight ? 'border-black/[0.07] bg-black/[0.015]' : 'border-white/[0.07] bg-white/[0.02]'
          }`}
        >
          <span>Customer</span>
          <span>Interested in</span>
          <span>Preferred date</span>
          <span>Received</span>
          <span>Status</span>
        </div>

        {error && <p className="px-5 py-8 text-sm text-[#D71920]">{error}</p>}
        {loading && !rows.length && !error && <p className={`px-5 py-8 text-sm ${muted}`}>Loading inquiries…</p>}
        {!loading && !error && !visible.length && (
          <div className="px-5 py-12 text-center">
            <Inbox className={`w-8 h-8 mx-auto mb-2 ${muted}`} />
            <p className={`text-sm ${strong}`}>No inquiries match these filters.</p>
            <button
              onClick={() => {
                setQuery('');
                setFilter('ALL');
              }}
              className="mt-2 text-sm text-[#D71920] hover:underline cursor-pointer"
            >
              Clear search and filters
            </button>
          </div>
        )}

        <ul>
          {visible.map((r) => {
            const open = openId === r.id;
            const st = STATUS_STYLE[r.status] || STATUS_STYLE.Inquiry;
            return (
              <li
                key={r.id}
                className={`border-b last:border-b-0 ${isGarageLight ? 'border-black/[0.06]' : 'border-white/[0.06]'}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1.3fr_0.8fr_0.8fr_150px] gap-2 md:gap-4 px-5 py-4 items-center">
                  <button
                    onClick={() => setOpenId(open ? null : r.id)}
                    aria-expanded={open}
                    className="text-left flex items-start gap-2 cursor-pointer min-w-0"
                  >
                    <ChevronDown
                      className={`w-4 h-4 mt-0.5 shrink-0 transition-transform ${muted} ${open ? 'rotate-180' : ''}`}
                    />
                    <span className="min-w-0">
                      <span className={`block text-sm font-semibold truncate ${strong}`}>{r.name}</span>
                      <span className={`block text-xs truncate ${muted}`}>{r.email}</span>
                    </span>
                  </button>
                  <div className="min-w-0 pl-6 md:pl-0">
                    <span className={`block text-sm truncate ${strong}`}>
                      {(r.preferredExperience || '').replace(/^\d+\s*/, '')}
                    </span>
                    <span className={`block text-xs truncate ${muted}`}>{r.vehicleInterest}</span>
                  </div>
                  <span className={`text-sm pl-6 md:pl-0 ${strong}`}>
                    <span className={`md:hidden ${muted}`}>Date: </span>
                    {formatDate(r.date)}
                  </span>
                  <span className={`text-xs pl-6 md:pl-0 ${muted}`}>{timeAgo(r.createdAt) || '—'}</span>
                  <div className="pl-6 md:pl-0">
                    <label className="sr-only" htmlFor={`status-${r.id}`}>
                      Status for {r.name}
                    </label>
                    <div className="relative inline-flex items-center">
                      <span className={`absolute left-2.5 w-2 h-2 rounded-full pointer-events-none ${st.dot}`} />
                      <select
                        id={`status-${r.id}`}
                        value={r.status}
                        disabled={savingId === r.id}
                        onChange={(e) => changeStatus(r, e.target.value as InquiryStatus)}
                        className={`appearance-none h-8 pl-6 pr-7 text-xs font-medium border cursor-pointer outline-none focus:ring-2 focus:ring-[#D71920]/40 ${
                          isGarageLight ? st.light : st.dark
                        }`}
                      >
                        {INQUIRY_STATUS_ORDER.map((s) => (
                          <option key={s} value={s}>
                            {INQUIRY_STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2 pointer-events-none opacity-60" />
                    </div>
                  </div>
                </div>

                {open && (
                  <div
                    className={`mx-5 mb-4 p-4 text-sm grid sm:grid-cols-3 gap-4 rounded-lg ${
                      isGarageLight ? 'bg-black/[0.025]' : 'bg-white/[0.03]'
                    }`}
                  >
                    <div className="sm:col-span-2">
                      <span className={`text-xs ${muted}`}>{r.subject ? `Subject: ${r.subject}` : 'Message'}</span>
                      <p className={`mt-1 leading-relaxed ${strong}`}>{r.message || 'No message was included.'}</p>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <p className={`flex items-center gap-2 ${muted}`}>
                        <Mail className="w-3.5 h-3.5" />
                        <a href={`mailto:${r.email}`} className="text-[#D71920] hover:underline">
                          Reply by email
                        </a>
                      </p>
                      <p className={`flex items-center gap-2 ${muted}`}>
                        <Calendar className="w-3.5 h-3.5" /> Received {formatDate(r.createdAt)}
                      </p>
                      <p className={`flex items-center gap-2 ${muted}`}>
                        <Share2 className="w-3.5 h-3.5" /> Came from{' '}
                        {CHANNEL_LABEL[(r.channel || 'website') as CampaignChannel] || r.channel}
                      </p>
                      <p className={`flex items-center gap-2 ${muted}`}>
                        <Car className="w-3.5 h-3.5" /> {r.location}
                      </p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-[#101214] text-white text-sm shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default InquiriesInbox;
