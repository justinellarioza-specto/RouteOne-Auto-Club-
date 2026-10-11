import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, MapPin, Mail, Clock, Phone, Instagram, Facebook, Youtube, Share2 } from 'lucide-react';
import { submitInquiry } from '../services/api';
import { useMember } from '../context/MemberContext';

export const ContactPage: React.FC = () => {
  const { isMember, memberProfile } = useMember();
  // Logged-in members get their details filled in, so the request shows under "My bookings"
  const [name, setName] = useState(isMember ? memberProfile.name : '');
  const [email, setEmail] = useState(isMember ? memberProfile.email : '');
  const [subject, setSubject] = useState('');
  const [experience, setExperience] = useState('Private Viewing');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Valid email is required';
    }
    if (!subject.trim()) errs.subject = 'Subject is required';
    if (!preferredDate) errs.preferredDate = 'Please select a date';
    if (!message.trim()) errs.message = 'Please provide message details';
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
        vehicleInterest: subject,
        subject,
        message,
        date: preferredDate,
        location: 'Silverstone Proving Ground Hub',
      });
      setIsSuccess(true);
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

  return (
    <div id="contact-page" className="w-full px-6 md:px-10 py-16 bg-[#111314]">
      {/* Page Header */}
      <div className="pb-8 mb-12 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 bg-[#D8B52A]" />
          <span className="text-xs text-[#8B8D8C]">
            Concierge & allocations
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-[#F4F4F1] font-semibold uppercase mb-4">
          START YOUR NEXT DRIVE.
        </h1>

        <p className="text-sm text-[#8B8D8C] font-light leading-relaxed max-w-xl">
          Coordinate private vehicle viewings, technical consultations, or circuit sessions with our private concierge team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Container */}
        <div className="lg:col-span-7 bg-[#151718] border border-white/[0.08] p-6 sm:p-8">
          {isSuccess ? (
            <div className="py-12 text-center flex flex-col items-center">
              <CheckCircle2 className="w-10 h-10 text-[#D8B52A] mb-4" />
              <h2 className="font-heading text-2xl text-[#F4F4F1] mb-2">
                Inquiry dispatched
              </h2>
              <p className="text-xs text-[#8B8D8C] leading-relaxed max-w-md mb-6 font-light">
                Thank you, {name}. Your inquiry has been registered with our private liaison desk. A technical concierge will respond within 24 hours.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setName('');
                  setEmail('');
                  setSubject('');
                  setPreferredDate('');
                  setMessage('');
                }}
                className="px-4 py-2 border border-white/20 text-xs text-[#F4F4F1] hover:bg-white/5 cursor-pointer"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-[#8B8D8C] mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Sterling"
                    className="w-full bg-[#111314] border border-white/[0.08] px-3.5 py-2.5 text-xs text-[#F4F4F1] placeholder-[#505251] focus:outline-none focus:border-[#D8B52A]"
                  />
                  {errors.name && <span className="text-xs text-amber-400 mt-1 block">{errors.name}</span>}
                </div>

                <div>
                  <label className="block text-xs text-[#8B8D8C] mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m.sterling@domain.com"
                    className="w-full bg-[#111314] border border-white/[0.08] px-3.5 py-2.5 text-xs text-[#F4F4F1] placeholder-[#505251] focus:outline-none focus:border-[#D8B52A]"
                  />
                  {errors.email && <span className="text-xs text-amber-400 mt-1 block">{errors.email}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8B8D8C] mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Private Viewing — RouteOne R1 Concept"
                  className="w-full bg-[#111314] border border-white/[0.08] px-3.5 py-2.5 text-xs text-[#F4F4F1] placeholder-[#505251] focus:outline-none focus:border-[#D8B52A]"
                />
                {errors.subject && <span className="text-xs text-amber-400 mt-1 block">{errors.subject}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-[#8B8D8C] mb-1.5">
                    Preferred experience
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-[#111314] border border-white/[0.08] px-3.5 py-2.5 text-xs text-[#F4F4F1] focus:outline-none focus:border-[#D8B52A]"
                  >
                    <option value="Private Viewing">01 Private Viewing</option>
                    <option value="Driver Briefing">02 Driver Briefing</option>
                    <option value="Track Session">03 Track Session</option>
                    <option value="Full Allocation Consultation">Full Allocation Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#8B8D8C] mb-1.5">
                    Preferred date *
                  </label>
                  <input
                    type="date"
                      min={new Date().toISOString().slice(0, 10)}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-[#111314] border border-white/[0.08] px-3.5 py-2.5 text-xs text-[#F4F4F1] focus:outline-none focus:border-[#D8B52A]"
                  />
                  {errors.preferredDate && <span className="text-xs text-amber-400 mt-1 block">{errors.preferredDate}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8B8D8C] mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline your interest or specific machine requirement..."
                  className="w-full bg-[#111314] border border-white/[0.08] px-3.5 py-2.5 text-xs text-[#F4F4F1] placeholder-[#505251] focus:outline-none focus:border-[#D8B52A]"
                />
                {errors.message && <span className="text-xs text-amber-400 mt-1 block">{errors.message}</span>}
              </div>

              <div className="pt-2">
                {errors.form && (
                  <p role="alert" className="text-xs text-[#D71920] mb-3">{errors.form}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-[#D71920] text-white text-sm font-semibold hover:bg-[#B5141A] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Sending…' : 'Send inquiry'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#151718] border border-white/[0.08]">
            <span className="text-xs text-[#8B8D8C] block mb-2">
              Discretion policy
            </span>
            <h3 className="font-heading text-lg text-[#F4F4F1] mb-2">
              Confidential protocol
            </h3>
            <p className="text-xs text-[#8B8D8C] leading-relaxed font-light mb-4">
              All member communications, session records, and bespoke machine allocations are handled with strict institutional privacy.
            </p>
            <div className="text-xs text-[#505251] ">
              Encrypted concierge liaison
            </div>
          </div>

          <div className="p-6 bg-[#151718] border border-white/[0.08] space-y-4 text-xs text-[#8B8D8C]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#D8B52A] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#F4F4F1] block">Paddock 01, Proving Ground</span>
                <span className="text-[#505251]">Silverstone Circuit, Towcester, Northamptonshire NN12 8TN, UK</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#F4F4F1] block">+44 1327 850200</span>
                <span className="text-[#505251]">Direct Paddock Concierge Desk</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#D8B52A] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#F4F4F1] block">Tuesday – Saturday: 09:00 – 19:00 BST</span>
                <span className="text-[#505251]">Sunday Track Sessions by Allocation</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#D8B52A] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#F4F4F1] block">concierge@routeoneautoclub.com</span>
                <span className="text-[#505251]">Direct allocation & VIP inquiries desk</span>
              </div>
            </div>

            {/* Social Media Accounts */}
            <div className="pt-3 border-t border-white/[0.08]">
              <span className="text-xs text-[#F4F4F1] block mb-2.5 font-semibold">
                Official social channels
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 p-2 bg-[#111314] hover:border-[#D71920] border border-white/10 text-[#AEB4B5] hover:text-[#F4F4F1] transition-colors"
                >
                  <Instagram className="w-3 h-3 text-[#D71920]" />
                  <span>@routeoneautoclub</span>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 p-2 bg-[#111314] hover:border-[#D71920] border border-white/10 text-[#AEB4B5] hover:text-[#F4F4F1] transition-colors"
                >
                  <Facebook className="w-3 h-3 text-[#D8B52A]" />
                  <span>RouteOne Club</span>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 p-2 bg-[#111314] hover:border-[#D71920] border border-white/10 text-[#AEB4B5] hover:text-[#F4F4F1] transition-colors"
                >
                  <Share2 className="w-3 h-3 text-[#AEB4B5]" />
                  <span>TikTok / Telemetry</span>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 p-2 bg-[#111314] hover:border-[#D71920] border border-white/10 text-[#AEB4B5] hover:text-[#F4F4F1] transition-colors"
                >
                  <Youtube className="w-3 h-3 text-[#D71920]" />
                  <span>YouTube / Onboards</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
