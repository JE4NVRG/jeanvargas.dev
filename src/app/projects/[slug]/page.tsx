import { projects, getProjectBySlug } from "@/data/projects";
import { CaseStudy } from "@/components/projects/case-study";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://je4ndev.com";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.title} — Case study · je4ndev`;
  const description = project.description.pt;
  const url = `${SITE_URL}/projects/${slug}`;
  const ogImage = project.image
    ? `${SITE_URL}${project.image}`
    : `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "pt-BR": url,
        "en-US": `${url}?lang=en`,
        "x-default": url,
      },
    },
    keywords: [
      project.title,
      project.category,
      ...project.technologies.slice(0, 6),
      "je4ndev",
      "Jean Carlos Vargas",
      "agencia de produto",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "JE4NDEV",
      type: "article",
      locale: "pt_BR",
      alternateLocale: ["en_US"],
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

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const projectUrl = `${SITE_URL}/projects/${slug}`;
  const ogImage = project.image
    ? `${SITE_URL}${project.image}`
    : `${SITE_URL}/og-image.png`;

  // JSON-LD por projeto: ajuda Google a entender que cada slug eh um produto
  // distinto da agencia (rich SERP nas buscas por NexPanel, ArchScene, etc).
  const projectJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": projectUrl,
      name: project.title,
      headline: project.title,
      url: projectUrl,
      image: ogImage,
      description: project.description.pt,
      inLanguage: ["pt-BR", "en"],
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
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Projetos",
          item: `${SITE_URL}/#work`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <CaseStudy slug={slug} />
    </>
  );
}
