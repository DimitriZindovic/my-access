"use client"

interface FooterProps {
}

export function Footer({  }: FooterProps) {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="mb-4">AccessiSanté</h3>
            <p className="text-muted-foreground text-sm">
              Trouvez des centres de santé accessibles adaptés à vos besoins.
            </p>
          </div>

          <div>
            <h4 className="mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => window.location.href =('home')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href =('dashboard')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Recherche de centres
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href =('help')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Aide & FAQ
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => window.location.href =('contact')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href =('accessibility')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Accessibilité du site
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href =('sitemap')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Plan du site
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => window.location.href =('legal')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mentions légales
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href =('privacy')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Politique de confidentialité
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href =('cgu')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  CGU
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 AccessiSanté. Tous droits réservés.</p>
          <p className="mt-2">
            Plateforme dédiée à l'accessibilité des centres de santé pour tous.
          </p>
        </div>
      </div>
    </footer>
  );
}
