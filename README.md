# Teto & Terra Real Estate — site institucional

Projeto React + TypeScript + Tailwind pronto para subir no GitHub e importar
no Figma Make (ou deployar direto em Vercel/Netlify).

## Stack

- **Vite 5** + **React 18** + **TypeScript 5**
- **Tailwind CSS 3** (com paleta customizada alinhada à logo)
- **React Router 6** (rotas `/`, `/empreendimentos/:slug`, `/admin`)
- **lucide-react** (ícones)

Nenhum backend é necessário. O conteúdo é editável pelo painel `/admin` e
salvo no `localStorage` do navegador, com opção de exportar/importar JSON.

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Como publicar no GitHub e importar no Figma Make

1. Crie um repositório novo no GitHub (ex.: `teto-e-terra-site`).
2. Copie **toda a pasta** deste projeto para a raiz do repo.
3. Commit e push.
4. No Figma Make, escolha **Importar do GitHub** e aponte para o repositório.
5. O Figma Make detecta `package.json`, `vite.config.ts` e `tailwind.config.js`
   automaticamente.

### Deploy direto (Vercel / Netlify)

- **Build command:** `npm run build`
- **Output directory:** `dist`

Ambas as plataformas detectam Vite sem configuração extra.

## Painel administrativo (`/admin`)

Acesse `https://seusite.com/admin`.

**Senha padrão:** `tetoeterra-2026`
**Como trocar:**

- Crie um arquivo `.env` baseado em `.env.example` com
  `VITE_ADMIN_PASSWORD=sua-senha-nova`
- Ou edite `FALLBACK_PASSWORD` em `src/lib/auth.ts`.

O painel permite editar:

- **Marca** — nome e tagline
- **Hero** — título, subtítulo, imagem de fundo, botões
- **Empreendimentos** — lista completa, destaques, status, imagens, descrições
- **Aluguel** e **Venda** — imóveis com preço, bairro, área, quartos
- **Sobre** — parágrafos e pilares
- **Investir** — bullets e CTA
- **Contato** — WhatsApp, e-mail, Instagram, endpoint Formspree
- **Backup** — exportar/importar JSON e restaurar padrão

> ⚠ O `localStorage` é por navegador. Para sincronizar entre máquinas ou
> garantir persistência após redeploy, use o **Exportar JSON** e cole o
> conteúdo diretamente em `src/data/defaultContent.ts`.

## Formulário de contato

Por padrão o formulário abre o WhatsApp com a mensagem já preenchida.
Para receber por e-mail, crie uma conta em [Formspree](https://formspree.io/)
ou [Getform](https://getform.io/) e cole o endpoint no painel (aba **Contato**).

## Correções feitas em relação ao site original

Veja `ANALISE.md` no repositório para a lista completa dos problemas
identificados no site atual (`tetoeterrarealstate.com.br`) e como cada um
foi resolvido neste projeto.

## Estrutura de pastas

```
src/
  components/        # Navbar, Hero, Seções, Footer, etc.
  pages/             # Home, Admin, ProjectDetail, NotFound
  data/              # defaultContent.ts (conteúdo inicial)
  lib/               # content.ts (persistência) + auth.ts
  types/             # tipagem do conteúdo
  index.css
  main.tsx
  App.tsx
public/
  favicon.svg
index.html
tailwind.config.js
vite.config.ts
```

## Licença

Uso privado — Teto & Terra Real Estate.
