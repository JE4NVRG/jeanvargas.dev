import { projects, getProjectBySlug } from "@/data/projects";
import { CaseStudy } from "@/components/projects/case-study";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Locale } from "@/i18n";

interface Props {
  params: Promise<{ slug: string; locale: Locale }>;
}

const SITE_URL = "https://je4ndev.com";
const SUPPORTED_LOCALES = ["pt", "en"] as const;

export function generateStaticParams() {
  // Cartesian product: 2 locales × 12 projects = 24 SSG'd pages.
  return SUPPORTED_LOCALES.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const isEn = locale === "en";
  const title = `${project.title} — Case study · je4ndev`;
  const description = project.description[locale];
  const url = `${SITE_URL}/${locale}/projects/${slug}`;
  const ogImage = project.image
    ? `${SITE_URL}${project.image}`
    : `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "pt-BR": `${SITE_URL}/pt/projects/${slug}`,
        "en-US": `${SITE_URL}/en/projects/${slug}`,
        "x-default": `${SITE_URL}/en/projects/${slug}`,
      },
    },
    keywords: [
      project.title,
      project.category,
      ...project.technologies.slice(0, 6),
      "je4ndev",
      "Jean Carlos Vargas",
      isEn ? "product agency" : "agencia de produto",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "JE4NDEV",
      type: "article",
      locale: isEn ? "en_US" : "pt_BR",
      alternateLocale: isEn ? ["pt_BR"] : ["en_US"],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${project.title} — ${project.category}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

function LangFixer({ locale }: { locale: Locale }) {
  const lang = locale === "pt" ? "pt-BR" : "en";
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(lang)};`,
      }}
    />
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug, locale } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const projectUrl = `${SITE_URL}/${locale}/projects/${slug}`;
  const ogImage = project.image
    ? `${SITE_URL}${project.image}`
    : `${SITE_URL}/og-image.png`;
  const isEn = locale === "en";

  const projectJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": projectUrl,
      name: project.title,
      headline: project.title,
      url: projectUrl,
      image: ogImage,
      description: project.description[locale],
      inLanguage: isEn ? "en" : "pt-BR",
      keywords: [project.category, ...project.technologies].join(", "),
      creator: {
        "@type": "Organization",
        name: "JE4NDEV",
        url: SITE_URL,
      },
      author: {
        "@type": "Person",
        name: "Jean Carlos Vargas",
        url: SITE_URL,
      },
      ...(project.links.live ? { sameAs: [project.links.live] } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isEn ? "Home" : "Início",
          item: `${SITE_URL}/${locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: isEn ? "Projects" : "Projetos",
          item: `${SITE_URL}/${locale}#work`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: project.title,
          item: projectUrl,
        },
      ],
    },
  ];

  return (
    <>
      <LangFixer locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <CaseStudy slug={slug} />
    </>
  );
}
