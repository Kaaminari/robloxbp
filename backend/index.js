const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');

app.use(cors());
app.use(express.json());

app.post('/refresh', async (req, res) => {
  const cookie = req.body.cookie;
  if (!cookie) return res.status(400).json({ error: "Cookie não enviado" });

  try {
    const response = await axios.post("https://auth.roblox.com/v2/logout", {}, {
      headers: {
        Cookie: `.ROBLOSECURITY=${cookie}`
      }
    });

    const csrfToken = response.headers['x-csrf-token'];
    res.json({ refreshed: true, token: csrfToken });
  } catch (err) {
    if (err.response?.headers['x-csrf-token']) {
      res.json({ refreshed: true, token: err.response.headers['x-csrf-token'] });
    } else {
      res.status(500).json({ error: "Erro ao tentar obter X-CSRF-TOKEN" });
    }
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
