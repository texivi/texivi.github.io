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
      art.style.setProperty("--fx", x * 34);
      art.style.setProperty("--px", x * 8);
      art.style.setProperty("--py", y * 6);
    });
  });
})();
