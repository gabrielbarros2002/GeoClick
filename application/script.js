document.addEventListener("DOMContentLoaded", function () {
    const btnIniciar = document.getElementById("btn-iniciar");
    const telaInicial = document.getElementById("tela-inicial");
    const mapaContainer = document.getElementById("mapa-container");
    const instrucoes = document.getElementById("instrucoes");
    const objetivoContainer = document.getElementById("objetivo-container"); // Novo contêiner do objetivo
    const vidasContainer = document.getElementById("vidas-container");
    const acertosDisplay = document.getElementById("acertos");
    const mapa = document.getElementById("mapa");
    const zoomInBtn = document.getElementById("zoom-in");
    const zoomOutBtn = document.getElementById("zoom-out");
    
    let paises = document.querySelectorAll("#mapa path");
    let paisAtual = null;
    let vidas = 3;
    let acertos = 0;
    let scale = 1;

    const zoomMinimo = 0.5; // Zoom mínimo permitido (50%)
    const zoomMaximo = 3; // Zoom máximo permitido (300%)
    const zoomStep = 0.1; // Passo de zoom (10%)

    let isDragging = false; // Indica se o mapa está sendo arrastado
    let startX, startY; // Posição inicial do cursor ao começar o arrasto
    let offsetX = 0, offsetY = 0; // Deslocamento do mapa durante o arrasto

    function aplicarZoom(event, delta) {
        const rect = mapa.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        const x = (offsetX / rect.width) * 100;
        const y = (offsetY / rect.height) * 100;

        // Ajusta o zoom dentro dos limites mínimo e máximo
        scale += delta;
        if (scale < zoomMinimo) scale = zoomMinimo;
        if (scale > zoomMaximo) scale = zoomMaximo;

        // Aplica o zoom no ponto do cursor
        mapa.style.transformOrigin = `${x}% ${y}%`;
        mapa.style.transform = `scale(${scale})`;
    }

    // Zoom in (aumentar zoom)
    zoomInBtn.addEventListener("click", function (event) {
        aplicarZoom(event, zoomStep);
    });

    // Zoom out (diminuir zoom)
    zoomOutBtn.addEventListener("click", function (event) {
        aplicarZoom(event, -zoomStep);
    });

    // Zoom com scroll do mouse
    mapa.addEventListener("wheel", function (event) {
        event.preventDefault();
        const delta = event.deltaY < 0 ? zoomStep : -zoomStep; // Scroll up = zoom in, scroll down = zoom out
        aplicarZoom(event, delta);
    });

    mapa.addEventListener("mousedown", function (event) {
        isDragging = true;
        startX = event.clientX - offsetX;
        startY = event.clientY - offsetY;
        mapa.style.cursor = "grabbing"; // Altera o cursor durante o arrasto
    });

    // Movimentar o mapa (mousemove)
    mapa.addEventListener("mousemove", function (event) {
        if (isDragging) {
            event.preventDefault();
            offsetX = event.clientX - startX;
            offsetY = event.clientY - startY;
            mapa.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
        }
    });

    // Parar arrasto (mouseup)
    mapa.addEventListener("mouseup", function () {
        isDragging = false;
        mapa.style.cursor = "grab"; // Restaura o cursor padrão
    });

    // Parar arrasto se o mouse sair do mapa (mouseleave)
    mapa.addEventListener("mouseleave", function () {
        isDragging = false;
        mapa.style.cursor = "grab"; // Restaura o cursor padrão
    });

    function escolherPaisAleatorio() {
        let paisAleatorio = paises[Math.floor(Math.random() * paises.length)];
        paisAtual = paisAleatorio;
        let nomePais = paisAtual.getAttribute("name");

        // Atualiza a instrução
        instrucoes.textContent = `Encontre: ${nomePais}`;
    }

    // Atualiza as vidas no display
    function atualizarVidas() {
        for (let i = 1; i <= 3; i++) {
            const vida = document.getElementById(`vida${i}`);
            vida.style.visibility = i <= vidas ? "visible" : "hidden";
        }
    }

    // Função para verificar se o clique foi no país correto
    function verificarClique(event) {
        let nomeClicado = event.target.getAttribute("name");
        let nomePaisAtual = paisAtual.getAttribute("name");

        if (nomeClicado === nomePaisAtual) {
            acertos++;
            acertosDisplay.textContent = acertos;
            alert("✅ Você acertou! Próximo país...");
            escolherPaisAleatorio();
        } else {
            vidas--;
            atualizarVidas();
            if (vidas <= 0) {
                alert("❌ Você perdeu todas as vidas. O jogo será reiniciado.");
                reiniciarJogo();
            } else {
                alert(`❌ Errado! Você clicou em ${nomeClicado}. Tente novamente.`);
            }
        }
    }

    // Função para reiniciar o jogo
    function reiniciarJogo() {
        vidas = 3;
        acertos = 0;
        acertosDisplay.textContent = acertos;
        atualizarVidas();
        objetivoContainer.style.display = "none";
        mapaContainer.style.display = "none";
        vidasContainer.style.display = "none";
        telaInicial.style.display = "block";
    
        // Remove todos os event listeners de clique dos países
        paises.forEach((pais) => {
            pais.removeEventListener("click", verificarClique);
        });
    }

    btnIniciar.addEventListener("click", function () {
        telaInicial.style.display = "none";
        mapaContainer.style.display = "block";
        objetivoContainer.style.display = "block"; // Torna o contêiner de objetivo visível
        vidasContainer.style.display = "block";
        atualizarVidas();
        escolherPaisAleatorio();

        // Adiciona o evento de clique SOMENTE quando o jogo começar
        paises.forEach((pais) => {
            pais.addEventListener("click", verificarClique);
        });
    });
});
