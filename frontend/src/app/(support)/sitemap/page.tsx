import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8">Plan du site</h1>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pages publiques</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Accueil</li>
                  <li>• Connexion</li>
                  <li>• Inscription</li>
                  <li>• Recherche de centres</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Espace utilisateur</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Mon profil</li>
                  <li>• Mes rendez-vous</li>
                  <li>• Mes avis</li>
                  <li>• Notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Centres</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Recherche et carte</li>
                  <li>• Fiche détaillée</li>
                  <li>• Prise de rendez-vous</li>
                  <li>• Donner un avis</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support & Légal</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Aide & FAQ</li>
                  <li>• Contact</li>
                  <li>• Mentions légales</li>
                  <li>• Politique de confidentialité</li>
                  <li>• CGU</li>
                  <li>• Accessibilité du site</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}