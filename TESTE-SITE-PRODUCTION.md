# 🧪 TESTE DO SITE EM PRODUÇÃO

**URL**: https://tetoeterrarealstate.com.br/
**Status**: ✅ Online
**Data**: 2026-04-17

---

## 📋 CHECKLIST DE TESTES

### ✅ Teste 1: Site Carrega
- [x] Site está acessível
- [ ] Veja se os projetos aparecem
- [ ] Veja se são 17 projetos (do Supabase) ou apenas alguns (dados padrão)

**Como verificar**:
1. Abra: https://tetoeterrarealstate.com.br/
2. Pressione F12 (abrir console)
3. Procure no console por:
   - ✅ "PROJETOS CARREGADOS DO SUPABASE: 17" = Conectado!
   - ❌ "📦 Usando projetos padrão" = Não conectou

---

### 📍 Teste 2: Admin Setup
**URL**: https://tetoeterrarealstate.com.br/admin/setup

**Passo a passo**:
1. Acesse a URL acima
2. Preencha:
   - **Usuário**: admin (ou qualquer um que quiser)
   - **Senha**: (min 8 caracteres - ANOTE!)
   - **Confirmar Senha**: (mesma senha)
   - **Chave Secreta**: `TETO-TERRA-SETUP-2026`
3. Clique "Configurar Credenciais"

**Resultado esperado**:
- ✅ "Credenciais configuradas com sucesso"
- ❌ Se der erro de conexão: Supabase não está acessível

---

### 🔐 Teste 3: Admin Login
**URL**: https://tetoeterrarealstate.com.br/admin

**Passo a passo**:
1. Acesse a URL acima
2. Faça login com as credenciais do Teste 2
3. Deve abrir o painel com abas:
   - Empreendimentos
   - Alugar
   - Venda
   - Textos do Site
   - Logo

**Verificar no console (F12)**:
- ✅ "Dados carregados com sucesso"
- ✅ Deve mostrar os 17 projetos, 5 aluguéis, 4 vendas

---

### 📸 Teste 4: Upload de Imagem
**URL**: https://tetoeterrarealstate.com.br/admin

**Passo a passo**:
1. No painel admin, vá em "Alugar"
2. Clique "Editar" em qualquer imóvel
3. Clique no botão "+" para adicionar imagem
4. Selecione 1 ou mais fotos (até 10)
5. Aguarde o upload

**Resultado esperado**:
- ✅ "X imagem(ns) enviada(s) com sucesso!"
- Imagens aparecem no grid
- Console mostra: "Original: XKB → Otimizada: YKB"

**Se der erro**:
- Verificar se bucket do Supabase Storage existe
- Bucket deve ser: `make-33b1e26f-images`

---

### 💾 Teste 5: Salvar e Sincronizar
**URL**: https://tetoeterrarealstate.com.br/admin

**Passo a passo**:
1. Após adicionar imagens no Teste 4
2. Clique "Salvar Alterações" (no modal)
3. Clique "Salvar Tudo" (botão principal)
4. Aguarde confirmação
5. Vá para: https://tetoeterrarealstate.com.br/
6. Clique no botão "Atualizar" (canto inferior direito)
7. Procure o imóvel que editou
8. Clique nele para abrir o modal
9. Verifique se as novas imagens aparecem

**Resultado esperado**:
- ✅ Novas imagens aparecem no site
- ✅ Galerira mostra todas as imagens

---

### ✏️ Teste 6: Editar Textos
**URL**: https://tetoeterrarealstate.com.br/admin

**Passo a passo**:
1. Vá na aba "Textos do Site"
2. Modifique o "Título do Hero" para: "Teto & Terra - Teste"
3. Clique "Salvar Textos"
4. Vá para: https://tetoeterrarealstate.com.br/
5. Clique "Atualizar"
6. Verifique se o título mudou

**Resultado esperado**:
- ✅ Título aparece como "Teto & Terra - Teste"

---

### 🎨 Teste 7: Upload de Logo
**URL**: https://tetoeterrarealstate.com.br/admin

**Passo a passo**:
1. Vá na aba "Logo"
2. Faça upload de uma imagem
3. Aguarde upload
4. Vá para: https://tetoeterrarealstate.com.br/
5. Clique "Atualizar"
6. Verifique o logo no cabeçalho

**Resultado esperado**:
- ✅ Novo logo aparece no topo do site

---

## 🚨 TROUBLESHOOTING

### Se nada aparecer no site:
1. Abra o console (F12)
2. Veja se há erros de "Failed to fetch"
3. Se sim: problema de conexão com Supabase

**Possíveis causas**:
- CORS não configurado
- Edge Function não deployada
- Token JWT inválido

**Teste direto**:
```bash
curl https://xrazwoifawzqstdamwbd.supabase.co/functions/v1/make-server-33b1e26f/projects \
  -H "Authorization: Bearer eyJhbGci..."
```

---

### Se admin não funcionar:
1. Verificar erro no console
2. Se "Failed to fetch": Supabase inacessível
3. Se "Invalid credentials": Setup não foi feito

**Solução**:
- Fazer setup primeiro em `/admin/setup`
- Verificar chave secreta correta

---

### Se upload falhar:
1. Verificar no Supabase Dashboard
2. Storage → Buckets
3. Deve existir: `make-33b1e26f-images`

**Se não existir**:
```bash
curl -X POST https://xrazwoifawzqstdamwbd.supabase.co/functions/v1/make-server-33b1e26f/storage/init \
  -H "Authorization: Bearer eyJhbGci..."
```

---

## ✅ RESULTADO FINAL

Após completar os 7 testes:

- [ ] Site carrega e mostra dados do Supabase
- [ ] Admin configurado e funcional
- [ ] Upload de imagens funciona
- [ ] Sincronização site ↔ admin funciona
- [ ] Edição de textos funciona
- [ ] Upload de logo funciona

**Se TODOS estiverem ✅**: Sistema 100% operacional! 🎉

---

**IMPORTANTE**: Anote as credenciais de admin em local seguro!
