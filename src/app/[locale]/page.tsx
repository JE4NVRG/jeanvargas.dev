import { Hero } from "@/components/sections/hero";
import { TechMarquee } from "@/components/ui/tech-marquee";
import { Showcase } from "@/components/sections/showcase";
import { ProjectUniverse } from "@/components/sections/project-universe";
import { GithubProof } from "@/components/sections/github-proof";
import { Process } from "@/components/sections/process";
import { Pricing } from "@/components/sections/pricing";
import { About } from "@/components/sections/about";
import { TechStack } from "@/components/sections/tech-stack";
import { Services } from "@/components/sections/services";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <TechMarquee />
      <Showcase />
      <ProjectUniverse />
      <GithubProof />
      <Process />
      <Pricing />
      <About />
      <TechStack />
      <Services />
      <Faq />
      <Contact />
    </main>
  );
}
