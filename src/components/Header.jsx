import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";


export default function Header() {
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsShrunk(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b" style={{ backgroundColor: "#F4EFE4", borderColor: "#BDC0B4" }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-4">
            <picture>
              <source srcSet="/logo-tree-300.avif 1x, /logo-tree-600.avif 2x" type="image/avif" />
              <source srcSet="/logo-tree-300.webp 1x, /logo-tree-600.webp 2x" type="image/webp" />
              <img
                src="/logo-tree-300.png"
                srcSet="/logo-tree-300.png 1x, /logo-tree-600.png 2x"
                alt="Tree logo"
                loading="lazy"
                className={`object-contain transition-all duration-300 ${isShrunk ? "h-10 sm:h-12" : "h-14 sm:h-20"}`}
              />
            </picture>

            <div className={`text-left transition-all duration-300 ${isShrunk ? "scale-95" : "scale-100"}`}>
              <h1 className="brand-script text-2xl sm:text-3xl md:text-4xl leading-6" style={{ color: "#22402C" }}>
                Ryan M. Fisher, MD
              </h1>
              <p className="brand-serif text-sm sm:text-lg tracking-wide" style={{ color: "#2F4634" }}>
                Family Medicine Physician
              </p>
            </div>
          </Link>

          {/* avatar removed from header; profile displayed on About page */}
        </div>

        <nav role="navigation" className="flex flex-col md:flex-row items-center gap-4">
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'text-[#8DA38A] font-medium hover:text-[#8DA38A]' : 'text-[#2F4634] font-medium hover:text-[#8DA38A]')}>
            About
          </NavLink>
          <NavLink to="/education" className={({ isActive }) => (isActive ? 'text-[#8DA38A] font-medium hover:text-[#8DA38A]' : 'text-[#2F4634] font-medium hover:text-[#8DA38A]')}>
            Educational Resources
          </NavLink>
          <NavLink to="/insights" className={({ isActive }) => (isActive ? 'text-[#8DA38A] font-medium hover:text-[#8DA38A]' : 'text-[#2F4634] font-medium hover:text-[#8DA38A]')}>
            Insights
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
