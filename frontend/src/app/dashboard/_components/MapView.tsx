"use client"

import { useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Center } from '@/types';
import { Badge } from '@/components/ui/badge';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';

interface MapViewProps {
  centers: Center[];
  selectedCenter: Center | null;
  onSelectCenter: (center: Center) => void;
}

export function MapView({ centers, selectedCenter, onSelectCenter }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  // Simple map simulation using a grid layout
  // In production, this would use react-leaflet or similar
  
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-500';
    if (score >= 3.5) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 4.5) return 'default';
    if (score >= 3.5) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="h-full bg-muted/20 rounded-lg border relative overflow-hidden z-48">
      <MapContainer center={[48.8566, 2.3522]} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Center Markers */}
        {centers.map((center, index) => {

          const iconHTML = new L.DivIcon({
            className: `w-8! h-8! rounded-full ${getScoreColor(center.globalScore)} 
                        flex! items-center justify-center text-white shadow-lg 
                        ${selectedCenter?.id === center.id ? 'ring-4 ring-primary' : ''}`,
            html: `<div aria-label="${center.name}, score ${center.globalScore}/5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            
            
          });
          
          return (
            <Marker key={center.id} position={[center.latitude, center.longitude]} icon={iconHTML}>
                <Popup>
                  {/* Tooltip on hover */}
                  <p className="text-sm mb-1!">{center.name}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getScoreBadgeVariant(center.globalScore)} className="text-xs">
                      {center.globalScore}/5
                    </Badge>
                    <span className="text-xs text-muted-foreground">{center.city}</span>
                  </div>
                  <Link
                    href={"center/" + center.id}
                    className='w-full text-center'
                  >Voir les détails</Link>
                </Popup>
            </Marker>
          );
        })}

      </MapContainer>

      {/* Map Header */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-1000">
        <div className="flex items-center gap-2 text-sm mb-2">
          <MapPin className="h-4 w-4" />
          <span>Paris et environs</span>
        </div>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Excellent (4.5+)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Bon (3.5+)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span>Moyen</span>
          </div>
        </div>
      </div>

      {/* Selected Center Info */}
      {selectedCenter && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-white rounded-lg shadow-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="mb-1">{selectedCenter.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedCenter.address}, {selectedCenter.city}</p>
            </div>
            <button 
              onClick={() => onSelectCenter(selectedCenter)}
              className="text-primary hover:underline text-sm"
            >
              Voir détails →
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <Badge variant={getScoreBadgeVariant(selectedCenter.globalScore)}>
              Note globale: {selectedCenter.globalScore}/5
            </Badge>
            <Badge variant="outline">
              {selectedCenter.type === 'both' ? 'Vaccination & Dépistage' : 
               selectedCenter.type === 'vaccination' ? 'Vaccination' : 'Dépistage'}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
