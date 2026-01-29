"use client"

import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Globe, ArrowLeft, Calendar, Star, ThumbsUp, Navigation } from 'lucide-react';
import { Center, User, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RatingForm } from './_components/RatingForm';
import { getCenter, getCurrentUser } from '@/lib/mockData';

interface CenterDetailsClientProps {
  idCenter : string;

}

export default function CenterDetailsClient({ idCenter }: CenterDetailsClientProps) {
  const [showRatingForm, setShowRatingForm] = useState(false);

  const [user, setUser] =  useState(null as User | null);
  const [center, setCenter] = useState(undefined as Center | undefined);

  useEffect(() => { 
    const user : User | null = getCurrentUser()
    setUser(user)
    const center : Center | undefined = getCenter(idCenter)
    setCenter(center)
    }, [])

    if (!center) {
        return(
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Centre non trouvé.</p>
            </div>
        )
    }

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

  const handleGetDirections = () => {
    const address = encodeURIComponent(`${center.address}, ${center.postalCode} ${center.city}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}&travelmode=transit`, '_blank');
  };

  const onBookAppointment = (center: Center) => {
    /*setSelectedCenterId(center.id);
    setSelectedCenter(center);
    setCurrentPage('booking');*/
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => window.location.href = (user ? '/dashboard' : '/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la recherche
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h1 className="mb-2">{center.name}</h1>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`flex items-center gap-1 ${getScoreColor(center.globalScore)}`}>
                        <Star className="h-6 w-6" fill="currentColor" />
                        <span className="text-xl">{center.globalScore}</span>
                      </div>
                      <span className="text-muted-foreground">
                        ({center.reviews.length} avis)
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge>
                        {center.type === 'both' ? 'Vaccination & Dépistage' : 
                         center.type === 'vaccination' ? 'Vaccination' : 'Dépistage'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>{center.address}, {center.postalCode} {center.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${center.phone}`} className="hover:underline">{center.phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${center.email}`} className="hover:underline">{center.email}</a>
                  </div>
                  {center.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a href={center.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Site web
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{center.hours}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Scores d'accessibilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Accessibilité physique</span>
                    <span className={`${getScoreColor(center.accessibilityScore.physique)}`}>
                      {center.accessibilityScore.physique}/5
                    </span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`absolute inset-y-0 left-0 ${getProgressColor(center.accessibilityScore.physique)}`}
                      style={{ width: `${(center.accessibilityScore.physique / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Accessibilité numérique</span>
                    <span className={`${getScoreColor(center.accessibilityScore.numerique)}`}>
                      {center.accessibilityScore.numerique}/5
                    </span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`absolute inset-y-0 left-0 ${getProgressColor(center.accessibilityScore.numerique)}`}
                      style={{ width: `${(center.accessibilityScore.numerique / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Qualité de l'accueil</span>
                    <span className={`${getScoreColor(center.accessibilityScore.accueil)}`}>
                      {center.accessibilityScore.accueil}/5
                    </span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`absolute inset-y-0 left-0 ${getProgressColor(center.accessibilityScore.accueil)}`}
                      style={{ width: `${(center.accessibilityScore.accueil / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            {center.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services & Équipements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {center.services.map((service, index) => (
                      <Badge key={index} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Avis et retours d'expérience</CardTitle>
                  {user && (
                    <Button onClick={() => setShowRatingForm(!showRatingForm)}>
                      {showRatingForm ? 'Annuler' : 'Donner mon avis'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {showRatingForm ? (
                  <RatingForm
                    center={center}
                    user={user!}
                    onSubmit={() => setShowRatingForm(false)}
                    onCancel={() => setShowRatingForm(false)}
                  />
                ) : (
                  <>
                    {center.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {center.reviews.map((review) => (
                          <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p>{review.userName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 text-yellow-600">
                                <Star className="h-4 w-4" fill="currentColor" />
                                <span>
                                  {((review.scores.physique + review.scores.numerique + review.scores.accueil) / 3).toFixed(1)}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-2 text-sm">
                              <div className="text-center p-2 bg-muted/50 rounded">
                                <p className="text-muted-foreground">Physique</p>
                                <p>{review.scores.physique}/5</p>
                              </div>
                              <div className="text-center p-2 bg-muted/50 rounded">
                                <p className="text-muted-foreground">Numérique</p>
                                <p>{review.scores.numerique}/5</p>
                              </div>
                              <div className="text-center p-2 bg-muted/50 rounded">
                                <p className="text-muted-foreground">Accueil</p>
                                <p>{review.scores.accueil}/5</p>
                              </div>
                            </div>

                            <p className="text-sm mb-2">{review.comment}</p>

                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Utile ({review.helpfulCount})
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Aucun avis pour le moment. Soyez le premier à partager votre expérience !
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => onBookAppointment(center)}
                    disabled
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Prendre rendez-vous
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleGetDirections}
                  >
                    <Navigation className="mr-2 h-5 w-5" />
                    Itinéraire accessible
                  </Button>
                </CardContent>
              </Card>

              {!user && (
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="pt-6">
                    <h3 className="mb-2">Créez un compte</h3>
                    <p className="text-sm mb-4 opacity-90">
                      Prenez rendez-vous, donnez votre avis et contribuez à la communauté.
                    </p>
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      //onClick={() => onNavigate('signup')}
                    >
                      S'inscrire gratuitement
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
