// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // <--- Aqui está o fetch incluído certinho

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/refresh", async (req, res) => {
  const { cookie } = req.body;

  if (!cookie || !cookie.includes(".ROBLOSECURITY")) {
    return res.status(400).json({ error: "Cookie inválido ou ausente" });
  }

  try {
    const response = await fetch("https://auth.roblox.com/v2/logout", {
      method: "POST",
      headers: {
        "Cookie": `.ROBLOSECURITY=${cookie}`,
        "User-Agent": "Mozilla/5.0",
      },
    });

    const newCookie = response.headers.get("set-cookie");

    if (!newCookie) {
      return res.status(401).json({ error: "Falha ao atualizar cookie" });
    }

    return res.json({ message: "Cookie atualizado com sucesso!", cookieAtualizado: newCookie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
