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

/**
 * Server-side `<html lang>` fix for the current request. Without this, the
 * root layout always renders lang="pt-BR" which misleads Googlebot when
 * crawling the /en route. We inject a tiny inline script that runs before
 * hydration to flip the attribute. It also runs before React hydrates, so
 * no mismatch warning is thrown.
 */
function LangFixer({ locale }: { locale: "pt" | "en" }) {
  const lang = locale === "pt" ? "pt-BR" : "en";
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(lang)};`,
      }}
    />
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: "pt" | "en" }>;
}) {
  const { locale } = await params;
  return (
    <>
      <LangFixer locale={locale} />
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
    </>
  );
}
