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

### 2️⃣ Limite por Semana (Tênis Regular)

**Jogos Normais - Separados por Período:**
- **Dias Úteis (Terça-Sexta):** até 2 agendamentos por semana
- **Fim de Semana (Sábado-Domingo):** até 1 agendamento por semana

**Jogos de Pirâmide:**
- **1 agendamento adicional por semana** (extra, não conta nos limites acima)

**Total possível:** 
- Máximo: 3 jogos normais (2 úteis + 1 fim de semana) + 1 Pirâmide = **4 agendamentos por semana**
- A semana vai de segunda-feira a domingo

**Importante:** O jogo de Pirâmide é EXTRA e NÃO conta nos limites de jogos normais. É um slot adicional exclusivo para a competição interna!

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

### ✅ Cenário 1: Agendamento Normal - Dias Úteis
- Terça 10h: Usuário agenda (1/2 dias úteis)
- Quarta 14h: Usuário agenda (2/2 dias úteis)
- Quinta 16h: ❌ Bloqueado - limite de dias úteis atingido
- Sábado 10h: ✅ LIBERADO - é fim de semana (contador separado)

### ✅ Cenário 2: Fim de Semana Separado
- Terça 10h: Usuário agenda (1/2 dias úteis)
- Sábado 14h: Usuário agenda (1/1 fim de semana)
- Domingo 10h: ❌ Bloqueado - limite de fim de semana atingido
- Quarta 16h: ✅ LIBERADO - ainda tem 1 vaga em dia útil

### ✅ Cenário 3: Última Hora - Quadra Livre
- Terça 10h: Usuário agenda (1/2 dias úteis)
- Quarta 14h: Usuário agenda (2/2 dias úteis)
- Sexta 18h: São 16:30 agora, horário vago! ✅ LIBERADO (quadra livre - última hora)
- Sábado 10h: Usuário agenda (1/1 fim de semana)
- Domingo 19h: São 17:15 agora! ✅ LIBERADO (quadra livre - última hora)

**Explicação:** Mesmo com limites atingidos, pode agendar horários vagos com menos de 2h de antecedência!

### ✅ Cenário 4: Mesmo Dia + Quadra Livre
- Segunda 10h: Usuário agenda (já usou o limite do dia)
- Segunda 14h: ❌ Bloqueado - limite diário atingido
- Segunda 19h: São 17:30 agora! ✅ LIBERADO (quadra livre - última hora)

**Explicação:** Mesmo tendo atingido o limite diário, pode agendar se faltar menos de 2 horas!

### ✅ Cenário 5: Jogos de Pirâmide (Extra)
- Terça 10h: Usuário agenda jogo Normal (1/2 dias úteis)
- Quarta 14h: Usuário agenda jogo Normal (2/2 dias úteis)
- Sábado 10h: Usuário agenda jogo Normal (1/1 fim de semana)
- Quinta 16h: Usuário tenta agendar outro Normal → ❌ BLOQUEADO - todos os limites normais atingidos
- Quinta 16h: Usuário agenda jogo de Pirâmide → ✅ LIBERADO (slot adicional de Pirâmide)

**Explicação:** Pirâmide tem seu próprio limite (1 por semana), independente dos jogos normais!

### ✅ Cenário 6: Semana Completa
- Terça 10h: Normal (1/2 úteis)
- Quarta 14h: Normal (2/2 úteis)
- Sábado 10h: Normal (1/1 fim de semana)
- Sexta 16h: Pirâmide (1/1 pirâmide)

**Resultado:** Total de 4 agendamentos na semana = limite máximo!

## Mensagens de Erro

### Limite Diário
> "Você já possui 1 agendamento neste dia. Limite: 1 por dia (exceto horários de última hora)."

### Limite Semanal - Dias Úteis
> "Você já possui 2 agendamentos em dias úteis. Limite: 2 por semana + 1 Pirâmide adicional (exceto horários de última hora)."

### Limite Semanal - Fim de Semana
> "Você já possui 1 agendamento no fim de semana. Limite: 1 por fim de semana + 1 Pirâmide adicional (exceto horários de última hora)."

### Limite Semanal - Jogos de Pirâmide
> "Você já possui 1 jogo de Pirâmide nesta semana. Limite: 1 Pirâmide por rodada (independente das reservas normais)."

## 📅 Janelas de Abertura da Agenda

A agenda abre em horários específicos dependendo do dia da semana que deseja reservar:

### Para Dias Úteis (Terça a Sexta)
- **Abre:** Segunda-feira às 08:00
- **Permite agendar:** Terça, Quarta, Quinta e Sexta da mesma semana
- Vale para TÊNIS e BEACH TENNIS

### Para Fim de Semana (Sábado e Domingo)
- **Abre:** Quinta-feira às 08:00
- **Permite agendar:** Sábado e Domingo da mesma semana
- Vale para TÊNIS e BEACH TENNIS

**Importante:** A exceção de horários de última hora (menos de 2 horas) continua funcionando normalmente, independente das janelas de abertura.

## Observações

- ✅ Horários cancelados NÃO contam nos limites
- ✅ Apenas agendamentos com status 'active' são contabilizados
- ✅ A janela de 2 horas começa a contar a partir do horário atual até o início do horário desejado
- 🎾 **QUADRA LIVRE:** Qualquer quadra de tênis vaga com menos de 2h de antecedência pode ser agendada por qualquer usuário, independente dos limites semanais
- ⚠️ A exceção de "quadra livre" aplica-se APENAS para TÊNIS (Quadras 1 e 2), não para Beach Tennis
- 🏆 **PIRÂMIDE:** O jogo de Pirâmide tem limite próprio (1 por semana) e não consome os slots de jogos normais
- 📊 **LIMITE MÁXIMO TÊNIS:** Um usuário pode ter até 4 agendamentos por semana: 2 Dias Úteis + 1 Fim de Semana + 1 Pirâmide (mais quadras livres de última hora ilimitadas)
- 📅 **SEPARAÇÃO:** Jogos em dias úteis (terça-sexta) e fim de semana (sábado-domingo) têm contadores separados
