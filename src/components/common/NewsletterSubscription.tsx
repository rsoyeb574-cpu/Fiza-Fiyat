import React, { useState } from 'react';
import { Send, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { sendInquiry } from '../../services/db';

export interface NewsletterSubscriptionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  placeholder?: string;
  className?: string;
  variant?: 'banner' | 'card' | 'compact';
  onSuccess?: (email: string) => void;
}

export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  title = 'Subscribe to Fiza-Fiya Industry Reports',
  description = 'Receive curated monthly architectural briefs, BIM workflow innovations, and generative AI design case studies.',
  buttonText = 'Subscribe',
  placeholder = 'Enter your corporate email...',
  className = '',
  variant = 'banner',
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      await sendInquiry({
        name: 'Newsletter Subscriber',
        email: email.trim(),
        service: 'Newsletter Subscription',
        message: `Subscribed to newsletter updates from ${email.trim()}`
      });
      setSubscribed(true);
      if (onSuccess) {
        onSuccess(email.trim());
      }
      setEmail('');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className={`p-6 rounded-3xl bg-[#151B2E] border border-emerald-500/30 text-emerald-400 backdrop-blur-2xl ${className}`}>
        <div className="flex items-center space-x-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-white">Subscription Confirmed!</h4>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              Thank you for subscribing to Fiza-Fiya Insights. Look out for our upcoming industry reports!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        {title && (
          <h4 id="newsletter-compact-heading" className="text-xs font-bold uppercase tracking-wider text-white">
            {title}
          </h4>
        )}
        {description && (
          <p className="text-slate-400 text-xs leading-relaxed">
            {description}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="newsletter-email-compact"
              type="email"
              required
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1020]/80 border border-indigo-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
          </div>
          {error && <p className="text-rose-400 text-[11px]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-2.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Subscribing...' : buttonText}</span>
            <Send className="w-3.5 h-3.5 shrink-0" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`p-8 rounded-3xl bg-[#151B2E] border border-indigo-500/30 backdrop-blur-2xl relative overflow-hidden shadow-2xl ${className}`}>
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span>Global Architecture & AI Insights</span>
          </div>
          <h3 id="newsletter-banner-heading" className="text-2xl font-bold text-white tracking-tight">
            {title}
          </h3>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="newsletter-email-banner"
                type="email"
                required
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0B1020]/80 border border-indigo-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all backdrop-blur-md"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all cursor-pointer flex items-center justify-center space-x-2 shrink-0 hover:-translate-y-0.5 disabled:opacity-50"
            >
              <span>{loading ? 'Subscribing...' : buttonText}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          {error && <p className="text-rose-400 text-xs mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default NewsletterSubscription;
