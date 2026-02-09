# 📋 Regras de Agendamento

## Limites de Agendamento

### 🚫 Conflito de Horário (CRÍTICO)
- **Ninguém pode estar em 2 quadras ao mesmo tempo**
- Sistema verifica se você ou seu oponente já estão agendados no mesmo horário
- Bloqueio automático se houver conflito

### 1️⃣ Limite por Dia
- **Cada usuário pode agendar até 1 horário por dia**
- Não é permitido fazer múltiplos agendamentos no mesmo dia

### 2️⃣ Limite por Semana
- **Cada usuário pode agendar até 2 horários por semana**
- A semana vai de segunda-feira a domingo

### 🕐 Exceção: Horários de Última Hora

**Agendamentos com menos de 2 horas de antecedência são liberados!**

Quando faltam menos de 2 horas para o horário:
- ✅ NÃO conta no limite diário
- ✅ NÃO conta no limite semanal
- ✅ Usuário pode agendar livremente

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

### ✅ Cenário 2: Última Hora
- Segunda 10h: Usuário agenda (1/2 da semana)
- Quarta 14h: Usuário agenda (2/2 da semana)
- Sexta 18h: São 16:30 agora, horário vago! ✅ LIBERADO (última hora)

### ✅ Cenário 3: Mesmo Dia
- Segunda 10h: Usuário agenda
- Segunda 14h: ❌ Bloqueado - limite diário atingido
- Segunda 19h: São 17:30 agora! ✅ LIBERADO (última hora)

## Mensagens de Erro

### Limite Diário
> "Você já possui 1 agendamento neste dia. Limite: 1 por dia (exceto horários de última hora)."

### Limite Semanal
> "Você já possui 2 agendamentos nesta semana. Limite: 2 por semana (exceto horários de última hora)."

## Observações

- ✅ Horários cancelados NÃO contam nos limites
- ✅ Apenas agendamentos com status 'active' são contabilizados
- ✅ A janela de 2 horas começa a contar a partir do horário atual até o início do horário desejado
