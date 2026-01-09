import { MapPin, Phone, Clock, Star } from 'lucide-react';
import { Center } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface CenterCardProps {
  center: Center;
  onViewDetails: (center: Center) => void;
}

export function CenterCard({ center, onViewDetails }: CenterCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-500';
    if (score >= 3.5) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="mb-1 line-clamp-2">{center.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{center.address}, {center.city}</span>
            </div>
          </div>
          <div className={`flex items-center gap-1 ml-2 ${getScoreColor(center.globalScore)}`}>
            <Star className="h-5 w-5" fill="currentColor" />
            <span className="font-medium">{center.globalScore}</span>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Accessibilité physique</span>
            <span className="font-medium">{center.accessibilityScore.physique}/5</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`absolute inset-y-0 left-0 ${getProgressColor(center.accessibilityScore.physique)}`}
              style={{ width: `${(center.accessibilityScore.physique / 5) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Accessibilité numérique</span>
            <span className="font-medium">{center.accessibilityScore.numerique}/5</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`absolute inset-y-0 left-0 ${getProgressColor(center.accessibilityScore.numerique)}`}
              style={{ width: `${(center.accessibilityScore.numerique / 5) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Qualité de l'accueil</span>
            <span className="font-medium">{center.accessibilityScore.accueil}/5</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`absolute inset-y-0 left-0 ${getProgressColor(center.accessibilityScore.accueil)}`}
              style={{ width: `${(center.accessibilityScore.accueil / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-3">
          <Badge variant="outline">
            {center.type === 'both' ? 'Vaccination & Dépistage' : 
             center.type === 'vaccination' ? 'Vaccination' : 'Dépistage'}
          </Badge>
          {center.reviews.length > 0 && (
            <Badge variant="secondary">
              {center.reviews.length} avis
            </Badge>
          )}
        </div>

        <div className="space-y-1 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{center.hours}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{center.phone}</span>
          </div>
        </div>

        <Button onClick={() => onViewDetails(center)} className="w-full">
          Voir les détails
        </Button>
      </CardContent>
    </Card>
  );
}
