"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryResource } from "@/lib/galleryData";
import "./ResourceDetailOverlay.scss";

type Props = {
  resource: GalleryResource | null;
  onClose: () => void;
};

export default function ResourceDetailOverlay({ resource, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!resource) return;

    // Empêche le scroll derrière l’overlay
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // (Optionnel) focus direct sur le bouton fermer pour accessibilité
    const timer = setTimeout(() => closeRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = prevOverflow;
      clearTimeout(timer);
    };
  }, [resource]);

  return (
    <AnimatePresence>
      {resource && (
        <motion.div
          className="rdOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={resource.title}
        >
          <motion.div
            className="rdOverlay__panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              className="rdOverlay__close"
              onClick={onClose}
              aria-label="Fermer"
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5L5 15M5 5l10 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="rdOverlay__imageWrap">
              <Image
                src={resource.image}
                alt={resource.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="rdOverlay__imageGrad" />
            </div>

            <div className="rdOverlay__body">
              <div className="rdOverlay__tags">
                <span className="rdOverlay__tag">{resource.tag}</span>
                <span className="rdOverlay__cat">{resource.category}</span>
              </div>

              <h2 className="rdOverlay__title">{resource.title}</h2>

              <p className="rdOverlay__desc">{resource.description}</p>

              <a
                className="rdOverlay__cta"
                href={resource.href}
                target="_blank"
                rel="noreferrer"
              >
                <span>Découvrir</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8.5h9m0 0L8.5 5m3.5 3.5L8.5 12"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}