const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Para interpretar JSON no body
app.use(bodyParser.json());

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Rota POST para "alterar idade"
app.post('/alterar-idade', (req, res) => {
  const { cookie, password } = req.body;

  if (!cookie || !password) {
    return res.status(400).json({ error: 'Cookie e senha são obrigatórios.' });
  }

  // Simulando idade alterada
  const idadeAlterada = Math.random() > 0.5 ? '13' : '-13';

  res.json({ idadeAlterada: idadeAlterada });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
