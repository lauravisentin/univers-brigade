"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { GalleryResource } from "@/lib/galleryData";
import "./ResourceReveal.scss";

type Props = {
  resource: GalleryResource | null;
  onClose: () => void;
};

// easing utilisé pour les animations Framer Motion
const ease = [0.22, 1, 0.36, 1] as const;

export default function ResourceReveal({ resource, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  // respecte la préférence "reduce motion" du système
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {resource && (
        <motion.div
          ref={panelRef}
          className="vReveal"
          role="dialog"
          aria-modal="true"
          aria-label={resource.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.3 }}
        >
          {/* panneau image */}
          <motion.div
            className="vReveal__imagePane"
            initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={reduce ? undefined : { clipPath: "inset(0 100% 0 0)" }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, ease }}
          >
            <Image
              src={resource.image}
              alt={resource.title}
              fill
              sizes="50vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </motion.div>

          {/* panneau texte */}
          <div className="vReveal__textPane">
            <button
              className="vReveal__close"
              onClick={onClose}
              aria-label="Fermer"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5l10 10"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="vReveal__body">
              <motion.span
                className="vReveal__label"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce ? { duration: 0 } : { duration: 0.5, delay: 0.3, ease }
                }
              >
                {resource.tag} — {resource.category}
              </motion.span>

              <motion.h2
                className="vReveal__title"
                initial={reduce ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce ? { duration: 0 } : { duration: 0.6, delay: 0.35, ease }
                }
              >
                {resource.title}
              </motion.h2>

              <motion.div
                className="vReveal__rule"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={
                  reduce ? { duration: 0 } : { duration: 0.6, delay: 0.45, ease }
                }
              />

              <motion.p
                className="vReveal__desc"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce ? { duration: 0 } : { duration: 0.6, delay: 0.5, ease }
                }
              >
                {resource.description}
              </motion.p>

              <motion.a
                className="vReveal__cta"
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce ? { duration: 0 } : { duration: 0.5, delay: 0.6, ease }
                }
              >
                <span>Visiter</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 12L12 4m0 0H6m6 0v6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}