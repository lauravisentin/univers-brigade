"use client";

import SiteHeader from "@/components/layout/SiteHeader";
import SmoothScroll from "@/components/ui/SmoothScroll";
import HorizontalEditorial from "@/components/home/HorizontalEditorial";
import { heroData, getFeatured } from "@/lib/galleryData";
import "./page.scss";

const featured = getFeatured();

export default function Page() {
  return (
    <div className="vitrine">
      <SmoothScroll>
        <SiteHeader />
        <HorizontalEditorial hero={heroData} items={featured} />
      </SmoothScroll>
    </div>
  );
}
