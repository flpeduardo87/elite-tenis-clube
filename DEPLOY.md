# ============================================
# GUIA DE DEPLOY - ELITE TÊNIS CLUBE
# ============================================

Este guia contém instruções detalhadas para deploy em diferentes plataformas.

## 📋 Pré-requisitos de Deploy

- ✅ Projeto buildando sem erros (`npm run build`) **CONCLUÍDO**
- ✅ Supabase configurado com schema aplicado
- ⚠️ **IMPORTANTE**: Execute `fix-game-type-constraint.sql` no Supabase SQL Editor antes do deploy
- ✅ Variáveis de ambiente definidas
- ✅ Primeiro usuário admin criado

---

## ⚠️ CORREÇÃO OBRIGATÓRIA ANTES DO DEPLOY

Execute este SQL no **Supabase SQL Editor**:

```sql
-- Permitir todos os tipos de jogo (pyramid, interdiction, etc)
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_game_type_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_game_type_check 
CHECK (game_type IN ('normal', 'pyramid', 'class', 'beach_volleyball', 'beach_tennis', 'footvolley', 'interdiction'));
```

Arquivo completo disponível em: `fix-game-type-constraint.sql`

---

## 🚀 VERCEL (Recomendado)

### Via Dashboard (Mais Fácil)

1. Acesse [vercel.com](https://vercel.com/)
2. Clique em **"New Project"**
3. Importe seu repositório Git (GitHub/GitLab/Bitbucket)
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   ```
   VITE_SUPABASE_URL = https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
6. Clique em **"Deploy"**
7. ✅ App no ar em ~2 minutos!

### Via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir prompts e configurar variáveis quando solicitado

# Deploy em produção
vercel --prod
```

### Domínio Customizado

1. No dashboard da Vercel, vá para **Settings** > **Domains**
2. Adicione seu domínio (ex: `reservas.elitetenis.com.br`)
3. Configure DNS conforme instruções (registro A ou CNAME)
4. Aguarde propagação DNS (~5min a 24h)

---

## 🌐 NETLIFY

### Via Dashboard

1. Acesse [netlify.com](https://netlify.com/)
2. Clique em **"Add new site"** > **"Import an existing project"**
3. Conecte ao Git
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. **Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. **Deploy site**

### Via CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Configurar variáveis
netlify env:set VITE_SUPABASE_URL "https://seu-projeto.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "sua_key_aqui"
```

---

## ☁️ CLOUDFLARE PAGES

### Via Dashboard

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com/)
2. **Pages** > **Create a project**
3. Conecte ao Git
4. Configure:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. **Environment variables** (Production):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. **Save and Deploy**

### Via Wrangler CLI

```bash
# Instalar Wrangler
npm install -g wrangler

# Login
wrangler login

# Build
npm run build

# Deploy
wrangler pages deploy dist --project-name=elite-tenis
```

---

## 🐳 DOCKER (Para VPS/Cloud)

### 1. Criar Dockerfile

Já incluído no projeto: `Dockerfile`

### 2. Build da Imagem

```bash
docker build -t elite-tenis-clube .
```

### 3. Rodar Container

```bash
docker run -d \
  -p 80:80 \
  -e VITE_SUPABASE_URL="https://seu-projeto.supabase.co" \
  -e VITE_SUPABASE_ANON_KEY="sua_key" \
  --name elite-tenis \
  elite-tenis-clube
```

### 4. Docker Compose (Recomendado)

```bash
docker-compose up -d
```

---

## 🖥️ VPS/SERVIDOR TRADICIONAL (Apache/Nginx)

### Requisitos

- Node.js 18+ (para build)
- Apache ou Nginx
- SSL/HTTPS (Let's Encrypt recomendado)

### 1. Build do Projeto

```bash
cd /caminho/do/projeto
npm install
npm run build
```

### 2A. Configurar Nginx

Crie `/etc/nginx/sites-available/elite-tenis`:

```nginx
server {
    listen 80;
    server_name reservas.elitetenis.com.br;
    
    # Redirecionar para HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name reservas.elitetenis.com.br;
    
    # Certificado SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/reservas.elitetenis.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/reservas.elitetenis.com.br/privkey.pem;
    
    root /var/www/elite-tenis/dist;
    index index.html;
    
    # Compressão
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/elite-tenis /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Instalar SSL com Let's Encrypt
sudo certbot --nginx -d reservas.elitetenis.com.br
```

### 2B. Configurar Apache

Crie `/etc/apache2/sites-available/elite-tenis.conf`:

```apache
<VirtualHost *:80>
    ServerName reservas.elitetenis.com.br
    Redirect permanent / https://reservas.elitetenis.com.br/
</VirtualHost>

<VirtualHost *:443>
    ServerName reservas.elitetenis.com.br
    
    DocumentRoot /var/www/elite-tenis/dist
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/reservas.elitetenis.com.br/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/reservas.elitetenis.com.br/privkey.pem
    
    <Directory /var/www/elite-tenis/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA Routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Compressão
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
    </IfModule>
</VirtualHost>
```

```bash
# Habilitar módulos necessários
sudo a2enmod rewrite ssl headers deflate

# Ativar site
sudo a2ensite elite-tenis
sudo apache2ctl configtest
sudo systemctl reload apache2

# Instalar SSL
sudo certbot --apache -d reservas.elitetenis.com.br
```

---

## 🔒 Configuração de SSL/HTTPS

### Let's Encrypt (Gratuito)

```bash
# Instalar Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx  # ou python3-certbot-apache

# Obter certificado
sudo certbot --nginx -d reservas.elitetenis.com.br

# Renovação automática (já configurada)
sudo certbot renew --dry-run
```

---

## 🔄 CI/CD - Deploy Automático

### GitHub Actions (Vercel)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### GitLab CI (Netlify)

Crie `.gitlab-ci.yml`:

```yaml
image: node:18

stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - npm install -g netlify-cli
    - netlify deploy --prod --dir=dist --auth=$NETLIFY_AUTH_TOKEN --site=$NETLIFY_SITE_ID
  only:
    - main
```

---

## 📊 Monitoramento Pós-Deploy

### Verificações Essenciais

1. **Funcionalidade**:
   - [ ] Login funciona
   - [ ] Reservas são criadas
   - [ ] Realtime atualiza
   - [ ] Painel admin acessível

2. **Performance**:
   - [ ] Lighthouse Score > 90
   - [ ] First Contentful Paint < 2s
   - [ ] Time to Interactive < 3s

3. **Segurança**:
   - [ ] HTTPS ativo (cadeado verde)
   - [ ] Headers de segurança configurados
   - [ ] RLS funcionando no Supabase

### Ferramentas de Monitoramento

- **Vercel Analytics** (grátis com Vercel)
- **Google Analytics**
- **Sentry** (monitoramento de erros)
- **Uptime Robot** (disponibilidade)

---

## 🆘 Troubleshooting Deploy

### Build falha com erro de memória

```bash
# Aumentar memória do Node
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Variáveis de ambiente não funcionam

- Certifique-se de usar prefixo `VITE_`
- Reinicie o deploy após adicionar variáveis
- Verifique se estão no escopo correto (production/preview)

### App carrega mas não conecta ao Supabase

- Verifique CORS no Supabase (Settings > API > CORS)
- Adicione domínio de produção nas URLs permitidas
- Confirme que as variáveis estão corretas

### 404 ao navegar entre rotas

- Configure fallback para `index.html` no servidor
- Verifique se o rewrite está ativo (SPA routing)

---

## ✅ Checklist Final de Deploy

- [ ] Build local sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Schema SQL aplicado no Supabase
- [ ] Primeiro admin criado e testado
- [ ] SSL/HTTPS configurado
- [ ] DNS propagado (se domínio customizado)
- [ ] Testado em mobile e desktop
- [ ] Realtime funcionando
- [ ] Painel admin acessível
- [ ] Backup do banco configurado
- [ ] Monitoramento ativo

---

## 📞 Suporte

Qualquer dúvida sobre deploy, consulte a documentação completa no README.md ou abra uma issue no repositório.
