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
  var dock, FULL = "polygon(0 0,100% 0,100% 50%,100% 100%,0 100%,0 50%)", MID = "polygon(14% 0,86% 0,80% 50%,64% 100%,36% 100%,20% 50%)", END = "polygon(36% 0,64% 0,56% 60%,52% 100%,48% 100%,44% 60%)";
  function genie(w, item, back) {
    var r = w.getBoundingClientRect(), t = item.getBoundingClientRect();
    var dx = t.left + t.width / 2 - (r.left + r.width / 2), dy = t.top + t.height / 2 - (r.top + r.height / 2);
    return w.animate([
      { translate: "0 0", scale: 1, clipPath: FULL, opacity: 1 },
      { translate: dx * .55 + "px " + dy * .55 + "px", scale: .55, clipPath: MID, opacity: 1, offset: .55 },
      { translate: dx + "px " + dy + "px", scale: Math.max(.05, t.width / r.width), clipPath: END, opacity: .6 }
    ], { duration: 700, easing: "cubic-bezier(.6,.05,.4,1)", direction: back ? "reverse" : "normal" });
  }
  function minimize(w) {
    if (w.classList.contains("min") || w.busy) return;
    var im = w.querySelector(".im img"), ti = w.querySelector(".ttl"), item = d.createElement("button");
    item.type = "button"; item.setAttribute("aria-label", "Restore " + (ti ? ti.textContent : "window"));
    item.style.backgroundImage = "url(" + (im ? im.src : "images/me.svg") + ")";
    if (!dock) { dock = d.createElement("div"); dock.className = "dock"; d.body.appendChild(dock); }
    dock.appendChild(item); dock.classList.add("on");
    if (rm) { w.classList.add("min"); } else {
      w.busy = true; item.style.visibility = "hidden";
      genie(w, item, false).onfinish = function () { w.classList.add("min"); w.busy = false; item.style.visibility = ""; item.classList.add("pop"); };
    }
    item.onclick = function () {
      if (w.busy) return;
      var done = function () { item.remove(); if (!dock.children.length) dock.classList.remove("on"); };
      if (rm) { w.classList.remove("min"); done(); return; }
      w.busy = true; item.style.visibility = "hidden"; w.classList.remove("min");
      genie(w, item, true).onfinish = function () { w.busy = false; done(); };
    };
  }
})();
