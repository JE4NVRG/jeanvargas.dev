# Componente CardCriptoIA - Destaque Tecnológico Animado

## 📁 Localização

O componente foi criado em: `src/components/ui/CardCriptoIA.tsx`

## 🎯 Objetivo

Componente animado inspirado no Aceternity UI que exibe de forma visual e interativa as principais tecnologias utilizadas nos projetos de Jean Carlos Vargas.

## 🚀 Funcionalidades

### ✨ Animações

- **Animações CSS nativas**: Usa `animate-pulse`, `animate-bounce`, `hover:scale-105`
- **Transições suaves**: `transition-all duration-300`
- **Efeitos hover**: Rotação e escala dos ícones
- **Animações escalonadas**: Delay diferente para cada tecnologia

### 🎨 Design

- **Background escuro**: `bg-gradient-to-br from-slate-900/90 to-black/80`
- **Estilo glass morphism**: `backdrop-blur-md border border-slate-700/50`
- **Gradientes animados**: Overlay com cores purple/blue/emerald
- **Sombras internas**: `shadow-inner shadow-black/20`

### 🔧 Tecnologias Destacadas

1. **OpenAI** (text-emerald-400) - Inteligência Artificial
2. **Solidity** (text-gray-300) - Smart Contracts
3. **Supabase** (text-green-400) - Banco de dados
4. **FlutterFlow** (text-blue-400) - Apps Mobile
5. **Meta APIs** (text-blue-500) - Integrações
6. **Gemini** (text-yellow-400) - AI Avançada
7. **Claude** (text-purple-400) - AI Generativa

## 📦 Dependências Instaladas

- `react-icons` - Para ícones das tecnologias
- `clsx` - Para utilitários de classe CSS
- `lucide-react` - Ícones alternativos (já estava instalado)

## 🛠️ Como Usar

### Importação

```tsx
import CardCriptoIA from "@/components/ui/CardCriptoIA";
// ou
import CardCriptoIA from "../components/ui/CardCriptoIA";
```

### Uso na Página

```tsx
<section className="py-20 px-6">
  <div className="container mx-auto max-w-5xl">
    <CardCriptoIA />
  </div>
</section>
```

### Integração Sugerida na `page.tsx`

Inserir entre a seção "Quem é Jean?" e "Stacks e Tecnologias":

```tsx
{
  /* Preview Sobre Mim */
}
<section className="py-16 px-6 bg-gradient-to-br from-gray-800 to-gray-900">
  {/* ... conteúdo existente ... */}
</section>;

{
  /* NOVO: Componente de Destaque Tecnológico */
}
<section className="py-20 px-6">
  <div className="container mx-auto max-w-5xl">
    <CardCriptoIA />
  </div>
</section>;

{
  /* Stacks e Tecnologias */
}
<section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
  {/* ... conteúdo existente ... */}
</section>;
```

## 🎨 Customizações Possíveis

### Alterar Tecnologias

Edite o array `technologies` no componente:

```tsx
const technologies: TechItem[] = [
  {
    name: "Nova Tecnologia",
    icon: NovoIcone,
    color: "text-nova-cor",
    description: "Nova Descrição",
  },
  // ...
];
```

### Alterar Cores

Modifique as cores no array de tecnologias ou nos gradientes:

```tsx
// Gradiente de fundo
bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-emerald-600/10

// Cores das tecnologias
"text-emerald-400", "text-gray-300", etc.
```

### Alterar Animações

Customize as propriedades de animação:

```tsx
// Duração das animações
animationDuration: "2s";

// Delay entre elementos
animationDelay: `${index * 0.1}s`;
```

## 🔧 Estrutura do Componente

```
CardCriptoIA/
├── Background gradient animado
├── Header com título e descrição
├── Grid responsivo de tecnologias
│   ├── Card individual por tecnologia
│   │   ├── Ícone com animação
│   │   ├── Efeito glow animado
│   │   ├── Nome da tecnologia
│   │   └── Descrição breve
│   └── Overlay hover
├── Elementos decorativos (3 pontos animados)
└── Sombra interna
```

## 📱 Responsividade

- **Mobile**: 2 colunas (`grid-cols-2`)
- **Tablet**: 3 colunas (`md:grid-cols-3`)
- **Desktop**: 4 colunas (`lg:grid-cols-4`)

## 🚀 Próximas Melhorias

1. **Integração com Framer Motion**: Quando os erros de import forem resolvidos
2. **Mais tecnologias**: Adicionar Docker, AWS, etc.
3. **Modo claro**: Suporte para light mode
4. **Personalização**: Props para customizar título, tecnologias, etc.

## 📋 Status

✅ Componente criado e funcional  
✅ Animações CSS nativas implementadas  
✅ Design responsivo  
✅ Documentação completa  
⚠️ Import do componente na página principal (necessita ajuste do path)  
🔄 Integração com Framer Motion (futuro)

---

**Desenvolvido por:** Jean Carlos Vargas  
**Tecnologias:** React + TypeScript + Tailwind CSS + Lucide React
