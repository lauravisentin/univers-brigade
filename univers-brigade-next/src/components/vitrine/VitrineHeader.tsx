"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import FullscreenMenu from "./FullscreenMenu";
import "./VitrineHeader.scss";

export default function VitrineHeader({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`vHeader ${scrolled ? "vHeader--scrolled" : ""} ${variant === "light" ? "vHeader--light" : ""}`}
        role="banner"
      >
        {/* <a href="/vitrine" className="vHeader__brand">
          Univers Brigade
        </a> */}

        <button
          className="vHeader__menuBtn"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
          type="button"
        >
          <motion.span
            className="vHeader__menuLine"
            animate={
              menuOpen
                ? { rotate: 45, y: 0, width: 24 }
                : { rotate: 0, y: -4, width: 24 }
            }
            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
          />
          <motion.span
            className="vHeader__menuLine"
            animate={
              menuOpen
                ? { rotate: -45, y: 0, width: 24 }
                : { rotate: 0, y: 4, width: 16 }
            }
            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
          />
        </button>
      </header>

      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
