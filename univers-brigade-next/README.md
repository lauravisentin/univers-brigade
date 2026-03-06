# Univers Brigade

Univers Brigade est un projet web réalisé dans le cadre de ma formation en **Techniques d'intégration multimédia**.
Le projet consiste à concevoir une interface web interactive permettant d'explorer différentes **ressources liées à l'univers de la restauration et de la gastronomie**.

L'application met l'accent sur :
- une **navigation visuelle immersive**
- des **animations et interactions avec React et Framer Motion**
- une **structure moderne avec Next.js**

**Voir le projet en ligne** : https://univers-brigade-6u9o.vercel.app/

## Technologies utilisées

- Next.js
- React
- TypeScript
- SCSSs
- Framer Motion
- Lenis (smooth scroll)

## Installation

```bash
npm install
npm run dev
```

## Structure du projet

```
src/
├── app/                        Pages et styles globaux
│   ├── layout.jsx              Layout racine (polices, HTML)
│   ├── globals.scss            Styles globaux (reset, typo, variables)
│   ├── page.tsx                Page d'accueil
│   ├── page.scss               Styles de la page d'accueil
│   ├── galerie/page.tsx        Page galerie
│   └── ressources/page.tsx     Page ressources
├── components/
│   ├── layout/                 Navigation partagée entre les pages
│   ├── ui/                     Composants utilitaires réutilisables
│   ├── home/                   Composants spécifiques à la page d'accueil
│   └── ressources/             Composants des pages galerie et ressources
└── lib/                        Données et configuration
    ├── galleryData.ts          Types et données des ressources
    └── fonts.ts                Configuration des polices
```

## Liste des fichiers sources
Triés par complexité décroissante

### Composants (logique, interactions, animations)

1. **`src/components/home/HorizontalEditorial.tsx`**
   Composant le plus complexe du projet. Transforme le scroll vertical en défilement horizontal de panneaux éditoriaux. Chaque panneau contient une image avec animation clip-path et du texte avec stagger reveal. Utilise useScroll et useTransform de Framer Motion pour synchroniser la position horizontale avec le scroll.

2. **`src/components/ressources/HorizontalGallery.tsx`**
   Galerie horizontale avec interaction drag (souris/tactile), effet parallax sur les images des cartes, barre de progression du scroll, détection drag vs clic, gestion clavier (Enter/Space), et overlay de détail. Adaptation responsive (vertical sur mobile).

3. **`src/components/ressources/GrandeGallery.tsx`**
   Grille animée. Les cartes démarrent empilées au centre puis se déploient en grille avec des animations spring. Supporte plusieurs variantes de taille (large, tall, wide, medium). Hover et tap feedback avec Framer Motion layout animations.

4. **`src/components/layout/SiteHeader.tsx`**
   Header du site utilisé sur plusieurs pages. Bouton burger animé avec Framer Motion (rotation des lignes). Détection du scroll pour changer de style (scrollY > 60px). Gère l'ouverture/fermeture du menu fullscreen. Supporte les variantes dark/light.

5. **`src/components/layout/FullscreenMenu.tsx`**
   Menu de navigation plein écran. Implémente un focus trap (la touche Tab reste dans le menu), fermeture avec Escape, blocage du scroll du body. Liens de navigation avec animations d'apparition.

6. **`src/components/ressources/ResourceDetailOverlay.tsx`**
   Modal overlay affichant les détails d'une ressource (image, tag, catégorie, titre, description, lien CTA). 

7. **`src/components/home/ResourceReveal.tsx`**
   Overlay split-screen pour la page d'accueil : image à gauche avec animation clip-path, contenu à droite avec stagger (label, titre, règle, description, CTA). Respecte les préférences de mouvement réduit (accessibilité).

8. **`src/components/ui/SmoothScroll.tsx`**
   Wrapper qui active le smooth scroll via la librairie Lenis. Synchronise Lenis avec le render loop de Framer Motion (useAnimationFrame) pour des animations fluides pendant le scroll.

9. **`src/app/page.tsx`**
   Page d'accueil. Assemble SiteHeader, SmoothScroll et HorizontalEditorial avec les données featured.

10. **`src/app/ressources/page.tsx`**
    Page ressources. Affiche le SiteHeader (variante light) et la GrandeGallery avec toutes les ressources.

11. **`src/app/galerie/page.tsx`**
    Page galerie. Affiche la HorizontalGallery avec toutes les ressources.

12. **`src/app/layout.jsx`**
    Layout racine de l'application. Applique les polices Google Fonts, les styles globaux et le wrapper HTML.

### Styles SCSS

13. **`src/components/home/HorizontalEditorial.scss`**
    Styles du défilement horizontal : positionnement des panneaux, hero, reveal d'images, animations texte, alternance de fonds clair/sombre.

14. **`src/app/globals.scss`**
    Styles globaux : reset CSS, typographie de base, variables de couleurs, utilitaires de layout, fondations responsive.

15. **`src/components/ressources/HorizontalGallery.scss`**
    Styles de la galerie horizontale : piste scrollable, cartes, barre de progression, header/compteur, texture grain.

16. **`src/components/ressources/GrandeGallery.scss`**
    Styles de la grille masonry : variantes de taille des cartes (large, tall, wide, medium), états hover, footer.

17. **`src/components/layout/SiteHeader.scss`**
    Styles du header : lignes du burger, état scrollé, variantes dark/light, responsive.

18. **`src/components/layout/FullscreenMenu.scss`**
    Styles du menu fullscreen : overlay sombre, liens de navigation animés, bouton fermer.

19. **`src/components/home/ResourceReveal.scss`**
    Styles de l'overlay split-screen : panneau image, panneau texte, bouton CTA.

20. **`src/components/ressources/ResourceDetailOverlay.scss`**
    Styles du modal overlay : conteneur image, gradient, métadonnées, bouton CTA.

21. **`src/app/page.scss`**
    Styles spécifiques au conteneur de la page d'accueil.

### Données et configuration applicative

22. **`src/lib/galleryData.ts`**
    Fichier de données central. Définit le type GalleryResource, contient les 12 objets ressource avec leurs métadonnées, le contenu hero de la page d'accueil, et la fonction getFeatured() qui retourne les 4 ressources mises en avant.

23. **`src/lib/fonts.ts`**
    Configuration des polices Google Fonts (Playfair Display pour les titres, Inter pour le corps de texte) avec export des variables CSS.

## Images

Images libres de droits utilisées à des fins de démonstration.
La source est mentionnée dans la page /Ressources.
