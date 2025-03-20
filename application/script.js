document.addEventListener("DOMContentLoaded", function () {
    const btnIniciar = document.getElementById("btn-iniciar");
    const telaInicial = document.getElementById("tela-inicial");
    const mapaContainer = document.getElementById("mapa-container");
    const instrucoes = document.getElementById("instrucoes");
    const objetivoContainer = document.getElementById("objetivo-container"); // Novo contêiner do objetivo
    
    let paises = document.querySelectorAll("#mapa path");
    let paisAtual = null;

    function escolherPaisAleatorio() {
        let paisAleatorio = paises[Math.floor(Math.random() * paises.length)];
        paisAtual = paisAleatorio;
        let nomePais = paisAtual.getAttribute("name");

        // Efeito de transição para o objetivo
        instrucoes.style.opacity = "0";
        setTimeout(() => {
            instrucoes.textContent = `Encontre: ${nomePais}`;
            instrucoes.style.opacity = "1";
        }, 500);
    }

    // Função para verificar se o clique foi no país correto
    function verificarClique(event) {
        let nomeClicado = event.target.getAttribute("name");
        let nomePaisAtual = paisAtual.getAttribute("name");

        if (nomeClicado === nomePaisAtual) {
            alert("✅ Você acertou! Próximo país...");
            escolherPaisAleatorio(); 
        } else {
            alert(`❌ Errado! Você clicou em ${nomeClicado}. Tente novamente.`);
        }
    }

    btnIniciar.addEventListener("click", function () {
        telaInicial.style.display = "none";
        mapaContainer.style.display = "block";
        objetivoContainer.style.display = "block"; // Torna o contêiner de objetivo visível

        // Adiciona o evento de clique SOMENTE quando o jogo começar
        paises.forEach((pais) => {
            pais.addEventListener("click", verificarClique);
        });

        escolherPaisAleatorio();
    });
});
