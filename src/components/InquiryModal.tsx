import React, { useState } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { submitInquiry } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useMember } from '../context/MemberContext';
import { RouteOneLogo } from './RouteOneLogo';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultExperience?: string;
  defaultVehicle?: string;
  onSuccess?: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  defaultExperience = 'Track Experience',
  defaultVehicle = 'RouteOne R1 Concept',
  onSuccess,
}) => {
  useEscapeKey(isOpen, onClose);
  const { isGarageLight } = useTheme();
  const { isMember, memberProfile } = useMember();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState(defaultExperience);
  const [vehicle, setVehicle] = useState(defaultVehicle);
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync inputs when modal opens with new defaults and member profile if logged in
  React.useEffect(() => {
    if (isOpen) {
      setExperience(defaultExperience);
      setVehicle(defaultVehicle);
      setIsSuccess(false);
      setErrors({});

      if (isMember) {
        setName(memberProfile.name);
        setEmail(memberProfile.email);
      } else {
        setName('');
        setEmail('');
      }
    }
  }, [isOpen, defaultExperience, defaultVehicle, isMember, memberProfile]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Valid email is required';
    }
    if (!preferredDate) errs.preferredDate = 'Please select a preferred date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitInquiry({
        name,
        email,
        preferredExperience: experience,
        vehicleInterest: vehicle,
        date: preferredDate,
        message: message || undefined,
        location: 'Silverstone Proving Ground Hub',
      });
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      // Show the server's explanation (invalid email, past date, too many requests…)
      const apiErr = err as { message?: string; fieldErrors?: Record<string, string> };
      const fe = apiErr.fieldErrors || {};
      const mapped: Record<string, string> = {};
      if (fe.name) mapped.name = fe.name;
      if (fe.email) mapped.email = fe.email;
      if (fe.date) mapped.preferredDate = fe.date;
      if (fe.message) mapped.message = fe.message;
      if (!Object.keys(mapped).length) mapped.form = apiErr.message || 'Your request could not be sent. Try again.';
      setErrors(mapped);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Book a drive">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl rounded-sm transition-colors duration-200 border ${
            isGarageLight
              ? 'bg-white border-black/15 shadow-[0_25px_60px_rgba(0,0,0,0.15)]'
              : 'bg-[#0B0D0E] border-white/[0.12] shadow-black'
          }`}
        >
          {/* Close button */}
          <button
            onClick={handleResetAndClose}
            className={`absolute top-4 right-4 p-1.5 transition-colors cursor-pointer rounded-sm ${
              isGarageLight
                ? 'text-[#565C62] hover:text-[#D71920]'
                : 'text-[#85898A] hover:text-[#D71920]'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 mx-auto border border-[#D71920] flex items-center justify-center text-[#D71920] mb-4 rounded-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <span className={`text-xs ${
                isGarageLight ? 'text-[#9C7D2B]' : 'text-[#C9B37E]'
              }`}>
                Request received
              </span>

              <h3 className={`font-heading text-2xl ${
                isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
              }`}>
                Inquiry registered
              </h3>

              <p className={`text-xs max-w-md mx-auto leading-relaxed font-light ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}>
                Our concierge will review your inquiry and contact you shortly. A reservation ticket has been logged with the paddock desk.
              </p>

              <div className={`p-4 border text-left text-xs space-y-2 max-w-sm mx-auto mt-6 rounded-sm ${
                isGarageLight
                  ? 'bg-[#F6F7F5] border-black/10 text-[#565C62]'
                  : 'bg-[#111415] border-white/[0.08] text-[#85898A]'
              }`}>
                <div className="flex justify-between">
                  <span>Client:</span>
                  <span className={isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}>{name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className="text-[#D71920]">{experience}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className={isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}>{preferredDate}</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="mt-6 px-6 py-2.5 bg-[#D71920] hover:bg-[#b5141a] text-white text-xs font-semibold transition-colors cursor-pointer rounded-sm"
              >
                Return to site
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <RouteOneLogo variant="emblem" className="h-4 w-auto" />
                <span className={`text-xs ${
                  isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                }`}>
                  Reservation & inquiry
                </span>
              </div>

              <h3 className={`font-heading text-2xl mb-2 ${
                isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
              }`}>
                {isMember ? 'VIP circuit allocation' : 'Get behind the wheel'}
              </h3>

              <p className={`text-xs mb-4 font-light ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}>
                {isMember
                  ? 'Apex Syndicate credential active. Instant pit priority dispatch with zero booking deposit required.'
                  : 'Submit your preferred circuit date or private viewing time. Our automotive concierge will tailor your session orientation.'}
              </p>

              {isMember && (
                <div className="mb-4 p-3 bg-[#181112] border border-[#D71920]/40 rounded-xs flex items-center justify-between text-xs ">
                  <div className="flex items-center gap-2 text-white">
                    <ShieldCheck className="w-4 h-4 text-[#C9B37E]" />
                    <span>Authenticated: {memberProfile.name} [{memberProfile.id}]</span>
                  </div>
                  <span className="text-[#10B981] font-bold">0% deposit</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs mb-1 ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                    }`}>
                      Full name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Julian Vane"
                      className={`w-full px-3 py-2 border text-xs focus:outline-none focus:border-[#D71920] rounded-sm transition-colors ${
                        isGarageLight
                          ? 'bg-[#F6F7F5] border-black/15 text-[#111415] placeholder-[#8C9399]'
                          : 'bg-[#111415] border-white/[0.08] text-[#F4F3EF] placeholder-[#565C62]'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[#D71920] text-xs mt-1 flex items-center gap-1 ">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-xs mb-1 ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                    }`}>
                      Email address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. j.vane@apex.com"
                      className={`w-full px-3 py-2 border text-xs focus:outline-none focus:border-[#D71920] rounded-sm transition-colors ${
                        isGarageLight
                          ? 'bg-[#F6F7F5] border-black/15 text-[#111415] placeholder-[#8C9399]'
                          : 'bg-[#111415] border-white/[0.08] text-[#F4F3EF] placeholder-[#565C62]'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[#D71920] text-xs mt-1 flex items-center gap-1 ">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs mb-1 ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                    }`}>
                      Preferred experience
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className={`w-full px-3 py-2 border text-xs focus:outline-none focus:border-[#D71920] rounded-sm transition-colors ${
                        isGarageLight
                          ? 'bg-[#F6F7F5] border-black/15 text-[#111415]'
                          : 'bg-[#111415] border-white/[0.08] text-[#F4F3EF]'
                      }`}
                    >
                      <option value="Track Experience">Track Experience</option>
                      <option value="Private Showroom Viewing">Private Showroom Viewing</option>
                      <option value="Driver Telemetry Briefing">Driver Telemetry Briefing</option>
                      <option value="Full Allocation Consultation">Full Allocation Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs mb-1 ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                    }`}>
                      Preferred date *
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className={`w-full px-3 py-2 border text-xs focus:outline-none focus:border-[#D71920] rounded-sm transition-colors ${
                        isGarageLight
                          ? 'bg-[#F6F7F5] border-black/15 text-[#111415] [color-scheme:light]'
                          : 'bg-[#111415] border-white/[0.08] text-[#F4F3EF] [color-scheme:dark]'
                      }`}
                    />
                    {errors.preferredDate && (
                      <p className="text-[#D71920] text-xs mt-1 flex items-center gap-1 ">
                        <AlertCircle className="w-3 h-3" /> {errors.preferredDate}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={`block text-xs mb-1 ${
                    isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                  }`}>
                    Preferred vehicle / inquiry details
                  </label>
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="RouteOne R1 Concept, Revuelto, 750S..."
                    className={`w-full px-3 py-2 border text-xs focus:outline-none focus:border-[#D71920] rounded-sm transition-colors ${
                      isGarageLight
                        ? 'bg-[#F6F7F5] border-black/15 text-[#111415] placeholder-[#8C9399]'
                        : 'bg-[#111415] border-white/[0.08] text-[#F4F3EF] placeholder-[#565C62]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs mb-1 ${
                    isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                  }`}>
                    Additional notes
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any track experience, simulator background, or specific vehicle preferences..."
                    className={`w-full px-3 py-2 border text-xs focus:outline-none focus:border-[#D71920] resize-none rounded-sm transition-colors ${
                      isGarageLight
                        ? 'bg-[#F6F7F5] border-black/15 text-[#111415] placeholder-[#8C9399]'
                        : 'bg-[#111415] border-white/[0.08] text-[#F4F3EF] placeholder-[#565C62]'
                    }`}
                  />
                </div>

                <div className="pt-2">
                  {errors.form && (
                    <p role="alert" className="text-xs text-[#D71920] mb-3">{errors.form}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#D71920] hover:bg-[#b5141a] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-[#D71920]/20 rounded-sm"
                  >
                    <span>{isSubmitting ? 'Sending…' : 'Confirm inquiry'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
