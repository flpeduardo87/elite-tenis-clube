# ✅ CHECKLIST DE DEPLOY - Elite Tênis Clube

Use este checklist para garantir que tudo está configurado corretamente.

---

## 📋 PRÉ-DEPLOY

### Ambiente Local
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Build funciona sem erros (`npm run build`)
- [ ] App roda localmente (`npm run dev`)
- [ ] Modo preview testado (sem variáveis de ambiente)

---

## 🗄️ SUPABASE SETUP

### Criar Projeto
- [ ] Conta Supabase criada
- [ ] Novo projeto criado
- [ ] Região: South America (São Paulo)
- [ ] Senha do banco anotada em local seguro

### Configurar Banco de Dados
- [ ] Arquivo `supabase-schema.sql` aberto
- [ ] SQL Editor acessado no Supabase Dashboard
- [ ] Schema completo colado e executado
- [ ] Mensagem "Success" confirmada
- [ ] Tabelas visíveis em Table Editor:
  - [ ] `profiles`
  - [ ] `bookings`

### Configurar Autenticação
- [ ] Authentication > Providers acessado
- [ ] Email Provider habilitado
- [ ] "Confirm email" **DESABILITADO** ⚠️ (crítico!)
- [ ] Configurações salvas

### Criar Primeiro Admin
- [ ] Authentication > Users > Add User clicado
- [ ] Email: `cpf01018467971@example.com`
- [ ] Password: `elite123` (ou personalizada)
- [ ] Auto Confirm User: **MARCADO** ✅
- [ ] User Metadata JSON configurado:
  ```json
  {
    "cpf": "010.184.679-71",
    "first_name": "Admin",
    "last_name": "Master"
  }
  ```
- [ ] Usuário criado com sucesso
- [ ] SQL executado para promover a admin:
  ```sql
  UPDATE public.profiles 
  SET roles = ARRAY['member', 'admin']::TEXT[]
  WHERE cpf = '010.184.679-71';
  ```
- [ ] Confirmado roles = `{member,admin}` no Table Editor

### Obter Credenciais
- [ ] Settings > API acessado
- [ ] Project URL copiada
- [ ] anon/public key copiada
- [ ] Credenciais salvas em local seguro

### Habilitar Realtime (Opcional mas Recomendado)
- [ ] Database > Replication acessado
- [ ] Tabela `bookings` marcada
- [ ] Tabela `profiles` marcada (opcional)
- [ ] Alterações salvas

---

## ⚙️ CONFIGURAÇÃO LOCAL

### Variáveis de Ambiente
- [ ] Arquivo `.env.local` aberto
- [ ] `VITE_SUPABASE_URL` preenchida
- [ ] `VITE_SUPABASE_ANON_KEY` preenchida
- [ ] Arquivo salvo
- [ ] Servidor reiniciado (`Ctrl+C` e `npm run dev`)

### Teste de Conexão
- [ ] App carregado em `http://localhost:3000`
- [ ] Console do navegador aberto (F12)
- [ ] SEM erro "Supabase credentials not found"
- [ ] Mensagem de preview mode NÃO aparece

### Teste de Login
- [ ] Tela de login visível
- [ ] CPF `010.184.679-71` inserido
- [ ] Senha `elite123` inserida
- [ ] Login bem-sucedido
- [ ] Nome "Admin Master" visível no header
- [ ] Botão "Painel Admin" visível

### Teste de Funcionalidades
- [ ] Seleção de tipo de quadra funciona
- [ ] Calendário semanal carrega
- [ ] Horários das quadras aparecem
- [ ] Clicar em horário vazio abre modal de reserva
- [ ] Lista de adversários carrega
- [ ] Criar reserva funciona
- [ ] Reserva aparece no calendário
- [ ] Cancelar reserva funciona
- [ ] Painel Admin abre
- [ ] Cadastro de usuário funciona

---

## 🚀 DEPLOY

### Escolher Plataforma
- [ ] Plataforma escolhida:
  - [ ] Vercel (recomendado)
  - [ ] Netlify
  - [ ] Cloudflare Pages
  - [ ] VPS/Servidor próprio

### Deploy Vercel
- [ ] Vercel CLI instalada (`npm install -g vercel`)
- [ ] Login realizado (`vercel login`)
- [ ] Deploy executado (`vercel`)
- [ ] URL de preview recebida e testada
- [ ] Deploy produção executado (`vercel --prod`)
- [ ] Variáveis de ambiente configuradas no dashboard:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Redeploy após configurar variáveis
- [ ] App funcionando na URL de produção

### Deploy Netlify
- [ ] Netlify CLI instalada (`npm install -g netlify-cli`)
- [ ] Build executado (`npm run build`)
- [ ] Deploy executado (`netlify deploy --prod --dir=dist`)
- [ ] Variáveis de ambiente configuradas no dashboard
- [ ] App funcionando na URL de produção

### Deploy VPS/Servidor
- [ ] Build executado (`npm run build`)
- [ ] Pasta `dist/` copiada para servidor
- [ ] Nginx ou Apache configurado
- [ ] SSL/HTTPS configurado (Let's Encrypt)
- [ ] Domínio apontando para servidor
- [ ] App acessível via HTTPS

---

## 🔒 PÓS-DEPLOY

### Configuração de Segurança
- [ ] HTTPS funcionando (cadeado verde)
- [ ] Headers de segurança verificados (developer tools)
- [ ] CORS configurado no Supabase (se necessário)
- [ ] Domínio de produção adicionado em Auth > URL Configuration

### Testes de Produção
- [ ] Login funciona em produção
- [ ] Criar reserva funciona
- [ ] Cancelar reserva funciona
- [ ] Realtime atualiza (abrir em 2 abas)
- [ ] Painel admin acessível
- [ ] Cadastro de usuário funciona
- [ ] Teste em mobile (responsividade)
- [ ] Teste em diferentes navegadores

### Performance
- [ ] Lighthouse executado (Chrome DevTools)
- [ ] Performance score > 80
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 80

---

## 📊 MONITORAMENTO

### Configurar Alertas
- [ ] Email de notificação configurado
- [ ] Uptime monitor configurado (opcional)
- [ ] Analytics configurado (opcional)

### Backup
- [ ] Backup automático do Supabase verificado
- [ ] Política de retenção entendida
- [ ] Processo de restore testado (opcional)

---

## 👥 USUÁRIOS

### Cadastrar Sócios
- [ ] Lista de sócios preparada (CPF;Nome;Sobrenome)
- [ ] Cadastro em lote testado (painel admin)
- [ ] Primeiros 5-10 usuários cadastrados
- [ ] Senha padrão definida (ex: `elite123`)
- [ ] Instruções de troca de senha enviadas

### Treinar Administradores
- [ ] Admin treinado em:
  - [ ] Cadastrar usuários (individual e lote)
  - [ ] Bloquear/desbloquear usuários
  - [ ] Promover a professor/admin
  - [ ] Cancelar reservas
  - [ ] Ver todas as reservas

---

## 🎓 DOCUMENTAÇÃO

### Entregar ao Cliente
- [ ] `README.md` revisado
- [ ] `QUICKSTART.md` compartilhado
- [ ] Credenciais Supabase entregues com segurança
- [ ] URL de produção documentada
- [ ] Senha do admin entregue

### Materiais de Suporte
- [ ] Manual do usuário (opcional)
- [ ] Vídeo tutorial (opcional)
- [ ] FAQ atualizado
- [ ] Contato de suporte definido

---

## ✅ APROVAÇÃO FINAL

### Antes de Liberar
- [ ] Cliente testou o sistema
- [ ] Feedback implementado
- [ ] Treinamento realizado
- [ ] Documentação entregue
- [ ] Suporte combinado

### Go Live
- [ ] Data de lançamento definida
- [ ] Comunicação aos sócios enviada
- [ ] Sistema monitorado nas primeiras 24h
- [ ] Feedback inicial coletado

---

## 🆘 TROUBLESHOOTING RÁPIDO

### Se algo não funcionar:

**Login falha:**
```
1. Verificar "Confirm email" está DESABILITADO
2. Email formato: cpf<numeros>@example.com
3. Usuário existe em Authentication > Users?
```

**Reservas não aparecem:**
```
1. Database > Replication > bookings habilitado?
2. Console do navegador tem erros?
3. Variáveis de ambiente corretas?
```

**Build falha:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

**Deploy falha:**
```
1. Variáveis de ambiente configuradas?
2. Build local funciona?
3. Logs de deploy verificados?
```

---

## 📞 SUPORTE

Se precisar de ajuda:
1. Consulte `README.md`
2. Verifique `DEPLOY.md`
3. Revise logs de erro
4. Abra issue no repositório

---

**✨ Parabéns! Seu sistema está no ar! 🎾**

Data de deploy: ___/___/______
Responsável: ___________________
URL de produção: ___________________
