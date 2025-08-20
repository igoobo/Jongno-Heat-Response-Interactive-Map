import { Menu, MapPin, Flame, MessageSquare } from 'lucide-react';

export const MOBILE_NAV_BUTTONS = [
  {
    sidebarType: 'location',
    label: 'Location',
    icon: MapPin,
  },
  {
    sidebarType: 'menu',
    label: 'Menu',
    icon: Menu,
  },
  {
    sidebarType: 'heatGuide',
    label: 'Heat',
    icon: Flame,
  },
  {
    sidebarType: 'chat',
    label: 'Chat',
    icon: MessageSquare,
  },
];
