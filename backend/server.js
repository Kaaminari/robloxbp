const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/alterar-idade', (req, res) => {
  const { cookie, password } = req.body;

  if (!cookie || !password) {
    return res.status(400).json({ error: 'Cookie e senha são obrigatórios.' });
  }

  const idadeAlterada = Math.random() > 0.5 ? '13+' : '-13'; // Simulação

  res.json({ idadeAlterada });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
