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
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    setGeneralError(null);

    if (!formData.email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await login(formData.email, formData.password);
        router.push("/dashboard");
      } catch (error) {
        setGeneralError(
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la connexion"
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isLoading = isSubmitting || authLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte AccessiSanté
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
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={isLoading}
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-destructive mt-1"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={errors.password ? "border-destructive" : ""}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                disabled={isLoading}
              />
              {errors.password && (
                <p
                  id="password-error"
                  className="text-sm text-destructive mt-1"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                onClick={() =>
                  alert("Fonctionnalité de récupération de mot de passe à venir")
                }
              >
                Mot de passe oublié ?
              </button>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <a className="text-primary hover:underline" href="/signup">
                S&apos;inscrire
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
