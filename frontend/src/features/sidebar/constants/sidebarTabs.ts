import { MapPin, Layers, Flame, MessageSquare } from 'lucide-react';

export const SIDEBAR_TABS = [
  {
    id: 'info',
    title: 'Info',
    icon: MapPin,
  },
  {
    id: 'layers',
    title: 'Layers',
    icon: Layers,
  },
  {
    id: 'heat-illness',
    title: 'Heat Illness Guide',
    icon: Flame,
  },
  {
    id: 'chat',
    title: 'Chat',
    icon: MessageSquare,
  },
];
