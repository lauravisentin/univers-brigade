import HorizontalGallery from "@/components/sections/HorizontalGallery";
import { galleryResources } from "@/lib/galleryData";

export const metadata = {
  title: "Galerie — Univers Brigade",
  description: "Explorez notre sélection curatée de ressources pour la restauration.",
};

export default function GaleriePage() {
  return <HorizontalGallery items={galleryResources} />;
}
