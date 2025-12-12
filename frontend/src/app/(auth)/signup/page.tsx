"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { HandicapType, User } from '@/types';
import { setCurrentUser } from '@/lib/mockData';

const handicapTypes: { value: HandicapType; label: string }[] = [
  { value: 'moteur', label: 'Handicaps moteurs' },
  { value: 'sensoriel', label: 'Handicaps sensoriels' },
  { value: 'mental', label: 'Handicaps mentaux' },
  { value: 'psychique', label: 'Handicaps psychiques' },
  { value: 'cognitif', label: 'Handicaps cognitifs' },
];

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    handicapTypes: [] as HandicapType[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else 
        
    if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.name) {
    newErrors.name = 'Nom requis';
    }
    if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (step === 1) {
        setStep(2);
      } else {
        // Create account
        const user: User = {
          id: Date.now().toString(),
          email: formData.email,
          name: formData.name,
          handicapTypes: formData.handicapTypes,
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(user);
        window.location.href = "dashboard"
      }
    }
  };

  const toggleHandicapType = (type: HandicapType) => {
    setFormData(prev => ({
      ...prev,
      handicapTypes: prev.handicapTypes.includes(type)
        ? prev.handicapTypes.filter(t => t !== type)
        : [...prev.handicapTypes, type]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {step === 1 ? 'Créer un compte' : 'Personnalisez votre profil'}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? 'Créez votre compte pour accéder à toutes les fonctionnalités'
              : 'Configurez vos préférences d\'accessibilité (optionnel mais recommandé)'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                </div>

                <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
                </div>

              </>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">Sélectionnez vos besoins d'accessibilité</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cela nous aidera à personnaliser vos résultats de recherche
                  </p>
                  <div className="space-y-3">
                    {handicapTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.value}
                          checked={formData.handicapTypes.includes(type.value)}
                          onCheckedChange={() => toggleHandicapType(type.value)}
                        />
                        <label
                          htmlFor={type.value}
                          className="text-sm cursor-pointer"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Retour
                </Button>
              )}
              <Button type="submit" className="flex-1">
                {step === 1 
                  ? 'Continuer'
                  : 'Créer mon compte'
                }
              </Button>
            </div>

            {step === 2 && (
              <Button
                type="submit"
                variant="ghost"
                className="w-full"
              >
                Passer cette étape
              </Button>
            )}

            <div className="text-center text-sm text-muted-foreground">
              
                Déjà un compte ?{' '}
                <a
                    className="text-primary hover:underline"
                    href='login'
                >
                Se connecter
                </a>
                
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
