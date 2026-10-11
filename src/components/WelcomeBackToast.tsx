import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';
import { useMember } from '../context/MemberContext';
import { useTheme } from '../context/ThemeContext';

/** Short "Welcome back" message after logging in. Admins also get a link to Race control. */
export const WelcomeBackToast: React.FC = () => {
  const { welcomeToast, dismissWelcomeToast, isAdmin } = useMember();
  const { isGarageLight } = useTheme();

  return (
    <AnimatePresence>
      {welcomeToast && (
        <motion.div
          id="welcome-back-toast"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed top-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm"
        >
          <div
            className={`relative border rounded-md shadow-xl overflow-hidden ${
              isGarageLight ? 'bg-white border-black/10' : 'bg-[#121417] border-white/10'
            }`}
          >
            <div className="flex items-start gap-3 p-4">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-[#D71920] shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${isGarageLight ? 'text-[#101214]' : 'text-[#F4F3EF]'}`}>
                  Welcome back, {welcomeToast.name}
                </p>
                <p className="text-xs text-[#85898A] mt-0.5">
                  {isAdmin ? 'Logged in as admin' : 'Logged in as a club member'}
                </p>
                {isAdmin && (
                  <a
                    href="#/admin"
                    onClick={dismissWelcomeToast}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#D71920] hover:underline"
                  >
                    Open Race control <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={dismissWelcomeToast}
                aria-label="Dismiss"
                className="p-1 -m-1 text-[#85898A] hover:text-[#D71920] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Time left before it closes by itself */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3.0, ease: 'linear' }}
              className="h-0.5 bg-[#D71920]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
