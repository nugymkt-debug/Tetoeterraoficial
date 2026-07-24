# Servidor Supabase — correção de segurança (PUBLICADA)

Status: **publicado em 24/07/2026** — Edge Function `make-server-33b1e26f`,
versão 42, `verify_jwt=false` (igual à anterior). Nenhum dado foi alterado:
15 empreendimentos, 1 locação, 16 vendas e 140 fotos seguem intactos.

## O que mudou

Antes, qualquer pessoa podia pegar a chave pública no JavaScript do site e
chamar as rotas de gravação — apagando ou sobrescrevendo todos os imóveis,
textos e logo. Não havia verificação de login no servidor.

Agora:

- gravar exige sessão de admin válida (`x-admin-token`): `/projects`,
  `/rentals`, `/sales`, `/site-texts`, `/logo`, `/settings`, `/init-data`,
  `/fix-images`, `/restore-all-images`, `/seed-defaults`, `/storage/init`,
  `/storage/upload` e `/storage/delete/:arquivo`;
- a leitura pelo site continua pública (o site não mudou em nada);
- o login gera token aleatório com validade de 7 dias (antes era o texto fixo
  `admin-authenticated`, igual para todo mundo e que nunca expirava);
- a senha é guardada como hash SHA-256. **A senha atual continua valendo** — na
  primeira vez que você logar ela é convertida automaticamente;
- `/admin/setup` voltou a recusar reconfiguração quando já existe admin
  (em produção essa checagem não existia: com a chave de setup dava para
  trocar usuário e senha do painel);
- `restore-all-images` não sobrescreve mais fotos já cadastradas — só preenche
  o que estiver vazio.

## Testes executados após o deploy

| Teste | Resultado |
|---|---|
| `/health` e `/status` | ok, conteúdo intacto |
| Leitura do site (com Cache-Control/Pragma/Expires) | HTTP 200 |
| Preflight CORS do site e do painel | 204, cabeçalhos liberados |
| `POST /sales` sem token | 401 (antes: apagava tudo) |
| `POST /seed-defaults` sem token | 401 (antes: repunha dados fake por cima) |
| `POST /storage/upload` sem token | 401 |
| Token antigo (`admin-authenticated`) | 401 |
| Sessão válida: verify, upload e exclusão de imagem | 200 |
| Logout invalida a sessão | 200 e depois 401 |
| `/admin/setup` tentando trocar credenciais | bloqueado |

O login com a senha real não pôde ser testado aqui (não tenho a senha). Ao
entrar no painel pela primeira vez, se algo falhar, é só avisar — a versão
anterior está salva e o rollback leva 1 minuto.

## Primeiro acesso ao painel

Sua sessão antiga foi invalidada (o token fixo não vale mais). Ao abrir
https://tetoeterrarealstate.com.br/admin, faça login normalmente com **o mesmo
usuário e senha de sempre**.

## Rollback (se precisar)

O código da versão anterior está no histórico do git:

```bash
git show 3cad05b~1:supabase/functions/server/index.tsx > supabase/functions/make-server-33b1e26f/index.ts
npx supabase functions deploy make-server-33b1e26f --project-ref xrazwoifawzqstdamwbd --no-verify-jwt
```

Atenção: aquela versão do repositório estava **desatualizada em relação à
produção** (faltavam os cabeçalhos CORS `Cache-Control/Pragma/Expires` e a rota
`seed-defaults`). Para rollback fiel, use a versão publicada como base.

## Estrutura

A pasta da função foi renomeada de `supabase/functions/server/` para
`supabase/functions/make-server-33b1e26f/` (com `index.ts`), que é o nome real
da função publicada. Foi essa divergência que permitiu o repositório ficar fora
de sincronia com a produção.

## Pendências (não urgentes)

- A chave de setup ainda está fixa no código. Como o sistema já está
  configurado, a rota está bloqueada — mas o ideal é movê-la para variável de
  ambiente do Supabase.
- Não há rate limit no login: vale bloquear após N tentativas erradas.
