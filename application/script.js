document.addEventListener("DOMContentLoaded", function () {
    const paises = document.querySelectorAll('path');
    console.log(paises);

    paises.forEach((pais) => {
        pais.addEventListener("click", function () {
            const nome = pais.getAttribute("name");
            const clazz = pais.getAttribute("class");
            alert("Você clicou no país: " + nome || clazz);
        });
    });
});
