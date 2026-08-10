import React from 'react';
import { MessageSquare } from 'lucide-react';
import { CONTACT_CONFIG } from '../../config/contact';

export interface WhatsAppButtonProps {
  whatsappGroupLink?: string;
  link?: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  whatsappGroupLink,
  link,
  label = CONTACT_CONFIG.whatsappButtonText || 'Join WhatsApp Group',
  className = '',
  children,
}) => {
  const targetUrl = whatsappGroupLink || link || CONTACT_CONFIG.whatsappGroupLink;

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-primary space-x-2 text-xs font-semibold ${className}`}
    >
      <MessageSquare className="w-4 h-4 fill-white shrink-0" />
      {children || <span>{label}</span>}
    </a>
  );
};

export default WhatsAppButton;
