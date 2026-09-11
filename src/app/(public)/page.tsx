"use client";

import About_Us from "@/components/Home/About-Us";
import Header from "@/components/Home/Header";
import Services from "@/components/Home/Services";

export default function HomePage() {
  return (
    <main id="main-content" className="font-[Vazir] bg-white text-black">
          <Header />
          <Services />
          <About_Us />
    </main>
  );
}
