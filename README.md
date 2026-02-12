# 🔔 Notificação de Status de Compra via Telegram (Projeto Pessoal)

> Este documento descreve um **mini-sistema pessoal** para receber alertas no Telegram (para você e, no máximo, um familiar) quando houver **mudanças no status/logística de uma compra** (ex.: pagamento aprovado, postado, chegou no CD, saiu para entrega, entregue).

---

# 🎯 Objetivo

Receber no celular **cada etapa logística** (para ansiedade edition 😄) de compras do Mercado Livre via mensagens do Telegram.

Sem multiusuário, sem SaaS.

---

# ✅ Escopo (MVP)

## Inclui

- Criar um bot no Telegram
- Guardar `BOT_TOKEN` e `CHAT_ID`
- Enviar mensagem de teste
- Capturar atualizações do pedido/envio (via webhook ou polling)
- Consultar detalhes do envio (shipment) e montar a mensagem
- Enviar alerta para você (e opcionalmente um familiar)

## Não inclui

- Monitoramento de preços
- Gestão de usuários
- Canal público
- WhatsApp
- Painel/dashboard

---

# 🧠 Como o Telegram encaixa na arquitetura

```text
Mercado Livre (evento de pedido/envio)
   ↓
Seu receiver (webhook ou job)
   ↓
Consulta detalhes (order/shipment/history)
   ↓
Formata mensagem
   ↓
Telegram Bot API (sendMessage)
   ↓
Você recebe no celular 🔔
```

---

# 🧩 Componentes

## 1) Bot do Telegram

Você cria um bot no Telegram via BotFather e obtém:

- `BOT_TOKEN`

---

## 2) Destinos (Chat IDs)

Você precisa descobrir o `CHAT_ID` do destino:

- Seu chat privado com o bot
- (Opcional) chat do seu familiar

Depois, você salva isso em env vars ou config.

---

## 3) Receiver de eventos (Mercado Livre)

Você tem duas estratégias possíveis:

### A) Webhook (preferido)

- Receber notificações de eventos de `orders`/`shipments`
- Ao receber, buscar o estado atual do envio e mandar mensagem

### B) Polling (fallback)

- Rodar um job a cada X minutos
- Comparar `status/substatus` atual vs último salvo
- Se mudou, notificar

> Para uso pessoal, polling com intervalo razoável pode ser suficiente; webhook é mais “tempo real” e eficiente.

---

## 4) Banco mínimo (para dedupe)

Mesmo sendo pessoal, você vai querer evitar notificação repetida.

Estrutura mínima sugerida:

### tracked_shipments

| campo           | tipo     |
| --------------- | -------- |
| shipment_id     | string   |
| order_id        | string   |
| last_event_hash | string   |
| last_status     | string   |
| last_substatus  | string   |
| updated_at      | datetime |

---

# 📨 Formato das mensagens (status/logística)

## Mensagem curta (boa)

```
📦 Pedido atualizado

Pedido: #123
Status: Em transferência
Local: CD Cajamar
Hora: 14:02

🔎 Rastreio: https://...
```

## Mensagem “ansioso mode” (detalhada)

```
📦 Linha do tempo (última atualização)

Pedido: #123
🚚 Evento: Chegou no centro de distribuição
📍 Local: CD Betim
🕒 2026-02-11 14:02

Próximo provável: Em transferência
```

---

# 🧠 Regras de “anti-spam” (recomendado)

Como eventos podem repetir, use:

- Deduplicação por `(shipment_id + timestamp + status + substatus)`
- Cooldown (ex.: não enviar o mesmo status em menos de 5 min)
- Enviar apenas quando a linha do tempo tiver um novo evento

---

# 🧪 Checklist do MVP

- [ ] Criar bot no BotFather
- [ ] Pegar `BOT_TOKEN`
- [ ] Descobrir `CHAT_ID`
- [ ] Implementar `sendTelegram(message)`
- [ ] Fazer “hello world” no Telegram
- [ ] Conectar origem de eventos (webhook ou polling)
- [ ] Salvar último status por shipment
- [ ] Enviar alerta quando mudar
- [ ] Deduplicação básica

---

# 🧭 Evoluções possíveis

- [ ] Incluir link direto do pedido/envio
- [ ] Enviar mensagem agrupada (ex.: 3 eventos em 1 msg)
- [ ] Botões inline ("Abrir rastreio")
- [ ] Modo silencioso (ex.: não notificar madrugada)

---

# 📝 Status

🟡 Planejamento

Documento focado em um setup pessoal e simples — ideal para começar rápido e evoluir depois.
