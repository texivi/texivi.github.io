(function () {
  var d = document, rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hd = d.querySelector("header"), pg = d.querySelector(".prog");
  function sc() {
    var h = d.documentElement.scrollHeight - innerHeight;
    if (pg) pg.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
    if (hd) hd.classList.toggle("sc", scrollY > 8);
  }
  addEventListener("scroll", sc, { passive: true }); sc();
  if (!rm && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12 });
    d.querySelectorAll(".sec, .title, .who, .about p, .facts div, .vc, .stack > div, .wr li, .talk > div").forEach(function (el, i) {
      el.classList.add("rv");
      var sib = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
      el.style.setProperty("--d", Math.min(sib, 5) * .09 + "s");
      io.observe(el);
    });
  }
  var arts = d.querySelectorAll(".art");
  if (arts.length && !rm) addEventListener("mousemove", function (e) {
    arts.forEach(function (art) {
      var r = art.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var x = e.clientX - cx, y = e.clientY - cy;
      x = Math.max(-1, Math.min(1, x / (x < 0 ? cx : innerWidth - cx)));
      y = Math.max(-1, Math.min(1, y / (y < 0 ? cy : innerHeight - cy)));
      art.style.setProperty("--px", x * 9);
      art.style.setProperty("--py", y * 7);
    });
  });
  d.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("button.tl"), w = t && t.closest(".vc, .portrait");
    if (!w) return;
    if (t.classList.contains("g")) { var a = w.querySelector("a.im"); location.href = a ? a.href : "images/me.svg"; }
    else if (t.classList.contains("y")) minimize(w);
    else { w.classList.add("gone"); setTimeout(function () { w.classList.remove("gone"); }, 2300); }
  });
  var dock, ICONS = {"subverge":"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232b2638'/%3E%3Ctext x='32' y='46' font-size='38' text-anchor='middle' fill='%23c9bfe0' font-family='serif'%3E%26%23937;%3C/text%3E%3C/svg%3E","uraniumos":"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%231b1b19'/%3E%3Cg transform='translate(32 32) scale(.56)'%3E%3Ccircle r='48' fill='%23f2d21b'/%3E%3Ccircle r='6.5' fill='%231b1b19'/%3E%3Cpath fill='%231b1b19' d='M6.50 -11.26 A13 13 0 0 0 -6.50 -11.26 L-20.00 -34.64 A40 40 0 0 1 20.00 -34.64 Z M-13.00 -0.00 A13 13 0 0 0 -6.50 11.26 L-20.00 34.64 A40 40 0 0 1 -40.00 -0.00 Z M6.50 11.26 A13 13 0 0 0 13.00 0.00 L40.00 0.00 A40 40 0 0 1 20.00 34.64 Z'/%3E%3C/g%3E%3C/svg%3E","tswm":"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23c9d6c4'/%3E%3Crect x='13' y='15' width='38' height='34' rx='3' fill='%23fff' stroke='%234a4357' stroke-width='2.5'/%3E%3Crect x='13' y='15' width='38' height='9' rx='3' fill='%237d7092' stroke='%234a4357' stroke-width='2.5'/%3E%3C/svg%3E","avtty":"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232b2638'/%3E%3Cpath d='M17 24 L29 33 L17 42' fill='none' stroke='%23c9bfe0' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M34 44 H48' stroke='%23c9bfe0' stroke-width='5' stroke-linecap='round'/%3E%3C/svg%3E","fluent":"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23c4b2e6'/%3E%3Cstop offset='1' stop-color='%237d7092'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='14' fill='url(%23g)'/%3E%3Cg fill='%23fff'%3E%3Crect x='12' y='20' width='10' height='10' rx='2.5'/%3E%3Crect x='27' y='20' width='10' height='10' rx='2.5'/%3E%3Crect x='42' y='20' width='10' height='10' rx='2.5'/%3E%3Crect x='12' y='35' width='40' height='10' rx='2.5'/%3E%3C/g%3E%3C/svg%3E"};
  function pts(e) {
    var L = [], Rr = [], n = 8, i, y, w;
    for (i = 0; i <= n; i++) { y = i / n; w = 1 - e * (1 - (1 - .92 * Math.pow(y, 1.5))); L.push((50 - w * 50).toFixed(2) + "% " + (y * 100).toFixed(1) + "%"); Rr.unshift((50 + w * 50).toFixed(2) + "% " + (y * 100).toFixed(1) + "%"); }
    return "polygon(" + L.concat(Rr).join(",") + ")";
  }
  function genie(w, item, back) {
    var r = w.getBoundingClientRect(), t = item.getBoundingClientRect(), c = w.cloneNode(true), kf = [], i, k, e, g;
    var dx = t.left + t.width / 2 - (r.left + r.width / 2), dy = t.top + t.height / 2 - (r.top + r.height / 2), s = Math.max(.05, t.width / r.width);
    c.classList.remove("min"); c.removeAttribute("id");
    c.style.cssText = "position:fixed;margin:0;z-index:60;pointer-events:none;box-shadow:none;left:" + (r.left + r.width / 2 - w.offsetWidth / 2) + "px;top:" + (r.top + r.height / 2 - w.offsetHeight / 2) + "px;width:" + w.offsetWidth + "px;height:" + w.offsetHeight + "px";
    d.body.appendChild(c);
    for (i = 0; i <= 14; i++) {
      k = i / 14; e = k * k * (3 - 2 * k); g = Math.pow(e, 1.6);
      kf.push({ clipPath: pts(e), translate: dx * g + "px " + dy * g + "px", scale: 1 - (1 - s) * g, offset: k });
    }
    var a = c.animate(kf, { duration: 800, easing: "cubic-bezier(.45,.05,.55,.95)", direction: back ? "reverse" : "normal", fill: "both" });
    a.finished.then(function () { c.remove(); });
    return a;
  }
  function minimize(w) {
    if (w.classList.contains("min") || w.busy) return;
    var ti = w.querySelector(".ttl"), name = ti ? ti.textContent.toLowerCase() : "", item = d.createElement("button");
    item.type = "button"; item.setAttribute("aria-label", "Restore " + name);
    item.style.backgroundImage = "url(\"" + (ICONS[name] || "images/me.svg") + "\")";
    if (!dock) { dock = d.createElement("div"); dock.className = "dock"; d.body.appendChild(dock); }
    dock.appendChild(item); dock.classList.add("on");
    if (rm) { w.classList.add("min"); } else {
      w.busy = true; item.style.visibility = "hidden";
      var a = genie(w, item, false); w.classList.add("min");
      a.finished.then(function () { w.busy = false; item.style.visibility = ""; item.classList.add("pop"); });
    }
    item.onclick = function () {
      if (w.busy) return;
      var done = function () { item.remove(); if (!dock.children.length) dock.classList.remove("on"); };
      if (rm) { w.classList.remove("min"); done(); return; }
      w.busy = true; item.style.visibility = "hidden";
      genie(w, item, true).finished.then(function () { w.classList.remove("min"); w.busy = false; done(); });
    };
  }
})();
