# ml-telegram-tracker

Bot pessoal que manda mensagem no Telegram cada vez que o status de um pedido do Mercado Livre muda. Nada mais, nada menos.

---

## Por que isso existe

Eu odeio ficar abrindo o app do ML pra ver se o pedido saiu pro CD ou não. Esse projeto resolve isso mandando uma mensagem direto no celular quando qualquer coisa mudar no rastreio — pagamento aprovado, postado, em transferência, saiu para entrega, entregue.

Uso pessoal. Não tem multi-usuário, não tem painel, não tem SaaS. No máximo você e um familiar recebendo no mesmo bot.

---

## Como funciona

```
ML emite evento (order/shipment)
  → receiver (webhook ou polling)
    → busca detalhes do envio via API
      → monta mensagem
        → Telegram Bot API (sendMessage)
          → notificação no celular
```

---

## O que tem no MVP

- Criar o bot via BotFather e guardar `BOT_TOKEN` + `CHAT_ID`
- Receber eventos do ML (webhook preferred, polling como fallback)
- Consultar estado atual do envio
- Enviar alerta quando o status mudar
- Deduplicação básica pra não spammar o mesmo status duas vezes

## O que não tem

- Monitoramento de preço
- WhatsApp
- Qualquer coisa que precise de servidor público permanente se você optar por polling

---

## Estratégia de eventos

**Webhook** — o ML notifica sua URL quando algo muda. Mais eficiente, mais próximo de tempo real. Exige endpoint público (ngrok pra dev, VPS/serverless pra produção).

**Polling** — job rodando a cada X minutos comparando o status atual com o último salvo. Suficiente pra uso pessoal. Mais fácil de colocar pra rodar num Raspberry Pi ou num cron qualquer.

---

## Banco de dados (mínimo)

Só pra guardar o último estado e evitar notificação repetida:

| campo           | tipo     |
| --------------- | -------- |
| shipment_id     | string   |
| order_id        | string   |
| last_event_hash | string   |
| last_status     | string   |
| last_substatus  | string   |
| updated_at      | datetime |

SQLite resolve bem pra uso pessoal.

---

## Formato das mensagens

**Versão enxuta:**

```
📦 Pedido #123 atualizado
Status: Em transferência — CD Cajamar
14:02 · Rastreio: https://...
```

**Versão detalhada (modo ansioso):**

```
📦 Pedido #123
Evento: Chegou no centro de distribuição
Local: CD Betim
Hora: 2026-02-11 14:02
Próximo provável: Em transferência
```

---

## Anti-spam

A API do ML pode mandar o mesmo evento mais de uma vez. Para não encher o Telegram de mensagem repetida:

- Hash de `(shipment_id + timestamp + status + substatus)` pra deduplicar
- Cooldown de 5 minutos por status
- Só notifica se aparecer um evento novo na linha do tempo

---

## Checklist MVP

- [ ] Criar bot no BotFather
- [ ] Salvar `BOT_TOKEN` e `CHAT_ID` em variáveis de ambiente
- [ ] Implementar `sendTelegram(message)` e testar com um hello world
- [ ] Conectar origem de eventos (webhook ou polling)
- [ ] Persistir último status por shipment
- [ ] Enviar alerta na mudança
- [ ] Deduplicação básica funcionando

---

## Possíveis evoluções

- Botões inline no Telegram ("Abrir rastreio")
- Agrupamento de eventos próximos numa mensagem só
- Modo silencioso por horário (sem notificação de madrugada)
- Link direto pro pedido/envio

---

## Status

Planejamento — documento serve como spec do MVP. A ideia é começar simples e evoluir conforme a necessidade aparecer.
