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

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
        // Simulate login
        const user: User = {
          id: '1',
          email: formData.email,
          name: formData.email.split('@')[0],
          handicapTypes: [],
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(user);
        window.location.href = "dashboard"
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
           Connexion
          </CardTitle>
          <CardDescription>
            Connectez-vous à votre compte AccessiSanté
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
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

            
            <div className="text-right">
            <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => alert('Fonctionnalité de récupération de mot de passe à venir')}
            >
                Mot de passe oublié ?
            </button>
            </div>
            

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Se connecter
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                  Pas encore de compte ?{' '}
                  <a
                    className="text-primary hover:underline"
                    href='signup'
                  >
                    S'inscrire
                  </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
