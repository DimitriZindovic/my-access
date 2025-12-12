import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8">Politique de Confidentialité</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Collecte des données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  AccessiSanté collecte les données personnelles suivantes :
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Préférences d'accessibilité (types de handicap)</li>
                  <li>Historique des rendez-vous</li>
                  <li>Avis et commentaires publiés</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilisation des données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Vos données sont utilisées pour :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Gérer votre compte utilisateur</li>
                  <li>Personnaliser vos résultats de recherche</li>
                  <li>Gérer vos rendez-vous</li>
                  <li>Publier vos avis (de manière anonyme ou avec votre nom)</li>
                  <li>Vous envoyer des notifications importantes</li>
                  <li>Améliorer nos services</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Protection des données</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Nous mettons en œuvre toutes les mesures techniques et organisationnelles 
                  appropriées pour protéger vos données contre tout accès, modification, 
                  divulgation ou destruction non autorisés.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vos droits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification</li>
                  <li>Droit à l'effacement</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité</li>
                  <li>Droit d'opposition</li>
                </ul>
                <p className="mt-4">
                  Pour exercer ces droits, contactez-nous à : privacy@accessisante.fr
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
