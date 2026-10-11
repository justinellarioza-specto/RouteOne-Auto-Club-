import React, { useState } from 'react';
import {
  Instagram,
  Facebook,
  Youtube,
  Share2,
  Copy,
  Check,
  ArrowRight,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Target,
  Users,
  Hash,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { campaignLink, CampaignChannel, setCampaignSource } from '../services/api';

interface SocialCampaignProps {
  /** Opens the booking form from the post's button, so the mockup is clickable */
  onCta?: () => void;
}

const HASHTAG = '#RouteOneGrandOpening';

/**
 * Part II: Social media marketing campaign.
 * Campaign type: Grand Opening. The poster is shown as an Instagram post, beside the campaign plan.
 */
export const SocialCampaign: React.FC<SocialCampaignProps> = ({ onCta }) => {
  const { isGarageLight } = useTheme();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  const muted = isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]';
  const strong = isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]';
  const gold = isGarageLight ? 'text-[#9C7D2B]' : 'text-[#C9B37E]';
  const panel = isGarageLight ? 'bg-[#F6F7F5] border-black/10' : 'bg-[#111415] border-white/[0.08]';
  const line = isGarageLight ? 'border-black/10' : 'border-white/[0.06]';

  const copyLink = (channel: CampaignChannel) => {
    navigator.clipboard?.writeText(campaignLink(channel));
    setCopiedLink(channel);
    setTimeout(() => setCopiedLink(null), 1800);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(HASHTAG);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const facts = [
    { icon: Target, label: 'Goal', value: 'Announce the club’s opening at Silverstone and fill the opening-weekend drives' },
    { icon: Users, label: 'Audience', value: 'Car enthusiasts, collectors and F1 fans in the UK' },
    { icon: Hash, label: 'Hashtags', value: `${HASHTAG}\n#DriveTheExtraordinary` },
  ];

  const rollout = [
    {
      when: '2 weeks before',
      title: 'Tease',
      text: 'The Grand Opening poster goes up on Instagram and Facebook, with countdown stories and short engine-sound clips on TikTok.',
    },
    {
      when: 'Opening day',
      title: 'Launch',
      text: 'Live stories from the paddock, a YouTube premiere of the first hot laps, and the poster pinned on every profile.',
    },
    {
      when: 'Week after',
      title: 'Keep it going',
      text: `Visitors’ photos reposted with ${HASHTAG}, plus a first-week booking offer for followers.`,
    },
  ];

  const channels = [
    {
      platform: 'Instagram',
      handle: '@routeoneautoclub',
      icon: Instagram,
      url: 'https://instagram.com/routeoneautoclub',
      note: 'The poster, countdown stories and opening-day Reels',
    },
    {
      platform: 'Facebook',
      handle: 'RouteOne Auto Club',
      icon: Facebook,
      url: 'https://facebook.com/routeoneautoclub',
      note: 'An event page with RSVP, the poster as cover photo',
    },
    {
      platform: 'TikTok',
      handle: '@routeoneautoclub',
      icon: Share2,
      url: 'https://tiktok.com/@routeoneautoclub',
      note: 'Short engine-sound teasers counting down the days',
    },
    {
      platform: 'YouTube',
      handle: 'RouteOne Auto Club',
      icon: Youtube,
      url: 'https://youtube.com/@routeoneautoclub',
      note: 'A premiere of the first hot laps on opening day',
    },
  ];

  return (
    <section
      id="social-campaign-section"
      className={`w-full px-6 md:px-10 py-16 border-b transition-colors duration-200 ${
        isGarageLight ? 'bg-white border-black/10' : 'bg-[#0B0D0E] border-white/[0.08]'
      }`}
    >
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-10 border-b gap-4 ${line}`}>
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-1.5 h-1.5 bg-[#D71920]" />
            <span className={`text-xs ${muted}`}>Social media campaign</span>
          </div>
          <h2 className={`font-heading text-3xl sm:text-4xl font-semibold uppercase ${strong}`}>Grand Opening</h2>
          <p className={`font-heading text-lg sm:text-xl mt-2 ${gold}`}>RouteOne opens its doors at Silverstone.</p>
        </div>

        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-2 px-3 py-1.5 border hover:border-[#D71920] text-xs transition-colors cursor-pointer self-start sm:self-auto rounded-sm ${
            isGarageLight
              ? 'bg-[#F6F7F5] border-black/15 text-[#565C62] hover:text-[#111415]'
              : 'border-white/[0.1] bg-[#111415] text-[#AEB4B5] hover:text-[#F4F3EF]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#D71920]" />
              <span>Copied {HASHTAG}</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy hashtag</span>
            </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-[420px_minmax(0,1fr)] xl:grid-cols-[440px_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
        {/* The poster, shown as an Instagram post */}
        <article
          aria-label="Grand Opening post on Instagram"
          className={`w-full max-w-[440px] mx-auto lg:mx-0 lg:sticky lg:top-24 border rounded-lg overflow-hidden shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] ${
            isGarageLight ? 'bg-white border-black/10' : 'bg-[#111415] border-white/10'
          }`}
        >
          <header className="flex items-center gap-3 px-4 py-3">
            <span className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#F9CE34] via-[#EE2A7B] to-[#6228D7] shrink-0">
              <span className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <img src="/images/brand/routeone-logo.png" alt="" className="w-6 h-auto" />
              </span>
            </span>
            <div className="min-w-0 leading-tight">
              <p className={`text-sm font-semibold ${strong}`}>routeoneautoclub</p>
              <p className={`text-xs ${muted}`}>Silverstone Circuit</p>
            </div>
            <span className={`ml-auto text-xs ${muted}`}>Sponsored</span>
          </header>

          <img
            src="/images/campaign/grand-opening.webp"
            srcSet="/images/campaign/grand-opening-640.webp 640w, /images/campaign/grand-opening.webp 1080w"
            sizes="(min-width: 1024px) 420px, 100vw"
            width={1080}
            height={1080}
            loading="lazy"
            alt="Grand Opening poster: a red Formula 1 car speeding through a corner with the RouteOne name painted on the track"
            className="w-full h-auto block rounded-none"
          />

          {/* Call to action bar, like Instagram's "Book now" */}
          <button
            type="button"
            onClick={() => {
              setCampaignSource('instagram');
              onCta?.();
            }}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#D71920] hover:bg-[#B5141A] text-white text-sm font-semibold cursor-pointer transition-colors"
          >
            <span>Book your opening-weekend drive</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="px-4 pt-3 pb-4">
            <div className={`flex items-center gap-4 ${strong}`}>
              <button
                type="button"
                onClick={() => setLiked((v) => !v)}
                aria-pressed={liked}
                aria-label={liked ? 'Unlike' : 'Like'}
                className="cursor-pointer"
              >
                <Heart className={`w-5 h-5 transition-colors ${liked ? 'fill-[#ED4956] text-[#ED4956]' : ''}`} />
              </button>
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              <Send className="w-5 h-5" aria-hidden="true" />
              <Bookmark className="w-5 h-5 ml-auto" aria-hidden="true" />
            </div>
            <p className={`text-sm font-semibold mt-2.5 ${strong}`}>{liked ? '2,419' : '2,418'} likes</p>
            <p className={`text-sm mt-1 leading-relaxed ${strong}`}>
              <span className="font-semibold">routeoneautoclub</span>{' '}
              <span className={isGarageLight ? 'text-[#2B3035]' : 'text-[#C9CDCE]'}>
                We’re open. 🏁 RouteOne Auto Club officially opens its doors at Silverstone. Come see the
                collection, take your first laps and meet the team. Book your drive at the link in our bio.
              </span>{' '}
              <span className="text-[#3B6FB6]">{HASHTAG} #DriveTheExtraordinary #Silverstone</span>
            </p>
            <p className={`text-xs mt-2 ${muted}`}>View all 186 comments</p>
          </div>
        </article>

        {/* Campaign plan */}
        <div className="min-w-0">
          <p className={`text-base leading-relaxed max-w-2xl ${isGarageLight ? 'text-[#2B3035]' : 'text-[#C9CDCE]'}`}>
            Our launch campaign for opening weekend. One poster, shared across four platforms, takes followers from
            “what is this?” to booking their first drive, and every post links back with its own tag so we can see
            which platform brings the bookings.
          </p>

          {/* Key facts */}
          <dl className={`mt-8 grid xl:grid-cols-3 border-y ${line} xl:divide-x ${isGarageLight ? 'divide-black/10' : 'divide-white/[0.08]'}`}>
            {facts.map(({ icon: Icon, label, value }, i) => (
              <div key={label} className={`py-4 xl:px-5 ${i === 0 ? 'xl:pl-0' : ''} ${i > 0 ? `border-t xl:border-t-0 ${line}` : ''}`}>
                <dt className={`text-xs flex items-center gap-1.5 ${muted}`}>
                  <Icon className="w-3.5 h-3.5 text-[#D71920]" /> {label}
                </dt>
                <dd className={`text-sm mt-1.5 leading-snug whitespace-pre-line ${strong}`}>{value}</dd>
              </div>
            ))}
          </dl>

          {/* Rollout: three steps side by side */}
          <h3 className={`font-heading text-lg mt-10 mb-5 ${strong}`}>Rollout</h3>
          <ol className="grid sm:grid-cols-3 gap-6 sm:gap-5">
            {rollout.map((step, i) => (
              <li key={step.title} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-full bg-[#D71920] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className={`h-px flex-1 ${i < rollout.length - 1 ? (isGarageLight ? 'bg-black/10' : 'bg-white/10') : 'bg-transparent'}`} aria-hidden="true" />
                </div>
                <p className={`text-xs ${gold}`}>{step.when}</p>
                <p className={`font-heading text-base mt-0.5 ${strong}`}>{step.title}</p>
                <p className={`text-sm leading-relaxed mt-1.5 ${muted}`}>{step.text}</p>
              </li>
            ))}
          </ol>

          {/* Platforms, each with its tracked link */}
          <h3 className={`font-heading text-lg mt-10 mb-1 ${strong}`}>Where it runs</h3>
          <p className={`text-xs mb-4 ${muted}`}>
            Each platform links to the site with its own tag, so the admin inbox shows where every booking came from.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {channels.map((ch) => {
              const Icon = ch.icon;
              const key = ch.platform.toLowerCase() as CampaignChannel;
              return (
                <li key={ch.platform} className={`p-4 border rounded-md flex flex-col ${panel}`}>
                  <div className="flex items-start gap-3">
                    <span className="w-9 h-9 rounded-full bg-[#D71920]/10 text-[#D71920] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className={`font-heading text-base leading-tight ${strong}`}>{ch.platform}</h4>
                      <a
                        href={ch.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs ${gold} hover:text-[#D71920]`}
                      >
                        {ch.handle}
                      </a>
                      <p className={`text-sm leading-snug mt-1.5 ${muted}`}>{ch.note}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyLink(key)}
                    className={`mt-3 ml-12 self-start inline-flex items-center gap-2 px-2.5 py-1 border rounded text-xs cursor-pointer transition-colors ${
                      isGarageLight ? 'bg-white border-black/10 hover:border-[#D71920]/50' : 'bg-black/20 border-white/10 hover:border-[#D71920]/50'
                    }`}
                    title="Copy tracked link"
                  >
                    <code className={isGarageLight ? 'text-[#2B3035]' : 'text-[#C9CDCE]'}>/?source={key}</code>
                    {copiedLink === key ? (
                      <span className="flex items-center gap-1 text-[#D71920]">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <Copy className="w-3 h-3 opacity-60" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
