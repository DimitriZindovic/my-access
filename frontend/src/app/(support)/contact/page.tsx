import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="mb-8">Contact</h1>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="mb-2">Support technique</h3>
                <p className="text-muted-foreground mb-2">
                  Pour toute question ou problème technique
                </p>
                <p><strong>Email :</strong> support@accessisante.fr</p>
                <p><strong>Téléphone :</strong> 01 23 45 67 89</p>
                <p className="text-sm text-muted-foreground">Lun-Ven 9h-18h</p>
              </div>

              <div>
                <h3 className="mb-2">Partenariats</h3>
                <p className="text-muted-foreground mb-2">
                  Vous êtes un centre de santé ou une organisation ?
                </p>
                <p><strong>Email :</strong> partenariats@accessisante.fr</p>
              </div>

              <div>
                <h3 className="mb-2">Presse</h3>
                <p className="text-muted-foreground mb-2">
                  Demandes média et presse
                </p>
                <p><strong>Email :</strong> presse@accessisante.fr</p>
              </div>

              <div>
                <h3 className="mb-2">Adresse postale</h3>
                <p>MyAccess SAS</p>
                <p>123 Avenue de la République</p>
                <p>75011 Paris</p>
                <p>France</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}