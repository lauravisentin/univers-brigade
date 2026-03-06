import { fontVariableClasses } from "@/lib/fonts";
import "./globals.scss";

export const metadata = {
  title: "Univers Brigade",
  description: "Catalogue de ressources",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={fontVariableClasses}>
        <main className="appMain">{children}</main>
      </body>
    </html>
  );
}
