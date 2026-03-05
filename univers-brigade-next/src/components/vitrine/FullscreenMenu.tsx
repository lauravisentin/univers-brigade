"use client";

/*
ce composant est côté client parce que :
- framer motion fonctionne seulement dans le navigateur
- j'utilise useEffect et useRef
- dans next.js app router, sans "use client" le composant serait rendu côté serveur
*/

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import "./FullscreenMenu.scss";

/*
props du composant
isOpen = état du menu (ouvert / fermé)
onClose = fonction pour fermer le menu
*/

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

/*
courbe d’animation personnalisée
je l’utilise pour donner une animation plus naturelle
*/

const ease = [0.22, 1, 0.36, 1] as const;

/*
liens du menu
je préfère les définir dans un tableau pour pouvoir facilement ajouter / retirer des pages
*/

const links = [
  { label: "Accueil", href: "/" },
  { label: "Ressources", href: "/ressources" },
];

export default function FullscreenMenu({ isOpen, onClose }: Props) {

  /*
  useReducedMotion permet de respecter l’accessibilité
  si l’utilisateur préfère moins d’animations, on réduit les transitions
  */

  const reduce = useReducedMotion();

  /*
  refs :
  menuRef = conteneur du menu
  closeRef = bouton fermer
  */

  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  /*
  gestion du clavier pour accessibilité

  Escape → ferme le menu
  Tab → empêche de sortir du menu (focus trap)
  */

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab" || !menuRef.current) return;

      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      /*
      si l'utilisateur tab en arrière depuis le premier élément
      on renvoie au dernier
      */

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }

      /*
      si tab depuis le dernier
      on revient au premier
      */

      else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    },
    [onClose]
  );

  /*
  useEffect exécuté quand le menu s'ouvre

  - ajoute l'écoute clavier
  - bloque le scroll de la page
  - met le focus sur le bouton fermer
  */

  useEffect(() => {

    if (!isOpen) return;

    document.addEventListener("keydown", handleKeyDown);

    /*
    empêche de scroller le site derrière le menu
    */

    document.body.style.overflow = "hidden";

    /*
    petit délai pour laisser le menu apparaître avant le focus
    */

    const t = setTimeout(() => closeRef.current?.focus(), 60);

    return () => {

      document.removeEventListener("keydown", handleKeyDown);

      /*
      on réactive le scroll quand le menu ferme
      */

      document.body.style.overflow = "";

      clearTimeout(t);
    };

  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className="vMenu"

          /*
          rôle dialog pour accessibilité
          */

          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"

          /*
          animation d'apparition du menu
          */

          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}

          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.4, ease: "easeInOut" }
          }
        >

          {/* bouton fermer */}

          <button
            ref={closeRef}
            className="vMenu__close"
            onClick={onClose}
            aria-label="Fermer le menu"
            type="button"
          >

            {/* icône X */}

            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* ligne décorative */}

          <div className="vMenu__rule" />

          {/* navigation */}

          <nav className="vMenu__nav">

            {links.map((link, i) => (

              <motion.a
                key={link.label}
                href={link.href}
                className="vMenu__link"

                /*
                animation d'apparition des liens
                */

                initial={reduce ? false : { opacity: 0, y: 40 }}

                animate={{ opacity: 1, y: 0 }}

                exit={reduce ? undefined : { opacity: 0, y: -20 }}

                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                        duration: 0.5,
                        delay: 0.1 + i * 0.08,
                        ease,
                      }
                }

                onClick={onClose}
              >
                {link.label}
              </motion.a>

            ))}

          </nav>

          {/* footer du menu */}

          {/* <motion.div
            className="vMenu__footer"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.5, delay: 0.5 }
            }
          >
            <span>Univers Brigade</span>
          </motion.div> */}

        </motion.div>
      )}
    </AnimatePresence>
  );
}