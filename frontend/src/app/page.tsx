"use client"

import { Search, MapPin, Star, Users, Shield, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className='text-2xl'>
              Trouvez un centre de santé <br/>
            </h1>
            <h2 className="text-primary text-xl mb-6">100% accessible</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Recherchez, comparez et prenez rendez-vous dans des centres de dépistage 
              et vaccination adaptés à vos besoins d'accessibilité.
            </p>

            <div className="flex gap-3 max-w-2xl mx-auto mb-8">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Entrez votre ville ou code postal..."
                  className="pl-10 h-12"
                />
              </div>
              <Button size="lg" className="h-12 px-8" onClick={() => onNavigate('dashboard')}>
                <Search className="mr-2 h-5 w-5" />
                Rechercher
              </Button>
            </div>

            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => onNavigate('signup')}>
                S'inscrire gratuitement
              </Button>
              <Button size="lg" variant="outline" onClick={() => onNavigate('login')}>
                Se connecter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Pourquoi choisir MyAccess ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une plateforme pensée pour tous, avec des informations détaillées 
              sur l'accessibilité de chaque centre.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2">Carte interactive</h3>
                <p className="text-muted-foreground">
                  Visualisez tous les centres sur une carte avec leur niveau d'accessibilité en un coup d'œil.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2">Notation détaillée</h3>
                <p className="text-muted-foreground">
                  Scores sur 3 critères : accessibilité physique, numérique et qualité de l'accueil.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2">Avis communauté</h3>
                <p className="text-muted-foreground">
                  Consultez et partagez des retours d'expérience ciblés sur l'accessibilité.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Accessibility Types Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Filtrez selon vos besoins</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre plateforme prend en compte tous les types de handicap pour vous 
              proposer les centres les plus adaptés.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { name: 'Handicaps moteurs', icon: '🦽' },
              { name: 'Handicaps sensoriels', icon: '👁️' },
              { name: 'Handicaps mentaux', icon: '🧠' },
              { name: 'Handicaps psychiques', icon: '💭' },
              { name: 'Handicaps cognitifs', icon: '🎯' },
            ].map((type) => (
              <Card key={type.name} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-2">{type.icon}</div>
                  <p className="text-sm">{type.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Comment ça marche ?</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                  1
                </div>
                <h3 className="mb-2">Recherchez</h3>
                <p className="text-muted-foreground">
                  Utilisez la carte interactive et les filtres pour trouver un centre adapté
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                  2
                </div>
                <h3 className="mb-2">Comparez</h3>
                <p className="text-muted-foreground">
                  Consultez les scores d'accessibilité et les avis de la communauté
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                  3
                </div>
                <h3 className="mb-2">Réservez</h3>
                <p className="text-muted-foreground">
                  Prenez rendez-vous directement et obtenez un itinéraire accessible
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-12 w-12 mx-auto mb-4" />
          <h2 className="mb-4">Rejoignez notre communauté</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Ensemble, rendons les soins de santé accessibles à tous. 
            Inscrivez-vous gratuitement et contribuez en partageant vos expériences.
          </p>
          <Button size="lg" variant="secondary" onClick={() => onNavigate('signup')}>
            Créer mon compte gratuitement
          </Button>
        </div>
      </section>
    </div>
  );
}
