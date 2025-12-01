# 🚀 CHECKLIST DE MIGRAÇÃO - SUPABASE DO ZERO

## ✅ Passo 1: Criar Projeto no Supabase (5 min)

1. Acesse https://supabase.com/ e faça login
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `Elite Tenis Clube` (ou o que preferir)
   - **Database Password**: Crie uma senha forte e **GUARDE** (ex: `Elite2025!Tenis`)
   - **Region**: **South America (São Paulo)** ← importante para latência baixa
   - **Pricing Plan**: Free (suficiente para começar)
4. Clique em **"Create new project"**
5. ⏳ Aguarde ~2 minutos até o projeto estar pronto (status "Active")

---

## ✅ Passo 2: Executar Schema do Banco de Dados (3 min)

### 2.1 Abrir SQL Editor
1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique em **"New Query"**

### 2.2 Executar Script
1. Abra o arquivo `supabase-schema.sql` (está na raiz do projeto)
2. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
3. **Cole** no SQL Editor do Supabase
4. Clique em **"Run"** (ou Ctrl+Enter)
5. ✅ Deve aparecer: **"Success. No rows returned"**

**O que isso criou:**
- Tabelas: `profiles` (usuários) e `bookings` (reservas)
- Triggers automáticos (updated_at)
- Row Level Security (políticas de acesso)
- Índices de performance
- Functions auxiliares

---

## ✅ Passo 3: Configurar Autenticação (2 min)

### 3.1 Habilitar Email Provider
1. No menu lateral, vá para **"Authentication"** → **"Providers"**
2. Encontre **"Email"** e clique para expandir
3. **ATIVE** o toggle "Enable Email provider"
4. **DESATIVE** "Confirm email" ← **IMPORTANTE** (caso contrário usuários precisam confirmar email)
5. Clique em **"Save"**

### 3.2 Configurar URL Settings (opcional agora, obrigatório no deploy)
1. Vá para **"Authentication"** → **"URL Configuration"**
2. **Site URL**: `http://localhost:3000` (por enquanto)
3. **Redirect URLs**: `http://localhost:3000/**` (adicionar)
4. Clique em **"Save"**

---

## ✅ Passo 4: Habilitar Realtime (1 min)

Para que as reservas apareçam automaticamente para todos os usuários online:

1. Vá para **"Database"** → **"Replication"**
2. Encontre a tabela **`bookings`**
3. **ATIVE** o toggle ao lado dela
4. ✅ Pronto! Mudanças serão sincronizadas em tempo real

---

## ✅ Passo 5: Obter Credenciais da API (1 min)

1. Vá para **"Settings"** (ícone de engrenagem no menu lateral)
2. Clique em **"API"**
3. Copie duas informações:
   
   **a) Project URL**
   ```
   Exemplo: https://xyzabcdefgh.supabase.co
   ```
   
   **b) anon / public key** (a chave longa, começa com `eyJhbGci...`)
   ```
   Exemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...
   ```

4. **Guarde essas duas informações!**

---

## ✅ Passo 6: Configurar Variáveis de Ambiente (1 min)

1. Abra o arquivo `.env.local` na raiz do projeto
2. Cole suas credenciais:

```env
# ===== SUPABASE CONFIGURATION =====
VITE_SUPABASE_URL=https://xyzabcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...

# ===== GEMINI API (OPCIONAL) =====
VITE_GEMINI_API_KEY=
```

3. **Salve o arquivo** (Ctrl+S)

---

## ✅ Passo 7: Criar Primeiro Usuário Admin (5 min)

### Opção A: Via Dashboard Supabase (Recomendado)

1. Vá para **"Authentication"** → **"Users"**
2. Clique em **"Add User"** → **"Create new user"**
3. Preencha:
   - **Email**: `cpf01018467971@example.com` (formato padrão: cpf + números sem pontos)
   - **Password**: `elite123` (ou outra senha que você escolher)
   - **Auto Confirm User**: ✅ **MARCAR** (importante!)
   - **User Metadata**: Clique em "Add metadata" e cole este JSON:
   
   ```json
   {
     "cpf": "010.184.679-71",
     "first_name": "Admin",
     "last_name": "Master"
   }
   ```

4. Clique em **"Create user"**

5. **Promover a Admin**: Vá para **SQL Editor** → **"New Query"** e execute:

```sql
UPDATE public.profiles 
SET roles = ARRAY['member', 'admin']::TEXT[]
WHERE cpf = '010.184.679-71';
```

✅ Pronto! Usuário admin criado.

**Credenciais de Login:**
- **CPF**: `010.184.679-71`
- **Senha**: `elite123` (ou a que você definiu)

---

## ✅ Passo 8: Testar Localmente (2 min)

1. No terminal, rode:

```powershell
npm run dev
```

2. Abra o navegador em `http://localhost:3000`

3. **Faça login** com:
   - CPF: `010.184.679-71`
   - Senha: `elite123`

4. **Abra o Console do Navegador** (F12):
   - Deve aparecer: `[Supabase] Conexão ok e tabela profiles acessível.`
   - ✅ Se aparecer, está tudo certo!
   - ❌ Se aparecer erro, volte ao Passo 2 (schema) ou Passo 3 (auth)

5. **Teste criar uma reserva**:
   - Escolha tipo de quadra (Tênis ou Areia)
   - Clique em um horário disponível
   - Preencha os dados
   - Confirme
   - ✅ Se criou, está perfeito!

---

## ✅ Passo 9: Cadastrar Mais Usuários (Opcional, 5 min)

### Via Painel Admin (Interface Web)
1. Faça login como admin
2. Clique no ícone do usuário → **"Admin Panel"**
3. Aba **"Cadastro Único"**:
   - CPF: `123.456.789-00`
   - Nome: `João`
   - Sobrenome: `Silva`
   - Clique em **"Cadastrar"**

### Via Cadastro em Lote
1. Prepare um arquivo `.txt`:
```
123.456.789-00;João;Silva
987.654.321-00;Maria;Santos
111.222.333-44;Pedro;Oliveira
```
2. No painel admin, aba **"Cadastro em Lote"**
3. Cole o texto e clique em **"Cadastrar Todos"**

---

## ✅ Passo 10: Build de Produção (3 min)

Antes de fazer deploy, teste se o build funciona:

```powershell
npm run build
```

✅ Deve aparecer: `✓ built in XXs`

Se der erro, me avise qual erro apareceu.

**Testar build localmente:**
```powershell
npm run preview
```

Abra `http://localhost:4173` e teste o app.

---

## ✅ Passo 11: Deploy no Vercel (5 min)

### 11.1 Instalar CLI (se não tiver)
```powershell
npm install -g vercel
```

### 11.2 Fazer Login
```powershell
vercel login
```

### 11.3 Deploy
```powershell
vercel
```

**Perguntas que vão aparecer:**
1. Set up and deploy? → **Y**
2. Which scope? → Escolha sua conta
3. Link to existing project? → **N**
4. Project name? → `elite-tenis-clube` (ou o que preferir)
5. In which directory? → `.` (Enter)
6. Auto-detected: Vite → **Y**
7. Override settings? → **N**

⏳ Aguarde o deploy (~30s)

### 11.4 Configurar Variáveis de Ambiente

1. Acesse https://vercel.com/
2. Entre no projeto **elite-tenis-clube**
3. Vá para **"Settings"** → **"Environment Variables"**
4. Adicione:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://xyzabcdefgh.supabase.co` (sua URL)
   - Environment: **Production, Preview, Development** (marcar todas)
   - Clique em **"Save"**

5. Adicione:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (sua key)
   - Environment: **Production, Preview, Development** (marcar todas)
   - Clique em **"Save"**

### 11.5 Re-deploy com Variáveis
```powershell
vercel --prod
```

✅ **Pronto!** Seu app está no ar!

**URL do app**: `https://elite-tenis-clube.vercel.app` (ou similar)

---

## ✅ Passo 12: Configurar Domínio Customizado (Opcional)

### Se você tem um domínio (ex: reservas.elitetenis.com.br):

1. No Vercel, vá para **"Settings"** → **"Domains"**
2. Clique em **"Add"**
3. Digite seu domínio: `reservas.elitetenis.com.br`
4. Clique em **"Add"**
5. **Configure DNS** conforme instruções da Vercel:
   - Tipo: **CNAME**
   - Name: `reservas`
   - Value: `cname.vercel-dns.com`
6. Aguarde propagação DNS (5min a 24h)

### Atualizar Supabase URLs

1. Volte ao Supabase → **"Authentication"** → **"URL Configuration"**
2. **Site URL**: `https://reservas.elitetenis.com.br`
3. **Redirect URLs**: Adicionar:
   - `https://reservas.elitetenis.com.br/**`
   - `https://elite-tenis-clube.vercel.app/**`
4. **Save**

---

## 🎉 Checklist Final - Está no Ar!

- [x] Projeto Supabase criado
- [x] Schema SQL aplicado
- [x] Authentication configurado
- [x] Realtime habilitado
- [x] Admin master criado
- [x] Variáveis de ambiente configuradas
- [x] Testado localmente
- [x] Build de produção funcionando
- [x] Deploy Vercel realizado
- [x] App acessível online

---

## 🆘 Troubleshooting Comum

### Erro: "Invalid login credentials"
- Verifique se "Confirm email" está **DESABILITADO** no Supabase Auth
- Email deve ser: `cpf<numeros>@example.com` (sem pontos/traços)
- Senha correta?

### Erro: "Row Level Security"
- Execute novamente o `supabase-schema.sql` completo
- Verifique se as policies foram criadas (Database > Policies)

### Reservas não aparecem
- Habilite Realtime: Database > Replication > marque `bookings`
- Verifique console do navegador (F12) se há erros

### Build falha
```powershell
rm -rf node_modules dist
npm install
npm run build
```

### App não conecta ao Supabase no Vercel
- Confirme que as variáveis estão no Vercel (Settings > Environment Variables)
- Re-deploy após adicionar variáveis: `vercel --prod`
- Verifique CORS no Supabase (Settings > API > CORS deve incluir seu domínio)

---

## 📞 Suporte

Se encontrar algum erro específico, me envie:
1. A mensagem de erro completa
2. Em qual passo ocorreu
3. Print da tela (se possível)

**Pronto para começar!** 🚀

Qual passo você quer fazer primeiro? Posso te guiar em tempo real!
