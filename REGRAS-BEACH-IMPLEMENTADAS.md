# ✅ Regras Beach Tennis - IMPLEMENTADAS

**Data:** 09/02/2026  
**Status:** ✅ Código atualizado em [App.tsx](App.tsx)

---

## 🏖️ Quadras e Horários

### Quadras
- **Beach Tennis**: Quadra 1 e Quadra 2 
  - No sistema: `court_id = 3` e `court_id = 4`
- **Tênis Regular**: Quadra 1 e Quadra 2
  - No sistema: `court_id = 1` e `court_id = 2`

### Horário de Funcionamento
- **Período de manhã**: 09:00 (abertura das janelas de agendamento)
- **Funcionamento**: 09:00 às 22:00 (mesmo do tênis regular)

---

## 📅 Janelas de Agendamento

### Para Dias Úteis (Terça a Sexta)
```
⏰ Abre: Segunda-feira às 09:00
📅 Permite agendar: Terça, Quarta, Quinta e Sexta da mesma semana
```

**Exemplo:**
- ✅ Segunda 03/02/2026 09:00 → Pode agendar Terça 04/02 até Sexta 07/02
- ❌ Domingo 02/02/2026 23:59 → **BLOQUEADO**
  - Mensagem: "Agendamentos de Beach Tennis para Terça-Sexta abrem na Segunda-feira às 09:00"

### Para Fim de Semana (Sábado e Domingo)
```
⏰ Abre: Quinta-feira às 09:00
📅 Permite agendar: Sábado e Domingo da mesma semana
```

**Exemplo:**
- ✅ Quinta 05/02/2026 09:00 → Pode agendar Sábado 08/02 e Domingo 09/02
- ❌ Quarta 04/02/2026 23:59 → **BLOQUEADO**
  - Mensagem: "Agendamentos de Beach Tennis para Sábado/Domingo abrem na Quinta-feira às 09:00"

---

## ⚖️ Limites de Agendamento

### Regra Principal
```
1 agendamento em dia útil (Terça-Sexta) por semana
+ 
1 agendamento em fim de semana (Sábado-Domingo) por semana
=
Máximo 2 agendamentos de beach por semana
```

### Validação no Código
- Conta apenas agendamentos `court_id = 3 ou 4` (beach)
- Separa contadores por tipo de dia (útil vs. fim de semana)
- Verifica se usuário já atingiu limite do período correspondente

**Exemplo:**
```
Semana de 03/02 a 09/02:

Usuário tenta agendar:
1. Quarta 05/02 às 10h → ✅ OK (1º dia útil)
2. Quinta 06/02 às 14h → ❌ BLOQUEADO "Você já possui 1 agendamento de Beach Tennis em dia útil"
3. Sábado 08/02 às 16h → ✅ OK (1º fim de semana)
4. Domingo 09/02 às 18h → ❌ BLOQUEADO "Você já possui 1 agendamento de Beach Tennis no fim de semana"
```

---

## ⏰ Exceção: Última Hora

### Regra
- **Menos de 2 horas antes do jogo**: Permite agendar sem contar nos limites
- Mesma exceção aplicada ao Tênis Regular e Beach Tennis

**Exemplo:**
```
Hoje: Terça 04/02/2026 às 17:30

Tentar agendar para HOJE:
- 18:00 (30min antes) → ✅ PERMITIDO (última hora)
- 19:00 (1h30 antes) → ✅ PERMITIDO (última hora)
- 20:00 (2h30 antes) → ❌ Aplica limite normal

Mesmo se o usuário já tiver:
- 1 agendamento em dia útil da semana
- Última hora permite agendar sem contar no limite
```

---

## 🔄 Comparação: Tênis vs Beach

| Aspecto | Tênis Regular | Beach Tennis |
|---------|---------------|--------------|
| **Quadras** | 1-2 (court_id 1-2) | 1-2 (court_id 3-4) |
| **Janela Dias Úteis** | Segunda 09:00 | Segunda 09:00 |
| **Janela Fim de Semana** | Sexta 10:00 | **Quinta 09:00** |
| **Limite Diário** | 1 por dia | Não se aplica |
| **Limite Semanal** | 2 por semana | **1 útil + 1 FDS** |
| **Última Hora (<2h)** | ✅ Sim | ✅ Sim |
| **Dias Funcionamento** | Ter-Dom (fecha Seg) | Ter-Dom (fecha Seg) |

---

## 💻 Implementação Técnica

### Localização do Código
- **Arquivo:** [App.tsx](App.tsx)
- **Função:** `handleConfirmBooking` (linha ~211)
- **Lógica:** Condicional `isBeachTennis` baseada em `courtId === 3 || courtId === 4`

### Fluxo de Validação
```typescript
1. Verificar conflito de horário (mesmo para ambos)
2. Calcular se é última hora (<2h antes)
3. Identificar se é Beach (court_id 3-4) ou Tênis (court_id 1-2)

Se Beach Tennis:
  4a. Verificar se janela de agendamento está aberta
      - Fim de semana: requer Quinta 09:00+
      - Dias úteis: requer Segunda 09:00+
  5a. Contar agendamentos de beach da semana
  6a. Separar por tipo (úteis vs. fim de semana)
  7a. Bloquear se limite atingido

Se Tênis Regular:
  4b. Contar agendamentos de tênis do DIA
  5b. Contar agendamentos de tênis da SEMANA
  6b. Bloquear se limites atingidos (1/dia, 2/semana)
```

### Funções Auxiliares Utilizadas
- `getDay(date)`: Retorna dia da semana (0=Dom, 1=Seg, ..., 6=Sáb)
- `startOfWeek(date, {weekStartsOn: 1})`: Início da semana (segunda-feira)
- `set(date, {hours, minutes})`: Define horário específico
- `addDays(date, n)`: Adiciona dias a uma data

---

## 🧪 Cenários de Teste

### ✅ Cenário 1: Agendamento Normal
```
Hoje: Segunda 03/02/2026 10:00
Tenta: Quarta 05/02/2026 14:00 (Beach)
Agendamentos: Nenhum
Resultado: ✅ PERMITIDO
```

### ❌ Cenário 2: Janela Fechada
```
Hoje: Domingo 02/02/2026 23:00
Tenta: Terça 04/02/2026 10:00 (Beach)
Resultado: ❌ BLOQUEADO
Mensagem: "Agendamentos de Beach Tennis para Terça-Sexta abrem na Segunda-feira às 09:00"
```

### ❌ Cenário 3: Limite Dias Úteis
```
Hoje: Segunda 03/02/2026 10:00
Tenta: Quinta 06/02/2026 16:00 (Beach)
Já tem: Quarta 05/02 10:00 (Beach)
Resultado: ❌ BLOQUEADO
Mensagem: "Você já possui 1 agendamento de Beach Tennis em dia útil"
```

### ✅ Cenário 4: Limite Separado
```
Hoje: Quinta 06/02/2026 10:00
Tenta: Sábado 08/02/2026 14:00 (Beach)
Já tem: Quarta 05/02 10:00 (Beach dia útil)
Resultado: ✅ PERMITIDO (limites separados)
```

### ✅ Cenário 5: Última Hora
```
Hoje: Terça 04/02/2026 17:30
Tenta: Terça 04/02/2026 19:00 (Beach, 1h30 antes)
Já tem: Quinta 06/02 10:00 (Beach)
Resultado: ✅ PERMITIDO (exceção última hora)
```

---

## 📝 Notas de Desenvolvimento

### ✅ Concluído
- [x] Separação de regras Beach vs. Tênis no código
- [x] Validação de janelas de agendamento (Segunda/Quinta 09:00)
- [x] Contadores separados (dias úteis vs. fim de semana)
- [x] Exceção de última hora (<2h)
- [x] Filtro por court_id (3-4 = beach, 1-2 = tênis)
- [x] Mensagens de erro específicas

### 🔍 Pontos de Atenção
- Sistema identifica beach por `court_id`, não por `courtType` state
- `courtType` state controla qual visualização mostrar (tênis/beach)
- Ambos os tipos podem ter agendamentos simultâneos
- Limites são independentes (2 tênis + 2 beach = 4 por semana possível)

### 🚀 Próximos Passos
1. Testar em produção
2. Monitorar feedback dos usuários
3. Ajustar mensagens de erro se necessário
4. Considerar adicionar outras modalidades (futevôlei, beach vôlei)
