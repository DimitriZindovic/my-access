import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Center } from '@/types';
import { Badge } from '@/components/ui/badge';

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
    <div className="h-full bg-muted/20 rounded-lg border relative overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
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

      {/* Simulated Map with Markers */}
      <div 
        ref={mapRef}
        className="w-full h-full relative bg-gradient-to-br from-blue-50 to-green-50"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      >
        {/* Paris center reference */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-blue-600 mt-3">
          Paris
        </div>

        {/* Center Markers */}
        {centers.map((center, index) => {
          // Position relative to Paris (simplified positioning)
          const offsetX = (center.longitude - 2.3522) * 2000;
          const offsetY = -(center.latitude - 48.8566) * 2000;
          
          return (
            <button
              key={center.id}
              onClick={() => onSelectCenter(center)}
              className={`absolute group transition-transform hover:scale-110 ${
                selectedCenter?.id === center.id ? 'z-20 scale-110' : 'z-10'
              }`}
              style={{
                left: `calc(50% + ${offsetX}px)`,
                top: `calc(50% + ${offsetY}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className={`w-8 h-8 rounded-full ${getScoreColor(center.globalScore)} 
                flex items-center justify-center text-white shadow-lg 
                ${selectedCenter?.id === center.id ? 'ring-4 ring-primary' : ''}`}>
                <MapPin className="h-5 w-5" fill="currentColor" />
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-white rounded-lg shadow-xl p-3 min-w-[200px] whitespace-nowrap">
                  <p className="text-sm mb-1">{center.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={getScoreBadgeVariant(center.globalScore)} className="text-xs">
                      {center.globalScore}/5
                    </Badge>
                    <span className="text-xs text-muted-foreground">{center.city}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
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
