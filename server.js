import express from 'express';
import 'dotenv/config';
import { formatMessage, eventHash } from './utils/shipment.utils.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MeliTrack online 🚚');
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', process.env.ML_CLIENT_ID);
  params.append('client_secret', process.env.ML_CLIENT_SECRET);
  params.append('code', code);
  params.append('redirect_uri', process.env.REDIRECT_URI);

  const r = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  const data = await r.json();
  console.log('TOKEN RESPONSE:', data);

  res.send('Token gerado! Veja o terminal 👌');
});

app.get('/test/shipment/:id', async (req, res) => {
  const shipmentId = req.params.id;

  const r = await fetch(
    `https://api.mercadolibre.com/shipments/${shipmentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ML_ACCESS_TOKEN}`,
      },
    },
  );

  const shipment = await r.json();

  const message = formatMessage(shipment);
  const hash = eventHash(shipment);

  res.json({
    message,
    dedupe_hash: hash,
  });
});

app.post('/webhook/meli', (req, res) => {
  console.log('Webhook recebido:', req.body);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Server rodando na 3000');
});
