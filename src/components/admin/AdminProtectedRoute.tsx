import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Lock,
  ArrowRight,
  ShieldCheck,
  Radio,
  Sliders,
  ChevronLeft,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';
import { useMember } from '../../context/MemberContext';
import { useTheme } from '../../context/ThemeContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  onNavigate?: (tab: string) => void;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children, onNavigate }) => {
  const { isAdmin, isMember, memberProfile, login } = useMember();
  const { isGarageLight } = useTheme();

  const [adminIdInput, setAdminIdInput] = useState('admin');
  const [adminPasswordInput, setAdminPasswordInput] = useState('admin');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // If already authenticated with Administrator privileges, render the admin dashboard directly
  if (isAdmin) {
    return <>{children}</>;
  }

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsAuthenticating(true);

    try {
      const cleanId = adminIdInput.trim().toLowerCase();
      if (cleanId !== 'admin') {
        setErrorMsg('Invalid race control credentials. Use id: admin / password: admin.');
        setIsAuthenticating(false);
        return;
      }

      await login(adminIdInput.trim(), adminPasswordInput);
    } catch {
      setErrorMsg('Authentication error. Please check your credentials.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleQuickAuthorize = async () => {
    setErrorMsg(null);
    setIsAuthenticating(true);
    await login('admin', 'admin');
    setIsAuthenticating(false);
  };

  return (
    <div
      id="admin-protected-route-gate"
      className="w-full min-h-[75vh] flex items-center justify-center px-4 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-xl border rounded-xs p-6 sm:p-8 shadow-2xl backdrop-blur-md transition-colors ${
          isGarageLight
            ? 'bg-white/95 border-black/15 shadow-[0_20px_50px_rgba(0,0,0,0.12)] text-[#101214]'
            : 'bg-[#101214]/95 border-[#D71920]/40 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(215,25,32,0.15)] text-white'
        }`}
      >
        {/* Top Racing Accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[#D71920] via-[#F4F3EF] to-[#D71920] mb-6" />

        {/* Security Header */}
        <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-black/10 dark:border-white/10 text-xs">
          <span className="flex items-center gap-1.5 text-[#D71920] font-bold ">
            <ShieldAlert className="w-4 h-4" />
            Admin protected route · FIA race control
          </span>
          <span className="px-2 py-0.5 bg-[#D71920]/15 border border-[#D71920]/40 text-[#D71920] font-bold rounded-xs">
            Security clearance level 4
          </span>
        </div>

        {/* Icon & Message */}
        <div className="text-center space-y-3 mb-6">
          <div
            className={`w-14 h-14 mx-auto rounded-xs flex items-center justify-center border transition-all ${
              isGarageLight
                ? 'bg-[#D71920]/10 border-[#D71920]/30 text-[#D71920]'
                : 'bg-[#D71920]/20 border-[#D71920]/50 text-[#D71920] shadow-[0_0_20px_rgba(215,25,32,0.3)]'
            }`}
          >
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-bold ">
            Restricted Paddock Management
          </h2>

          <p className="text-xs sm:text-sm text-[#85898A] font-sans leading-relaxed max-w-md mx-auto">
            This sector controls circuit dispatch, track flag conditions, supercar asset allocations, and VIP booking
            scrutineering. Steward or Race Director credentials are required.
          </p>

          {isMember && !isAdmin && (
            <div className="py-2 px-3 bg-black/10 dark:bg-white/5 border border-white/10 rounded-xs inline-block text-[11px] text-[#F59E0B]">
              Currently signed in as: <strong>{memberProfile.name}</strong> ({memberProfile.tier}) • Administrative
              override needed.
            </div>
          )}
        </div>

        {/* Admin Login Form */}
        <form onSubmit={handleAdminAuth} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-[#D71920]/15 border border-[#D71920]/50 rounded-xs text-[#D71920] text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#85898A] uppercase mb-1">
                Admin / Steward ID
              </label>
              <input
                type="text"
                required
                value={adminIdInput}
                onChange={(e) => setAdminIdInput(e.target.value)}
                placeholder="admin"
                className={`w-full p-2.5 rounded-xs border outline-none ${
                  isGarageLight
                    ? 'bg-black/[0.03] border-black/20 focus:border-[#D71920] text-[#101214]'
                    : 'bg-black/50 border-white/20 focus:border-[#D71920] text-white'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-[#85898A] uppercase mb-1">
                Security Passkey
              </label>
              <input
                type="password"
                required
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="admin"
                className={`w-full p-2.5 rounded-xs border outline-none ${
                  isGarageLight
                    ? 'bg-black/[0.03] border-black/20 focus:border-[#D71920] text-[#101214]'
                    : 'bg-black/50 border-white/20 focus:border-[#D71920] text-white'
                }`}
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="submit"
              disabled={isAuthenticating}
              className="flex-1 py-3 bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-bold rounded-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(215,25,32,0.3)] active:scale-[0.99]"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isAuthenticating ? 'Authorizing Paddock Access...' : 'Authenticate as Race Director'}</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAuthorize}
              disabled={isAuthenticating}
              className="px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs rounded-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>1-Click Passkey</span>
            </button>
          </div>
        </form>

        {/* Footer info & Go Back */}
        <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] text-[#85898A]">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-1 hover:text-foreground dark:hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Return to Public Showroom</span>
          </button>

          <span className="text-[#D71920] font-bold">Race control protocol</span>
        </div>
      </motion.div>
    </div>
  );
};
