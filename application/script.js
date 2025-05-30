document.addEventListener("DOMContentLoaded", function () {
    const telaInicial = document.getElementById("tela-inicial");
    const telaFeedback = document.getElementById("tela-feedback");
    const telaVitoria = document.getElementById("tela-vitoria");
    const telaDerrota = document.getElementById("tela-derrota");
    const proxBtn = document.getElementById("btn-proximo");
    const tituloFeedback = document.getElementById("titulo-feedback");
    const msgFeedback = document.getElementById("mensagem-feedback");
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
    let totalPaises = 0;
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
            atualizarDisplayAcertos();
            if (paisesRestantes.length === 0) {
                mostrarTelaVitoria();
                return;
            }
            preencherPaisAcerto(nomeClicado);
            mostrarMsgAcerto();
            escolherPaisAleatorio();
        } else {
            vidas--;
            atualizarVidas();
            if (vidas <= 0) {
                mostrarTelaDerrota();
            } else {
                mostrarMsgErro(nomeClicado);
            }
        }
    }

    function preencherPaisAcerto(nomePais) {
        document.querySelectorAll(`path[name="${nomePais}"]`).forEach((pais) => {
            pais.classList.add('preenchido');
        });
    }

    function mostrarMsgAcerto() {
        esconderMapaEObjetivo();
        telaFeedback.style.display = "block";
        tituloFeedback.textContent = "Parabéns!";
        msgFeedback.textContent = '✅ Você encontrou ' + nomePaisAtual;
    }

    function mostrarMsgErro(nomeClicado) {
        esconderMapaEObjetivo();
        telaFeedback.style.display = "block";
        tituloFeedback.textContent = "Errado!";
        msgFeedback.textContent = `❌ Você clicou em ${nomeClicado}. Tente novamente.`;
    }

    function mostrarTelaVitoria() {
        esconderMapaEObjetivo();
        telaVitoria.style.display = "block";
        confettiLegal();
    }

    function mostrarTelaDerrota() {
        esconderMapaEObjetivo();
        telaDerrota.style.display = "block";
    }

    document.querySelectorAll(".btn-reiniciar").forEach((btn) => {
        btn.addEventListener("click", () => {
            reiniciarJogo();
        });
    });

    function esconderMapaEObjetivo() {
        mapaContainer.style.display = "none";
        objetivoContainer.style.display = "none";
    }

    proxBtn.addEventListener("click", () => {
        mapaContainer.style.display = "block";
        objetivoContainer.style.display = "block";
        telaFeedback.style.display = "none";
    })

    function atualizarDisplayAcertos() {
        acertosDisplay.textContent = `${acertos}/${totalPaises}`;
    }

    // Função para reiniciar o jogo
    function reiniciarJogo() {
        vidas = 3;
        atualizarVidas();
        acertos = 0;
        acertosDisplay.textContent = acertos;
        telaInicial.style.display = "block";
        telaVitoria.style.display = "none";
        telaDerrota.style.display = "none";
        telaFeedback.style.display = "none";
        mapaContainer.style.display = "none";
        objetivoContainer.style.display = "none";
        vidasContainer.style.display = "none";
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        mapa.style.transformOrigin = "50% 50%";
        mapa.style.transform = "scale(1)";
        mapa.style.cursor = "grab";
        document.querySelectorAll('path').forEach((pais) => {
            pais.classList.remove('preenchido');
        });
    }

    telaInicial.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener("click", () => {
            iniciarJogo(btn.value);
        })
    });

    function iniciarJogo(nivel) {
        nivelSelecionado = nivel;
        telaInicial.style.display = "none";
        mapaContainer.style.display = "block";
        objetivoContainer.style.display = "block";
        vidasContainer.style.display = "block";
        atualizarVidas();
    
        // Filtra os países por nível e armazena em paisesRestantes
        const paisesFiltrados = Array.from(paises).filter(pais => {
            return parseInt(pais.getAttribute("nivel")) == nivelSelecionado;
        });
        
        // Criar conjunto de nomes únicos
        const nomesUnicos = [...new Set(paisesFiltrados.map(p => p.getAttribute("name")))];
        paisesRestantes = nomesUnicos;        
    
        // Embaralha os países
        embaralharArray(paisesRestantes);

        totalPaises = paisesRestantes.length;
        atualizarDisplayAcertos();
    
        // Adiciona o evento de clique apenas uma vez
        paises.forEach((pais) => {
            pais.removeEventListener("click", verificarClique);
            pais.addEventListener("click", verificarClique);
        });
    
        escolherPaisAleatorio();
    }

    function confettiLegal() {
        const duration = 2 * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 10, spread: 360, ticks: 60, zIndex: 0 };
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);

            confetti(
                Object.assign({}, defaults, {
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                })
            );
            confetti(
                Object.assign({}, defaults, {
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                })
            );
        }, 250);
    }
  
});
