// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/refresh", (req, res) => {
  const { cookie } = req.body;

  if (!cookie || !cookie.includes(".ROBLOSECURITY")) {
    return res.status(400).json({ error: "Cookie inválido ou ausente" });
  }

  // Aqui você faria a lógica real (ex: chamar API da Roblox, etc)
  // Exemplo de resposta simulada:
  res.json({ message: "Cookie atualizado com sucesso!", cookieRecebido: cookie });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
