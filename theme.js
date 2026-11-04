(function () {
  var d = document.documentElement, t;
  try { t = localStorage.getItem("theme"); } catch (e) {}
  if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  d.setAttribute("data-theme", t);
  document.addEventListener("DOMContentLoaded", function () {
    var n = document.querySelector("header nav"), b = document.createElement("button");
    if (!n) return;
    b.className = "theme"; b.type = "button"; b.setAttribute("aria-label", "Toggle dark mode");
    function s() { b.textContent = d.getAttribute("data-theme") === "dark" ? "☀" : "☾"; }
    s();
    b.onclick = function () {
      var v = d.getAttribute("data-theme") === "dark" ? "light" : "dark";
      d.setAttribute("data-theme", v);
      try { localStorage.setItem("theme", v); } catch (e) {}
      s();
    };
    n.appendChild(b);
  });
})();
