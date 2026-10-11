import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Mail, Users, CalendarClock, Target, Monitor, Smartphone, Check, ChevronsDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { setCampaignSource } from '../services/api';

interface EmailCampaignProps {
  /** Lets the email's button open the real booking form, so the mockup is clickable */
  onCta?: () => void;
}

const EMAIL_SRC = '/email/stop-the-route/email.html';
/** Visible height of the email window; the rest scrolls inside it */
const VIEW_HEIGHT = 560;
const SUBJECT = 'Stop the Route: Your dream supercar is waiting inside';
const PREHEADER = "Meet the Scuderia Ferrari SF-26. You've seen the speed. Now experience it.";

/**
 * Part III — Email marketing mockup.
 * Shows the group's "Stop the Route" email (public/email/stop-the-route/email.html)
 * as it would land in an inbox. The email itself is not actually sent.
 */
export const EmailCampaign: React.FC<EmailCampaignProps> = ({ onCta }) => {
  const { isGarageLight } = useTheme();
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
  const [height, setHeight] = useState(1100);
  const [atEnd, setAtEnd] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const ctaRef = useRef(onCta);
  ctaRef.current = onCta;

  const muted = isGarageLight ? 'text-[#5F656B]' : 'text-[#8E9394]';
  const strong = isGarageLight ? 'text-[#101214]' : 'text-[#F4F3EF]';
  const panel = isGarageLight ? 'bg-white border-black/10' : 'bg-[#111415] border-white/10';

  // Fit the frame to the email's height, and make its links open the booking form in place
  const wireUpEmail = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc?.body) return;
    setHeight(Math.ceil(doc.documentElement.scrollHeight) + 2);
    const win = doc.defaultView;
    if (win && !(win as Window & { __wired?: boolean }).__wired) {
      (win as Window & { __wired?: boolean }).__wired = true;
      win.addEventListener(
        'scroll',
        () => setAtEnd(win.scrollY + win.innerHeight >= doc.documentElement.scrollHeight - 24),
        { passive: true }
      );
    }
    doc.querySelectorAll<HTMLAnchorElement>('a[href*="source=email"]').forEach((a) => {
      if (a.dataset.wired) return;
      a.dataset.wired = '1';
      a.addEventListener('click', (e) => {
        if (!ctaRef.current) return; // no handler: let the link open the site normally
        e.preventDefault();
        setCampaignSource('email');
        ctaRef.current();
      });
    });
  }, []);

  // Re-measure after switching between desktop and phone width (the email reflows)
  useEffect(() => {
    const t = setTimeout(wireUpEmail, 350);
    return () => clearTimeout(t);
  }, [view, wireUpEmail]);

  // Part III checklist: what the email contains
  const contents = ['Company logo', 'Subject line', 'Promotional banner', 'Main message', 'Call-to-action button', 'Company info and social links'];

  const facts = [
    { icon: Mail, label: 'Subject line', value: SUBJECT },
    { icon: Users, label: 'Sent to', value: 'Club members and newsletter subscribers' },
    { icon: CalendarClock, label: 'Promotes', value: 'New release: the Scuderia Ferrari SF-26' },
    { icon: Target, label: 'Call to action', value: '“Drive the Extraordinary Now!” opens the booking form' },
  ];

  return (
    <section
      id="email-campaign-section"
      className={`w-full px-6 md:px-10 py-16 border-b ${
        isGarageLight ? 'bg-[#F1F2EF] border-black/10' : 'bg-[#0E1012] border-white/[0.08]'
      }`}
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-14 items-center">
        {/* Campaign brief */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-1.5 h-1.5 bg-[#D71920]" />
            <span className={`text-xs ${muted}`}>Email campaign</span>
          </div>
          <h2 className={`font-heading text-3xl sm:text-4xl ${strong}`}>Stop the Route</h2>
          <p className={`text-sm leading-relaxed mt-3 max-w-md ${muted}`}>
            Our new-release email announcing the Scuderia Ferrari SF-26. It invites readers to stop scrolling and
            come drive it, and its button takes them straight to booking. This is a preview of how it looks in an
            inbox.
          </p>

          <dl className="mt-6 grid sm:grid-cols-2 gap-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className={`p-4 border flex gap-3 rounded-sm ${panel}`}>
                <Icon className="w-4 h-4 mt-0.5 text-[#D71920] shrink-0" />
                <div>
                  <dt className={`text-xs ${muted}`}>{label}</dt>
                  <dd className={`text-sm mt-0.5 ${strong}`}>{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <h3 className={`font-heading text-base mt-7 mb-3 ${strong}`}>What’s in the email</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
            {contents.map((item) => (
              <li key={item} className={`flex items-start gap-2 text-sm ${muted}`}>
                <Check className="w-4 h-4 mt-0.5 text-[#D71920] shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-7 hidden sm:flex flex-wrap items-center gap-3">
            <div className={`inline-flex p-1 border ${panel}`} role="group" aria-label="Preview size">
              {(
                [
                  ['desktop', Monitor, 'Desktop'],
                  ['mobile', Smartphone, 'Phone'],
                ] as const
              ).map(([key, Icon, label]) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  aria-pressed={view === key}
                  className={`h-8 px-3 text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                    view === key ? 'bg-[#D71920] text-white' : muted
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inbox mockup */}
        <div
          className={`border overflow-hidden shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] mx-auto w-full transition-[max-width] duration-300 ${panel} ${
            view === 'mobile' ? 'max-w-[380px]' : 'max-w-[720px]'
          }`}
        >
          {/* Email client header */}
          <div className={`px-5 py-4 border-b ${isGarageLight ? 'border-black/[0.07]' : 'border-white/[0.07]'}`}>
            <div className="flex items-center gap-1.5 mb-3" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            </div>
            <p className={`text-base font-semibold leading-snug ${strong}`}>{SUBJECT}</p>
            <div className="mt-2 flex items-center gap-2.5">
              <img
                src="/images/brand/routeone-logo.png"
                alt=""
                className="w-9 h-9 object-contain rounded-full bg-[#F6F7F5] p-1.5 border border-black/10"
              />
              <div className="min-w-0 text-xs">
                <p className={strong}>
                  <span className="font-semibold">RouteOne Auto Club</span>{' '}
                  <span className={muted}>&lt;hello@routeoneautoclub.com&gt;</span>
                </p>
                <p className={`truncate ${muted}`}>To: Ms. J. Mendez · {PREHEADER}</p>
              </div>
            </div>
          </div>

          {/* The email itself (always light, like a real email client); scroll inside to read it all */}
          <div className="relative bg-[#ECEDEA] p-2 sm:p-4">
            <iframe
              ref={frameRef}
              src={EMAIL_SRC}
              title={`Email preview: ${SUBJECT}`}
              onLoad={wireUpEmail}
              loading="lazy"
              className="block mx-auto w-full max-w-[600px] bg-white border-0"
              style={{ height: Math.min(height, VIEW_HEIGHT) }}
            />
            {height > VIEW_HEIGHT && !atEnd && (
              <div
                className="pointer-events-none absolute left-0 right-0 bottom-0 h-16 flex items-end justify-center pb-3"
                style={{ background: 'linear-gradient(180deg, rgba(236,237,234,0) 0%, rgba(236,237,234,0.95) 85%)' }}
                aria-hidden="true"
              >
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full shadow-sm"
                  style={{ background: '#FFFFFF', color: '#5F656B' }}
                >
                  <ChevronsDown className="w-3 h-3" style={{ color: '#D71920' }} /> Scroll to read the full email
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailCampaign;
