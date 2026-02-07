# ✅ CHECKLIST FINAL - DEPLOY VERCEL

## 1️⃣ SUPABASE - Preparação do Banco

### ✅ Credenciais (você vai precisar)
Acesse: https://app.supabase.com/project/SEU_PROJECT/settings/api

Copie:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci... (longo token)
```

### ✅ Verificar Admin
Execute no SQL Editor:
```sql
SELECT u.email, p.cpf, p.first_name, p.last_name, p.roles
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE p.cpf = '358.350.678-28';

-- Deve retornar:
-- CPF: 358.350.678-28
-- Roles: {member,admin}
```

### ✅ Verificar Tabelas
Execute:
```sql
-- Deve retornar 2 linhas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'bookings');
```

### ✅ Verificar RLS
Execute:
```sql
-- Deve retornar TRUE para ambas
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'bookings');
```

---

## 2️⃣ VERCEL - Deploy

### Passo 1: Criar Projeto
1. Acesse: https://vercel.com/new
2. Importe: `flpeduardo87/elite-tenis-clube`
3. Framework Preset: **Vite** (auto-detectado)
4. **NÃO CLIQUE EM DEPLOY AINDA!**

### Passo 2: Configurar Environment Variables
Antes de fazer deploy, adicione:

```
VITE_SUPABASE_URL = [Cole aqui o URL do Supabase]
VITE_SUPABASE_ANON_KEY = [Cole aqui a chave anon]
```

✅ Marque: **Production**, **Preview**, **Development**

### Passo 3: Deploy
1. Clique em **Deploy**
2. Aguarde ~2 minutos
3. Receberá URL: `https://elite-tenis-clube.vercel.app`

---

## 3️⃣ TESTES PÓS-DEPLOY

### ✅ Teste 1: Login Admin
- URL: `https://seu-app.vercel.app`
- CPF: `358.350.678-28`
- Senha: `elite123`
- ✅ Deve aparecer o calendário e botão "Admin" no menu

### ✅ Teste 2: Criar Reserva
- Clique em um horário livre
- Preencha os dados
- ✅ Deve criar a reserva no Supabase

### ✅ Teste 3: Painel Admin
- Clique no botão "Admin"
- ✅ Deve listar usuários do banco

### ✅ Teste 4: Verificar no Supabase
Execute:
```sql
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5;
```
✅ Deve aparecer a reserva que você criou no app

---

## 🔴 IMPORTANTE: Preview Mode vs Produção

### Localmente (SEM .env):
```
⚠️ Preview Mode ATIVO
📊 Dados: Mockados (8 usuários fake)
🔒 Não salva no Supabase
```

### Vercel (COM variáveis):
```
✅ Preview Mode DESATIVADO
📊 Dados: Supabase real
🔒 Tudo salvo no banco
```

---

## 📋 RESUMO STATUS ATUAL

| Item | Status | Observação |
|------|--------|------------|
| Código no GitHub | ✅ | Commit: 4cb2374 |
| Build compila | ✅ | 0 erros TypeScript |
| Supabase schema | ✅ | Tabelas + RLS |
| Admin criado | ✅ | CPF: 358.350.678-28 |
| Preview mode local | ⚠️ | Dados mockados |
| Deploy Vercel | ⏳ | **Próximo passo!** |

---

## 🚀 PRÓXIMA AÇÃO

1. Pegue as credenciais do Supabase (URL + Anon Key)
2. Acesse Vercel e importe o repo
3. Configure as 2 variáveis de ambiente
4. Clique em Deploy
5. Teste o login com o admin criado

**Quando subir no Vercel, terá acesso ao banco real! ✅**
