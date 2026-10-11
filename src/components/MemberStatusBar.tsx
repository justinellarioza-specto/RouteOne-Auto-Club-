import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User } from 'lucide-react';
import { useMember } from '../context/MemberContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Login / logout toast ("Updated" / "Signed out").
 * The old admin telemetry ribbon was removed; admins reach Race control from the header.
 */
export const MemberStatusBar: React.FC<{
  onOpenBookingModal?: (experience?: string, vehicle?: string) => void;
  onNavigate?: (tab: string) => void;
}> = () => {
  const { isMember, toastMessage, dismissToast } = useMember();
  const { isGarageLight } = useTheme();

  return (
    <>
      {/* Toast Notification for instant feedback when toggle is triggered */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] pointer-events-auto"
          >
            <div
              className={`p-4 border shadow-2xl flex items-start justify-between gap-3 ${
                isMember
                  ? isGarageLight
                    ? 'bg-white border-[#D71920]/40 text-[#101214] shadow-[0_12px_40px_rgba(215,25,32,0.12)]'
                    : 'bg-[#0E1012] border-[#D71920]/60 text-[#F4F3EF] shadow-[0_12px_40px_rgba(0,0,0,0.8)]'
                  : isGarageLight
                  ? 'bg-white border-black/15 text-[#101214]'
                  : 'bg-[#121416] border-white/15 text-[#F4F3EF]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {isMember ? (
                    <span className="inline-flex rounded-full h-2.5 w-2.5 mt-0.5 bg-[#D71920]"></span>
                  ) : (
                    <User className="w-4 h-4 text-[#85898A]" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs mb-1 font-semibold text-[#D71920]">
                    {isMember ? 'Updated' : 'Signed out'}
                  </div>
                  <p className="text-xs font-light leading-relaxed">
                    {toastMessage}
                  </p>
                </div>
              </div>
              <button
                id="btn-dismiss-member-toast"
                onClick={dismissToast}
                className="text-[#85898A] hover:text-[#D71920] p-1 transition-colors cursor-pointer shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
