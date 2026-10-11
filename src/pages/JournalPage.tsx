import React from 'react';
import { Journal } from '../components/Journal';
import { SocialCampaign } from '../components/SocialCampaign';
import { EmailCampaign } from '../components/EmailCampaign';
import { Article } from '../data/marketingData';

interface JournalPageProps {
  onSelectArticle: (article: Article) => void;
  onOpenBookingModal?: (vehicle?: string) => void;
}

/** The lower part of the Contact page: campaigns and journal articles */
export const JournalPage: React.FC<JournalPageProps> = ({ onSelectArticle, onOpenBookingModal }) => {
  return (
    <div id="journal-page" className="w-full">
      {/* Part II: Social media campaign (Grand Opening) */}
      <SocialCampaign onCta={() => onOpenBookingModal?.('Grand opening weekend drive')} />

      {/* Part III: Email marketing campaign mockup */}
      <EmailCampaign onCta={() => onOpenBookingModal?.()} />

      {/* From the journal: editorial articles */}
      <Journal onSelectArticle={onSelectArticle} />
    </div>
  );
};
