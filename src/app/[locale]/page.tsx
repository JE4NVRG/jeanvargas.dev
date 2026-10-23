import { Hero } from "@/components/sections/hero";
import { Showcase } from "@/components/sections/showcase";
import { ProjectUniverse } from "@/components/sections/project-universe";
import { Capabilities } from "@/components/sections/capabilities";
import { Partners } from "@/components/sections/partners";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Showcase />
      <ProjectUniverse />
      <Capabilities />
      <Partners />
      <Services />
      <Process />
      <About />
      <Contact />
    </main>
  );
}
