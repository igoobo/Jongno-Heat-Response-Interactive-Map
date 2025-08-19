import { Menu, MapPin, Flame } from 'lucide-react';

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
    label: 'Heat Guide',
    icon: Flame,
  },
];
