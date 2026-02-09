# 🏖️ REGRAS DE AGENDAMENTO - QUADRAS DE AREIA (BEACH)

## 🎾 Quadras Disponíveis
- **Quadra 1** (frente)
- **Quadra 2** (fundos)

## 📅 Períodos de Agendamento

### 1️⃣ Agendamento para SEMANA (Terça a Sexta)
- **Abertura:** Segunda-feira de manhã (a partir das 6h)
- **Permite agendar:** Terça, Quarta, Quinta e Sexta
- **Quadras:** 1 ou 2

### 2️⃣ Agendamento para FINAL DE SEMANA (Sábado e Domingo)
- **Abertura:** Quinta-feira de manhã (a partir das 6h)
- **Permite agendar:** Sábado e Domingo
- **Quadras:** 1 ou 2

## ⚖️ Limites de Agendamento

### Limite Semanal
- **Máximo: 2 horários por semana**
- **Restrição:**
  - 1 horário no período da SEMANA (terça a sexta)
  - 1 horário no FINAL DE SEMANA (sábado e domingo)

### Exemplos:
✅ **Permitido:**
- 1 agendamento na quarta + 1 agendamento no sábado = OK
- 1 agendamento na terça + 1 agendamento no domingo = OK

❌ **NÃO Permitido:**
- 2 agendamentos na semana (terça + quarta) = BLOQUEADO
- 2 agendamentos no final de semana (sábado + domingo) = BLOQUEADO
- 3+ agendamentos = BLOQUEADO

## 📋 Regras Obrigatórias

### 1. Titular Obrigatório
- Agendamento **SEMPRE** no nome do sócio titular
- Titular ou dependente **DEVE ESTAR PRESENTE** no horário reservado

### 2. Informações do Agendamento
Ao agendar, informar:
- ✅ Número da quadra (1 ou 2)
- ✅ Esporte praticado:
  - Beach Vôlei
  - Beach Tênis  
  - Futevôlei
- ✅ Nomes de todos os jogadores

### 3. Quadra Vaga (Sem Agendamento)
- Respeitar ordem de chegada
- Informar no grupo que a quadra estava vaga
- Não conta nos limites de agendamento

## 🚫 Bloqueios Automáticos

O sistema bloqueia automaticamente quando:
1. ❌ Tentar agendar FORA do período de liberação
   - Ex: Tentar agendar sábado na segunda (só pode na quinta)
2. ❌ Já possui 1 agendamento no período da SEMANA
   - Não pode agendar outro de terça a sexta
3. ❌ Já possui 1 agendamento no FINAL DE SEMANA
   - Não pode agendar outro no sábado ou domingo
4. ❌ Tentar agendar quando já está em outro horário
   - Mesma pessoa não pode estar em 2 quadras ao mesmo tempo

## 📊 Comparação: Beach vs Tênis

| Regra | TÊNIS | BEACH |
|-------|-------|-------|
| Agendamento por dia | 1 por dia | Depende do período |
| Agendamento por semana | 2 por semana | 2 por semana (1 semana + 1 FDS) |
| Quadras | 4 quadras | 2 quadras |
| Períodos de liberação | Qualquer dia | Segunda (semana) e Quinta (FDS) |
| Última hora | <2h libera | Não aplicável |

## 🎯 Exemplos Práticos

### Cenário 1: Uso Normal
- **Segunda 8h:** Felipe agenda Quarta 17h Quadra 1 (Beach Tênis)
- **Quinta 8h:** Felipe agenda Sábado 10h Quadra 2 (Futevôlei)
- ✅ 2 agendamentos - 1 em cada período = PERMITIDO

### Cenário 2: Bloqueio no Mesmo Período
- **Segunda 8h:** Felipe agenda Terça 17h Quadra 1
- **Segunda 9h:** Felipe tenta agendar Quinta 18h Quadra 2
- ❌ BLOQUEADO - Já tem 1 agendamento no período da semana

### Cenário 3: Bloqueio Fora do Período
- **Segunda 8h:** Felipe tenta agendar Sábado 10h
- ❌ BLOQUEADO - Agendamento de FDS só abre quinta-feira

### Cenário 4: Conflito de Horário
- **Segunda 8h:** Felipe agenda Terça 17h Quadra 1
- **Segunda 9h:** Rafael tenta agendar Terça 17h Quadra 2 com Felipe
- ❌ BLOQUEADO - Felipe já está jogando às 17h na Quadra 1

---

**Próximos passos:** Implementar essas regras no código! 🚀
