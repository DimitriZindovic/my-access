import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8">Mentions Légales</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Éditeur du site</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Nom :</strong> AccessiSanté SAS</p>
                <p><strong>Adresse :</strong> 123 Avenue de la République, 75011 Paris</p>
                <p><strong>SIRET :</strong> 123 456 789 00012</p>
                <p><strong>Email :</strong> contact@accessisante.fr</p>
                <p><strong>Téléphone :</strong> 01 23 45 67 89</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hébergement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Hébergeur :</strong> OVH</p>
                <p><strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France</p>
                <p><strong>Téléphone :</strong> 1007</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Directeur de publication</CardTitle>
              </CardHeader>
              <CardContent>
                <p>M. Jean Dupont, Président</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}