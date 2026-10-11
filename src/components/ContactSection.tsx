import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ContactSectionProps {
  initialExperience?: string;
  onSuccess?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialExperience = 'Private Showroom Viewing',
  onSuccess,
}) => {
  const { isGarageLight } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'VIP Allocation Inquiry',
    preferredExperience: initialExperience,
    preferredDate: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    }, 600);
  };

  return (
    <section
      id="contact-section"
      className={`w-full px-6 md:px-10 py-16 border-b transition-colors duration-300 ${
        isGarageLight
          ? 'bg-[#FFFFFF] border-black/[0.08]'
          : 'bg-[#0B0D0E] border-white/[0.08]'
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Heading & Context */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#D71920]" />
            <span
              className={`text-xs ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              Appointments & inquiries
            </span>
          </div>

          <h2
            className={`font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold uppercase leading-[0.95] mb-6 ${
              isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
            }`}
          >
            START YOUR
            <br />
            NEXT DRIVE.
          </h2>

          <p
            className={`text-sm font-light leading-relaxed max-w-md mb-8 ${
              isGarageLight ? 'text-[#3E4347]' : 'text-[#AEB4B5]'
            }`}
          >
            Whether booking a private showroom viewing, reserving a track session, or inquiring about an exotic allocation, our concierge is at your service.
          </p>

          <div
            className={`space-y-3 text-xs border-t pt-6 transition-colors duration-300 ${
              isGarageLight
                ? 'border-black/[0.08] text-[#565C62]'
                : 'border-white/[0.06] text-[#85898A]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Location</span>
              <span className={isGarageLight ? 'text-[#111415] font-semibold' : 'text-[#F4F3EF]'}>
                Silverstone circuit, UK
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Response time</span>
              <span className="text-[#D71920] font-semibold">&Lt; 2 hours · concierge desk</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Direct paddock line</span>
              <span className={isGarageLight ? 'text-[#9C7D2B] font-semibold' : 'text-[#C9B37E]'}>
                +44 1327 850200
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <div
            className={`border p-6 sm:p-8 relative rounded-sm transition-colors duration-300 ${
              isGarageLight
                ? 'bg-[#F6F7F5] border-black/10 shadow-sm'
                : 'bg-[#111415] border-white/[0.08]'
            }`}
          >
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-[#D71920] mx-auto animate-in zoom-in-50 duration-300" />
                <h3
                  className={`font-heading text-2xl ${
                    isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
                  }`}
                >
                  Inquiry registered
                </h3>
                <p
                  className={`text-xs max-w-sm mx-auto font-light leading-relaxed ${
                    isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                  }`}
                >
                  Your details have been transmitted to the RouteOne private concierge. A member of our paddock team will reach out shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-[#D71920] hover:underline transition-colors cursor-pointer pt-2"
                >
                  Send another inquiry →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label
                      className={`block text-xs mb-1.5 ${
                        isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                      }`}
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Adrian Newey"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-xs font-sans-ui focus:outline-none focus:border-[#D71920] transition-colors rounded-sm border ${
                        isGarageLight
                          ? 'bg-white border-black/15 text-[#111415] placeholder-[#8C9399]'
                          : 'bg-[#0B0D0E] border-white/[0.08] text-[#F4F3EF] placeholder-[#45494A]'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className={`block text-xs mb-1.5 ${
                        isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                      }`}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@routeone.club"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-xs font-sans-ui focus:outline-none focus:border-[#D71920] transition-colors rounded-sm border ${
                        isGarageLight
                          ? 'bg-white border-black/15 text-[#111415] placeholder-[#8C9399]'
                          : 'bg-[#0B0D0E] border-white/[0.08] text-[#F4F3EF] placeholder-[#45494A]'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Subject */}
                  <div>
                    <label
                      className={`block text-xs mb-1.5 ${
                        isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                      }`}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-xs font-sans-ui focus:outline-none focus:border-[#D71920] transition-colors rounded-sm border ${
                        isGarageLight
                          ? 'bg-white border-black/15 text-[#111415] placeholder-[#8C9399]'
                          : 'bg-[#0B0D0E] border-white/[0.08] text-[#F4F3EF] placeholder-[#45494A]'
                      }`}
                    />
                  </div>

                  {/* Preferred Experience */}
                  <div>
                    <label
                      className={`block text-xs mb-1.5 ${
                        isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                      }`}
                    >
                      Preferred experience
                    </label>
                    <select
                      value={formData.preferredExperience}
                      onChange={(e) => setFormData({ ...formData, preferredExperience: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-xs font-sans-ui focus:outline-none focus:border-[#D71920] transition-colors rounded-sm border ${
                        isGarageLight
                          ? 'bg-white border-black/15 text-[#111415]'
                          : 'bg-[#0B0D0E] border-white/[0.08] text-[#F4F3EF]'
                      }`}
                    >
                      <option value="Private Showroom Viewing">Private Showroom Viewing</option>
                      <option value="Track Session — Silverstone">Track Session — Silverstone</option>
                      <option value="RouteOne R1 Concept Allocation">RouteOne R1 Concept Allocation</option>
                      <option value="VIP Full Day Experience">VIP Full Day Experience</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Date */}
                <div>
                  <label
                    className={`block text-xs mb-1.5 ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                    }`}
                  >
                    Preferred date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-xs font-sans-ui focus:outline-none focus:border-[#D71920] transition-colors rounded-sm border ${
                      isGarageLight
                        ? 'bg-white border-black/15 text-[#111415] [color-scheme:light]'
                        : 'bg-[#0B0D0E] border-white/[0.08] text-[#F4F3EF] [color-scheme:dark]'
                    }`}
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    className={`block text-xs mb-1.5 ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide additional details regarding vehicle preferences, track requirements, or scheduling..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-xs font-sans-ui focus:outline-none focus:border-[#D71920] transition-colors resize-none rounded-sm border ${
                      isGarageLight
                        ? 'bg-white border-black/15 text-[#111415] placeholder-[#8C9399]'
                        : 'bg-[#0B0D0E] border-white/[0.08] text-[#F4F3EF] placeholder-[#45494A]'
                    }`}
                  />
                </div>

                {/* CTA: SEND INQUIRY */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#D71920] hover:bg-[#b5141a] text-white text-[11px] font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-[#D71920]/20 disabled:opacity-50 rounded-sm"
                  >
                    <span>{isSubmitting ? 'Transmitting...' : 'Send inquiry'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
