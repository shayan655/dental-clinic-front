"use client";

import About_Us_Pricing from "@/components/Home/About-Us-&-Pricing";
import Header from "@/components/Home/Header";
import Services from "@/components/Home/Services";

export default function HomePage() {
  return (
    <main id="main-content" className="font-[Vazir] bg-white text-black">
          <Header />
          <Services />
          <About_Us_Pricing />
    </main>
  );
}
