
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault(); // evita o recarregamento da página

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");

  
  const adminUser = "admin";
  const adminPass = "12345";

  if (username === adminUser && password === adminPass) {
    // Salvando login na sessão (simples)
    sessionStorage.setItem("logado", "true");
    window.location.href = "admin.html";
  } else {
    errorMsg.textContent = "Usuário ou senha incorretos.";
  }
});
