document.addEventListener("DOMContentLoaded", function () {
    const btnIniciar = document.getElementById("btn-iniciar");
    const telaInicial = document.getElementById("tela-inicial");
    const mapaContainer = document.getElementById("mapa-container");
    const instrucoes = document.getElementById("instrucoes");
    const objetivoContainer = document.getElementById("objetivo-container");
    const vidasContainer = document.getElementById("vidas-container");
    const acertosDisplay = document.getElementById("acertos");
    const mapa = document.getElementById("mapa");
    const zoomInBtn = document.getElementById("zoom-in");
    const zoomOutBtn = document.getElementById("zoom-out");
    
    let paises = document.querySelectorAll("#mapa path");
    let nomePaisAtual = null;
    let vidas = 3;
    let acertos = 0;
    let scale = 1;
    let nivelSelecionado = 1;
    let paisesRestantes = [];

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
        if (paisesRestantes.length === 0) {
            alert("Parabéns! Você acertou todos os países deste nível!");
            reiniciarJogo();
            return;
        }
    
        nomePaisAtual = paisesRestantes.pop();
        instrucoes.textContent = `Encontre: ${nomePaisAtual}`;
    }
    
    function embaralharArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
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
        atualizarVidas();
        acertos = 0;
        acertosDisplay.textContent = acertos;
        telaInicial.style.display = "block";
        mapaContainer.style.display = "none";
        objetivoContainer.style.display = "none";
        vidasContainer.style.display = "none";
        instrucoes.textContent = "Clique em Iniciar para jogar!";
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        mapa.style.transformOrigin = "50% 50%";
        mapa.style.transform = "scale(1)";
        mapa.style.cursor = "grab";
    }    

    btnIniciar.addEventListener("click", function () {
        nivelSelecionado = parseInt(document.getElementById("nivel-select").value);
        telaInicial.style.display = "none";
        mapaContainer.style.display = "block";
        objetivoContainer.style.display = "block";
        vidasContainer.style.display = "block";
        atualizarVidas();
    
        // Filtra os países por nível e armazena em paisesRestantes
        const paisesFiltrados = Array.from(paises).filter(pais => {
            return parseInt(pais.getAttribute("nivel")) <= nivelSelecionado;
        });
        
        // Criar conjunto de nomes únicos
        const nomesUnicos = [...new Set(paisesFiltrados.map(p => p.getAttribute("name")))];
        paisesRestantes = nomesUnicos;        
    
        // Embaralha os países
        embaralharArray(paisesRestantes);
    
        // Adiciona o evento de clique apenas uma vez
        paises.forEach((pais) => {
            pais.removeEventListener("click", verificarClique);
            pais.addEventListener("click", verificarClique);
        });
    
        escolherPaisAleatorio();
    });      
});
