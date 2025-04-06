const cookie = document.getElementById("cookie").value;
const password = document.getElementById("password").value;

async function alterarIdade() {
  const response = await fetch("/alterar-idade", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cookie, password })
  });

  const data = await response.json();
  console.log(data); // Aqui você pode tratar os dados ou exibir algo na tela
}
