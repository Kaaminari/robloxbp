// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // Aqui está o fetch incluído certinho

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
    // Verificando a autenticidade do cookie
    const response = await fetch("https://users.roblox.com/v1/users/authenticated", {
      method: "GET",
      headers: {
        "Cookie": `.ROBLOSECURITY=${cookie}`,
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
      },
    });

    if (response.status !== 200) {
      return res.status(401).json({ error: "Cookie inválido" });
    }

    // Realizando o logout após verificar que o cookie é válido
    const logoutResponse = await fetch("https://auth.roblox.com/v2/logout", {
      method: "POST",
      headers: {
        "Cookie": `.ROBLOSECURITY=${cookie}`,  // Envia o cookie que foi passado
        "User-Agent": "Mozilla/5.0",  // User-Agent para evitar bloqueio
      },
    });

    // Logando o status da resposta e os headers
    console.log("Status da resposta:", response.status);
    const newCookie = response.headers.get("set-cookie");

    // Verificando se o novo cookie foi obtido
    if (!newCookie) {
      console.log("Nenhum novo cookie retornado");
      return res.status(401).json({ error: "Falha ao atualizar cookie" });
    }

    // Logando o novo cookie
    console.log("Novo cookie:", newCookie);

    return res.json({ message: "Cookie atualizado com sucesso!", cookieAtualizado: newCookie });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
