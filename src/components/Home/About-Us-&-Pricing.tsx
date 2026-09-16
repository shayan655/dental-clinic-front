import About from "./About-Us";
import Pricing from "./Pricing";

export default function About_Us_Pricing() {
  return (
     <section className="mx-auto mt-8 flex w-full flex-col overflow-hidden rounded-2xl bg-blue-800 bg-[url('/images/dentist-about-section-bg.png')] bg-cover bg-center">
          <About />
          <Pricing />
     </section>
  );
}
