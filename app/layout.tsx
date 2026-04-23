import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muscle Fit Irwin | Meal Prep & Smoothies",
  description: "Simple, fast meal prep and smoothie ordering inside the gym.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="brand">
              Muscle Fit Irwin
            </Link>
            <nav>
              <ul className="nav-list">
                <li>
                  <Link href="/meal-prep">Meal Prep</Link>
                </li>
                <li>
                  <Link href="/smoothies">Smoothies</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <p>Muscle Fit Irwin</p>
        </footer>
      </body>
    </html>
  );
}
