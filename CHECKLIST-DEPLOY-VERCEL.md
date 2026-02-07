## 🚀 CHECKLIST - DEPLOY VERCEL DO ZERO

### ✅ PRÉ-REQUISITOS

#### 1. Credenciais do Supabase (ATUAL)
- [ ] Project URL: https://_____.supabase.co
- [ ] anon/public key: eyJhbGci_____

**Como pegar:**
1. https://app.supabase.com/
2. Abrir projeto atual
3. Settings > API
4. Copiar e guardar

---

### 🚀 CRIAR PROJETO NA VERCEL

#### 2. Importar do GitHub
1. [ ] Acessar https://vercel.com/
2. [ ] "Add New..." > "Project"
3. [ ] Importar: **flpeduardo87/elite-tenis-clube**
4. [ ] Clicar em "Import"

#### 3. Configuração do Build
- [ ] Framework Preset: **Vite** (detecta automático)
- [ ] Root Directory: `./` (padrão)
- [ ] Build Command: `npm run build` (padrão)
- [ ] Output Directory: `dist` (padrão)
- [ ] Install Command: `npm install` (padrão)

#### 4. Environment Variables ⚠️ IMPORTANTE
Clicar em "Environment Variables" e adicionar:

**Variável 1:**
- [ ] Key: `VITE_SUPABASE_URL`
- [ ] Value: [Colar URL do Supabase]
- [ ] Environments: ✅ Production, ✅ Preview, ✅ Development

**Variável 2:**
- [ ] Key: `VITE_SUPABASE_ANON_KEY`
- [ ] Value: [Colar anon key do Supabase]
- [ ] Environments: ✅ Production, ✅ Preview, ✅ Development

#### 5. Deploy
- [ ] Clicar em "Deploy"
- [ ] Aguardar ~2 minutos
- [ ] ✅ App no ar!

---

### ✅ VALIDAÇÃO PÓS-DEPLOY

#### 6. Testar o App
- [ ] Abrir URL da Vercel (ex: elite-tenis-clube.vercel.app)
- [ ] Fazer login com usuário teste
- [ ] Verificar se carrega as quadras
- [ ] Testar criar uma reserva
- [ ] Abrir F12 > Console (não deve ter erros)

#### 7. Promover Admin (se necessário)
Se precisar fazer login como admin:
- [ ] Executar no Supabase: `promover-para-admin.sql`
- [ ] Login com CPF: 358.350.678-28

---

### 🎯 URLs IMPORTANTES

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com/
- **GitHub Repo**: https://github.com/flpeduardo87/elite-tenis-clube

---

### 🆘 SE DER ERRO

**Build falhou:**
- Verificar env vars
- Ver logs do build na Vercel

**Erro de autenticação:**
- Verificar URL e key do Supabase
- Ver F12 > Console no navegador

**Não carrega dados:**
- Executar `verificar-rls.sql` no Supabase
- Verificar se tem dados no banco

---

## ✅ PRONTO!

Depois que terminar, me avisa que eu te ajudo a validar tudo! 🚀
