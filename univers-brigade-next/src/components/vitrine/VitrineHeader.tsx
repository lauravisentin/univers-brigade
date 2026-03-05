"use client";

/*
ce composant est côté client car :
- j’utilise des hooks React (useState, useEffect)
- j’écoute l’événement scroll du navigateur
*/

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import FullscreenMenu from "./FullscreenMenu";
import "./VitrineHeader.scss";

export default function VitrineHeader({ variant = "dark" }: { variant?: "dark" | "light" }) {

  /*
  état du menu fullscreen
  */

  const [menuOpen, setMenuOpen] = useState(false);

  /*
  état utilisé pour savoir si la page a été scrollée
  permet de modifier le style du header
  */

  const [scrolled, setScrolled] = useState(false);

  /*
  respecte la préférence utilisateur "réduire les animations"
  */

  const reduce = useReducedMotion();

  /*
  écoute du scroll pour détecter
  si la page est descendue de plus de 60px
  */

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);

    /*
    passive:true améliore la performance du scroll
    */

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`vHeader ${scrolled ? "vHeader--scrolled" : ""} ${variant === "light" ? "vHeader--light" : ""}`}
        role="banner"
      >

        {/* bouton pour ouvrir le menu fullscreen */}

        <button
          className="vHeader__menuBtn"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
          type="button"
        >

          {/* lignes du bouton burger animées avec Framer Motion */}

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

      {/* composant du menu fullscreen */}

      <FullscreenMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}