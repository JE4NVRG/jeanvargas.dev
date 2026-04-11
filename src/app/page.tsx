import { Hero } from "@/components/sections/hero";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Testimonials } from "@/components/sections/testimonials";
import { About } from "@/components/sections/about";
import { TechStack } from "@/components/sections/tech-stack";
import { Services } from "@/components/sections/services";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedWork />
      <Testimonials />
      <About />
      <TechStack />
      <Services />
      <Contact />
    </main>
  );
}
