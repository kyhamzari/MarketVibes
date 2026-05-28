import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus, User, MessageSquare, Search, Briefcase, GraduationCap, Plane, Phone, ArrowLeftRight, Newspaper, Users } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const LOGO = "https://media.base44.com/images/public/6a05479e7e88abc77b4bb112/a243af006_Gemini_Generated_Image_4td5no4td5no4td5.png";

function isActive(item, pathname) {
  if (item.exact) return pathname === item.to;
  if (item.startsWith) return pathname.startsWith(item.to);
  return pathname === item.to;
}

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { to: '/', labelKey: 'browse', icon: Search, exact: true },
    { to: '/messages', labelKey: 'messages', icon: MessageSquare },
    { to: '/currency', labelKey: 'currency', icon: ArrowLeftRight },
    { to: '/jobs', labelKey: 'jobs', icon: Briefcase, startsWith: true },
    { to: '/scholarships', labelKey: 'scholarships', icon: GraduationCap },
    { to: '/travels', labelKey: 'travel', icon: Plane },
    { to: '/news', labelKey: 'news', icon: Newspaper },
    { to: '/chat', labelKey: 'chat', icon: Users },
    { to: '/contact', labelKey: 'contact', icon: Phone },
    { to: '/support', labelKey: 'support', icon: MessageSquare },
    { to: '/my-listings', labelKey: 'myListings', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={LOGO} alt="K Y Hamzari Bazaar" className="h-10 w-10 rounded-lg object-cover" />
            <span className="font-display text-xl font-semibold tracking-tight hidden sm:block">K~Y~Hamzari Bazaar</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
            {navItems.map(item => (
              <Link key={item.to} to={item.to}>
                <Button variant={isActive(item, location.pathname) ? 'secondary' : 'ghost'} size="sm" className="gap-1.5 text-xs whitespace-nowrap">
                  <item.icon className="w-3.5 h-3.5" />
                  {t(item.labelKey)}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="gap-1.5 hidden sm:flex">
                <User className="w-4 h-4" />
                {user?.full_name?.split(' ')[0] || t('profile')}
              </Button>
            </Link>
            <Link to="/create">
              <Button size="sm" className="gap-1.5 rounded-full px-4">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t('sell')}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="lg:hidden flex items-center gap-1 pb-3 -mt-1 overflow-x-auto scrollbar-hide">
          {navItems.map(item => (
            <Link key={item.to} to={item.to} className="shrink-0">
              <Button variant={isActive(item, location.pathname) ? 'secondary' : 'ghost'} size="sm" className="gap-1 text-xs">
                <item.icon className="w-3.5 h-3.5" />
                {t(item.labelKey)}
              </Button>
            </Link>
          ))}
          <Link to="/profile" className="shrink-0">
            <Button variant={location.pathname === '/profile' ? 'secondary' : 'ghost'} size="sm" className="gap-1 text-xs">
              <User className="w-3.5 h-3.5" />
              {t('profile')}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}