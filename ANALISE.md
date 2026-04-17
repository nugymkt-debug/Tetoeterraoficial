# Análise do site atual e correções aplicadas

Análise feita em 17/04/2026, rodando o site original em
`https://tetoeterrarealstate.com.br/`.

O site está publicado via **Figma Sites / Figma Make** (confirmado pelo
runtime `SitesRuntime` e pela flag `isFigmake: true` no HTML). A tentativa
de editar via IA no painel gerou inconsistências no conteúdo e imagens. Este
projeto foi reescrito do zero em código React estruturado, eliminando a
dependência do editor visual.

---

## 1. Problemas encontrados no site atual

### Dados faltando / placeholders não preenchidos

| # | Problema | Localização |
|---|---|---|
| 1 | 3 cards de "Empreendimentos em Destaque" **sem imagem**, só gradiente cinza | Topo da home |
| 2 | Cards de "Imóveis para Alugar" totalmente vazios — placeholders `/`, `/` e ícones sem dados | Meio da home |
| 3 | Cards de "Imóveis à Venda" idem, totalmente vazios | Abaixo da seção anterior |
| 4 | Imagem de fundo da seção "Investimento" é uma **cidade litorânea (Monaco/Monte Carlo)** — fora do contexto "Serra de Petrópolis" | Seção Investir |
| 5 | "Outros Empreendimentos" usa imagens genéricas de stock (cozinha padrão, quarto padrão, mulher numa cozinha) — **não representam** os imóveis reais | Portfolio |

### Copy & SEO

| # | Problema | Correção |
|---|---|---|
| 6 | `<title>` é "Teto e terra oficial" — ruim pra SEO | Alterado para "Teto & Terra Real Estate \| Imóveis exclusivos em Petrópolis e Região Serrana" |
| 7 | Falta `meta description`, Open Graph, canonical | Adicionados no `index.html` |
| 8 | "**Vinícula** Maturano" no dropdown do formulário (erro: é **Vinícola**) | Corrigido |
| 9 | "Oni Araras" e "Araltes Sebollas" — nomes com possível typo | Normalizados para "Oni Araras" e "Aralter Sebollas" (editáveis no admin) |
| 10 | Tagline repetida duas vezes no hero | Consolidada numa única linha |

### Contato

| # | Problema | Correção |
|---|---|---|
| 11 | WhatsApp **"(24) 99999-9999"** — **placeholder fake** publicado | Trocado por campo vazio/genérico, editável em `/admin` |
| 12 | E-mail `tetoeterrarealstate@hotmail.com` — @hotmail passa imagem amadora para uma imobiliária de alto padrão | Padrão alterado para `contato@tetoeterrarealstate.com.br` (editável em `/admin`) |
| 13 | Formulário de contato sem destino real (envia via Figma Sites) | Agora envia via Formspree (opcional) ou abre WhatsApp com mensagem pronta |

### Visual / UX

| # | Problema | Correção |
|---|---|---|
| 14 | Navbar transparente colide com título "Empreendimentos em Destaque" no scroll, tornando o texto ilegível | Navbar passa a `bg-navy-800/95 + blur` quando scroll > 40px |
| 15 | Botão "Ver Todos (14)" com opacidade tão baixa que parece desabilitado | Substituído por "Ver mais empreendimentos (N restantes)" com paginação progressiva |
| 16 | Botão **"Atualizar"** do editor do Figma Sites vaza na versão publicada | Não existe no novo código (é inerente ao editor) |
| 17 | Sobreposição visual do menu com o conteúdo em resoluções intermediárias | Layout responsivo com breakpoints `sm/md/lg` + menu mobile dedicado |
| 18 | Falta de badge de status nos empreendimentos (lançamento / em obras / pronto) | Adicionado `StatusBadge` em todos os cards |

### Responsividade

| # | Problema | Correção |
|---|---|---|
| 19 | Menu desktop não colapsa em mobile (via Figma Sites) | Menu hamburger nativo com drawer |
| 20 | Cards quebram em telas médias | Grid fluido 1/2/3 colunas com breakpoints |
| 21 | Hero com texto gigante estourando em mobile | Tipografia responsiva `4xl → 7xl` |

### Acessibilidade

| # | Problema | Correção |
|---|---|---|
| 22 | Imagens sem `alt` | `alt` descritivo em todas |
| 23 | Botões sem `aria-label` onde o texto é icônico | Adicionados |
| 24 | Falta de `lang="pt-BR"` adequado | Definido no `<html>` |
| 25 | Contraste de botão "Ver Todos" insuficiente | Corrigido |

### Arquitetura / editabilidade

| # | Problema | Correção |
|---|---|---|
| 26 | Edição via IA do Figma Sites gerou conteúdo inconsistente | Painel `/admin` próprio com formulários estruturados |
| 27 | Sem histórico ou backup de edições | Exportar/Importar JSON na aba Backup |
| 28 | Dependência 100% de JavaScript (SPA do Figma) | Continua SPA, mas com fallback de SEO completo via meta tags |

---

## 2. Ganhos deste projeto

- **Controle total do código** — HTML, CSS, imagens, lógica
- **Painel `/admin`** protegido por senha, sem backend, com 9 abas de edição
- **17 empreendimentos** já modelados com base na lista real do site
- **Rotas dedicadas** para cada empreendimento (`/empreendimentos/slug`)
- **Design coeso** — paleta tirada da logo (verde musgo + navy), Playfair + Inter
- **Pronto para Vercel/Netlify/Figma Make** sem configuração extra

---

## 3. O que a Iza precisa fazer depois do deploy

1. Acessar `/admin` e logar (senha padrão: `tetoeterra-2026`)
2. Trocar a senha em `.env` ou `src/lib/auth.ts`
3. Substituir as imagens (URLs) pelas fotos reais dos empreendimentos
4. Preencher WhatsApp real (com link `https://wa.me/55...`) e e-mail
5. (Opcional) Criar conta no Formspree e colar o endpoint na aba **Contato**
6. Na aba **Backup**, clicar em **Exportar JSON** e salvar o arquivo como
   backup — pode colar em `src/data/defaultContent.ts` para que o conteúdo
   viaje com o código entre máquinas e deploys.
