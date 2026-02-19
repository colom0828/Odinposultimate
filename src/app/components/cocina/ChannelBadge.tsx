'use client';

import { Laptop, MonitorCheck, Code2, Globe, Smartphone } from 'lucide-react';

type Channel = 'ODIN' | 'POS_EXTERNO' | 'API' | 'WEB' | 'MOBILE';

interface ChannelBadgeProps {
  channel: Channel;
  size?: 'sm' | 'md';
}

export function ChannelBadge({ channel, size = 'sm' }: ChannelBadgeProps) {
  const channelConfig = {
    ODIN: {
      label: 'ODIN',
      icon: Laptop,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
    POS_EXTERNO: {
      label: 'POS',
      icon: MonitorCheck,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
    },
    API: {
      label: 'API',
      icon: Code2,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
    },
    WEB: {
      label: 'WEB',
      icon: Globe,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
    },
    MOBILE: {
      label: 'APP',
      icon: Smartphone,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/30',
    },
  };

  const config = channelConfig[channel];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
  };

  const iconSize = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
  };

  return (
    <div
      className={`inline-flex items-center space-x-1 ${sizeClasses[size]} rounded ${config.bg} border ${config.border}`}
      title={`Origen: ${config.label}`}
    >
      <Icon className={`${iconSize[size]} ${config.color}`} />
      <span className={`font-bold ${config.color} leading-none`}>
        {config.label}
      </span>
    </div>
  );
}