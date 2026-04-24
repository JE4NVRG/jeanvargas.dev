<div align="center">

<img src="docs/screenshots/hero.png" alt="je4ndev portfolio hero" width="100%" />

<br />
<br />

# je4ndev.com

**Portfolio pessoal de Jean Carlos Vargas**  
**Full-stack developer focado em SaaS, automacoes com IA e Web3**

[![Live](https://img.shields.io/badge/LIVE-je4ndev.com-8b5cf6?style=for-the-badge)](https://je4ndev.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-ready-000?style=for-the-badge&logo=vercel)](https://vercel.com)

Portfolio dark, bilingue e orientado a conversao para apresentar projetos,
servicos, stack tecnica, auditoria Solidity, automacoes com IA e estudos de caso.

[**View Live**](https://je4ndev.com) &middot; [**Projetos**](#featured-projects) &middot; [**Stack**](#tech-stack) &middot; [**Rodar local**](#getting-started)

</div>

---

## Preview

<table>
<tr>
<td width="50%">

**Hero atualizado**

<img src="docs/screenshots/hero.png" alt="Hero com foto, terminal e CTA" />

</td>
<td width="50%">

**Mobile**

<img src="docs/screenshots/mobile.png" alt="Mobile responsive view" />

</td>
</tr>
<tr>
<td width="50%">

**Projetos em destaque**

<img src="docs/screenshots/featured-work.png" alt="Featured projects section" />

</td>
<td width="50%">

**Case study**

<img src="docs/screenshots/case-study.png" alt="Project case study" />

</td>
</tr>
</table>

---

## Highlights

- **Hero comercial** com foto do Jean, CTA para WhatsApp, metricas e terminal animado.
- **Navegacao bilingue** PT-BR/EN com troca instantanea e persistencia em `localStorage`.
- **Projetos com cases**: prints, problema, solucao, impacto, resultados e CTA final.
- **OpenClaw Gateway** com visual de terminal simulado em vez de print sem contexto.
- **Comentarios comerciais** com avatares gerados por IA e empresas ficticias localizadas em PT/EN.
- **Servicos claros**: SaaS, apps web, automacoes com IA, integracoes, mobile, consultoria e auditoria Solidity.
- **Stack atualizada** com OpenAI, Anthropic, Qwen, Kimi, LangChain, Supabase, Next.js e Web3.
- **UX refinada**: loading escuro, footer com GitHub central, links sociais e transicoes sem flash branco.

---

## Featured Projects

| Project | What it does | Stack | Status |
|---------|-------------|-------|--------|
| **Gestao ML** | SaaS de gestao de pedidos para vendedores do Mercado Livre | Next.js, TypeScript, Supabase, Mercado Livre API | **Live** |
| **NexPanel** | SaaS management for IPTV resellers, clients, billing and dashboards | Next.js, Supabase, Stripe | **Live** |
| **Vultrix 3D** | Plataforma para precificacao, estoque e financeiro de impressao 3D | Next.js, Supabase, Tailwind | **Live** |
| **OpenClaw Gateway** | Gateway multi-plataforma de automacao com workflows de IA | Node.js, OpenAI, Supabase | **Live** |
| **HypeFC** | Dashboard de futebol em tempo real com placares e classificacoes | Next.js, API Football | **Live** |
| **MepChat** | Chatbot WhatsApp com IA e painel para operacao CNPJ | Node.js, Firebase, OpenAI | **MVP** |

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js App Router, React, TypeScript, Tailwind CSS |
| **Backend** | Node.js, API Routes, integrations and automations |
| **Database** | Supabase, PostgreSQL, Firebase |
| **AI** | OpenAI, Anthropic, Qwen, Kimi, LangChain, CCXT |
| **Web3** | Solidity, Hardhat, OpenZeppelin, smart contract audits |
| **DevOps** | Vercel, Docker, GitHub Actions |
| **UI** | Framer Motion, Lucide Icons, generated bitmap assets |

---

## Architecture

```txt
src/
  app/
    layout.tsx
    loading.tsx
    page.tsx
    projects/[slug]/page.tsx
  components/
    layout/
    projects/
    sections/
    ui/
  data/
    projects.ts
  i18n/
    provider.tsx
    translations/
  types/
    project.ts
public/
  images/
  projects/
docs/
  screenshots/
```

Design decisions:

- Project data is typed in TypeScript.
- Pages are statically generated where possible.
- Client components are used only for animation, language state and interactive UI.
- Screenshots and generated testimonial avatars live in versioned project assets.

---

## Getting Started

```bash
git clone https://github.com/JE4NVRG/jeanvargas.dev.git
cd jeanvargas.dev
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run lint` | ESLint check |

---

## Validation

Current checks used before publishing:

```bash
npm run lint
npm run build
```

---

## Contact

<div align="center">

**Jean Carlos Vargas**  
Full-stack Developer  
Paranavai, Brazil

[![Portfolio](https://img.shields.io/badge/je4ndev.com-8b5cf6?style=for-the-badge)](https://je4ndev.com)
[![Email](https://img.shields.io/badge/jean@je4ndev.com-000?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jean@je4ndev.com)
[![GitHub](https://img.shields.io/badge/@JE4NVRG-000?style=for-the-badge&logo=github)](https://github.com/JE4NVRG)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jean-carlos-vargas-93bbb31b4/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/5511914826568)

</div>

---

<div align="center">

Criado por **JE4NVRG - JE4NDEV**.

</div>
