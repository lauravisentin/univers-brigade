"use client";

/*
  HorizontalGallery
  - Objectif : afficher une galerie horizontale scrollable avec des cartes animées.
  - Tech : Next.js (Image) + Framer Motion (spring, transform) + overlay de détail au clic.
  - Accessibilité : navigation clavier (Enter/Espace) + respect du "prefers-reduced-motion".
*/

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { GalleryResource } from "@/lib/galleryData";
import ResourceDetailOverlay from "./ResourceDetailOverlay";
import "./HorizontalGallery.scss";

/* Petit utilitaire pour s'assurer que la valeur reste dans [min, max]. */
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export default function HorizontalGallery({ items }: { items: GalleryResource[] }) {
  // Respecte les préférences d’accessibilité (moins d’animations).
  const reduce = useReducedMotion();

  // Références DOM : container (zone d’écoute wheel/drag) et track (contenu total).
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // État : ressource sélectionnée (ouvre l’overlay).
  const [selected, setSelected] = useState<GalleryResource | null>(null);

  // État : largeur scrollable max (= largeur contenu - largeur viewport).
  const [maxScroll, setMaxScroll] = useState(0);

  // On désactive le scroll horizontal custom sur mobile (<= 768px) pour éviter conflits UX.
  const [isMobile, setIsMobile] = useState(false);

  /*
    Scroll "logique" :
    - scrollTarget = position cible (en px) qu’on met à jour via wheel/drag
    - scrollX = motion value (valeur animable)
    - smoothX = spring qui rend le déplacement fluide
    NB : on met x en négatif (style={x: smoothX}) pour déplacer le contenu vers la gauche.
  */
  const scrollTarget = useRef(0);
  const scrollX = useMotionValue(0);

  const smoothX = useSpring(scrollX, {
    stiffness: reduce ? 300 : 80,
    damping: reduce ? 40 : 28,
    mass: reduce ? 0.5 : 0.8,
  });

  // Barre de progression en bas : 0 → 1 selon l’avancement du scroll.
  const progress = useTransform(smoothX, (v) =>
    maxScroll > 0 ? Math.abs(v) / maxScroll : 0
  );

  /*
    Drag state :
    - isDragging : pour distinguer un drag d’un clic
    - dragStartX : position initiale du pointeur
    - dragStartScroll : scrollTarget au début du drag
  */
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  // Détecter mobile / desktop.
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Calculer maxScroll en fonction des widths réelles (contenu vs viewport).
  const measure = useCallback(() => {
    if (!trackRef.current || !containerRef.current || isMobile) return;
    const trackW = trackRef.current.scrollWidth;
    const viewW = containerRef.current.clientWidth;
    setMaxScroll(Math.max(0, trackW - viewW));
  }, [isMobile]);

  // Re-mesure au montage, au resize, et quand les items changent.
  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, items]);

  /*
    Scroll à la molette :
    - Sur desktop : on intercepte wheel pour convertir deltaY en scroll horizontal.
    - e.preventDefault() nécessaire → listener passive:false.
  */
  useEffect(() => {
    if (isMobile) return;
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Si le device envoie déjà un deltaX, on le priorise.
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      scrollTarget.current = clamp(
        scrollTarget.current + delta * 1.2, // petit gain pour un feeling plus “rapide”
        0,
        maxScroll
      );

      // On pousse la valeur négative dans la motion value.
      scrollX.set(-scrollTarget.current);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [maxScroll, scrollX, isMobile]);

  // Début du drag.
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isMobile) return;
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartScroll.current = scrollTarget.current;

      // Permet de continuer à recevoir les events même si le pointeur sort de la carte.
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [isMobile]
  );

  // Drag en cours.
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || isMobile) return;

      // dx = combien on a “tiré” depuis le départ.
      const dx = dragStartX.current - e.clientX;

      scrollTarget.current = clamp(dragStartScroll.current + dx, 0, maxScroll);
      scrollX.set(-scrollTarget.current);
    },
    [maxScroll, scrollX, isMobile]
  );

  // Fin du drag.
  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Ouvrir l’overlay au clic (si ce n’était pas un drag).
  const handleCardClick = useCallback((item: GalleryResource) => {
    if (isDragging.current) return;
    setSelected(item);
  }, []);

  // Accessibilité clavier : Enter/Espace ouvre l’overlay.
  const handleCardKeyDown = useCallback(
    (e: React.KeyboardEvent, item: GalleryResource) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelected(item);
      }
    },
    []
  );

  return (
    <>
      <section
        ref={containerRef}
        className="hGallery"
        aria-label="Galerie horizontale de ressources"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Grain visuel (décoratif). */}
        <div className="hGallery__grain" aria-hidden="true" />

        {/* Entête : titre + compteur. */}
        <header className="hGallery__header">
          <span className="hGallery__kicker">Galerie des ressources</span>
          <div className="hGallery__rule" />
          <span className="hGallery__counter">{items.length} ressources</span>
        </header>

        {/* Track animé horizontalement (x = smoothX) sur desktop uniquement. */}
        <motion.div
          ref={trackRef}
          className="hGallery__track"
          style={isMobile ? undefined : { x: smoothX }}
        >
          {items.map((item, i) => (
            <Card
              key={item.id}
              item={item}
              index={i}
              smoothX={smoothX}
              reduce={!!reduce}
              isMobile={isMobile}
              onClick={handleCardClick}
              onKeyDown={handleCardKeyDown}
            />
          ))}
        </motion.div>

        {/* Progress bar (visuelle). */}
        <div className="hGallery__progress" aria-hidden="true">
          <motion.div className="hGallery__progressBar" style={{ scaleX: progress }} />
        </div>
      </section>

      {/* Overlay de détail (ouvre/ferme selon selected). */}
      <ResourceDetailOverlay resource={selected} onClose={() => setSelected(null)} />
    </>
  );
}

/* Card : une carte cliquable avec image + meta + petites animations d’apparition + parallax. */
function Card({
  item,
  index,
  smoothX,
  reduce,
  isMobile,
  onClick,
  onKeyDown,
}: {
  item: GalleryResource;
  index: number;
  smoothX: ReturnType<typeof useSpring>;
  reduce: boolean;
  isMobile: boolean;
  onClick: (item: GalleryResource) => void;
  onKeyDown: (e: React.KeyboardEvent, item: GalleryResource) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  /*
    Parallax sur l’image :
    - On regarde où se situe la carte par rapport au centre de l’écran
    - Plus elle est à gauche/droite, plus on décale légèrement l’image
    - Désactivé si reduceMotion ou mobile.
  */
  const parallaxX = useTransform(smoothX, () => {
    if (reduce || isMobile || !cardRef.current) return 0;

    const rect = cardRef.current.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const viewCenter = window.innerWidth / 2;

    const dist = (center - viewCenter) / window.innerWidth; // normalisé ~[-0.5..0.5]
    return dist * -30; // amplitude du parallax
  });

  const parallaxSpring = useSpring(parallaxX, {
    stiffness: 120,
    damping: 30,
  });

  return (
    <motion.div
      ref={cardRef}
      className={`hGallery__card hGallery__card--${item.size}`}
      role="button"
      tabIndex={0}
      aria-label={`${item.title} — ${item.tag}`}
      onClick={() => onClick(item)}
      onKeyDown={(e) => onKeyDown(e, item)}
      // Animation d’entrée (stagger) sur desktop si animations autorisées.
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : 0.6,
        delay: reduce ? 0 : index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Media (image) avec parallax. */}
      <motion.div className="hGallery__media" style={isMobile ? undefined : { x: parallaxSpring }}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width:768px) 100vw, 600px"
          style={{ objectFit: "cover" }}
          // Priorité sur les premières images pour un meilleur LCP.
          priority={index < 4}
        />
      </motion.div>

      {/* Couches visuelles (overlay/shine) gérées en CSS. */}
      <div className="hGallery__overlay" />
      <div className="hGallery__shine" />

      {/* Meta texte. */}
      <div className="hGallery__meta">
        <span className="hGallery__tag">{item.tag}</span>
        <span className="hGallery__title">{item.title}</span>
        <div className="hGallery__underline" />
      </div>
    </motion.div>
  );
}