export function getLastEvent(shipment) {
  const hist = shipment.substatus_history || [];
  const last = hist[hist.length - 1];

  return {
    status: shipment.status,
    substatus: shipment.substatus,
    eventDate: last?.date || shipment.last_updated,
    eventStatus: last?.status || shipment.status,
    eventSubstatus: last?.substatus || shipment.substatus,
  };
}

export function eventHash(shipment) {
  return `${shipment.id}|${shipment.status}|${shipment.substatus}|${shipment.last_updated}`;
}

export function humanizeSubstatus(sub) {
  const map = {
    invoice_pending: 'Aguardando nota fiscal',
    waiting_for_carrier_authorization:
      'Aguardando autorização da transportadora',
    ready_to_print: 'Etiqueta pronta',
    dropped_off: 'Postado no ponto de coleta',
    picked_up: 'Coletado pela transportadora',
    in_hub: 'No centro de distribuição',
    in_packing_list: 'Em separação (packing list)',
  };
  return map[sub] || sub;
}

export function formatMessage(shipment) {
  const item = shipment.shipping_items?.[0]?.description || 'Item';
  const { eventDate, eventSubstatus } = getLastEvent(shipment);

  return `📦 Pedido atualizado

Pedido: #${shipment.order_id}
Item: ${item}
Status: ${humanizeSubstatus(eventSubstatus)}
🕒 ${eventDate}

🔎 Rastreio: ${shipment.tracking_number || '—'}`;
}
