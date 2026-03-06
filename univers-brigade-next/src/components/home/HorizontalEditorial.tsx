"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "framer-motion";
import type { GalleryResource } from "@/lib/galleryData";
import ResourceReveal from "./ResourceReveal";
import "./HorizontalEditorial.scss";

type Props = {
  hero: { headline: string; subline: string };
  items: GalleryResource[];
};

// 1. useScroll + useTransform qui convertit le scroll vertical en déplacement horizontal
// 2. calcul dynamique de la hauteur (totalPanels * 100vh)
// 3. structure sticky + track.

export default function HorizontalEditorial({ hero, items }: Props) {
  
  const reduce = useReducedMotion();  // respecte les préférences d’accessibilité (réduction des animations)

  const wrapRef = useRef<HTMLDivElement>(null);  // référence du conteneur principal utilisée pour calculer la progression du scroll

  const [selected, setSelected] = useState<GalleryResource | null>(null);  // état pour afficher une ressource dans l’overlay

  const totalPanels = 1 + items.length;  // 1 panneau hero + les panneaux de ressources

  // récupère la progression du scroll vertical (0 → 1)
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /*
  transforme le scroll vertical en déplacement horizontal
  quand scrollYProgress = 0 → x = 0
  quand scrollYProgress = 1 → x = déplacement total des panels
  */
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0vw", "0vw"] : ["0vw", `-${(totalPanels - 1) * 100}vw`]
  );

  return (
    <>
      <div
        ref={wrapRef}
        className="hEdit"

        // hauteur totale = nombre de panels → crée l’illusion de scroll horizontal
        style={{ height: `${totalPanels * 100}vh` }}
      >
        <div className="hEdit__sticky">

          {/* track horizontal déplacé selon la progression du scroll */}
          <motion.div className="hEdit__track" style={{ x }}>

            {/* premier panneau : section hero */}
            <div className="hEdit__panel hEdit__panel--hero">
              <div className="hEdit__heroContent">
                <h1 className="hEdit__heroHeadline">{hero.headline}</h1>
                <div className="hEdit__heroRule" />
                <p className="hEdit__heroSubline">{hero.subline}</p>
              </div>
            </div>

            {/* génération dynamique des panneaux de ressources */}
            {items.map((item, i) => (
              <EditorialPanel
                key={item.id}
                item={item}
                index={i}
                reduce={!!reduce}
                onSelect={setSelected}
              />
            ))}

          </motion.div>
        </div>
      </div>

      {/* overlay affichant la ressource sélectionnée */}
      <ResourceReveal resource={selected} onClose={() => setSelected(null)} />
    </>
  );
}

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

function EditorialPanel({
  item,
  index,
  reduce,
  onSelect,
}: {
  item: GalleryResource;
  index: number;
  reduce: boolean;
  onSelect: (r: GalleryResource) => void;
}) {

  // détecte si le panneau est visible dans le viewport
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // déclenche les animations seulement lorsque visible
  const show = reduce || inView;

  return (
    <div
      ref={ref}
      className={`hEdit__panel ${
        index % 2 === 0 ? "hEdit__panel--light" : "hEdit__panel--dark"
      }`}
    >
      <div className="hEdit__image">

        {/* animation reveal de l'image via clip-path */}
        <div
          className="hEdit__imageInner"
          style={{
            clipPath: show ? "inset(0)" : "inset(0 0 0 100%)",
            transition: reduce ? "none" : `clip-path 0.9s ${ease}`,
          }}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="50vw"
            style={{ objectFit: "cover" }}
            priority={index < 2}
          />
        </div>

      </div>

      <div className="hEdit__text">

        {/* reveal progressif des éléments texte */}
        {[item.tag, item.title, item.description].map((content, i) => (
          <div
            key={i}
            className="hEdit__textReveal"
            style={{
              transform: show ? "translateY(0)" : "translateY(100%)",
              opacity: show ? 1 : 0,
              transition: reduce
                ? "none"
                : `transform 0.7s ${ease} ${0.3 + i * 0.08}s, opacity 0.7s ${ease} ${0.3 + i * 0.08}s`,
            }}
          >
            {i === 0 && <span className="hEdit__label">{content}</span>}
            {i === 1 && <h2 className="hEdit__title">{content}</h2>}
            {i === 2 && <p className="hEdit__desc">{content}</p>}
          </div>
        ))}

        {/* bouton pour afficher la ressource détaillée */}
        <button
          className="hEdit__cta"
          onClick={() => onSelect(item)}
          type="button"
        >
          Découvrir
        </button>

      </div>
    </div>
  );
}