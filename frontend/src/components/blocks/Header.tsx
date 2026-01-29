"use client"

import { Bell, User, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Center, User as UserType } from '@/types';
import { useEffect, useState } from 'react';
import { getCenter, getCurrentUser, getNotifications, setCurrentUser } from '@/lib/mockData';
import Link from 'next/link';
import Image from 'next/image';

type Page = 
  | 'home' 
  | 'login' 
  | 'signup' 
  | 'dashboard' 
  | 'center' 
  | 'booking' 
  | 'profile' 
  | 'appointments' 
  | 'notifications' 
  | 'my-reviews'
  | 'help'
  | 'legal'
  | 'privacy'
  | 'cgu'
  | 'accessibility'
  | 'contact'
  | 'sitemap';

interface HeaderProps {

}

export function Header({ }: HeaderProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Load user on mount
    useEffect(() => {
      const savedUser = getCurrentUser();
      if (savedUser) {
        setUser(savedUser);
        setCurrentPage('dashboard');
      }
    }, []);
  
    // Update unread notifications count
  useEffect(() => {
    if (user) {
      const notifications = getNotifications(user.id);
      const unread = notifications.filter(n => !n.read).length;
      setUnreadNotifications(unread);
    }
  }, [user, currentPage]);

  // Load center when needed
  useEffect(() => {
    if (selectedCenterId && (currentPage === 'center' || currentPage === 'booking')) {
      const center = getCenter(selectedCenterId);
      if (center) {
        setSelectedCenter(center);
      }
    }
  }, [selectedCenterId, currentPage]);

  const handleNavigate = (page: string, centerId?: string) => {
    if (centerId) {
      setSelectedCenterId(centerId);
    }
    setCurrentPage(page as Page);
    window.scrollTo(0, 0);
  };

  const handleLogin = () => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <a href="#main-content" className="sr-only focus:not-sr-only px-6 h-10 bg-primary text-primary-foreground rounded-md focus:absolute focus:top-4 focus:left-4">
        Aller au contenu principal
      </a>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href={"/"} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-primary-foreground">
              <Image
                src={"/logo.png"}
                alt='Logo MyAccess'
                width={512}
                height={512}
              />
              <span className="sr-only">Logo</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.7"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="tracking-tight text-primary">MyAccess</span>
              <span className="text-xs text-muted-foreground">Centres accessibles</span>
            </div>
          </Link>

          {user && (
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={() => window.location.href =('/dashboard')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Centres
              </button>
              {/*<button 
                onClick={() => window.location.href =('/appointments')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Mes rendez-vous
              </button>*/}
              <button 
                onClick={() => window.location.href =('/help')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Aide
              </button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label='Notifications'
                onClick={() => window.location.href =('/notifications')}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label='Paramètres utilisateurs'>
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href =('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Mon profil
                  </DropdownMenuItem>
                  {/*<DropdownMenuItem onClick={() => window.location.href =('/appointments')}>
                    Mes rendez-vous
                  </DropdownMenuItem>*/}
                  <DropdownMenuItem onClick={() => window.location.href =('/my-reviews')}>
                    Mes avis
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <a href='login' className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3">
                Connexion
              </a>
              <a href='signup' className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3">
                S'inscrire
              </a>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
