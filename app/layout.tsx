import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteData } from "@/lib/site-data";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muscle Fit Irwin | Meal Prep & Smoothies",
  description: "Simple, fast meal prep and smoothie ordering inside the gym.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
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
              <span className="brand-badge">MFI</span>
              <span className="brand-text">
                <strong>Muscle Fit Irwin</strong>
                <small>Performance Fuel</small>
              </span>
              <Image src="/brand/logo-light.svg" alt="Muscle Fit" width={170} height={48} priority className="brand-mark" />
            </Link>
            <nav className="topnav">
              <ul className="nav-list">
                <li>
                  <Link href="/meal-prep">Meal Prep</Link>
                </li>
                <li>
                  <Link href="/acai-bowls">Acai Bowls</Link>
                </li>
                <li>
                  <Link href="/smoothies">Smoothies</Link>
                </li>
                {siteData.clover.enabled ? (
                  <li>
                    <Link href="/order">Order</Link>
                  </li>
                ) : null}
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
