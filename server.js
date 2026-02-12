import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MeliTrack online 🚚');
});

app.get('/auth/callback', (req, res) => {
  console.log('CODE:', req.query.code);
  res.send('OAuth recebido! Pode fechar 👍');
});

app.post('/webhook/meli', (req, res) => {
  console.log('Webhook recebido:', req.body);
  res.sendStatus(200);
});

app.get('/auth/callback', (req, res) => {
  const { code } = req.query;
  console.log('OAuth CODE:', code);
  res.send('Recebi o code! Agora vou trocar por token 👌');
});

app.listen(3000, () => {
  console.log('Server rodando na 3000');
});
