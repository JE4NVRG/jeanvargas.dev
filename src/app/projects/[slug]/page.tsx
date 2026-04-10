import { projects, getProjectBySlug } from "@/data/projects";
import { CaseStudy } from "@/components/projects/case-study";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.title} — je4ndev`,
    description: project.description.en,
    openGraph: {
      title: `${project.title} — je4ndev`,
      description: project.description.en,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return <CaseStudy slug={slug} />;
}
