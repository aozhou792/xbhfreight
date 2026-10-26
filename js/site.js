(function () {
  var root = document.documentElement;
  var LANGS = ["zh", "en", "de", "fr", "es", "it"];
  var HTML_LANG = { zh: "zh-CN", en: "en", de: "de", fr: "fr", es: "es", it: "it" };
  var CALL = {
    zh: "拨打刘先生 · 177 2242 2349",
    en: "Call Mr. Liu · 177 2242 2349",
    de: "Herrn Liu anrufen · 177 2242 2349",
    fr: "Appeler M. Liu · 177 2242 2349",
    es: "Llamar al Sr. Liu · 177 2242 2349",
    it: "Chiama il sig. Liu · 177 2242 2349"
  };
  var PH = {
    cargo: { zh: "家具 / sofa", en: "sofa / furniture", de: "Sofa / Möbel", fr: "canapé / meuble", es: "sofá / mueble", it: "divano / mobile" },
    dest: { zh: "DE 44145 / US 90001", en: "DE 44145 / US 90001", de: "DE 44145 / US 90001", fr: "DE 44145 / US 90001", es: "DE 44145 / US 90001", it: "DE 44145 / US 90001" },
    wv: { zh: "320kg, 120×80×90cm × 4", en: "320kg, 120×80×90cm × 4", de: "320kg, 120×80×90cm × 4", fr: "320kg, 120×80×90cm × 4", es: "320kg, 120×80×90cm × 4", it: "320kg, 120×80×90cm × 4" },
    who: { zh: "", en: "", de: "", fr: "", es: "", it: "" },
    note: { zh: "", en: "", de: "", fr: "", es: "", it: "" }
  };
  var TRACK = {
    zh: "https://www.17track.net/zh-cn",
    en: "https://www.17track.net/en",
    de: "https://www.17track.net/de",
    fr: "https://www.17track.net/fr",
    es: "https://www.17track.net/es",
    it: "https://www.17track.net/it"
  };
  var FORM = {
    zh: ["鑫佰航询价", "货物", "目的地", "重量/体积", "联系人", "备注"],
    en: ["XBH Freight quote request", "Cargo", "Destination", "Weight / volume", "Contact", "Note"],
    de: ["XBH Frachtanfrage", "Ware", "Ziel", "Gewicht / Volumen", "Kontakt", "Hinweis"],
    fr: ["Demande de tarif XBH", "Marchandise", "Destination", "Poids / volume", "Contact", "Note"],
    es: ["Solicitud de tarifa XBH", "Mercancía", "Destino", "Peso / volumen", "Contacto", "Nota"],
    it: ["Richiesta tariffa XBH", "Merce", "Destinazione", "Peso / volume", "Contatto", "Nota"]
  };
  function detect() {
    var l = null;
    try { l = localStorage.getItem("xbh-lang"); } catch (e) {}
    return LANGS.indexOf(l) >= 0 ? l : "en";
  }
  function apply(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "en";
    LANGS.forEach(function (code) { root.classList.remove("lang-" + code); });
    if (lang !== "zh") root.classList.add("lang-" + lang);
    root.lang = HTML_LANG[lang];
    document.querySelectorAll(".lang-select").forEach(function (sel) { sel.value = lang; });
    try { localStorage.setItem("xbh-lang", lang); } catch (e) {}
    if (bar) bar.textContent = CALL[lang];
    document.querySelectorAll("[data-ph]").forEach(function (el) {
      var pack = PH[el.getAttribute("data-ph")];
      if (pack && pack[lang]) el.placeholder = pack[lang];
    });
    root.dataset.lang = lang;
    document.querySelectorAll("a[href*='17track.net']").forEach(function (a) {
      a.href = TRACK[lang] || TRACK.en;
    });
  }
  var bar = document.createElement("a");
  bar.className = "callbar";
  bar.href = "tel:+8617722422349";
  document.body.appendChild(bar);
  apply(detect());

  var wa = document.createElement("a");
  wa.className = "wa-btn";
  wa.href = "https://wa.me/message/NURIUSSACE2WH1";
  wa.target = "_blank";
  wa.rel = "noopener";
  wa.setAttribute("aria-label", "WhatsApp");
  wa.innerHTML = '<img src="assets/whatsapp.png" alt="" width="72" height="72" draggable="false">';
  document.body.appendChild(wa);
  var waDrag = false;
  var waMoved = false;
  var waStartX = 0;
  var waStartY = 0;
  var waOriginX = 0;
  var waOriginY = 0;
  function waSize() {
    return { w: wa.offsetWidth || 72, h: wa.offsetHeight || 72 };
  }
  function waClamp(x, y) {
    var pad = 8;
    var size = waSize();
    return {
      x: Math.min(window.innerWidth - size.w - pad, Math.max(pad, x)),
      y: Math.min(window.innerHeight - size.h - pad, Math.max(pad, y))
    };
  }
  function waDefault() {
    var size = waSize();
    var y = window.innerHeight - size.h - 18;
    if (window.matchMedia("(max-width: 720px)").matches) y -= 78;
    return waClamp(window.innerWidth - size.w - 16, y);
  }
  function waPlace() {
    var pos = null;
    try {
      var saved = JSON.parse(localStorage.getItem("xbh-wa") || "null");
      if (saved && typeof saved.x === "number" && typeof saved.y === "number") {
        pos = waClamp(saved.x * window.innerWidth, saved.y * window.innerHeight);
      }
    } catch (err) {}
    if (!pos) pos = waDefault();
    wa.style.left = pos.x + "px";
    wa.style.top = pos.y + "px";
  }
  waPlace();
  var waImg = wa.querySelector("img");
  if (waImg) waImg.addEventListener("load", waPlace);
  window.addEventListener("resize", waPlace);
  wa.addEventListener("pointerdown", function (ev) {
    if (ev.button && ev.button !== 0) return;
    waDrag = true;
    waMoved = false;
    waStartX = ev.clientX;
    waStartY = ev.clientY;
    var rect = wa.getBoundingClientRect();
    waOriginX = rect.left;
    waOriginY = rect.top;
    wa.classList.add("is-drag");
    if (wa.setPointerCapture) wa.setPointerCapture(ev.pointerId);
  });
  wa.addEventListener("pointermove", function (ev) {
    if (!waDrag) return;
    var dx = ev.clientX - waStartX;
    var dy = ev.clientY - waStartY;
    if (Math.abs(dx) + Math.abs(dy) > 6) waMoved = true;
    var pos = waClamp(waOriginX + dx, waOriginY + dy);
    wa.style.left = pos.x + "px";
    wa.style.top = pos.y + "px";
  });
  function waEnd() {
    if (!waDrag) return;
    waDrag = false;
    wa.classList.remove("is-drag");
    if (!waMoved) return;
    var rect = wa.getBoundingClientRect();
    try {
      localStorage.setItem("xbh-wa", JSON.stringify({
        x: rect.left / window.innerWidth,
        y: rect.top / window.innerHeight
      }));
    } catch (err) {}
  }
  wa.addEventListener("pointerup", waEnd);
  wa.addEventListener("pointercancel", waEnd);
  wa.addEventListener("click", function (ev) {
    if (!waMoved) return;
    ev.preventDefault();
    waMoved = false;
  });
  document.querySelectorAll(".lang-select").forEach(function (sel) {
    sel.addEventListener("change", function () { apply(sel.value); });
  });

  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".menu");
  function setMenu(open) {
    if (!toggle || !menu) return;
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "×" : "☰";
    document.body.classList.toggle("menu-open", open);
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("open"));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("click", function (ev) {
      if (!menu.classList.contains("open")) return;
      if (menu.contains(ev.target) || toggle.contains(ev.target)) return;
      setMenu(false);
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") setMenu(false);
    });
  }

  function showTab(btn) {
    var id = btn.getAttribute("data-tab");
    var scope = btn.closest("[data-tabs]") || document;
    scope.querySelectorAll("[data-tab]").forEach(function (b) {
      var on = b === btn;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    scope.querySelectorAll("[data-panel]").forEach(function (p) {
      p.classList.toggle("is-on", p.getAttribute("data-panel") === id);
    });
  }
  document.querySelectorAll(".tabs").forEach(function (el) { el.setAttribute("role", "tablist"); });
  document.querySelectorAll("[data-tab]").forEach(function (btn) {
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", btn.classList.contains("is-on") ? "true" : "false");
    btn.addEventListener("click", function () { showTab(btn); });
    btn.addEventListener("keydown", function (ev) {
      if (ev.key !== "ArrowRight" && ev.key !== "ArrowLeft") return;
      var scope = btn.closest("[data-tabs]") || document;
      var list = scope.querySelectorAll("[data-tab]");
      var idx = 0;
      for (var i = 0; i < list.length; i++) if (list[i] === btn) idx = i;
      var next = ev.key === "ArrowRight" ? idx + 1 : idx - 1;
      if (next < 0) next = list.length - 1;
      if (next >= list.length) next = 0;
      ev.preventDefault();
      showTab(list[next]);
      list[next].focus();
    });
  });

  var form = document.querySelector("#quote-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var viaWa = ev.submitter && ev.submitter.getAttribute("data-send") === "wa";
      var data = new FormData(form);
      var labels = FORM[root.dataset.lang] || FORM.zh;
      var lines = [
        labels[0],
        labels[1] + ": " + data.get("cargo"),
        labels[2] + ": " + data.get("dest"),
        labels[3] + ": " + data.get("wv"),
        labels[4] + ": " + data.get("who"),
        labels[5] + ": " + data.get("note")
      ];
      var text = lines.join("\n");
      if (viaWa) {
        window.open("https://wa.me/message/NURIUSSACE2WH1?text=" + encodeURIComponent(text), "_blank", "noopener");
      }
      var done = function () {
        var ok = document.querySelector("#form-ok");
        var waOk = document.querySelector("#form-wa");
        var button = ev.submitter || form.querySelector("button[type=submit]");
        if (button) button.classList.add("is-done");
        if (ok) ok.hidden = !!viaWa;
        if (waOk) waOk.hidden = !viaWa;
        var el = viaWa ? waOk : ok;
        if (el) {
          el.hidden = false;
          el.scrollIntoView({ block: "nearest" });
        }
      };
      var fallback = function () {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (err) {}
        document.body.removeChild(ta);
        done();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    });
  }

  var nav = document.querySelector(".nav");
  function markNav() {
    if (!nav) return;
    nav.classList.toggle("is-stuck", window.scrollY > 36);
  }
  markNav();
  window.addEventListener("scroll", markNav, { passive: true });

  var ticker = document.querySelector(".ticker-track");
  if (ticker && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      ticker.style.animationPlayState = entries[0].isIntersecting ? "running" : "paused";
    }).observe(ticker.parentElement || ticker);
  }
})();
