import { HandicapType } from '@/types';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface FilterPanelProps {
  selectedHandicaps: HandicapType[];
  onHandicapChange: (handicaps: HandicapType[]) => void;
  minScore: number;
  onMinScoreChange: (score: number) => void;
  centerType: 'all' | 'vaccination' | 'depistage' | 'both';
  onCenterTypeChange: (type: 'all' | 'vaccination' | 'depistage' | 'both') => void;
}

const handicapTypes: { value: HandicapType; label: string; icon: string }[] = [
  { value: 'moteur', label: 'Handicaps moteurs', icon: '🦽' },
  { value: 'sensoriel', label: 'Handicaps sensoriels', icon: '👁️' },
  { value: 'mental', label: 'Handicaps mentaux', icon: '🧠' },
  { value: 'psychique', label: 'Handicaps psychiques', icon: '💭' },
  { value: 'cognitif', label: 'Handicaps cognitifs', icon: '🎯' },
];

export function FilterPanel({
  selectedHandicaps,
  onHandicapChange,
  minScore,
  onMinScoreChange,
  centerType,
  onCenterTypeChange,
}: FilterPanelProps) {
  const toggleHandicap = (handicap: HandicapType) => {
    if (selectedHandicaps.includes(handicap)) {
      onHandicapChange(selectedHandicaps.filter(h => h !== handicap));
    } else {
      onHandicapChange([...selectedHandicaps, handicap]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres de recherche
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Type de centre */}
        <div>
          <Label className="mb-3 block">Type de centre</Label>
          <Select value={centerType} onValueChange={(value: any) => onCenterTypeChange(value)} aria-label="Sélectionner le type de centre">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les centres</SelectItem>
              <SelectItem value="vaccination">Vaccination uniquement</SelectItem>
              <SelectItem value="depistage">Dépistage uniquement</SelectItem>
              <SelectItem value="both">Vaccination & Dépistage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Score minimum */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <Label>Score d'accessibilité minimum</Label>
            <span className="text-sm text-muted-foreground">{minScore}/5</span>
          </div>
          <Slider
            value={[minScore]}
            onValueChange={(values: any) => onMinScoreChange(values[0])}
            min={0}
            max={5}
            step={0.5}
            className="mb-2"
            aria-label="Score d'accessibilité minimum"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>5</span>
          </div>
        </div>

        {/* Types de handicap */}
        <div>
          <Label className="mb-3 block">Filtrer par type de handicap</Label>
          <div className="space-y-3">
            {handicapTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`filter-${type.value}`}
                  checked={selectedHandicaps.includes(type.value)}
                  onCheckedChange={() => toggleHandicap(type.value)}
                />
                <label
                  htmlFor={`filter-${type.value}`}
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Reset filters */}
        <button
          onClick={() => {
            onHandicapChange([]);
            onMinScoreChange(0);
            onCenterTypeChange('all');
          }}
          className="w-full text-sm text-primary hover:underline"
        >
          Réinitialiser les filtres
        </button>
      </CardContent>
    </Card>
  );
}
