"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

type HandicapType =
  | "moteur"
  | "sensoriel"
  | "mental"
  | "psychique"
  | "cognitif";

const handicapTypes: { value: HandicapType; label: string }[] = [
  { value: "moteur", label: "Handicaps moteurs" },
  { value: "sensoriel", label: "Handicaps sensoriels" },
  { value: "mental", label: "Handicaps mentaux" },
  { value: "psychique", label: "Handicaps psychiques" },
  { value: "cognitif", label: "Handicaps cognitifs" },
];

export default function SignUpPage() {
  const router = useRouter();
  const { signup, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    handicapTypes: [] as HandicapType[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) {
      newErrors.firstName = "Prénom requis";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Nom requis";
    }

    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else {
      setIsSubmitting(true);
      try {
        await signup({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          handicapType: formData.handicapTypes.join(",") || undefined,
        });
        router.push("/dashboard");
      } catch (error) {
        setGeneralError(
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'inscription"
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleHandicapType = (type: HandicapType) => {
    setFormData((prev) => ({
      ...prev,
      handicapTypes: prev.handicapTypes.includes(type)
        ? prev.handicapTypes.filter((t) => t !== type)
        : [...prev.handicapTypes, type],
    }));
  };

  const isLoading = isSubmitting || authLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {step === 1 ? "Créer un compte" : "Personnalisez votre profil"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Créez votre compte pour accéder à toutes les fonctionnalités"
              : "Configurez vos préférences d'accessibilité (optionnel mais recommandé)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {generalError && (
              <div
                className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
                role="alert"
                aria-live="polite"
              >
                {generalError}
              </div>
            )}

            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className={errors.firstName ? "border-destructive" : ""}
                      aria-invalid={!!errors.firstName}
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className={errors.lastName ? "border-destructive" : ""}
                      aria-invalid={!!errors.lastName}
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive mt-1" role="alert">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={errors.email ? "border-destructive" : ""}
                    aria-invalid={!!errors.email}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={errors.password ? "border-destructive" : ""}
                    aria-invalid={!!errors.password}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1" role="alert">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={
                      errors.confirmPassword ? "border-destructive" : ""
                    }
                    aria-invalid={!!errors.confirmPassword}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1" role="alert">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">
                    Sélectionnez vos besoins d&apos;accessibilité
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cela nous aidera à personnaliser vos résultats de recherche
                  </p>
                  <div className="space-y-3" role="group" aria-label="Types de handicap">
                    {handicapTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.value}
                          checked={formData.handicapTypes.includes(type.value)}
                          onCheckedChange={() => toggleHandicapType(type.value)}
                          disabled={isLoading}
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
                  disabled={isLoading}
                >
                  Retour
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {step === 1 ? "..." : "Création..."}
                  </>
                ) : step === 1 ? (
                  "Continuer"
                ) : (
                  "Créer mon compte"
                )}
              </Button>
            </div>

            {step === 2 && (
              <Button
                type="submit"
                variant="ghost"
                className="w-full"
                disabled={isLoading}
              >
                Passer cette étape
              </Button>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <a className="text-primary hover:underline" href="/login">
                Se connecter
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
