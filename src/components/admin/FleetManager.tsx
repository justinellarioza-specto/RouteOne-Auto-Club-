import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { fetchVehicles, fetchVehicleAvailability, updateVehicleAvailability } from '../../services/api';
import type { Vehicle, VehicleAvailabilityRecord } from '../../types';

type Status = 'Currently Available' | 'In Private Collection';
type Filter = 'ALL' | Status;

/**
 * Fleet tab: the real car list from GET /api/vehicles with live availability.
 * Changing a car's status calls PATCH /api/vehicles/:id/availability and shows on the Collection page.
 */
export const FleetManager: React.FC = () => {
  const { isGarageLight } = useTheme();
  const [cars, setCars] = useState<Vehicle[]>([]);
  const [avail, setAvail] = useState<Record<string, VehicleAvailabilityRecord>>({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [v, a] = await Promise.all([fetchVehicles(), fetchVehicleAvailability()]);
    setCars(v);
    setAvail(a.availability || {});
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const statusOf = (id: string): Status => (avail[id]?.status as Status) || 'Currently Available';

  const counts = useMemo(() => {
    const available = cars.filter((c) => statusOf(c.id) === 'Currently Available').length;
    return { ALL: cars.length, 'Currently Available': available, 'In Private Collection': cars.length - available };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars, avail]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cars.filter((c) => {
      if (filter !== 'ALL' && statusOf(c.id) !== filter) return false;
      if (!q) return true;
      return [c.name, c.marque, c.category, c.subcategory].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars, avail, filter, query]);

  const setStatus = async (car: Vehicle, status: Status) => {
    if (statusOf(car.id) === status) return;
    const prev = avail[car.id];
    setSavingId(car.id);
    setAvail((a) => ({ ...a, [car.id]: { ...(a[car.id] || ({} as VehicleAvailabilityRecord)), vehicleId: car.id, status } }));
    try {
      await updateVehicleAvailability(car.id, status);
      setToast(`${car.name} is now ${status === 'Currently Available' ? 'available' : 'in the private collection'}`);
    } catch (err) {
      setAvail((a) => ({ ...a, [car.id]: prev }));
      setToast(err instanceof Error ? err.message : 'Could not save. Try again.');
    } finally {
      setSavingId(null);
    }
  };

  const card = isGarageLight ? 'bg-white border-black/10' : 'bg-[#111415] border-white/10';
  const muted = isGarageLight ? 'text-[#5F656B]' : 'text-[#8E9394]';
  const strong = isGarageLight ? 'text-[#101214]' : 'text-[#F4F3EF]';
  const line = isGarageLight ? 'border-black/[0.06]' : 'border-white/[0.06]';
  const labels: Record<Filter, string> = {
    ALL: 'All cars',
    'Currently Available': 'Available',
    'In Private Collection': 'Private collection',
  };

  return (
    <div className="space-y-5" id="admin-fleet-manager">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className={`font-heading text-2xl ${strong}`}>Fleet</h2>
          <p className={`text-sm mt-1 ${muted}`}>
            Every car on the site, from{' '}
            <code className={`text-[12px] px-1.5 py-0.5 rounded ${isGarageLight ? 'bg-black/[0.05]' : 'bg-white/10'}`}>
              GET /api/vehicles
            </code>
            . Changing a car's status updates the Collection page straight away.
          </p>
        </div>
        <button
          onClick={load}
          className={`h-9 px-3 border text-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto ${card} ${strong} hover:border-[#D71920]/50`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <label className="relative flex-1 max-w-md">
          <span className="sr-only">Search cars</span>
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${muted}`} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, brand or category"
            className={`w-full h-10 pl-9 pr-3 border text-sm outline-none focus:border-[#D71920] ${card} ${strong}`}
          />
        </label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by availability">
          {(['ALL', 'Currently Available', 'In Private Collection'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`h-8 px-3 text-xs font-medium border cursor-pointer ${
                filter === f ? 'bg-[#D71920] border-[#D71920] text-white' : `${card} ${muted} hover:border-[#D71920]/40`
              }`}
            >
              {labels[f]} <span className="opacity-70">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`border overflow-hidden ${card}`}>
        {loading && !cars.length && <p className={`px-5 py-8 text-sm ${muted}`}>Loading fleet…</p>}
        {!loading && !visible.length && <p className={`px-5 py-8 text-sm ${muted}`}>No cars match these filters.</p>}
        <ul>
          {visible.map((car) => {
            const status = statusOf(car.id);
            return (
              <li
                key={car.id}
                className={`grid grid-cols-[64px_1fr] sm:grid-cols-[88px_1.4fr_1fr_auto] gap-3 sm:gap-5 items-center px-4 sm:px-5 py-3 border-b last:border-b-0 ${line}`}
              >
                <img
                  src={car.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-16 h-11 sm:w-[88px] sm:h-14 object-cover rounded-md bg-black/10"
                />
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${strong}`}>{car.name}</p>
                  <p className={`text-xs truncate ${muted}`}>
                    {car.marque} · {String(car.category).charAt(0) + String(car.category).slice(1).toLowerCase()}
                  </p>
                </div>
                <p className={`hidden sm:block text-xs ${muted}`}>
                  {car.power}
                  <br />
                  {car.acceleration ? `0–100 in ${car.acceleration}` : ''}
                </p>
                <div
                  className={`col-span-2 sm:col-span-1 inline-flex p-0.5 border rounded-lg justify-self-start sm:justify-self-end ${line}`}
                  role="radiogroup"
                  aria-label={`Availability of ${car.name}`}
                >
                  {(['Currently Available', 'In Private Collection'] as Status[]).map((s) => {
                    const on = status === s;
                    return (
                      <button
                        key={s}
                        role="radio"
                        aria-checked={on}
                        disabled={savingId === car.id}
                        onClick={() => setStatus(car, s)}
                        className={`h-7 px-2.5 text-xs font-medium cursor-pointer rounded-md transition-colors ${
                          on
                            ? s === 'Currently Available'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#101214] text-white'
                            : `${muted} ${isGarageLight ? 'hover:text-[#101214]' : 'hover:text-white'}`
                        }`}
                      >
                        {s === 'Currently Available' ? 'Available' : 'Private collection'}
                      </button>
                    );
                  })}
                </div>
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

export default FleetManager;
