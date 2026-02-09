# ✅ CHECKLIST PRÉ-DEPLOY VERCEL

## 🔍 Verificação do Código

### Funcionalidades Críticas
- ✅ **Login**: CPF + Senha funcionando
- ✅ **Registro**: Novo usuário com nome/sobrenome correto
- ✅ **Agendamento**: Bloqueia 2º horário/dia e 3º horário/semana
- ✅ **Exceção Última Hora**: Libera agendamentos com <2h antes
- ✅ **Painel Admin**: Gerenciar usuários (bloquear, editar, resetar senha)
- ✅ **Painel Admin Mobile**: Botões reduzidos (10px), sem scroll

### Validações Implementadas
- ✅ Limite de 1 agendamento por dia
- ✅ Limite de 2 agendamentos por semana  
- ✅ Horários de última hora permite agredir limites
- ✅ Nomes de usuários salvos corretamente no perfil
- ✅ Dados de usuário enviados nos metadados do Supabase Auth

## 🗄️ Banco de Dados (Supabase)

Antes de fazer deploy, execute **obrigatoriamente**:

```sql
-- 1. Criar trigger corrigido para novos usuários
-- Execute: fix-trigger-perfil.sql
```

### Tabelas Verificadas
- ✅ `profiles` (id, cpf, first_name, last_name, roles, is_blocked)
- ✅ `bookings` (id, court_id, date, time_slot_start, member_id, status)
- ✅ `auth.users` (email, password)

### RLS Policies
- ✅ Usuários veem seus próprios agendamentos
- ✅ Admins podem gerenciar todos os usuários

## 🌐 Variáveis de Ambiente

Verificar em `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
```

No Vercel, configurar as mesmas variáveis em **Settings > Environment Variables**.

## 📋 Fluxo de Teste

### 1️⃣ Novo Usuário
1. [ ] Clica em "Criar Conta"
2. [ ] Preenche: CPF, Nome, Sobrenome, Telefone, Senha
3. [ ] Sistema cria usuário com nome correto
4. [ ] Auto-login funciona
5. [ ] Nome aparece no header

### 2️⃣ Agendamento Normal
1. [ ] Usuário clica em horário vago
2. [ ] Abre modal de agendamento
3. [ ] Seleciona adversário e tipo de jogo
4. [ ] Sistema bloqueia 2º agendamento do mesmo dia
5. [ ] Sistema bloqueia 3º agendamento da semana
6. [ ] Mensagens de erro claras

### 3️⃣ Agendamento Última Hora
1. [ ] Faltam <2h para horário desejado
2. [ ] Sistema PERMITE agendamento mesmo com limites
3. [ ] Não mostra mensagem de erro

### 4️⃣ Painel Admin
1. [ ] Admin entra no sistema
2. [ ] Clica no botão Admin
3. [ ] Vê lista de usuários
4. [ ] Pode bloquear/desbloquear
5. [ ] Pode editar nome (botão pequeno 10px mobile)
6. [ ] Pode excluir usuário
7. [ ] Pode resetar senha
8. [ ] Pode promovê-lo a Professor/Admin
9. [ ] Sem scroll horizontal no mobile

## 🚀 Deploy no Vercel

### Passos:
1. Fazer push para GitHub
2. Conectar repositório no Vercel
3. Configurar variáveis de ambiente
4. Verificar build: `npm run build`
5. Deploy automático

### Comando Local para Testar:
```bash
npm run build
npm run preview
```

## ⚠️ Pontos de Atenção

- ⚠️ Supabase precisa ter RLS ativadas corretamente
- ⚠️ Trigger `handle_new_user` deve estar criado
- ⚠️ Variáveis de ambiente devem estar _exatamente_ corretas
- ⚠️ Testar no mobile (responsive)
- ⚠️ Testar logout/login para atualizar dados

## ✨ Melhorias Já Implementadas

- ✅ Espaço em branco reduzido (mobile)
- ✅ Botões menores no painel admin (10px mobile)
- ✅ Modal painel admin posicionada corretamente
- ✅ Nomes salvos corretamente ao registrar
- ✅ Regras de agendamento funcionando
- ✅ Exceção de última hora implementada

---

**Status:** ✅ Pronto para Vercel
