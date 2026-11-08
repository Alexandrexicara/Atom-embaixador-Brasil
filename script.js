(() => {
  const cfg = window.ATOM_SITE_CONFIG || {};
  document.getElementById("year").textContent = new Date().getFullYear();
  const url = (cfg.referralUrl || "").trim();
  document.querySelectorAll("[data-ref-link]").forEach(link => {
    link.href = url || "https://gb.atomeducacional.com.br/";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    if (!url) link.title = "Página oficial geral. O link pessoal será configurado quando for fornecido.";
  });
})();