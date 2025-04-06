async function pegarToken(cookie) {
  const resposta = await fetch('https://auth.roblox.com/v2/logout', {
    method: 'POST',
    headers: {
      'Cookie': `.ROBLOSECURITY=${cookie}`,
    }
  });

  const csrf = resposta.headers.get('x-csrf-token');
  return csrf;
}

async function alterarIdade(cookie, birthYear = 2000) {
  const csrf = await pegarToken(cookie);

  const resposta = await fetch('https://accountsettings.roblox.com/v1/birthdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'X-CSRF-Token': csrf,
      'User-Agent': 'Mozilla/5.0'
    },
    body: JSON.stringify({
      birthMonth: 1,
      birthDay: 1,
      birthYear
    })
  });

  return await resposta.json();
}

module.exports = { alterarIdade };
