import { useState } from 'react';
import { Star } from 'lucide-react';
import { Center, User, HandicapType, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { addReview, updateCenterWithReview, addNotification } from '@/lib/mockData';

interface RatingFormProps {
  center: Center;
  user: User;
  onSubmit: () => void;
  onCancel: () => void;
}

const handicapTypes: { value: HandicapType; label: string }[] = [
  { value: 'moteur', label: 'Handicaps moteurs' },
  { value: 'sensoriel', label: 'Handicaps sensoriels' },
  { value: 'mental', label: 'Handicaps mentaux' },
  { value: 'psychique', label: 'Handicaps psychiques' },
  { value: 'cognitif', label: 'Handicaps cognitifs' },
];

export function RatingForm({ center, user, onSubmit, onCancel }: RatingFormProps) {
  const [scores, setScores] = useState({
    physique: 0,
    numerique: 0,
    accueil: 0,
  });
  const [comment, setComment] = useState('');
  const [selectedHandicaps, setSelectedHandicaps] = useState<string[]>(user.handicapType?.split(';') || []);
  const [hoveredScores, setHoveredScores] = useState({
    physique: 0,
    numerique: 0,
    accueil: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (scores.physique === 0 || scores.numerique === 0 || scores.accueil === 0) {
      alert('Veuillez noter tous les critères');
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.firstName + " " + user.lastName,
      centerId: center.id,
      date: new Date().toISOString(),
      scores,
      comment,
      handicapTypes: selectedHandicaps,
      helpfulCount: 0,
    };

    addReview(review);
    updateCenterWithReview(center.id, review);

    // Add notification
    addNotification({
      id: Date.now().toString(),
      userId: user.id,
      title: 'Avis publié',
      message: `Votre avis sur ${center.name} a été publié avec succès.`,
      date: new Date().toISOString(),
      read: false,
      type: 'review',
    });

    onSubmit();
  };

  const toggleHandicap = (type: HandicapType) => {
    if (selectedHandicaps.includes(type)) {
      setSelectedHandicaps(selectedHandicaps.filter(h => h !== type));
    } else {
      setSelectedHandicaps([...selectedHandicaps, type]);
    }
  };

  const renderStars = (category: 'physique' | 'numerique' | 'accueil') => {
    const currentScore = hoveredScores[category] || scores[category];
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setScores({ ...scores, [category]: star })}
            onMouseEnter={() => setHoveredScores({ ...hoveredScores, [category]: star })}
            onMouseLeave={() => setHoveredScores({ ...hoveredScores, [category]: 0 })}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-6 w-6 ${
                star <= currentScore 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border rounded-lg p-4 bg-muted/30">
      <div>
        <h3 className="mb-4">Évaluez ce centre</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Accessibilité physique</Label>
              <span className="text-sm text-muted-foreground">
                {scores.physique > 0 ? `${scores.physique}/5` : 'Non noté'}
              </span>
            </div>
            {renderStars('physique')}
            <p className="text-xs text-muted-foreground mt-1">
              Rampe d'accès, ascenseur, parking PMR, toilettes adaptées...
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Accessibilité numérique</Label>
              <span className="text-sm text-muted-foreground">
                {scores.numerique > 0 ? `${scores.numerique}/5` : 'Non noté'}
              </span>
            </div>
            {renderStars('numerique')}
            <p className="text-xs text-muted-foreground mt-1">
              Site web accessible, prise de RDV en ligne, informations claires...
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Qualité de l'accueil</Label>
              <span className="text-sm text-muted-foreground">
                {scores.accueil > 0 ? `${scores.accueil}/5` : 'Non noté'}
              </span>
            </div>
            {renderStars('accueil')}
            <p className="text-xs text-muted-foreground mt-1">
              Personnel formé, langue des signes, patience, compréhension...
            </p>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="comment">Votre commentaire (optionnel)</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience en détail pour aider la communauté..."
          className="mt-2"
          rows={4}
        />
      </div>

      <div>
        <Label className="mb-3 block">
          Type(s) de handicap concerné(s) par votre avis
        </Label>
        <div className="space-y-2">
          {handicapTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${type.value}`}
                checked={selectedHandicaps.includes(type.value)}
                onCheckedChange={() => toggleHandicap(type.value)}
              />
              <label
                htmlFor={`rating-${type.value}`}
                className="text-sm cursor-pointer"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Publier mon avis
        </Button>
      </div>
    </form>
  );
}
