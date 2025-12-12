import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccessibilityStatement() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8">Déclaration d'Accessibilité</h1>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <p>
                AccessiSanté s'engage à rendre son site web accessible conformément au 
                Référentiel Général d'Amélioration de l'Accessibilité (RGAA).
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>État de conformité</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Ce site est en conformité partielle avec le RGAA version 4.1. 
                  Les non-conformités et dérogations sont énumérées ci-dessous.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités accessibles</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  <li>Navigation au clavier</li>
                  <li>Contrastes de couleurs conformes</li>
                  <li>Structure sémantique claire</li>
                  <li>Alternatives textuelles pour les images</li>
                  <li>Formulaires étiquetés correctement</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contenus non accessibles</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Certains contenus peuvent ne pas être totalement accessibles pour les raisons suivantes :
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Carte interactive (alternative textuelle fournie)</li>
                  <li>Certains documents PDF téléchargeables</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Signaler un problème d'accessibilité</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Si vous rencontrez un problème d'accessibilité, contactez-nous à :
                </p>
                <p className="mt-2">
                  <strong>Email :</strong> accessibilite@accessisante.fr
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}