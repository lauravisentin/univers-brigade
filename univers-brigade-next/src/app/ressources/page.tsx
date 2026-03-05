import GrandeGallery from "@/components/sections/GrandeGallery";
import VitrineHeader from "@/components/vitrine/VitrineHeader";
import { galleryResources } from "@/lib/galleryData";

export const metadata = {
  title: "Ressources — Univers Brigade",
  description: "Catalogue de ressources pour la restauration contemporaine.",
};

export default function RessourcesPage() {
  return (
    <>
      <VitrineHeader variant="light" />
      <GrandeGallery items={galleryResources} />
    </>
  );
}
