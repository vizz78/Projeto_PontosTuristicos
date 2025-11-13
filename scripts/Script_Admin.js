// ===== VERIFICA LOGIN =====
if (sessionStorage.getItem("logado") !== "true") {
  window.location.href = "login.html";
}

// ===== ELEMENTOS =====
const form = document.getElementById("formPonto");
const listaDiv = document.getElementById("listaPontos");
const menuCadastrar = document.getElementById("menuCadastrar");
const menuListar = document.getElementById("menuListar");
const logout = document.getElementById("logout");
const btnSubmit = form.querySelector('button[type="submit"]');

let pontos = JSON.parse(localStorage.getItem("pontos")) || [];
let editingId = null; // id do ponto em edição

// ===== TROCA ENTRE SEÇÕES =====
menuCadastrar.addEventListener("click", () => toggleSection("cadastrar", menuCadastrar));
menuListar.addEventListener("click", () => toggleSection("listar", menuListar));

function toggleSection(id, menuAtivo) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".sidebar a").forEach(link => link.classList.remove("active"));
  if (menuAtivo) menuAtivo.classList.add("active");

  if (id === "listar") renderList();
}

// ===== LOGOUT =====
logout.addEventListener("click", () => {
  sessionStorage.removeItem("logado");
  window.location.href = "index.html";
});

// ===== CADASTRAR / ATUALIZAR =====
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const imagemInput = document.getElementById("imagem");

  if (!titulo || !descricao) {
    alert("Preencha todos os campos!");
    return;
  }

  // Atualização
  if (editingId) {
    const idx = pontos.findIndex(p => p.id === editingId);
    if (idx === -1) {
      alert("Erro ao atualizar: ponto não encontrado.");
      resetFormState();
      return;
    }

    // Atualiza texto
    pontos[idx].titulo = titulo;
    pontos[idx].descricao = descricao;

    // Se o usuário escolher nova imagem, substitui
    if (imagemInput.files && imagemInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        pontos[idx].imagem = e.target.result;
        salvarAtualizacao();
      };
      reader.readAsDataURL(imagemInput.files[0]);
    } else {
      // Mantém a imagem anterior
      salvarAtualizacao();
    }

    function salvarAtualizacao() {
      localStorage.setItem("pontos", JSON.stringify(pontos));
      alert("Ponto atualizado com sucesso!");
      resetFormState();
      renderList();
      toggleSection("listar", menuListar);
    }

    return;
  }

  // Cadastro novo
  if (!imagemInput.files || imagemInput.files.length === 0) {
    alert("Selecione uma imagem para cadastrar o ponto!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const novoPonto = {
      id: Date.now(),
      titulo,
      descricao,
      imagem: e.target.result,
    };
    pontos.push(novoPonto);
    localStorage.setItem("pontos", JSON.stringify(pontos));
    alert("Ponto cadastrado com sucesso!");
    resetFormState();
    renderList();
    toggleSection("listar", menuListar);
  };
  reader.readAsDataURL(imagemInput.files[0]);
});

// ===== RENDER LISTA =====
function renderList() {
  listaDiv.innerHTML = "";

  if (pontos.length === 0) {
    listaDiv.innerHTML = "<p>Nenhum ponto cadastrado.</p>";
    return;
  }

  pontos.forEach(ponto => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${ponto.imagem}" alt="${ponto.titulo}">
      <h3>${ponto.titulo}</h3>
      <p>${ponto.descricao}</p>
      <div class="actions">
        <button class="edit" data-id="${ponto.id}">Editar</button>
        <button class="delete" data-id="${ponto.id}">Excluir</button>
      </div>
    `;
    listaDiv.appendChild(card);
  });

  listaDiv.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.getAttribute('data-id'));
      editarPonto(id);
    });
  });

  listaDiv.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.getAttribute('data-id'));
      excluirPonto(id);
    });
  });
}

// ===== EXCLUIR =====
function excluirPonto(id) {
  if (confirm("Tem certeza que deseja excluir este ponto?")) {
    pontos = pontos.filter(p => p.id !== id);
    localStorage.setItem("pontos", JSON.stringify(pontos));
    if (editingId === id) resetFormState();
    renderList();
  }
}

// ===== EDITAR =====
function editarPonto(id) {
  const ponto = pontos.find(p => p.id === id);
  if (!ponto) return;

  document.getElementById("titulo").value = ponto.titulo;
  document.getElementById("descricao").value = ponto.descricao;
  editingId = id;
  btnSubmit.textContent = "Atualizar";

  toggleSection("cadastrar", menuCadastrar);
}

// ===== RESET ESTADO =====
function resetFormState() {
  form.reset();
  editingId = null;
  btnSubmit.textContent = "Cadastrar";
}

// ===== INICIALIZAÇÃO =====
renderList();
