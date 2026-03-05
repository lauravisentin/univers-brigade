import Link from "next/link";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          Univers Brigade
        </Link>

        <nav className={styles.nav}>
          <a href="#ressources" className={styles.link}>Ressources</a>
          <Link href="/compte/creer" className={styles.cta}>
            Rejoins Brigade
          </Link>
        </nav>
      </div>
    </header>
  );
}
