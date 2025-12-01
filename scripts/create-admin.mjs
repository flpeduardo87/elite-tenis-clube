import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Usage (PowerShell):
// node scripts/create-admin.mjs --url=https://YOUR-PROJECT.supabase.co --key=YOUR_SERVICE_ROLE 
//   [--cpf=010.184.679-71 --first=Admin --last=Master --password=elite123]
// Or create a .env.admin file in project root:
//   SUPABASE_URL=...
//   SUPABASE_SERVICE_ROLE_KEY=...
//   ADMIN_CPF=010.184.679-71
//   ADMIN_FIRST_NAME=Admin
//   ADMIN_LAST_NAME=Master
//   ADMIN_PASSWORD=elite123

// Lightweight .env loader (avoids extra dependency)
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

// Resolve project root and try loading .env.admin then .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
loadEnvFile(path.join(projectRoot, '.env.admin'));
loadEnvFile(path.join(projectRoot, '.env'));

// Parse CLI args
const argMap = Object.fromEntries(
  process.argv.slice(2)
    .map((a) => a.match(/^--([^=]+)=(.*)$/))
    .filter(Boolean)
    .map(([, k, v]) => [k.toLowerCase(), v])
);

const url = argMap.url || process.env.SUPABASE_URL;
const serviceRoleKey = argMap.key || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  console.error('Provide via CLI args --url --key, or .env.admin file at project root.');
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey);

// Admin data (CLI → env → defaults)
const cpf = argMap.cpf || process.env.ADMIN_CPF || '010.184.679-71';
const firstName = argMap.first || process.env.ADMIN_FIRST_NAME || 'Admin';
const lastName = argMap.last || process.env.ADMIN_LAST_NAME || 'Master';
const password = argMap.password || process.env.ADMIN_PASSWORD || 'elite123';

const cpfNumbers = cpf.replace(/\D/g, '');
const email = `cpf${cpfNumbers}@elitetenis.com.br`;

async function main() {
  console.log('Creating admin user...', { url, email });

  // 1) Create auth user with email confirmed
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      cpf,
      first_name: firstName,
      last_name: lastName,
    },
  });

  if (error) {
    console.error('createUser error:', error);
    process.exit(1);
  }

  const user = data.user;
  console.log('User created:', user.id);

  // 2) Wait briefly for trigger to create profile
  await new Promise((r) => setTimeout(r, 600));

  // 3) Ensure profile exists and promote to admin
  const { error: upErr } = await admin
    .from('profiles')
    .update({ roles: ['member', 'admin'] })
    .eq('id', user.id);

  if (upErr) {
    console.error('Failed to promote profile to admin:', upErr);
    process.exit(1);
  }

  // 4) Verify
  const { data: profile, error: selErr } = await admin
    .from('profiles')
    .select('id, cpf, roles')
    .eq('id', user.id)
    .single();

  if (selErr) {
    console.error('Profile check error:', selErr);
    process.exit(1);
  }

  console.log('Admin profile ready:', profile);
  console.log('Login with CPF:', cpf, 'Password:', password);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
