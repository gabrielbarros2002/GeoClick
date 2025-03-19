document.addEventListener("DOMContentLoaded", function () {
    const btnIniciar = document.getElementById("btn-iniciar");
    const telaInicial = document.getElementById("tela-inicial");
    const mapaContainer = document.getElementById("mapa-container");

    btnIniciar.addEventListener("click", function () {
        telaInicial.style.display = "none";
        mapaContainer.style.display = "block";
    });

    const paises = document.querySelectorAll("#mapa path");

    paises.forEach((pais) => {
        pais.addEventListener("click", function () {
            const nome = pais.getAttribute("name");
            alert("Você clicou no país: " + nome);
        });
    });
});
