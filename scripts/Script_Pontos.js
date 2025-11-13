// ===== CARREGAR PONTOS DO LOCALSTORAGE =====
const lista = document.getElementById("listaPontos");
const pontos = JSON.parse(localStorage.getItem("pontos")) || [];

if (pontos.length === 0) {
  lista.innerHTML = "<p>Nenhum ponto turístico cadastrado ainda.</p>";
} else {
  pontos.forEach(ponto => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${ponto.imagem}" alt="${ponto.titulo}">
      <div class="card-content">
        <h3>${ponto.titulo}</h3>
        <p>${ponto.descricao}</p>
      </div>
    `;
    lista.appendChild(card);
  });
}
