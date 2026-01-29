"use client"

import { useState, useMemo, Suspense } from 'react';
import { Search, List, Map } from 'lucide-react';
import { Center, HandicapType, User } from '@/types';
import { getCenters } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterPanel } from './_components/FilterPanel';
import { CenterCard } from './_components/CenterCard';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import DashboardClient from './page.client';

const MapView = dynamic(() => import('./_components/MapView').then((mod) => mod.MapView), { 
  ssr: false,
});

interface DashboardProps {
  user: User | null;
  onNavigate: (page: string, centerId?: string) => void;
}

export default function Dashboard({ user, onNavigate }: DashboardProps) {
  return (
    <Suspense>
      <DashboardClient user={user} onNavigate={onNavigate} />
    </Suspense>
  );
}
