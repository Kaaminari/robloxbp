document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bypass-form");
    const input = document.getElementById("cookie-input");
    const resultBox = document.getElementById("result-box");
    const resultText = document.getElementById("result-text");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const cookie = input.value.trim();
        if (!cookie) {
            showResult("Insira um cookie válido.", true);
            return;
        }

        try {
            const response = await fetch(`/api/bypass?cookie=${encodeURIComponent(cookie)}`);
            if (!response.ok) {
                showResult(`Erro ${response.status}: ${response.statusText}`, true);
                return;
            }

            const data = await response.json();
            if (data.success) {
                showResult(`Cookie bypassado com sucesso: ${data.result}`);
            } else {
                showResult("Falha ao bypassar o cookie. Verifique se ele é válido.", true);
            }

        } catch (error) {
            showResult("Erro de conexão com o servidor. Tente novamente mais tarde.", true);
            console.error(error);
        }
    });

    function showResult(message, isError = false) {
        resultBox.style.display = "block";
        resultText.innerText = message;
        resultText.style.color = isError ? "#ff4c4c" : "#00ff99";
    }
});
