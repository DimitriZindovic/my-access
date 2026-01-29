"use client";

import { Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getNotifications } from "@/lib/mockData";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Update unread notifications count
  useEffect(() => {
    if (user) {
      const notifications = getNotifications(user.id);
      const unread = notifications.filter((n) => !n.read).length;
      setUnreadNotifications(unread);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const displayName = user
    ? user.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : user.email.split("@")[0]
    : "";

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only px-6 h-10 bg-primary text-primary-foreground rounded-md focus:absolute focus:top-4 focus:left-4 focus:flex focus:items-center"
      >
        Aller au contenu principal
      </a>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <span className="sr-only">Logo</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  fill="currentColor"
                  opacity="0.7"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="tracking-tight text-primary">MyAccess</span>
              <span className="text-xs text-muted-foreground">
                Centres accessibles
              </span>
            </div>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex gap-6" aria-label="Navigation principale">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Recherche
              </Link>
              <Link
                href="/appointments"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Mes rendez-vous
              </Link>
              <Link
                href="/help"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Aide
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
          ) : isAuthenticated && user ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => router.push("/notifications")}
                aria-label={`Notifications${unreadNotifications > 0 ? `, ${unreadNotifications} non lues` : ""}`}
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
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
                  <Button variant="ghost" size="icon" aria-label="Menu utilisateur">
                    <User className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/appointments")}>
                    Mes rendez-vous
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/my-reviews")}>
                    Mes avis
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
              >
                S&apos;inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
