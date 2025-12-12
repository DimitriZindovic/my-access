import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8">Conditions Générales d'Utilisation</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Objet</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir 
                  les modalités et conditions dans lesquelles les utilisateurs peuvent accéder et 
                  utiliser la plateforme AccessiSanté.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Accès au service</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  L'accès à AccessiSanté est gratuit. Certaines fonctionnalités nécessitent la 
                  création d'un compte utilisateur.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Compte utilisateur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Pour créer un compte, vous devez fournir des informations exactes et à jour. 
                  Vous êtes responsable de la confidentialité de vos identifiants.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Utilisation du service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Vous vous engagez à :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ne pas publier de contenu illégal, diffamatoire ou offensant</li>
                  <li>Publier des avis honnêtes et basés sur votre expérience réelle</li>
                  <li>Ne pas tenter de manipuler les notes des centres</li>
                  <li>Respecter les autres utilisateurs</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Propriété intellectuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Tous les contenus présents sur AccessiSanté (textes, images, logos, etc.) sont 
                  protégés par le droit d'auteur. Toute reproduction non autorisée est interdite.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Responsabilité</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  AccessiSanté ne peut être tenu responsable des informations fournies par les 
                  centres de santé ou des avis publiés par les utilisateurs. Nous vous recommandons 
                  de vérifier les informations directement auprès des établissements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}