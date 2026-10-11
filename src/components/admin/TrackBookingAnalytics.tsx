import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Plus,
  Radio,
  Search,
  Sliders,
  Filter,
  BarChart3,
  TrendingUp,
  MapPin,
  X,
  Trash2,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { useMember, TrackBooking } from '../../context/MemberContext';
import { useTheme } from '../../context/ThemeContext';

export const TrackBookingAnalytics: React.FC = () => {
  const { trackBookings, updateBookingStatus, addTrackBooking, deleteTrackBooking, fleetVehicles, allProfiles } =
    useMember();
  const { isGarageLight } = useTheme();

  const [circuitFilter, setCircuitFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);

  // New booking form fields
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberId, setNewMemberId] = useState('');
  const [newCircuit, setNewCircuit] = useState<TrackBooking['circuit']>('Silverstone GP Circuit');
  const [newDate, setNewDate] = useState('Tomorrow');
  const [newSlot, setNewSlot] = useState('10:00 - 12:30 (Session 1)');
  const [newVehicle, setNewVehicle] = useState('RouteOne R1 Concept #001');
  const [newInstructor, setNewInstructor] = useState('J. Palmer (F1 Test Driver)');
  const [newPitBox, setNewPitBox] = useState('Pit Box 04');

  const filteredBookings = trackBookings.filter((b) => {
    const matchesCircuit = circuitFilter === 'ALL' || b.circuit === circuitFilter;
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch =
      b.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pitBox.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCircuit && matchesStatus && matchesSearch;
  });

  // Calculate high-level circuit analytics
  const totalBookings = trackBookings.length;
  const confirmedCount = trackBookings.filter((b) => b.status === 'Confirmed').length;
  const pendingCount = trackBookings.filter((b) => b.status === 'Pending Scrutineering').length;
  const waitlistCount = trackBookings.filter((b) => b.status === 'Waitlisted').length;

  const silverstoneCount = trackBookings.filter((b) => b.circuit === 'Silverstone GP Circuit').length;
  const spaCount = trackBookings.filter((b) => b.circuit === 'Spa-Francorchamps').length;
  const nurburgringCount = trackBookings.filter((b) => b.circuit === 'Nürburgring Nordschleife').length;

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    addTrackBooking({
      memberName: newMemberName.trim(),
      memberId: newMemberId.trim() || `R1-VIP-${Math.floor(100 + Math.random() * 900)}`,
      circuit: newCircuit,
      date: newDate,
      slot: newSlot,
      vehicleName: newVehicle,
      status: 'Confirmed',
      telemetryUplink: true,
      instructor: newInstructor,
      pitBox: newPitBox,
    });

    setNewMemberName('');
    setIsAddBookingModalOpen(false);
  };

  const getStatusStyle = (status: TrackBooking['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-[#10B981]/20 border-[#10B981]/60 text-[#10B981]';
      case 'Pending Scrutineering':
        return 'bg-[#F59E0B]/20 border-[#F59E0B]/60 text-[#F59E0B]';
      case 'Completed':
        return 'bg-white/10 border-white/20 text-[#85898A]';
      case 'Waitlisted':
        return 'bg-[#D71920]/20 border-[#D71920]/60 text-[#D71920]';
    }
  };

  return (
    <div className="space-y-6" id="admin-booking-analytics-ui">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div
          className={`p-4 border rounded-xs ${
            isGarageLight ? 'bg-white border-black/10' : 'bg-[#121517] border-white/10'
          }`}
        >
          <span className="text-xs text-[#85898A] block">Track Sessions</span>
          <div className="text-xl sm:text-2xl font-bold mt-1 text-foreground dark:text-white flex items-center justify-between">
            <span>{totalBookings} Reserved</span>
            <Calendar className="w-5 h-5 text-[#D71920]" />
          </div>
          <span className="text-xs text-[#10B981] mt-1 block">+{confirmedCount} Confirmed & Ready</span>
        </div>

        <div
          className={`p-4 border rounded-xs ${
            isGarageLight ? 'bg-white border-black/10' : 'bg-[#121517] border-white/10'
          }`}
        >
          <span className="text-xs text-[#85898A] block">Track Capacity Utilized</span>
          <div className="text-xl sm:text-2xl font-bold mt-1 text-[#10B981] flex items-center justify-between">
            <span>88.4%</span>
            <TrendingUp className="w-5 h-5 text-[#10B981]" />
          </div>
          <span className="text-xs text-[#85898A] mt-1 block">Optimal Paddock Density</span>
        </div>

        <div
          className={`p-4 border rounded-xs ${
            isGarageLight ? 'bg-white border-black/10' : 'bg-[#121517] border-white/10'
          }`}
        >
          <span className="text-xs text-[#85898A] block">Scrutineering Queue</span>
          <div className="text-xl sm:text-2xl font-bold mt-1 text-[#F59E0B] flex items-center justify-between">
            <span>{pendingCount} Vehicles</span>
            <ShieldAlert className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <span className="text-xs text-[#85898A] mt-1 block">FIA Safety Verification</span>
        </div>

        <div
          className={`p-4 border rounded-xs ${
            isGarageLight ? 'bg-white border-black/10' : 'bg-[#121517] border-white/10'
          }`}
        >
          <span className="text-xs text-[#85898A] block">Telemetry Uplink Rate</span>
          <div className="text-xl sm:text-2xl font-bold mt-1 text-[#60A5FA] flex items-center justify-between">
            <span>100%</span>
            <Radio className="w-5 h-5 text-[#60A5FA]" />
          </div>
          <span className="text-xs text-[#85898A] mt-1 block">MoTeC Live Beacon active</span>
        </div>
      </div>

      {/* Circuit Analytics Breakdown Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Silverstone */}
        <div
          className={`p-4 border rounded-xs ${
            isGarageLight ? 'bg-white border-black/10' : 'bg-[#121517] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold flex items-center gap-1.5 text-[#D71920]">
              <MapPin className="w-3.5 h-3.5" /> Silverstone gp
            </span>
            <span className="text-xs font-bold text-foreground dark:text-white">{silverstoneCount} Slots</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-[#D71920]"
              style={{ width: `${Math.round((silverstoneCount / Math.max(1, totalBookings)) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-[#85898A] leading-relaxed">
            5.891 km Grand Prix circuit. Full telemetry pit garages 01-08 active.
          </p>
        </div>

        {/* Spa Francorchamps */}
        <div
          className={`p-4 border rounded-xs ${
            isGarageLight ? 'bg-white border-black/10' : 'bg-[#121517] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold flex items-center gap-1.5 text-[#C9B37E]">
              <MapPin className="w-3.5 h-3.5" /> Spa-francorchamps
            </span>
            <span className="text-xs font-bold text-foreground dark:text-white">{spaCount} Slots</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-[#C9B37E]"
              style={{ width: `${Math.round((spaCount / Math.max(1, totalBookings)) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-[#85898A] leading-relaxed">
            7.004 km Ardennes elevation. Eau Rouge high-downforce aero setup verified.
          </p>
        </div>

        {/* Nürburgring Nordschleife */}
        <div
          className={`p-4 border rounded-xs ${
            isGarageLight ? 'bg-white border-black/10' : 'bg-[#121517] border-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold flex items-center gap-1.5 text-[#10B981]">
              <MapPin className="w-3.5 h-3.5" /> NÜRBURGRING
            </span>
            <span className="text-xs font-bold text-foreground dark:text-white">{nurburgringCount} Slots</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-[#10B981]"
              style={{ width: `${Math.round((nurburgringCount / Math.max(1, totalBookings)) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-[#85898A] leading-relaxed">
            20.832 km Green Hell. Scrutineering mandatory for all sub-7 minute targets.
          </p>
        </div>
      </div>

      {/* Bookings Queue Controls & Search */}
      <div
        className={`p-4 sm:p-5 border rounded-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
          isGarageLight ? 'bg-white border-black/10' : 'bg-[#121517] border-white/10'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#85898A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member, vehicle, or pit bay..."
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-xs border transition-colors outline-none ${
                isGarageLight
                  ? 'bg-black/[0.02] border-black/15 focus:border-[#D71920] text-[#101214]'
                  : 'bg-black/40 border-white/15 focus:border-[#D71920] text-white'
              }`}
            />
          </div>

          {/* Circuit Filter */}
          <select
            value={circuitFilter}
            onChange={(e) => setCircuitFilter(e.target.value)}
            className={`py-2 px-3 text-xs rounded-xs border outline-none cursor-pointer ${
              isGarageLight
                ? 'bg-white border-black/15 text-[#101214]'
                : 'bg-[#0E1012] border-white/15 text-white'
            }`}
          >
            <option value="ALL">All Circuits</option>
            <option value="Silverstone GP Circuit">Silverstone GP</option>
            <option value="Spa-Francorchamps">Spa-Francorchamps</option>
            <option value="Nürburgring Nordschleife">Nürburgring Nordschleife</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`py-2 px-3 text-xs rounded-xs border outline-none cursor-pointer ${
              isGarageLight
                ? 'bg-white border-black/15 text-[#101214]'
                : 'bg-[#0E1012] border-white/15 text-white'
            }`}
          >
            <option value="ALL">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending Scrutineering">Pending Scrutineering</option>
            <option value="Waitlisted">Waitlisted</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Create Booking Button */}
        <button
          onClick={() => setIsAddBookingModalOpen(true)}
          className="px-4 py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-bold rounded-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(215,25,32,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Pit Reservation</span>
        </button>
      </div>

      {/* Bookings Table */}
      <div
        className={`border rounded-xs overflow-x-auto ${
          isGarageLight ? 'bg-white border-black/10' : 'bg-[#121517] border-white/10'
        }`}
      >
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs text-[#85898A] bg-black/20">
              <th className="py-3 px-4">Booking ID & Date</th>
              <th className="py-3 px-4">Driver & Member ID</th>
              <th className="py-3 px-4">Circuit & Pit Bay</th>
              <th className="py-3 px-4">Allocated Supercar</th>
              <th className="py-3 px-4">Instructor</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredBookings.map((b) => (
              <tr
                key={b.id}
                className={`transition-colors ${
                  isGarageLight ? 'hover:bg-black/[0.02]' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* ID & Date */}
                <td className="py-3 px-4">
                  <span className="font-bold text-[#D71920] block">{b.id}</span>
                  <span className="text-xs text-[#85898A] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {b.date} • {b.slot}
                  </span>
                </td>

                {/* Driver */}
                <td className="py-3 px-4">
                  <span className="font-bold text-foreground dark:text-white block">{b.memberName}</span>
                  <span className="text-xs text-[#85898A] uppercase">ID: {b.memberId}</span>
                </td>

                {/* Circuit & Bay */}
                <td className="py-3 px-4">
                  <span className="text-foreground dark:text-white block font-semibold">{b.circuit}</span>
                  <span className="text-xs text-[#C9B37E] font-bold uppercase">{b.pitBox}</span>
                </td>

                {/* Supercar */}
                <td className="py-3 px-4">
                  <span className="text-foreground dark:text-white font-semibold block">{b.vehicleName}</span>
                  <span className="text-[11px] text-[#10B981] flex items-center gap-1">
                    <Radio className="w-3 h-3" /> MoTeC Telemetry Linked
                  </span>
                </td>

                {/* Instructor */}
                <td className="py-3 px-4 text-[#85898A] text-[11px]">{b.instructor}</td>

                {/* Status */}
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 text-[11px] font-bold border rounded-xs ${getStatusStyle(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {b.status !== 'Confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                        title="Approve & Confirm Track Day"
                        className="px-2 py-1 bg-[#10B981]/20 hover:bg-[#10B981]/30 border border-[#10B981]/50 text-[#10B981] rounded-xs text-xs font-bold transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                    )}

                    {b.status !== 'Pending Scrutineering' && (
                      <button
                        onClick={() => updateBookingStatus(b.id, 'Pending Scrutineering')}
                        title="Require FIA Scrutineering Inspection"
                        className="px-2 py-1 bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 border border-[#F59E0B]/50 text-[#F59E0B] rounded-xs text-xs font-bold transition-colors cursor-pointer"
                      >
                        Scrutineer
                      </button>
                    )}

                    <button
                      onClick={() => deleteTrackBooking(b.id)}
                      title="Release slot"
                      className="p-1 text-[#85898A] hover:text-[#D71920] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="p-8 text-center text-[#85898A] text-xs">
            No track bookings found matching your search or filters.
          </div>
        )}
      </div>

      {/* New Pit Reservation Modal */}
      {isAddBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg border rounded-xs overflow-hidden shadow-2xl p-6 ${
              isGarageLight ? 'bg-white border-black/15 text-[#101214]' : 'bg-[#121517] border-white/15 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D71920]" />
                Schedule VIP track reservation
              </h3>
              <button
                onClick={() => setIsAddBookingModalOpen(false)}
                className="p-1 hover:text-[#D71920] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#85898A] uppercase mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sir Alexander Vance"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full p-2.5 rounded-xs border border-white/20 bg-black/40 text-white outline-none focus:border-[#D71920]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#85898A] uppercase mb-1">Member ID</label>
                  <input
                    type="text"
                    placeholder="e.g. R1-APEX-084"
                    value={newMemberId}
                    onChange={(e) => setNewMemberId(e.target.value)}
                    className="w-full p-2.5 rounded-xs border border-white/20 bg-black/40 text-white outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#85898A] uppercase mb-1">Circuit</label>
                  <select
                    value={newCircuit}
                    onChange={(e) => setNewCircuit(e.target.value as TrackBooking['circuit'])}
                    className="w-full p-2.5 rounded-xs border border-white/20 bg-black/40 text-white outline-none"
                  >
                    <option value="Silverstone GP Circuit">Silverstone GP Circuit</option>
                    <option value="Spa-Francorchamps">Spa-Francorchamps</option>
                    <option value="Nürburgring Nordschleife">Nürburgring Nordschleife</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#85898A] uppercase mb-1">Pit Box / Bay</label>
                  <input
                    type="text"
                    value={newPitBox}
                    onChange={(e) => setNewPitBox(e.target.value)}
                    className="w-full p-2.5 rounded-xs border border-white/20 bg-black/40 text-white outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#85898A] uppercase mb-1">Date</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xs border border-white/20 bg-black/40 text-white outline-none focus:border-[#D71920]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#85898A] uppercase mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xs border border-white/20 bg-black/40 text-white outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#85898A] uppercase mb-1">Allocated Supercar</label>
                <input
                  type="text"
                  value={newVehicle}
                  onChange={(e) => setNewVehicle(e.target.value)}
                  className="w-full p-2.5 rounded-xs border border-white/20 bg-black/40 text-white outline-none focus:border-[#D71920]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddBookingModalOpen(false)}
                  className="px-4 py-2 border border-white/20 hover:bg-white/5 rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold rounded-xs cursor-pointer shadow-[0_0_12px_rgba(215,25,32,0.3)]"
                >
                  Confirm & Slotted Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
