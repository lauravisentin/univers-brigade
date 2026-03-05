"use client";

/*
ce composant est côté client parce que :
- framer motion fonctionne dans le browser
- j’utilise des hooks react (useState, useRef)
*/

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion, useInView } from "framer-motion";
import type { GalleryResource } from "@/lib/galleryData";
import ResourceReveal from "./ResourceReveal";
import "./HorizontalEditorial.scss";

/*
props du composant

hero = contenu de la première section
items = ressources affichées dans les panels
*/

type Props = {
  hero: { headline: string; subline: string };
  items: GalleryResource[];
};

export default function HorizontalEditorial({ hero, items }: Props) {

  /*
  respect des préférences d’accessibilité
  si l’utilisateur préfère réduire les animations
  */

  const reduce = useReducedMotion();

  /*
  ref du conteneur principal
  utilisée pour calculer la progression du scroll
  */

  const wrapRef = useRef<HTMLDivElement>(null);

  /*
  état de la ressource sélectionnée
  sert à afficher le composant ResourceReveal
  */

  const [selected, setSelected] = useState<GalleryResource | null>(null);

  /*
  nombre total de panels

  1 = hero
  + nombre de ressources
  */

  const totalPanels = 1 + items.length;

  /*
  useScroll permet d’obtenir la progression du scroll
  entre 0 et 1
  */

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  /*
  transforme le scroll vertical en déplacement horizontal

  quand scrollYProgress = 0 → x = 0
  quand scrollYProgress = 1 → x = déplacement total
  */

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reduce
      ? ["0vw", "0vw"]
      : ["0vw", `-${(totalPanels - 1) * 100}vw`]
  );

  return (
    <>
      <div
        ref={wrapRef}
        className="hEdit"

        /*
        la hauteur du conteneur correspond au nombre de panels
        cela permet de créer l’illusion de scroll horizontal
        */

        style={{ height: `${totalPanels * 100}vh` }}
      >

        {/* zone sticky pour garder le contenu fixe */}

        <div className="hEdit__sticky">

          <motion.div
            className="hEdit__track"
            style={{ x }}
          >

            {/* Panel 0 : Hero */}

            <div className="hEdit__panel hEdit__panel--hero">

              <div className="hEdit__heroContent">

                <h1 className="hEdit__heroHeadline">
                  {hero.headline}
                </h1>

                <div className="hEdit__heroRule" />

                <p className="hEdit__heroSubline">
                  {hero.subline}
                </p>

              </div>

              {/* indicateur de scroll */}

              <motion.div
                className="hEdit__scrollHint"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }
                }
              >
                <span className="hEdit__scrollLabel">scroll</span>
                <svg
                  className="hEdit__scrollArrow"
                  width="20"
                  height="10"
                  viewBox="0 0 20 10"
                  fill="none"
                >
                  <path
                    d="M0 5h17m0 0l-4-4m4 4l-4 4"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>

            </div>

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

      {/* composant qui affiche la ressource en overlay */}

      <ResourceReveal
        resource={selected}
        onClose={() => setSelected(null)}
      />
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const show = reduce || inView;

  return (
    <div
      ref={ref}
      className={`hEdit__panel ${index % 2 === 0 ? "hEdit__panel--light" : "hEdit__panel--dark"}`}
    >
      <div
        className="hEdit__image"
        style={{
          backgroundColor: index === 0 || index % 2 !== 0 ? "#f5f2ed" : "#0e0e0e",
        }}
      >
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
        {[
          <span key="label" className="hEdit__label">
            {item.tag} — {item.category}
          </span>,
          <h2 key="title" className="hEdit__title">{item.title}</h2>,
          <div key="rule" className="hEdit__rule" />,
          <p key="desc" className="hEdit__desc">{item.description}</p>,
          <button
            key="cta"
            className="hEdit__cta"
            onClick={() => onSelect(item)}
            type="button"
          >
            <span>Découvrir</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M4 9h10m0 0L10 5m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>,
        ].map((el, i) => (
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
            {el}
          </div>
        ))}
      </div>
    </div>
  );
}