"use client";

import VitrineHeader from "@/components/vitrine/VitrineHeader";
import SmoothScroll from "@/components/vitrine/SmoothScroll";
import HorizontalEditorial from "@/components/vitrine/HorizontalEditorial";
import { heroData, getFeatured } from "@/lib/galleryData";
import "./vitrine.scss";

const featured = getFeatured();

export default function Page() {
  return (
    <div className="vitrine">
      <SmoothScroll>
        <VitrineHeader />
        <HorizontalEditorial hero={heroData} items={featured} />
      </SmoothScroll>
    </div>
  );
}
