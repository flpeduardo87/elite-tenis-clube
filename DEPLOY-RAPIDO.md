## 🎯 PASSOS PARA DEPLOY - RESUMO EXECUTIVO

### 1️⃣ PRIMEIRO: Corrigir Banco de Dados (OBRIGATÓRIO)
```sql
-- Copie e execute no Supabase SQL Editor
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_game_type_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_game_type_check 
CHECK (game_type IN ('normal', 'pyramid', 'class', 'beach_volleyball', 'beach_tennis', 'footvolley', 'interdiction'));
```

### 2️⃣ Deploy no Vercel (Escolha uma opção)

#### Opção A - Dashboard (Mais Rápido):
1. https://vercel.com/ → Login
2. "New Project" → Import Git ou Upload da pasta
3. Framework: **Vite** | Build: `npm run build` | Output: `dist`
4. Adicionar Environment Variables:
   - `VITE_SUPABASE_URL` = sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua chave anon
5. Deploy!

#### Opção B - CLI:
```bash
npm install -g vercel
vercel login
vercel --prod
# Adicionar env vars quando solicitado
```

### 3️⃣ Configurar Supabase Auth
Supabase → Authentication → URL Configuration:
- Site URL: `https://[seu-app].vercel.app`
- Redirect URLs: Adicionar `https://[seu-app].vercel.app/**`

### 4️⃣ Testar
- Login com admin (CPF 358.350.678-28)
- Cadastrar um sócio de teste
- Criar uma reserva (normal e pirâmide)
- ✅ Pronto para compartilhar com usuários!

---

## 📱 Informações para Compartilhar com Usuários

**Sistema de Reservas - Elite Tênis Clube**
🔗 Link: https://[seu-app].vercel.app

**Primeiro Acesso:**
1. Use o CPF fornecido pelo administrador
2. Senha temporária (será solicitada troca no primeiro login)
3. Crie uma senha forte (mínimo 10 caracteres, maiúsculas, minúsculas, números e símbolos)

**Funcionalidades:**
- 📅 Visualizar agenda de quadras (Tênis e Areia)
- ➕ Fazer reservas (Normal, Pirâmide, Beach Tennis, etc)
- 👥 Ver minhas reservas
- ❌ Cancelar reservas
- 📋 Consultar regras do clube

**Dúvidas ou problemas:**
Contate o administrador do sistema.
