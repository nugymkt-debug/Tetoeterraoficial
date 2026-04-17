# ✅ CHECKLIST DE DEPLOY - FIGMA MAKE + SUPABASE

## 📋 ANTES DO DEPLOY

### 1. Verificar Configurações ✅
- ✅ Project ID: `xrazwoifawzqstdamwbd`
- ✅ Anon Key: Configurado
- ✅ Backend rodando: `https://xrazwoifawzqstdamwbd.supabase.co/functions/v1/make-server-33b1e26f`

### 2. Dados no Supabase ✅
- ✅ 17 projetos salvos
- ✅ 5 imóveis para alugar
- ✅ 4 imóveis para venda
- ✅ Todas as imagens preservadas

---

## 🚀 DEPLOY PELO FIGMA

### Passo 1: Configurar Supabase no Figma Make
1. Na interface do Figma Make, vá em configurações do projeto
2. Conecte o Supabase:
   - Project ID: `xrazwoifawzqstdamwbd`
   - Anon Key: (já está no código)
   - URL: `https://xrazwoifawzqstdamwbd.supabase.co`

### Passo 2: Deploy
1. Clique em "Deploy" ou "Publish"
2. Aguarde o build completar
3. Anote a URL do site deployado

---

## 🧪 APÓS O DEPLOY - TESTES OBRIGATÓRIOS

### Teste 1: Site Principal (/)
- [ ] Acessar a URL do deploy
- [ ] Verificar se os 17 projetos aparecem na seção "Empreendimentos"
- [ ] Ir até "Alugar" - deve mostrar 5 imóveis
- [ ] Ir até "Venda" - deve mostrar 4 imóveis
- [ ] Clicar em qualquer imóvel - modal deve abrir com imagens
- [ ] Verificar se todas as imagens estão carregando

**Console deve mostrar**:
```
🚀 Carregando dados do Supabase...
✅ PROJETOS CARREGADOS DO SUPABASE: 17
✅ ALUGUÉIS CARREGADOS DO SUPABASE: 5
✅ VENDAS CARREGADAS DO SUPABASE: 4
```

---

### Teste 2: Configuração Admin (/admin/setup)
- [ ] Acessar `{URL_DO_DEPLOY}/admin/setup`
- [ ] Definir credenciais:
  - Usuário: `admin` (ou o que quiser)
  - Senha: (mínimo 8 caracteres)
  - Chave secreta: `TETO-TERRA-SETUP-2026`
- [ ] Clicar "Configurar"
- [ ] Deve aparecer: "✅ Credenciais configuradas com sucesso"

**⚠️ IMPORTANTE**: Anote as credenciais! Essa configuração só pode ser feita UMA vez.

---

### Teste 3: Login Admin (/admin)
- [ ] Acessar `{URL_DO_DEPLOY}/admin`
- [ ] Fazer login com as credenciais configuradas
- [ ] Deve carregar o painel com todas as abas:
  - Empreendimentos
  - Alugar
  - Venda
  - Textos do Site
  - Logo

**Console deve mostrar**:
```
📥 Carregando dados do admin...
✅ Dados carregados com sucesso
```

---

### Teste 4: Upload de Imagem
- [ ] No painel admin, ir até "Alugar"
- [ ] Clicar "Editar" em qualquer imóvel
- [ ] Clicar no botão de adicionar imagem
- [ ] Selecionar 1 ou mais imagens (até 10)
- [ ] Aguardar upload
- [ ] Deve aparecer: "✅ X imagem(ns) enviada(s) com sucesso!"
- [ ] Imagens devem aparecer no modal de edição

**Console deve mostrar**:
```
📸 Imagem otimizada: foto.jpg - Original: 5000KB → Otimizada: 800KB
```

---

### Teste 5: Salvar e Sincronizar
- [ ] Ainda no modal de edição, clicar "Salvar Alterações"
- [ ] Clicar "Salvar Tudo"
- [ ] Deve aparecer:
  ```
  ✅ Dados salvos com sucesso no Supabase!
  📊 5 itens salvos
  📸 XX imagens no total
  ⚠️ Clique no botão "Atualizar" no site (/) para ver as mudanças.
  ```
- [ ] Ir ao site principal (/)
- [ ] Clicar no botão "Atualizar" (canto inferior direito)
- [ ] Verificar que as novas imagens aparecem

---

### Teste 6: Edição de Textos
- [ ] No admin, ir até aba "Textos do Site"
- [ ] Modificar qualquer texto (ex: título do Hero)
- [ ] Clicar "Salvar Textos"
- [ ] Ir ao site (/)
- [ ] Clicar "Atualizar"
- [ ] Texto deve estar atualizado

---

### Teste 7: Upload de Logo
- [ ] No admin, ir até aba "Logo"
- [ ] Fazer upload de um novo logo
- [ ] Logo deve aparecer imediatamente no preview
- [ ] Ir ao site (/)
- [ ] Clicar "Atualizar"
- [ ] Novo logo deve aparecer no cabeçalho

---

## ❌ SE ALGO NÃO FUNCIONAR

### Problema: "Failed to fetch" ou "Erro ao conectar"
**Possíveis causas**:
1. Edge Function do Supabase não foi deployada
2. CORS não configurado
3. Token JWT expirado

**Solução**:
1. Verificar no Supabase Dashboard se a Edge Function `make-server-33b1e26f` existe
2. Testar endpoint diretamente:
   ```bash
   curl https://xrazwoifawzqstdamwbd.supabase.co/functions/v1/make-server-33b1e26f/projects \
     -H "Authorization: Bearer eyJhbGci..."
   ```
3. Se não funcionar, pode precisar redesployar a Edge Function

---

### Problema: "Dados não aparecem no site"
**Solução**:
1. Abrir console (F12) no navegador
2. Verificar os logs:
   - Deve mostrar "✅ PROJETOS CARREGADOS DO SUPABASE: X"
   - Se mostrar "📦 Usando projetos padrão", dados não estão sendo carregados
3. Clicar no botão "Atualizar" no site
4. Se persistir, limpar cache do navegador (Ctrl+Shift+Del)

---

### Problema: "Upload de imagem falha"
**Solução**:
1. Verificar se o bucket `make-33b1e26f-images` existe no Supabase Storage
2. Se não existir, o backend cria automaticamente no primeiro POST
3. Testar fazer POST em `/storage/init` primeiro:
   ```bash
   curl -X POST https://xrazwoifawzqstdamwbd.supabase.co/functions/v1/make-server-33b1e26f/storage/init \
     -H "Authorization: Bearer eyJhbGci..."
   ```

---

### Problema: "Admin setup não funciona"
**Solução**:
1. Verificar se endpoint `/admin/setup` está respondendo
2. Confirmar que chave secreta está correta: `TETO-TERRA-SETUP-2026`
3. Verificar no Supabase KV Store se chave `admin_credentials` já existe
   - Se existir, setup já foi feito e não pode ser refeito

---

## 📞 SUPORTE

Se após todos os testes algo não funcionar:

1. **Copiar logs do console** (F12 → Console → Copiar tudo)
2. **Anotar qual teste falhou**
3. **Verificar no Supabase Dashboard**:
   - Edge Functions → Logs
   - Storage → Buckets
   - Database → SQL Editor → `SELECT * FROM kv_store_33b1e26f`

---

## ✅ CONFIRMAÇÃO FINAL

Após completar TODOS os 7 testes acima, o sistema está:
- ✅ Deployado e funcional
- ✅ Conectado ao Supabase
- ✅ Pronto para uso da cliente

**Entregue à cliente**:
1. URL do site
2. URL do admin (`{URL}/admin`)
3. Credenciais de acesso
4. Instruções básicas de uso

---

**Data**: 2026-04-17
**Sistema**: Teto & Terra Real Estate
**Status**: ✅ PRONTO PARA DEPLOY
