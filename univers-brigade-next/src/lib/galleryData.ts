export type GalleryResource = {
  id: string;
  title: string;
  tag: string;
  category: string;
  description: string;
  image: string;
  href: string;
  size: "large" | "tall" | "medium" | "wide";
};

/* --- Vitrine --- */

export const heroData = {
  headline: "Univers Brigade",
  subline:
    "Une sélection curatée de ressources, guides et inspirations pour les artisans de la gastronomie contemporaine.",
};

const featuredIds = ["g1", "g2", "g8", "g12"];

export function getFeatured(): GalleryResource[] {
  return featuredIds
    .map((id) => galleryResources.find((r) => r.id === id))
    .filter((r): r is GalleryResource => r !== undefined);
}


export const galleryResources: GalleryResource[] = [
  {
    id: "g1",
    title: "Guide Michelin",
    tag: "Référence",
    category: "Guides",
    description:
      "Le guide incontournable de la gastronomie mondiale. Découvrez les étoiles, les Bib Gourmand et les nouvelles tables qui redéfinissent l'excellence culinaire chaque année.",
    image: "/images/img1.jpg",
    href: "https://guide.michelin.com",
    size: "tall",
  },
  {
    id: "g2",
    title: "Les Lauriers",
    tag: "Québec",
    category: "Récompenses",
    description:
      "Célébrer l'excellence de la restauration québécoise. Les Lauriers mettent en lumière les artisans, les producteurs et les chefs qui font rayonner notre terroir.",
    image: "/images/img7.jpg",
    href: "https://lauriers.ca",
    size: "large",
  },
  {
    id: "g3",
    title: "Produits locaux",
    tag: "Marchés",
    category: "Approvisionnement",
    description:
      "Répertoire des marchés publics et producteurs locaux. Trouvez les meilleurs produits de saison, directement du champ à votre cuisine professionnelle.",
    image: "/images/img9.jpg",
    href: "https://example.com",
    size: "medium",
  },
  {
    id: "g4",
    title: "Sommellerie",
    tag: "Boissons",
    category: "Formation",
    description:
      "Ressources pour la sommellerie moderne. Accords mets-vins, tendances des vins naturels, et formations certifiées pour élever votre carte des boissons.",
    image: "/images/img5.jpg",
    href: "https://example.com",
    size: "medium",
  },
  {
    id: "g5",
    title: "Tastet",
    tag: "Recettes",
    category: "Inspiration",
    description:
      "Tastet est un guide interactif de bonnes adresses gourmandes locales : bons restos, bons cafés et bons bars.",
    image: "/images/img8.jpg",
    href: "https://tastet.ca/",
    size: "medium",
  },
  {
    id: "g6",
    title: "Bistros",
    tag: "Restaurants",
    category: "Découverte",
    description:
      "Sélection curatée des meilleurs bistros contemporains. Ambiances uniques, menus créatifs et expériences gastronomiques accessibles qui redéfinissent le genre.",
    image: "/images/img6.jpg",
    href: "https://example.com",
    size: "large",
  },
  {
    id: "g7",
    title: "Design de salle",
    tag: "Aménagement",
    category: "Design",
    description:
      "Inspirations pour l'aménagement de votre salle à manger. Mobilier, éclairage, acoustique et ergonomie pour créer une expérience client mémorable.",
    image: "/images/img1.jpg",
    href: "https://example.com",
    size: "tall",
  },
  {
    id: "g8",
    title: "Formations ITHQ",
    tag: "Éducation",
    category: "Formation",
    description:
      "Programmes de formation continue de l'Institut de tourisme et d'hôtellerie du Québec. Perfectionnez vos compétences avec des experts reconnus.",
    image: "/images/img10.jpg",
    href: "https://www.ithq.qc.ca/",
    size: "medium",
  },
  {
    id: "g9",
    title: "Équipement pro",
    tag: "Fournisseurs",
    category: "Approvisionnement",
    description:
      "Guide des fournisseurs d'équipement professionnel. Comparatifs, avis et recommandations pour investir intelligemment dans votre cuisine.",
    image: "/images/img4.jpg",
    href: "https://example.com",
    size: "medium",
  },
  {
    id: "g10",
    title: "Tendances 2025",
    tag: "Veille",
    category: "Inspiration",
    description:
      "Les grandes tendances qui façonnent la restauration en 2025. De la fermentation au service omnicanal, anticipez les mutations de notre industrie.",
    image: "/images/img2.jpg",
    href: "https://example.com",
    size: "wide",
  },
  {
    id: "g11",
    title: "Carte des vins",
    tag: "Boissons",
    category: "Outils",
    description:
      "Outil interactif pour concevoir et optimiser votre carte des vins. Marges, rotations, accords et présentations premium pour maximiser vos revenus.",
    image: "/images/img5.jpg",
    href: "https://example.com",
    size: "medium",
  },
  {
    id: "g12",
    title: "Ricardo Cuisine",
    tag: "Recettes",
    category: "Inspiration",
    description:
      "Ricardo Cuisine est une marque québécoise de référence fondée par le chef Ricardo Larrivée, proposant une expérience culinaire complète : plus de 8 000 recettes en ligne, un magazine, des émissions de télé, des boutiques/restaurants, des produits alimentaires (via IGA) et des accessoires de cuisine.",
    image: "/images/img4.jpg",
    href: "https://www.ricardocuisine.com/",
    size: "wide",
  },
];

