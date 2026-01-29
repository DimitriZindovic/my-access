"use client"

import { useState, useMemo } from 'react';
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

const MapView = dynamic(() => import('./_components/MapView').then((mod) => mod.MapView), { 
  ssr: false,
});

interface DashboardProps {
  user: User | null;
  onNavigate: (page: string, centerId?: string) => void;
}

export default function DashboardClient({ user, onNavigate }: DashboardProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState( searchParams.get("q") ?? '');
  const [selectedHandicaps, setSelectedHandicaps] = useState<HandicapType[]>(user?.handicapTypes || []);
  const [minScore, setMinScore] = useState(0);
  const [centerType, setCenterType] = useState<'all' | 'vaccination' | 'depistage' | 'both'>('all');
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const centers = getCenters();

  const filteredCenters = useMemo(() => {
    return centers.filter(center => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !center.name.toLowerCase().includes(query) &&
          !center.city.toLowerCase().includes(query) &&
          !center.address.toLowerCase().includes(query) &&
          !center.postalCode.includes(query)
        ) {
          return false;
        }
      }

      // Score filter
      if (center.globalScore < minScore) {
        return false;
      }

      // Center type filter
      if (centerType !== 'all') {
        if (centerType === 'both' && center.type !== 'both') {
          return false;
        } else if (centerType === 'vaccination' && center.type !== 'vaccination' && center.type !== 'both') {
          return false;
        } else if (centerType === 'depistage' && center.type !== 'depistage' && center.type !== 'both') {
          return false;
        }
      }

      return true;
    });
  }, [centers, searchQuery, minScore, centerType]);

  const handleViewDetails = (center: Center) => {
    if(typeof window === "undefined") return;
    window.location.href = "center/" + center.id
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-3 max-w-3xl">
            <div className="flex-1 relative border rounded">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ville, code postal, nom du centre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            {/*<Button variant="outline" className="gap-2">
              <Map className="h-4 w-4" />
              Itinéraire
            </Button>*/}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              selectedHandicaps={selectedHandicaps}
              onHandicapChange={setSelectedHandicaps}
              minScore={minScore}
              onMinScoreChange={setMinScore}
              centerType={centerType}
              onCenterTypeChange={setCenterType}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredCenters.length} centre{filteredCenters.length > 1 ? 's' : ''} trouvé{filteredCenters.length > 1 ? 's' : ''}
              </p>

              <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
                <TabsList>
                  <TabsTrigger value="map" className="gap-2" aria-label='Afficher la carte des centres'>
                    <Map className="h-4 w-4" />
                    Carte
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-2" aria-label='Afficher la liste des centres'>
                    <List className="h-4 w-4" />
                    Liste
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {viewMode === 'map' ? (
              <div className="h-[600px]">
                <MapView
                  centers={filteredCenters}
                  selectedCenter={selectedCenter}
                  onSelectCenter={handleViewDetails}
                />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredCenters.length > 0 ? (
                  filteredCenters.map(center => (
                    <CenterCard
                      key={center.id}
                      center={center}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-muted-foreground">
                      Aucun centre ne correspond à vos critères de recherche.
                    </p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery('');
                        setMinScore(0);
                        setCenterType('all');
                        setSelectedHandicaps([]);
                      }}
                      className="mt-2"
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
