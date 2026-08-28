"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/portal", label: "Portal" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header>
      <nav
        className="
          mt-3 flex items-center justify-between
          px-6 md:px-10 lg:px-16
          bg-[rgba(255,255,255,0)]!
        "
      >
        {/* Logo */}
        <Link href="/" onClick={closeMenu}>
          <Image
            src="/images/logo.png"
            width={150}
            height={150}
            alt="Logo"
            className="w-24 md:w-28 lg:w-36"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-blue-500"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/login"
            className="
              rounded-full
              bg-blue-500
              px-7 py-1
              text-white
              hover:bg-blue-600
              transition
            "
          >
            Login/Register
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex flex-col gap-1.5 p-2 lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span
            className={`
              block h-0.5 w-6 bg-white
              transition-all duration-300
              ${isOpen ? "translate-y-2 rotate-45" : ""}
            `}
          />

          <span
            className={`
              block h-0.5 w-6 bg-white
              transition-all duration-300
              ${isOpen ? "opacity-0" : "opacity-100"}
            `}
          />

          <span
            className={`
              block h-0.5 w-6 bg-white
              transition-all duration-300
              ${isOpen ? "-translate-y-2 -rotate-45" : ""}
            `}
          />
        </button>
      </nav>

      {/* Mobile & Tablet Menu */}
      <div
        className={`
          overflow-hidden
          bg-[rgba(255,255,255,0)]!
          transition-all duration-300 ease-in-out
          lg:hidden
          ${
            isOpen
              ? "max-h-96 translate-y-0 opacity-100"
              : "max-h-0 -translate-y-2 opacity-0"
          }
        `}
      >
        <div className="flex flex-col items-center gap-5 py-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="transition-colors hover:text-blue-500"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/login"
            onClick={closeMenu}
            className="
              rounded-full
              bg-blue-500
              px-7 py-1
              text-white
              transition-colors
              hover:bg-blue-600
            "
          >
            Login/Register
          </Link>
        </div>
      </div>
    </header>
  );
}