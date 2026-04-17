# 🔐 Configuração do Painel Administrativo

## ⚠️ IMPORTANTE - LEIA ANTES DE USAR

Este guia é **PRIVADO** e deve ser mantido em sigilo. Não compartilhe com a cliente.

---

## 📋 Passo 1: Deploy do Servidor Supabase

1. Abra as **Configurações do Figma Make**
2. Vá até a seção **Supabase**
3. Clique em **"Deploy Server"** ou **"Redeploy Server"**
4. Aguarde 1-2 minutos até o deploy completar

---

## 🔧 Passo 2: Configurar Credenciais (APENAS UMA VEZ)

### Acesse a página de configuração:

```
https://seu-site.com/admin/setup
```

### Preencha os dados:

1. **Usuário**: Defina o nome de usuário (ex: `admin` ou outro de sua escolha)
2. **Senha**: Crie uma senha FORTE (mínimo 8 caracteres)
3. **Confirmar Senha**: Digite a senha novamente
4. **Chave Secreta**: Digite: `TETO-TERRA-SETUP-2026`

### ⚠️ IMPORTANTE:
- Esta configuração só pode ser feita **UMA VEZ**
- **ANOTE** as credenciais que você criar
- Após configurar, a página `/admin/setup` não funcionará mais
- Se esquecer a senha, será necessário reconfigurar o banco de dados

---

## 📝 Passo 3: Passar Credenciais para a Cliente

Envie para sua cliente:

```
🔐 ACESSO AO PAINEL ADMINISTRATIVO

URL: https://seu-site.com/admin

Usuário: [o que você definiu]
Senha: [a que você definiu]

IMPORTANTE:
- Mantenha estas credenciais em sigilo
- Não compartilhe com terceiros
- Você pode alterar a senha dentro do painel
```

---

## 🚀 Como a Cliente Vai Usar

1. Acessar: `https://seu-site.com/admin`
2. Fazer login com as credenciais fornecidas
3. Gerenciar:
   - ✅ Empreendimentos (adicionar/editar/remover)
   - ✅ Imóveis para alugar
   - ✅ Imóveis para venda
   - ✅ Alterar senha

---

## 🔒 Segurança

✅ **Senha não está exposta no código**
✅ **Configuração protegida por chave secreta**
✅ **URL admin não é visível para visitantes**
✅ **Autenticação necessária para acessar**

---

## ❓ Problemas Comuns

### "Sistema não configurado"
- Acesse `/admin/setup` e configure as credenciais

### "Servidor não encontrado"
- Faça deploy do servidor Supabase nas configurações

### "Credenciais inválidas"
- Verifique usuário e senha
- Letras maiúsculas/minúsculas importam

---

## 📞 Suporte

Se precisar reconfigurar o sistema:
1. Acesse o Supabase Dashboard
2. Navegue até a tabela `kv_store`
3. Delete a chave `admin_credentials`
4. Acesse `/admin/setup` novamente
