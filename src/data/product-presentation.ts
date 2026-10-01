export interface ProductPresentationImage {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
  kind?: "composition";
}

export interface ProductPresentation {
  images: ProductPresentationImage[];
  tagline: string;
  accent: "cyan" | "amber" | "blue" | "violet";
}

/** First-party public evidence and labeled authored covers. Never an authenticated customer session. */
export function getProductPresentation(slug: string, locale: "pt" | "en"): ProductPresentation {
  const pt = locale === "pt";
  const catalog: Record<string, ProductPresentation> = {
    mepmail: {
      accent: "cyan",
      tagline: pt ? "E-mail integrado a aplicações e agentes." : "Email integrated with applications and agents.",
      images: [
        {src:"/projects/presentation/mepmail-public-product.webp",width:1600,height:1100,label:pt?"Visão do produto":"Product overview · PT snapshot",alt:pt?"Página pública atual do MepMail com identidade, templates e integrações de e-mail":"Current MepMail public page with its identity, email templates and integrations"},
        {src:"/projects/presentation/mepmail-integration-focused.webp",width:1000,height:544,label:pt?"API, SMTP e agentes":"API, SMTP and agents · PT snapshot",alt:pt?"Seção pública responsiva do MepMail em enquadramento mais próximo, com integração API, SMTP e agentes; sem envio real ou credencial privada":"Actual responsive MepMail public section in a closer framing, with API, SMTP and agent integration; no email sent or private credential"},
        {src:"/projects/captures/mepmail-templates-public.webp",width:1110,height:614,label:pt?"Templates de e-mail":"Email templates",alt:pt?"Galeria real de templates publicada pelo MepMail":"Real email-template gallery publicly published by MepMail"},
      ],
    },
    archscene: {
      accent: "amber",
      tagline: pt ? "Dê forma visual às suas ideias de arquitetura." : "Give your architectural ideas a visual form.",
      images: [
        {src:`/projects/presentation/archscene-kitchen-cover-${locale}.webp`,width:1600,height:1000,kind:"composition",label:pt?"Do projeto ao render":"From project to render",alt:pt?"Composição ArchScene com o projeto técnico da cozinha integrada e o render real do mesmo ambiente, ambos completos e publicados na galeria do produto":"ArchScene composition showing the integrated kitchen's whole technical project and real matching render, both published in the product gallery"},
        {src:"/projects/presentation/archscene-kitchen-render.webp",width:887,height:887,label:pt?"Render original completo":"Whole original render",alt:pt?"Render real completo da cozinha integrada, com materiais, marcenaria e iluminação, publicado pelo ArchScene":"Whole real integrated-kitchen render, with materials, cabinetry and lighting, published by ArchScene"},
        {src:"/projects/presentation/archscene-kitchen-project.webp",width:887,height:887,label:pt?"Projeto técnico original":"Original technical project",alt:pt?"Export técnico completo do mesmo projeto de cozinha integrada apresentado na capa do ArchScene":"Whole technical export of the same integrated-kitchen project shown in the ArchScene cover"},
      ],
    },
    fullcommerce360: {
      accent: "blue",
      tagline: pt ? "Uma operação de marketplace mais organizada." : "A more organized marketplace operation.",
      images: [
        {src:`/projects/presentation/fullcommerce-operation-cover-${locale}.webp`,width:1600,height:1000,kind:"composition",label:pt?"Operação · dados de demonstração":"Operations · demonstration data",alt:pt?"Composição FullCommerce360 com recortes autênticos de produtos e contas, dados fictícios identificados e imagem ambiental oficial de preparação de pedidos; não representa clientes ou resultados comerciais":"FullCommerce360 composition with authentic Portuguese product and account UI excerpts, labeled fictional demonstration data, and an official order-packing contextual photograph; not customer or commercial results"},
        {src:`/projects/presentation/fullcommerce-radar-cover-${locale}.webp`,width:1600,height:1000,kind:"composition",label:pt?"Radar · dados de demonstração":"Radar · demonstration data",alt:pt?"Tela real completa do Radar FullCommerce360 em composição panorâmica, com referências e estimativas de demonstração, não resultados financeiros":"Whole real Portuguese FullCommerce360 Radar interface in a wide composition, with demonstration references and estimates, not financial results"},
      ],
    },
    urlpivot: {
      accent: "violet",
      tagline: pt ? "Altere o destino. Preserve o link e o QR Code." : "Change the destination. Keep the link and QR code.",
      images: [
        {src:"/projects/presentation/urlpivot-public-product.webp",width:1600,height:1100,label:pt?"Links, QR Codes e Pages":"Links, QR Codes and Pages · PT snapshot",alt:pt?"Página pública atual do URLPivot com interfaces de Link, QR Code e Page, sem painel de cookies sobre o produto":"Current URLPivot public page with Link, QR Code and Page interfaces, with no cookie banner covering the product"},
        {src:"/projects/presentation/urlpivot-official-page.webp",width:430,height:932,label:pt?"Page oficial da marca":"Official brand Page · PT snapshot",alt:pt?"Page oficial real do URLPivot com identidade própria e links públicos da marca, não um exemplo fictício":"Real official URLPivot Page with its own identity and public brand links, not a fictional example"},
      ],
    },
  };
  return catalog[slug] ?? {images:[],tagline:"",accent:"cyan"};
}
