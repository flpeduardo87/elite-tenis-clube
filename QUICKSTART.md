# 🚀 GUIA RÁPIDO DE INÍCIO

## ⚡ Setup em 5 Minutos

### 1. Instalar Dependências
```bash
npm install
```

### 2. Rodar em Modo Preview (sem banco)
```bash
npm run dev
```
✅ Acesse: http://localhost:3000

**Login demo**: CPF `010.184.679-71` | Senha `elite123`

---

## 🗄️ Setup com Supabase (Produção)

### 1. Criar Conta Supabase
- Acesse: https://supabase.com/
- Crie novo projeto (região: South America)

### 2. Executar Schema
- SQL Editor → Cole conteúdo de `supabase-schema.sql` → Run

### 3. Configurar Variáveis
Edite `.env.local`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Criar Admin
**Authentication > Users > Add User**:
- Email: `cpf01018467971@example.com`
- Password: `elite123`
- Auto Confirm: ✅
- Metadata: `{"cpf": "010.184.679-71", "first_name": "Admin", "last_name": "Master"}`

**SQL Editor**:
```sql
UPDATE public.profiles 
SET roles = ARRAY['member', 'admin']::TEXT[]
WHERE cpf = '010.184.679-71';
```

### 5. Rodar App
```bash
npm run dev
```

---

## 📤 Deploy Rápido

### Vercel (Mais Fácil)
```bash
npm install -g vercel
vercel
```
Configure variáveis de ambiente no dashboard.

### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```bash
docker-compose up -d
```

---

## 📚 Documentação Completa

- **README.md**: Guia completo do sistema
- **DEPLOY.md**: Instruções detalhadas de deploy
- **supabase-schema.sql**: Schema do banco de dados

---

## ❓ Dúvidas Frequentes

**P: Como adicionar mais quadras?**
R: Edite `constants.ts` e adicione em `TENNIS_COURTS` ou `SAND_COURTS`

**P: Como mudar horários?**
R: Edite `WEEKDAY_TIME_SLOTS` em `constants.ts`

**P: Como cadastrar novos sócios?**
R: Use o Painel Admin na interface (requer login como admin)

**P: Preciso do Supabase?**
R: Não! O modo preview funciona sem banco para testes.

---

## 🆘 Problemas Comuns

### Build falha
```bash
rm -rf node_modules
npm install
npm run build
```

### Erro ao logar
- Verifique se "Confirm email" está DESABILITADO no Supabase Auth
- Formato do email: `cpf<numeros>@example.com`

### Realtime não funciona
- Database > Replication > Habilite tabela `bookings`

---

## ✅ Checklist de Produção

- [ ] Schema SQL aplicado
- [ ] Admin criado e testado
- [ ] Variáveis de ambiente configuradas
- [ ] Build funciona (`npm run build`)
- [ ] Deploy realizado
- [ ] SSL/HTTPS ativo
- [ ] Testado em mobile

---

**Pronto!** Seu sistema está profissional e pronto para produção. 🎾
