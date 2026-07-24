# Deploy da correção de segurança (Supabase Edge Function)

O site (Vercel) já está publicado com as correções. **Falta apenas publicar o
servidor** — enquanto isso não for feito, tudo continua funcionando normalmente,
só que os endpoints de gravação seguem abertos.

## O que muda

Hoje, qualquer pessoa que abra o site pode pegar a chave pública no JavaScript e
chamar diretamente as rotas de gravação — apagando ou sobrescrevendo todos os
imóveis, textos e logo. Não existe verificação de login no servidor.

Depois do deploy:

- gravar dados (`POST /projects`, `/rentals`, `/sales`, `/site-texts`, `/logo`,
  uploads e restauração de imagens) exige uma sessão de admin válida;
- a leitura pelo site continua pública (o site não muda em nada);
- o login passa a gerar um token aleatório com validade de 7 dias
  (antes era o texto fixo `admin-authenticated`, igual para todo mundo);
- a senha do admin passa a ser guardada como hash SHA-256. **A senha atual
  continua valendo** — na primeira vez que você logar, ela é convertida
  automaticamente;
- `restore-all-images` deixa de sobrescrever fotos já cadastradas: agora só
  preenche o que estiver vazio.

## Como publicar

O arquivo já está pronto em `supabase/functions/server/index.tsx`.

### Opção A — Painel do Supabase (mais simples)

1. Acesse https://supabase.com/dashboard/project/xrazwoifawzqstdamwbd/functions
2. Abra a function `make-server-33b1e26f` (ou `server`).
3. Substitua todo o conteúdo do arquivo `index.tsx` pelo conteúdo de
   `supabase/functions/server/index.tsx` deste repositório.
4. Clique em **Deploy**.

### Opção B — CLI

```bash
npm i -g supabase
supabase login
supabase link --project-ref xrazwoifawzqstdamwbd
supabase functions deploy server
```

## Depois do deploy — teste em 2 minutos

1. Abra https://tetoeterrarealstate.com.br/admin e faça login normalmente
   (mesmo usuário e senha de hoje).
2. Edite um imóvel, suba uma foto e clique em **Salvar Tudo** → deve salvar.
3. Abra o site principal e confirme que a alteração apareceu.

Se algo der errado, o painel avisa "Sua sessão expirou" — basta sair e entrar
de novo. Nenhum dado é apagado em nenhuma hipótese: o deploy do servidor não
toca no conteúdo salvo.

## Ordem de publicação

Não importa. O painel detecta se o servidor ainda é o antigo e continua
funcionando como antes; quando o servidor novo entra no ar, ele passa a mandar
o token automaticamente.

## Pendências conhecidas (não bloqueiam)

- A chave de setup (`/admin/setup`) continua fixa no código do servidor. Como o
  sistema já está configurado, a rota está bloqueada — mas o ideal é movê-la
  para uma variável de ambiente do Supabase numa próxima rodada.
- Não existe rate limit no login: dá para tentar senha por força bruta. Vale
  adicionar bloqueio após N tentativas.
