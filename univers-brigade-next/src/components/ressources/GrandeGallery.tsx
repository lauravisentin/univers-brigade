"use client";

/*
ce composant est côté client parce que :
- framer motion fonctionne dans le browser
- j’utilise useState / useEffect
- sans "use client", next.js (app router) va essayer de le rendre côté serveur → erreurs.
*/

import Image from "next/image";

import { motion, useReducedMotion } from "framer-motion"; //hook pour respecter les préférences d’animation de l’utilisateur (accessibilité).
import type { Transition } from "framer-motion";

import { useEffect, useState } from "react";
import clsx from "clsx"; /* clsx = utilitaire pour gérer les classes conditionnelles. */


import type { GalleryResource } from "@/lib/galleryData";
import "./GrandeGallery.scss";

const sizeToVariant: Record<string, string> = {
  large: "large",
  tall: "tall",
  wide: "wide",
  medium: "default",
};

export default function GrandeGallery({ items }: { items: GalleryResource[] }) {

    const reduce = useReducedMotion();/* useReducedMotion = accessibilité. */

    /*
    état qui sert juste à déclencher l’anim.
    au début les cartes sont empilées (stack),
    puis après 1 frame → grid.
    ça permet un effet “explosion”.
    */
    const [toGrid, setToGrid] = useState(false);

    useEffect(() => {
        const t = requestAnimationFrame(() => setToGrid(true)); /* RequestAnimationFrame = attendre le premier rendu*/
        return () => cancelAnimationFrame(t);
    }, []); //Exécuté une seule fois au montage du composant.

   /*
    springGrid = transition pour le conteneur (layout).
    springCard = transition pour les cartes (initial → animate).
    
    si reduce = pas d’animation, juste un changement instantané.
    
    stiffness = rigidité du ressort
    damping = amortissement
    mass = masse de l’objet.

   */
    const springGrid: Transition = reduce
        ? { duration: 0 }
        : { type: "spring", stiffness: 120, damping: 18, mass: 0.9 };

    const springCard: Transition = reduce
        ? { duration: 0 }
        : { type: "spring", stiffness: 140, damping: 18 };

    return (
        <section className="animGallery" aria-label="Gallerie des ressources">
            {/* header simple, style editorial */}
            <header className="animGallery__header">
                <div className="animGallery__kicker">Gallerie des ressources</div>
                <div className="animGallery__rule" />
            </header>

            {/* 
      layout = magic de framer motion.
      ça permet l’animation automatique quand le layout change.
      ici quand stack → grid.
      */}
            <motion.div
                layout
                className={`animGallery__grid ${toGrid ? "animGallery__grid--active" : ""
                    }`}
                transition={springGrid}
            >
                {items.map((it, i) => {
                    /*
                    bloc texte en bas des images.
                    */
                    const meta = (
                        <div className="animGallery__meta" aria-hidden="true">
                            {it.tag ? (
                                <div className="animGallery__tag">{it.tag}</div>
                            ) : null}
                            <div className="animGallery__title">{it.title}</div>
                        </div>
                    );

                    /*
                    base de l’animation.
                    initial = état au load
                    animate = état final
                    blur + scale → effet premium.
                    */
                    const baseProps = {
                        layout: true,
                        initial: { opacity: 0, scale: 0.85, filter: "blur(10px)" },
                        animate: {
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)",
                        },
                        transition: springCard,
                        /*
                        hover seulement si lien.
                        */
                        whileHover:
                            !reduce && toGrid && it.href ? { scale: 1.01 } : undefined,
                        whileTap:
                            !reduce && toGrid && it.href ? { scale: 0.99 } : undefined,
                    } as const;
                
                    /*
                    classes dynamiques.
                    stack au début, puis grid.
                    */
                    const className = clsx(
                        "animGallery__card",
                        `animGallery__card--${sizeToVariant[it.size] ?? "default"}`, // nombre de ressources illimité
                        toGrid ? "animGallery__card--grid" : "animGallery__card--stack",
                        it.href ? "is-clickable" : "is-static"
                    );
                    /*
                    si lien ->  motion.a
                    sinon ->  motion.div
                    */
                    if (it.href) {
                        return (
                            <motion.a
                                key={it.id}
                                layout
                                href={it.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={it.title}
                                className={className}
                                initial={baseProps.initial}
                                animate={baseProps.animate}
                                transition={baseProps.transition}
                                whileHover={baseProps.whileHover}
                                whileTap={baseProps.whileTap}
                            >
                                <div className="animGallery__media">
                                    <Image
                                        src={it.image}
                                        alt={it.title}
                                        fill
                                        sizes="(max-width:768px) 100vw, (max-width:1100px) 50vw, 33vw"
                                        style={{ objectFit: "cover" }}
                                        priority={i < 4}
                                    />
                                </div>

                                <div className="animGallery__overlay" />
                                {meta}
                            </motion.a>
                        );
                    }

                    /*
                    version non cliquable. pas de hover.
                    */
                    return (
                        <motion.div
                            key={it.id}
                            layout
                            className={className}
                            initial={baseProps.initial}
                            animate={baseProps.animate}
                            transition={baseProps.transition}
                        >
                            <div className="animGallery__media">
                                <Image
                                    src={it.image}
                                    alt={it.title}
                                    fill
                                    sizes="(max-width:768px) 100vw, (max-width:1100px) 50vw, 33vw"
                                    style={{ objectFit: "cover" }}
                                    priority={i < 4}
                                />
                            </div>

                            <div className="animGallery__overlay is-static" />
                            {meta}
                        </motion.div>
                    );
                })}
            </motion.div>

            <footer className="animGallery__footer">
                <span>&copy; 2026 Univers Brigade</span>
                <a
                    href="https://unsplash.com/fr"
                    target="_blank"
                    rel="noreferrer"
                    className="animGallery__footerLink"
                >
                    Photos de Unsplash
                </a>
            </footer>
        </section>
    );
}
