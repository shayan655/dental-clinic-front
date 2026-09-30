import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-blue-950 text-white">
      {/* Main Footer */}
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                width={150}
                height={150}
                alt="Dental Clinic Logo"
                className="w-28 sm:w-32"
              />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-blue-100/70 sm:text-base">
              Your smile is our priority. We provide modern dental care with
              professional service and a comfortable experience for every
              patient.
            </p>

            {/* Social Media */}
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600"
              >
                f
              </Link>

              <Link
                href="/"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600"
              >
                ig
              </Link>

              <Link
                href="/"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600"
              >
                X
              </Link>

              <Link
                href="/"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600"
              >
                in
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-blue-100/70 transition-colors duration-300 hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-sm text-blue-100/70 transition-colors duration-300 hover:text-white"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="text-sm text-blue-100/70 transition-colors duration-300 hover:text-white"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-sm text-blue-100/70 transition-colors duration-300 hover:text-white"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="text-sm text-blue-100/70 transition-colors duration-300 hover:text-white"
                >
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">
              Our Services
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/services"
                  className="text-sm text-blue-100/70 transition-colors duration-300 hover:text-white"
                >
                  General Dentistry
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="text-sm text-blue-100/70 transition-colors duration-300 hover:text-white"
                >
                  Cosmetic Dentistry
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="text-sm text-blue-100/70 transition-colors duration-300 hover:text-white"
                >
                  Teeth Whitening
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="text-sm text-blue-100/70 transition-colors duration-300 hover:text-white"
                >
                  Dental Implants
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="text-sm text-blue-100/70 transition-colors duration-300 hover:text-white"
                >
                  Orthodontics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">
              Contact Us
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-300">
                  📍
                </span>

                <span className="text-sm leading-6 text-blue-100/70">
                  123 Dental Street,
                  <br />
                  New York, USA
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-300">
                  ☎
                </span>

                <Link
                  href="tel:+1234567890"
                  className="text-sm text-blue-100/70 transition-colors hover:text-white"
                >
                  +1 234 567 890
                </Link>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-300">
                  @
                </span>

                <Link
                  href="mailto:info@dentalclinic.com"
                  className="break-all text-sm text-blue-100/70 transition-colors hover:text-white"
                >
                  info@dentalclinic.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Appointment CTA */}
        <div className="mt-12 flex flex-col gap-5 rounded-3xl bg-blue-900/60 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold sm:text-2xl">
              Ready for a healthier smile?
            </h3>

            <p className="mt-2 text-sm text-blue-100/70 sm:text-base">
              Book your appointment today and take the first step.
            </p>
          </div>

          <Link
            href="/portal/appointments"
            className="w-full rounded-full bg-blue-600 px-7 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-500 hover:shadow-lg sm:w-fit sm:px-8 sm:py-4 sm:text-base"
          >
            MAKE AN APPOINTMENT
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-5 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left lg:px-10">
          <p className="text-xs text-blue-100/50 sm:text-sm">
            © 2026 Dental Clinic. All rights reserved.
          </p>

          <div className="flex justify-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-blue-100/50 transition-colors hover:text-white sm:text-sm"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-blue-100/50 transition-colors hover:text-white sm:text-sm"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
