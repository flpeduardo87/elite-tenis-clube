# 🚀 GUIA DEPLOY VERCEL - AGENDA ELITE

## 📋 PASSO 1: Preparar Variáveis de Ambiente Localmente

### 1.1 Copiar do Supabase as chaves do projeto:

1. Acesse: https://app.supabase.com/project/_/settings/api
2. Copie a **Project URL** (Supabase URL)
3. Copie a **anon/public key** (Supabase Anon Key)

### 1.2 Atualizar `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## 🔨 PASSO 2: Testar Build Localmente

Abra o terminal na pasta do projeto e execute:

```bash
npm run build
```

Se tudo der certo, você verá:
```
✓ built in 15.23s
```

Depois visualize:
```bash
npm run preview
```

Testa localmente em: http://localhost:4173

## 📤 PASSO 3: Fazer Commit e Push

```bash
git add .
git commit -m "Deploy final - regras agendamento implementadas"
git push origin main
```

## 🌐 PASSO 4: Deploy no Vercel

### 4.1 Primeira Vez (Configuração Inicial)

1. Acesse: https://vercel.com
2. Clique em **"New Project"**
3. Selecione seu repositório GitHub
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL` = sua URL Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua Anon Key

5. Clique em **"Deploy"**

### 4.2 Updates Futuros

Quando quiser fazer atualizações:
- Faça alterações no código
- Commit e push no GitHub
- Vercel faz deploy automático! ✨

## ✅ PASSO 5: Testar em Produção

Após o deploy estar pronto:

### Teste Completo:
1. **Abrir aplicação** em https://seu-dominio.vercel.app
2. **Criar uma conta nova** com nome e sobrenome
3. **Logar** com a conta criada
4. **Verificar nome** apareci no header
5. **Agendar 2 horários** (um deve e bloqueado)
6. **Testar última hora** (agendar com <2h antes)
7. **Painel admin** gerenciar usuários

## 🔐 SEGURANÇA PRÉ-DEPLOY

### No Supabase:
- [ ] Executar `fix-trigger-perfil.sql`
- [ ] Verificar RLS policies estão ativas
- [ ] Testar permissões com usuário teste

### No Vercel:
- [ ] Variáveis de ambiente configuradas
- [ ] Build passou sem erros
- [ ] Preview funcionou localmente

## 🆘 Se algo der errado:

### Build falha:
```bash
npm install
npm run build
```

### Vercel não encontra projeto:
- Verifique autenticação GitHub
- Reconnecte o repositório no Vercel

### Usuários sem nome:
- Executou `fix-trigger-perfil.sql`?
- Usuários precisam fazer logout/login

### Agendamento não restringe:
- Verifique se buildou corretamente
- Limpar cache do navegador (Ctrl+Shift+Del)

## 📞 Checklist Final

- [ ] `.env.local` atualizado com credenciais Supabase
- [ ] `npm run build` passou
- [ ] `npm run preview` funciona localmente
- [ ] Git push feito
- [ ] Vercel configurado com variáveis
- [ ] Deploy completou com sucesso
- [ ] Site abre sem erros
- [ ] Cadastro de novo usuário funciona
- [ ] Nome do usuário aparece corretamente
- [ ] Agendamento respeita limites
- [ ] Painel admin funciona

---

**Pronto? Vamos subir!** 🚀
