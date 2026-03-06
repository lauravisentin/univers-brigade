import GrandeGallery from "@/components/ressources/GrandeGallery";
import SiteHeader from "@/components/layout/SiteHeader";
import { galleryResources } from "@/lib/galleryData";

export const metadata = {
  title: "Ressources — Univers Brigade",
  description: "Catalogue de ressources pour la restauration contemporaine.",
};

export default function RessourcesPage() {
  return (
    <>
      <SiteHeader variant="light" />
      <GrandeGallery items={galleryResources} />
    </>
  );
}
