import React from 'react';
import { MessageSquare } from 'lucide-react';
import { CONTACT_CONFIG, SOCIAL_LINKS } from '../../config/contact';
import { WhatsAppButton as PrimaryWhatsAppButton } from './WhatsAppButton';

export { WhatsAppButton } from './WhatsAppButton';

interface WhatsAppGroupButtonProps {
  className?: string;
  variant?: 'default' | 'compact' | 'full';
  link?: string;
  whatsappGroupLink?: string;
  label?: string;
}

export const WhatsAppGroupButton: React.FC<WhatsAppGroupButtonProps> = ({
  className = '',
  variant = 'default',
  link,
  whatsappGroupLink,
  label = SOCIAL_LINKS.whatsappGroup.label || CONTACT_CONFIG.whatsappButtonText,
}) => {
  const targetUrl = whatsappGroupLink || link || SOCIAL_LINKS.whatsappGroup.url || CONTACT_CONFIG.whatsappGroupLink;

  return (
    <PrimaryWhatsAppButton
      whatsappGroupLink={targetUrl}
      label={label}
      className={className}
    />
  );
};

export const SocialLinks: React.FC<{ className?: string; variant?: 'default' | 'compact' | 'full' }> = ({
  className = '',
  variant = 'compact',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <WhatsAppGroupButton variant={variant} />
    </div>
  );
};

