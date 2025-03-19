document.addEventListener("DOMContentLoaded", function () {
    const btnIniciar = document.getElementById("btn-iniciar");
    const telaInicial = document.getElementById("tela-inicial");
    const mapaContainer = document.getElementById("mapa-container");
    const instrucoes = document.getElementById("instrucoes");
    
    let paises = document.querySelectorAll("#mapa path");
    let paisAtual = null; 
    
    function escolherPaisAleatorio() {
        let paisAleatorio = paises[Math.floor(Math.random() * paises.length)];
        paisAtual = paisAleatorio;
        let nomePais = paisAtual.getAttribute("name");
        
        instrucoes.textContent = `Encontre: ${nomePais}`;
    }

    btnIniciar.addEventListener("click", function () {
        telaInicial.style.display = "none";
        mapaContainer.style.display = "block";
        escolherPaisAleatorio();
    });

    paises.forEach((pais) => {
        pais.addEventListener("click", function () {
            let nomeClicado = pais.getAttribute("name");
            let nomePaisAtual = paisAtual.getAttribute("name");

            if (nomeClicado === nomePaisAtual) {
                alert("✅ Você acertou! Próximo país...");
                escolherPaisAleatorio(); 
            } else {
                alert(`❌ Errado! Você clicou em ${nomeClicado}. Tente novamente.`);
            }
        });
    });
});
