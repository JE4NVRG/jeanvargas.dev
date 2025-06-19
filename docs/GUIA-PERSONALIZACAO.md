# 🎨 Guia de Personalização do Portfólio

Este guia te ensina como personalizar facilmente todos os elementos do seu portfólio.

## 📸 Como Trocar Imagens de Depoimentos

### 1. **Usando Pravatar (Avatares Aleatórios)**

```typescript
avatar: "https://i.pravatar.cc/150?img=25";
```

- Troque o número após `img=` (1 a 70)
- Cada número gera uma pessoa diferente
- Tamanho fixo de 150x150px

### 2. **Usando Suas Próprias Imagens**

```typescript
avatar: "/avatars/cliente1.jpg";
```

- Coloque a imagem na pasta `public/avatars/`
- Formato recomendado: JPG ou PNG
- Tamanho recomendado: 150x150px

### 3. **Usando Unsplash (Fotos Profissionais)**

```typescript
avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
```

- Pesquise uma foto no [Unsplash](https://unsplash.com)
- Copie o ID da foto da URL
- Substitua no template acima

## 💬 Editando Depoimentos

### Arquivo: `src/data/feedbacks.ts`

```typescript
{
  id: 1,
  nome: "Seu Cliente",
  cargo: "Cargo do Cliente",
  empresa: "Nome da Empresa", // opcional
  avatar: "URL_DA_IMAGEM",
  avaliacao: 4.8, // 1 a 5 (aceita decimais)
  depoimento: "Texto do depoimento aqui..."
}
```

**Dicas:**

- Máximo recomendado: 200 caracteres no depoimento
- Use aspas duplas para textos longos
- Avaliação aceita decimais (ex: 4.8, 4.9)

## 🚀 Personalizando Projetos

### Arquivo: `src/app/page.tsx` (linha ~25)

```typescript
{
  id: 1,
  titulo: "Nome do Projeto",
  descricao: "Descrição breve (máx 50 chars)",
  tecnologias: ["React", "Node.js", "MongoDB"],
  resultados: [
    { valor: "100%", label: "Sucesso", icon: TrendingUp },
    // ... mais resultados
  ],
  gradiente: "from-blue-500 to-purple-600", // Cores Tailwind
  link: "https://github.com/seu-usuario/projeto"
}
```

### 🎨 Gradientes Disponíveis:

- `from-emerald-500 to-teal-600` (verde)
- `from-purple-500 to-pink-600` (roxo)
- `from-orange-500 to-red-600` (laranja)
- `from-blue-500 to-cyan-600` (azul)
- `from-indigo-500 to-purple-600` (índigo)

## 🛠️ Modificando Serviços

### Arquivo: `src/app/page.tsx` (linha ~65)

```typescript
{
  id: 1,
  titulo: "Seu Serviço",
  descricao: "Descrição detalhada do serviço",
  icon: Globe, // Ícone do Lucide React
  destaque: true, // true = card destacado
  tamanho: "wide" // "normal" | "wide" | "tall"
}
```

### 📦 Tamanhos de Card:

- `normal`: Card padrão (1 coluna)
- `wide`: Card largo (2 colunas)
- `tall`: Card alto (2 linhas)

### 🎯 Ícones Disponíveis (Lucide React):

- `Globe`, `Server`, `Smartphone`, `Bot`
- `Plug`, `Repeat`, `Zap`, `Users`
- [Ver todos os ícones](https://lucide.dev/icons)

## 💼 Atualizando Tecnologias

### Arquivo: `src/app/page.tsx` (linha ~105)

```typescript
{ nome: "React", emoji: "⚛️", categoria: "Frontend" }
```

### 📂 Categorias Disponíveis:

- `Frontend`, `Backend`, `Database`
- `Mobile`, `IA`, `Blockchain`
- `DevOps`, `Cloud`, `Linguagem`

## 📊 Modificando Métricas

### Arquivo: `src/data/feedbacks.ts` (linha ~105)

```typescript
{
  id: 1,
  icone: MessageCircle, // Ícone do Lucide
  valor: "+120k", // Como será exibido
  valorNumerico: 120, // Para animação
  sufixo: "k+", // Texto após número
  prefixo: "+", // Texto antes do número
  descricao: "Descrição da métrica",
  destaque: true // true = estilo especial
}
```

## 📱 Configurando WhatsApp

### Arquivo: `src/components/ui/whatsapp-button.tsx` (linha ~10)

```typescript
const whatsappUrl = "https://wa.me/5511999999999";
```

**Formato:**

- `55` = Código do país (Brasil)
- `11` = DDD da cidade
- `999999999` = Seu número (sem espaços ou símbolos)

## 🎭 Personalizando Efeitos Visuais

### Mouse Glow

**Arquivo:** `src/components/ui/mouse-glow-config.ts`

```typescript
enabled: true, // Liga/desliga o efeito
showOnMobile: false, // Mostrar no mobile
opacity: 1, // Intensidade (0-1)
colors: {
  base: [255, 255, 255], // RGB da cor
}
```

### Background Beams

**Para desativar:** Remova o componente `<BackgroundBeamsWithCollision>` dos arquivos.

## 🏷️ Alterando Selos de Confiança

### Arquivo: `src/data/feedbacks.ts` (linha ~145)

```typescript
{
  id: 1,
  texto: "Texto do selo",
  icone: "✅", // Emoji
  cor: "emerald" // "emerald"|"blue"|"purple"|"orange"|"cyan"
}
```

## 🎨 Cores do Tema

### CSS Global: `src/app/globals.css`

As cores principais estão definidas nas variáveis CSS. Para alterar o tema:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... outras variáveis */
}
```

## 📝 Dicas Importantes

1. **Backup**: Sempre faça backup antes de grandes mudanças
2. **Testes**: Teste em diferentes dispositivos e navegadores
3. **Performance**: Otimize imagens antes de usar (use WebP quando possível)
4. **SEO**: Atualize textos Alt das imagens e meta descriptions
5. **Git**: Commit pequenas mudanças para facilitar reversão

## 🔧 Comandos Úteis

```bash
# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Verificar erros
npm run lint

# Preview da build
npm run start
```

## 📞 Precisa de Ajuda?

Se tiver dúvidas sobre alguma personalização:

1. Consulte a documentação oficial do [Next.js](https://nextjs.org/docs)
2. Verifique a documentação do [Tailwind CSS](https://tailwindcss.com/docs)
3. Entre em contato através do WhatsApp configurado no site

---

**💡 Lembre-se:** Pequenas mudanças fazem grande diferença. Comece devagar e vá personalizando aos poucos!
