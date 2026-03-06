"use client";

import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";

/*
composant qui active le smooth scroll sur tout le site

Lenis remplace le scroll natif du navigateur
pour créer un défilement plus fluide
*/

export default function SmoothScroll({ children }: { children: React.ReactNode }) {

  /*
  référence vers l’instance Lenis
  permet d’appeler sa méthode raf()
  */

  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {

    /*
    Framer Motion possède une boucle de rendu interne
    ici on synchronise Lenis avec cette boucle
    pour que le scroll et les animations soient parfaitement fluides
    */

    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    frame.update(update, true);

    /*
    nettoyage lorsque le composant est démonté
    */

    return () => cancelFrame(update);

  }, []);

  return (

    /*
    ReactLenis applique le smooth scroll
    à tout le contenu enfant

    autoRaf = false car on contrôle la boucle avec Framer Motion
    */

    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>

  );
}