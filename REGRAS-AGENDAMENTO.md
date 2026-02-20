# 📋 Regras de Agendamento

## Limites de Agendamento

### 🚫 Conflito de Horário (CRÍTICO)
- **Ninguém pode estar em 2 quadras ao mesmo tempo**
- Sistema verifica se você ou seu oponente já estão agendados no mesmo horário
- Bloqueio automático se houver conflito

### 1️⃣ Limite por Dia
- **Cada usuário pode agendar até 1 horário por dia**
- Não é permitido fazer múltiplos agendamentos no mesmo dia
- Vale para qualquer tipo de jogo (Normal ou Pirâmide)

### 2️⃣ Limite por Semana
- **Jogos Normais: até 2 agendamentos por semana**
- **Jogos de Pirâmide: até 1 agendamento adicional por semana**
- **Total possível: 3 agendamentos (2 Normais + 1 Pirâmide)**
- A semana vai de segunda-feira a domingo

**Importante:** O jogo de Pirâmide NÃO conta nos 2 agendamentos normais semanais. É um slot adicional exclusivo para Pirâmide!

### 🕐 Exceção: Horários de Última Hora - "QUADRA LIVRE" 🎾

**Agendamentos com menos de 2 horas de antecedência são liberados!**

Quando faltam menos de 2 horas para o horário de TÊNIS:
- ✅ NÃO conta no limite diário
- ✅ NÃO conta no limite semanal
- ✅ Usuário pode agendar livremente, mesmo já tendo atingido o limite de 2 por semana
- ✅ Sistema identifica automaticamente e mostra indicador "Quadra Livre"

**Como funciona:**
- Sistema calcula o tempo até o início do horário desejado
- Se faltarem menos de 2 horas → Quadra Livre ativada!
- Permite aproveitar horários vagos sem prejudicar quem segue as regras normais

**Importante:** Esta exceção se aplica APENAS para quadras de TÊNIS (Quadras 1 e 2).

Isso permite aproveitar horários vagos de última hora.

## Exemplos

### 🚨 Cenário 0: Conflito de Horário
- Segunda 17h Quadra 1: Luiz vs Zion
- Segunda 17h Quadra 2: Rafael tenta agendar com Luiz
- ❌ BLOQUEADO - Luiz já está jogando às 17h na Quadra 1

### ✅ Cenário 1: Agendamento Normal
- Segunda 10h: Usuário agenda (1/2 da semana)
- Quarta 14h: Usuário agenda (2/2 da semana)
- Sexta 16h: ❌ Bloqueado - limite semanal atingido

### ✅ Cenário 2: Última Hora - Quadra Livre
- Segunda 10h: Usuário agenda (1/2 da semana)
- Quarta 14h: Usuário agenda (2/2 da semana)
- Sexta 18h: São 16:30 agora, horário vago! ✅ LIBERADO (quadra livre - última hora)
- Sexta 19h: São 17:15 agora! ✅ LIBERADO (quadra livre - última hora)

**Explicação:** Mesmo com limite semanal atingido, pode agendar horários vagos com menos de 2h de antecedência!

### ✅ Cenário 3: Mesmo Dia + Quadra Livre
- Segunda 10h: Usuário agenda (já usou o limite do dia)
- Segunda 14h: ❌ Bloqueado - limite diário atingido
- Segunda 19h: São 17:30 agora! ✅ LIBERADO (quadra livre - última hora)

**Explicação:** Mesmo tendo atingido o limite diário, pode agendar se faltar menos de 2 horas!

### ✅ Cenário 4: Quadra Livre Avançado
- Usuário já tem 2 agendamentos na semana (limite atingido)
- Chega às 17:45 e vê que a quadra 1 das 18:00 está vaga
- ✅ LIBERADO - Pode agendar porque faltam apenas 15 minutos!
- Sistema mostra: "🎾 Quadra Livre! Horário com menos de 2 horas de antecedência"

**Explicação:** A regra de "quadra livre" permite usar horários vagos de última hora sem prejudicar os limites normais.

### ✅ Cenário 5: Jogos de Pirâmide
- Segunda 10h: Usuário agenda jogo Normal (1/2 normais)
- Quarta 14h: Usuário agenda jogo Normal (2/2 normais)
- Sexta 16h: Usuário tenta agendar outro jogo Normal → ❌ BLOQUEADO - limite de jogos normais atingido
- Sexta 16h: Usuário agenda jogo de Pirâmide → ✅ LIBERADO (slot adicional de Pirâmide)

**Explicação:** Pirâmide tem seu próprio limite (1 por semana), independente dos 2 jogos normais!

### ✅ Cenário 6: Limite Máximo Semanal
- Segunda 10h: Usuário agenda Normal (1/2 normais)
- Terça 15h: Usuário agenda Pirâmide (1/1 pirâmide)
- Quarta 17h: Usuário agenda Normal (2/2 normais)
- Quinta 10h: ❌ BLOQUEADO - todos os limites atingidos (2 normais + 1 pirâmide)

**Resultado:** Total de 3 agendamentos na semana = limite máximo!

## Mensagens de Erro

### Limite Diário
> "Você já possui 1 agendamento neste dia. Limite: 1 por dia (exceto horários de última hora)."

### Limite Semanal - Jogos Normais
> "Você já possui 2 agendamentos normais nesta semana. Limite: 2 por semana + 1 Pirâmide adicional (exceto horários de última hora)."

### Limite Semanal - Jogos de Pirâmide
> "Você já possui 1 jogo de Pirâmide nesta semana. Limite: 1 Pirâmide por semana (independente das reservas normais)."

## Observações

- ✅ Horários cancelados NÃO contam nos limites
- ✅ Apenas agendamentos com status 'active' são contabilizados
- ✅ A janela de 2 horas começa a contar a partir do horário atual até o início do horário desejado
- 🎾 **QUADRA LIVRE:** Qualquer quadra de tênis vaga com menos de 2h de antecedência pode ser agendada por qualquer usuário, independente dos limites semanais
- ⚠️ A exceção de "quadra livre" aplica-se APENAS para TÊNIS (Quadras 1 e 2), não para Beach Tennis
- 🏆 **PIRÂMIDE:** O jogo de Pirâmide tem limite próprio (1 por semana) e não consome os 2 slots de jogos normais
- 📊 **LIMITE MÁXIMO:** Um usuário pode ter até 3 agendamentos por semana: 2 Normais + 1 Pirâmide (mais quadras livres de última hora ilimitadas)
