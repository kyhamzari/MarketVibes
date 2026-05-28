import React from 'react';
import { Shield, Star, Crown } from 'lucide-react';

const configs = {
  standard: { label: 'Standard', icon: Shield, className: 'bg-slate-100 text-slate-600 border-slate-200' },
  gold: { label: 'Gold', icon: Star, className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  vip: { label: 'VIP', icon: Crown, className: 'bg-purple-50 text-purple-700 border-purple-200' },
};

export default function MembershipBadge({ tier = 'standard', size = 'sm' }) {
  const config = configs[tier] || configs.standard;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${config.className}`}>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} />
      {config.label}
    </span>
  );
}