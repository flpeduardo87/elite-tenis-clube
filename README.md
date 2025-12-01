# 🎾 Elite Tênis Clube - Sistema de Reserva de Quadras

Sistema profissional de agendamento de quadras de tênis e beach tennis para clubes esportivos.

![Status](https://img.shields.io/badge/status-production--ready-green)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## 🚀 Funcionalidades

### Para Sócios
- ✅ **Autenticação segura** via CPF e senha
- ✅ **Reserva de quadras** de tênis (2) e beach tennis (2)
- ✅ **Visualização semanal** com navegação entre semanas
- ✅ **Sistema de liberação programada** (segunda 9h e quinta 10h)
- ✅ **Notificações** de cancelamentos
- ✅ **Tipos de jogo**: normal, aula, beach tennis
- ✅ **Seleção de adversário** na reserva

### Para Administradores/Professores
- ✅ **Painel administrativo** completo
- ✅ **Cadastro de usuários** (individual e em lote)
- ✅ **Bloqueio/desbloqueio** de sócios
- ✅ **Gerenciamento de permissões** (admin, professor)
- ✅ **Reservas antecipadas** (sem restrição de horário)
- ✅ **Cancelamento** de qualquer reserva

### Técnicas
- ⚡ **Realtime** - Atualizações ao vivo via Supabase
- 🔒 **Row Level Security** - Segurança por linha no banco
- 📱 **Responsivo** - Interface adaptável mobile/desktop
- 🎨 **Tailwind CSS** - Design moderno e profissional
- 🔄 **Modo Preview** - Funciona sem banco (dados mockados)

---

## 📋 Pré-requisitos

- **Node.js** 18+ ([baixar aqui](https://nodejs.org/))
- **Conta Supabase** (gratuita) - [criar aqui](https://supabase.com/)
- Navegador moderno (Chrome, Firefox, Edge, Safari)

---

## ⚙️ Instalação e Configuração

### 1️⃣ Clonar e Instalar Dependências

```bash
# Entre na pasta do projeto
cd reserva-de-quadras-elite-tenis-clube

# Instalar dependências
npm install
```

### 2️⃣ Configurar Supabase

#### A) Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com/)
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: Elite Tenis Clube
   - **Database Password**: (guarde essa senha)
   - **Region**: South America (São Paulo)
4. Aguarde ~2 minutos para o projeto ser criado

#### B) Executar o Schema do Banco

1. No Supabase Dashboard, vá para **SQL Editor** (menu lateral)
2. Clique em **"New Query"**
3. Copie TODO o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em **"Run"**
5. ✅ Deve aparecer "Success. No rows returned"

#### C) Configurar Autenticação

1. Vá para **Authentication** > **Providers**
2. **Email**:
   - Habilite "Enable Email provider"
   - **Confirm email**: DESABILITE (importante!)
3. Clique em **Save**

#### D) Obter Credenciais

1. Vá para **Settings** > **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxxxxxxxx.supabase.co`)
   - **anon/public key** (começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3️⃣ Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` na raiz do projeto
2. Preencha com suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE**: Deixe vazio para rodar em **modo preview** (dados demo, sem banco)

### 4️⃣ Criar Primeiro Usuário Admin

#### Via Supabase Dashboard (Recomendado)

1. Vá para **Authentication** > **Users** no Supabase
2. Clique em **"Add User"** > **"Create new user"**
3. Preencha:
   - **Email**: `cpf01018467971@example.com` (use o CPF sem pontos)
   - **Password**: `elite123` (ou outra senha segura)
   - **Auto Confirm User**: ✅ MARCAR
   - **User Metadata** (JSON):
   ```json
   {
     "cpf": "010.184.679-71",
     "first_name": "Admin",
     "last_name": "Master"
   }
   ```
4. Clique em **"Create user"**
5. Vá para **SQL Editor** e execute:
   ```sql
   UPDATE public.profiles 
   SET roles = ARRAY['member', 'admin']::TEXT[]
   WHERE cpf = '010.184.679-71';
   ```

---

## 🎮 Executar o Sistema

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3000**

### Login Inicial

- **CPF**: `010.184.679-71` (ou o que você configurou)
- **Senha**: `elite123` (ou a que você definiu)

---

## 📦 Deploy para Produção

### Opção 1: Vercel (Recomendado) ⭐

1. Instale a CLI da Vercel:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Configure as variáveis de ambiente na Vercel:
   - Vá para **Settings** > **Environment Variables**
   - Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

4. ✅ Pronto! Seu app está no ar

### Opção 2: Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

Configure as variáveis no painel da Netlify.

### Opção 3: Hospedagem Tradicional

```bash
npm run build
```

A pasta `dist/` contém os arquivos. Configure seu servidor para servir `index.html` como fallback.

---

## 🛠️ Customização

### Alterar Horários das Quadras

Edite `constants.ts`:

```typescript
export const WEEKDAY_TIME_SLOTS: TimeSlotInfo[] = [
    { start: '08:00', end: '09:30' },
    // ... adicione mais slots
];
```

### Alterar Número de Quadras

```typescript
export const TENNIS_COURTS = [
    { id: 1, name: 'Quadra 1' }, 
    { id: 2, name: 'Quadra 2' },
    { id: 3, name: 'Quadra 3' }, // Adicione mais
];
```

---

## 🐛 Troubleshooting

### Erro: "Invalid credentials"
- Verifique se "Confirm email" está DESABILITADO no Supabase Auth
- Email deve ser: `cpf<numeros>@example.com`

### Reservas não aparecem
- Habilite Realtime: Database > Replication > marque `bookings`

### Modo Preview não funciona
- Limpe as variáveis no `.env.local`
- Reinicie: `Ctrl+C` e `npm run dev`

---

## 📄 Licença

Elite Tênis Clube © 2025

**Stack:** React 19 + TypeScript + Vite + Supabase + Tailwind CSS
