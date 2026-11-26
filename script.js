/* =====================================================================
   ENGINE OPTIK LIQUID GLASS (Peta Pembiasan Lensa + Cahaya Reaktif Kursor)
   Catatan: Data acara, asisten, & parameter kaca berada di file data.js
   ===================================================================== */

/**
 * Menghasilkan peta normal permukaan lensa bevel (displacement map) pada canvas
 * sesuai parameter Corner Radius (32), Z-Radius (30), Refraction (0.88),
 * Distortion (0.13), dan Chromatic Aberration (0.055), lalu memasangkannya ke filter SVG.
 */
function initLiquidGlassOptics() {
  if (typeof LIQUID_GLASS_CONFIG === "undefined") return;
  const cfg = LIQUID_GLASS_CONFIG;
  const imgEl = document.getElementById("lg-displacement-image");
  const dispR = document.getElementById("lg-disp-r");
  const dispG = document.getElementById("lg-disp-g");
  const dispB = document.getElementById("lg-disp-b");
  const satEl = document.getElementById("lg-saturate");

  const root = document.documentElement;
  root.style.setProperty("--lg-blur", `${cfg.blurAmount}px`);
  root.style.setProperty("--lg-radius", `${cfg.cornerRadius}px`);
  root.style.setProperty("--lg-edge-highlight", String(cfg.edgeHighlight));
  root.style.setProperty("--lg-specular", String(cfg.specular));
  root.style.setProperty("--lg-shadow-opacity", String(cfg.shadowOpacity));
  root.style.setProperty("--lg-shadow-spread", `${cfg.shadowSpread}px`);
  root.style.setProperty("--lg-saturate", String(1 + cfg.saturation));

  if (!imgEl) return;

  const w = 256;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  const rx = 0.5;
  const ry = 0.5;
  const cornerNorm = Math.min(0.24, (cfg.cornerRadius / 256) * 1.15);
  const bevelWidth = Math.min(0.24, (cfg.zRadius / 256) * 1.35);

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const u = (x + 0.5) / w - 0.5;
      const v = (y + 0.5) / h - 0.5;

      const qx = Math.abs(u) - (rx - cornerNorm);
      const qy = Math.abs(v) - (ry - cornerNorm);
      const outX = Math.max(qx, 0);
      const outY = Math.max(qy, 0);
      const outsideDist = Math.hypot(outX, outY);
      const insideDist = Math.min(Math.max(qx, qy), 0);
      const sdf = outsideDist + insideDist - cornerNorm;
      const distFromEdge = Math.max(0, -sdf);

      let nx = 0;
      let ny = 0;

      if (distFromEdge < bevelWidth) {
        const t = 1 - distFromEdge / bevelWidth;
        const curve = Math.pow(t, 2.15) * (1 + cfg.distortion * 1.8);

        let gx = 0;
        let gy = 0;
        if (qx > 0 || qy > 0) {
          const len = Math.hypot(outX, outY) || 1;
          gx = (outX / len) * Math.sign(u || 1);
          gy = (outY / len) * Math.sign(v || 1);
        } else if (qx > qy) {
          gx = Math.sign(u || 1);
        } else {
          gy = Math.sign(v || 1);
        }

        nx = gx * curve;
        ny = gy * curve;
      }

      const idx = (y * w + x) * 4;
      data[idx] = Math.round(Math.max(0, Math.min(255, 128 + nx * 127)));
      data[idx + 1] = Math.round(Math.max(0, Math.min(255, 128 + ny * 127)));
      data[idx + 2] = 128;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const dataUrl = canvas.toDataURL("image/png");
  imgEl.setAttribute("href", dataUrl);
  imgEl.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", dataUrl);

  const baseScale = Math.round(cfg.refraction * 26 * (1 + cfg.distortion));
  const chromaDelta = Math.max(2, Math.round(cfg.chromaticAberration * 90));

  if (dispR) dispR.setAttribute("scale", String(baseScale + chromaDelta));
  if (dispG) dispG.setAttribute("scale", String(baseScale));
  if (dispB) dispB.setAttribute("scale", String(Math.max(0, baseScale - chromaDelta)));
  if (satEl) satEl.setAttribute("values", String(1 + cfg.saturation));
}

/**
 * Cahaya reaktif bergaya iOS Liquid Glass pada permukaan & tepian panel kaca
 */
function initCursorLight() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const PROXIMITY_RADIUS = 320;
  let pointerX = -9999;
  let pointerY = -9999;
  let rafPending = false;

  function getGlassTargets() {
    return document.querySelectorAll(".lg-panel, .acara-item, .header-nav a, .room-back-btn");
  }

  function updateGlassLighting() {
    rafPending = false;
    const targets = getGlassTargets();

    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -PROXIMITY_RADIUS || rect.top > window.innerHeight + PROXIMITY_RADIUS) {
        return;
      }

      const dx = Math.max(rect.left - pointerX, 0, pointerX - rect.right);
      const dy = Math.max(rect.top - pointerY, 0, pointerY - rect.bottom);
      const dist = Math.hypot(dx, dy);

      if (dist < PROXIMITY_RADIUS) {
        const linear = 1 - dist / PROXIMITY_RADIUS;
        const intensity = Math.pow(linear, 1.5);
        el.style.setProperty("--mx", `${pointerX - rect.left}px`);
        el.style.setProperty("--my", `${pointerY - rect.top}px`);
        el.style.setProperty("--lg-light", intensity.toFixed(3));
      } else if (el.style.getPropertyValue("--lg-light") !== "0") {
        el.style.setProperty("--lg-light", "0");
      }
    });
  }

  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "touch") return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateGlassLighting);
      }
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", () => {
    getGlassTargets().forEach((el) => {
      el.style.setProperty("--lg-light", "0");
    });
  });
}

/* =====================================================================
   RENDER HALAMAN BERANDA (index.html)
   ===================================================================== */

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function renderAcaraList() {
  const container = document.getElementById("acara-list");
  if (!container || typeof ACARA_LIST === "undefined") return;

  container.innerHTML = ACARA_LIST.map((item, index) => {
    const isReversed = index % 2 === 1 ? "is-reversed" : "";
    const roomUrl = `acara.html?id=${encodeURIComponent(item.nomor)}`;
    const visualContent = item.foto
      ? `<img src="${item.foto}" alt="Acara ${item.nomor}: ${item.judul}" />`
      : `<div class="acara-placeholder-graphic">
           <div>
             <span>ACARA ${item.nomor}</span>
             <small>Klik untuk masuk ruang acara</small>
           </div>
         </div>`;

    return `
      <article class="acara-item ${isReversed} reveal">
        <a href="${roomUrl}" class="acara-visual">
          ${visualContent}
        </a>
        <div class="acara-body">
          <span class="acara-body-kicker">ACARA ${item.nomor}</span>
          <h3>${item.judul}</h3>
          <p>${item.deskripsi}</p>
          <a href="${roomUrl}" class="acara-drive-btn">
            Masuk Ruang Acara &rarr;
          </a>
        </div>
      </article>
    `;
  }).join("");
}

function renderAsistenGrid() {
  const container = document.getElementById("asisten-grid");
  if (!container || typeof ASISTEN_LIST === "undefined") return;

  container.innerHTML = ASISTEN_LIST.map((asisten) => {
    const photoHtml = asisten.foto
      ? `<img src="${asisten.foto}" alt="Foto ${asisten.nama}" />`
      : `<span class="asisten-initials">${getInitials(asisten.nama)}</span>`;

    return `
      <div class="asisten-card lg-panel reveal" tabindex="0" role="button" aria-expanded="false">
        <div class="asisten-photo-wrap">${photoHtml}</div>
        <div class="asisten-info">
          <span>${asisten.peran}</span>
          <strong>${asisten.nama}</strong>
        </div>
        <div class="asisten-menu" role="menu">
          <span class="asisten-menu-title">HUBUNGI ${asisten.nama.toUpperCase()}</span>
          <a
            href="https://wa.me/${asisten.wa}"
            target="_blank"
            rel="noopener noreferrer"
            class="asisten-contact-link link-wa"
          >WhatsApp</a>
          <a
            href="https://www.instagram.com/${asisten.ig}/"
            target="_blank"
            rel="noopener noreferrer"
            class="asisten-contact-link link-ig"
          >Instagram</a>
        </div>
      </div>
    `;
  }).join("");
}

/* =====================================================================
   RENDER HALAMAN RUANG ACARA / BREAKOUT ROOM (acara.html?id=XX)
   ===================================================================== */

function renderAcaraRoom() {
  if (!document.body.classList.contains("page-acara-room") || typeof ACARA_LIST === "undefined") {
    return;
  }

  // Tandai bahwa pengguna berada di halaman acara agar saat kembali (tombol, back browser, atau swipe back)
  // beranda selalu menampilkan transisi cepat logo lab 0,2 detik.
  try {
    sessionStorage.setItem("simkom_from_acara", "1");
  } catch (_) {
    // Abaikan jika penyimpanan dibatasi
  }

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id") || ACARA_LIST[0].nomor;
  let currentIndex = ACARA_LIST.findIndex((item) => item.nomor === requestedId);
  if (currentIndex === -1) currentIndex = 0;

  const acara = ACARA_LIST[currentIndex];
  const prevAcara = currentIndex > 0 ? ACARA_LIST[currentIndex - 1] : null;
  const nextAcara = currentIndex < ACARA_LIST.length - 1 ? ACARA_LIST[currentIndex + 1] : null;
  const labelRomawi = acara.romawi || acara.nomor;

  document.title = `Diproteksi: Acara ${labelRomawi} — Lab Simkom UPN Yogyakarta`;

  const headerTitle = document.getElementById("room-header-title");
  if (headerTitle) headerTitle.textContent = `Acara ${acara.nomor}`;

  const codeBadge = document.getElementById("room-code-badge");
  if (codeBadge) codeBadge.textContent = `ACARA ${acara.nomor}`;

  // 1. Bar pintasan pindah ruang acara (01 - 08)
  const switcherEl = document.getElementById("room-switcher");
  if (switcherEl) {
    switcherEl.innerHTML =
      `<span class="room-switcher-label">RUANG ACARA:</span>` +
      ACARA_LIST.map((item) => {
        const activeClass = item.nomor === acara.nomor ? "is-active" : "";
        return `<a href="acara.html?id=${encodeURIComponent(item.nomor)}" class="room-switch-pill ${activeClass}" title="Acara ${item.nomor}: ${item.judul}">${item.nomor}</a>`;
      }).join("");
  }

  // Fungsi merender isi ruang acara setelah sandi valid
  function unlockAndPopulateRoom() {
    document.title = `Acara ${acara.nomor}: ${acara.judul} — Lab Simkom UPN Yogyakarta`;

    const heroEl = document.getElementById("room-hero");
    if (heroEl) {
      const visualHtml = acara.foto
        ? `<img src="${acara.foto}" alt="Acara ${acara.nomor}: ${acara.judul}" />`
        : `<div class="acara-placeholder-graphic">
             <div>
               <span>ACARA ${acara.nomor}</span>
             </div>
           </div>`;

      heroEl.innerHTML = `
        <div class="room-hero-copy">
          <h1 class="room-hero-title">${acara.judul}</h1>
          <p class="room-hero-desc">${acara.deskripsi}</p>
        </div>
        <div class="room-hero-visual">
          ${visualHtml}
        </div>
      `;
    }

    const resourcesEl = document.getElementById("room-resources");
    if (resourcesEl) {
      resourcesEl.innerHTML = (acara.berkas || [])
        .map(
          (file) => `
          <a
            href="${file.link}"
            target="_blank"
            rel="noopener noreferrer"
            class="doc-card lg-panel reveal"
          >
            <h3>${file.judul}</h3>
            <p>${file.keterangan}</p>
            <span class="doc-link-label">${file.labelTombol || "Buka Tautan"} &rarr;</span>
          </a>
        `
        )
        .join("");
    }

    const tujuanEl = document.getElementById("room-tujuan");
    if (tujuanEl) {
      tujuanEl.innerHTML = (acara.tujuan || []).map((t) => `<li>${t}</li>`).join("");
    }

    const langkahEl = document.getElementById("room-langkah");
    if (langkahEl) {
      langkahEl.innerHTML = (acara.langkah || []).map((l) => `<li>${l}</li>`).join("");
    }

    const catatanEl = document.getElementById("room-catatan");
    if (catatanEl) {
      catatanEl.textContent = acara.catatan || "Hubungi tim asisten jika mengalami kendala selama pengerjaan.";
    }

    const footerNavEl = document.getElementById("room-footer-nav");
    if (footerNavEl) {
      const prevHtml = prevAcara
        ? `<a href="acara.html?id=${encodeURIComponent(prevAcara.nomor)}" class="room-nav-card lg-panel">
             <span class="room-nav-dir">&larr; Acara Sebelumnya</span>
             <strong>Acara ${prevAcara.nomor}: ${prevAcara.judul}</strong>
           </a>`
        : `<div class="room-nav-spacer"></div>`;

      const nextHtml = nextAcara
        ? `<a href="acara.html?id=${encodeURIComponent(nextAcara.nomor)}" class="room-nav-card room-nav-next lg-panel">
             <span class="room-nav-dir">Acara Berikutnya &rarr;</span>
             <strong>Acara ${nextAcara.nomor}: ${nextAcara.judul}</strong>
           </a>`
        : `<a href="index.html?from=acara#buku-panduan" class="room-nav-card room-nav-next lg-panel">
             <span class="room-nav-dir">Lanjut ke Tahap Akhir &rarr;</span>
             <strong>Studi Kasus &amp; Buku Panduan</strong>
           </a>`;

      footerNavEl.innerHTML = `${prevHtml}${nextHtml}`;
    }

    const gateEl = document.getElementById("room-gate");
    const protectedEl = document.getElementById("room-protected-content");
    if (gateEl) gateEl.hidden = true;
    if (protectedEl) {
      protectedEl.hidden = false;
      protectedEl.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    }
  }

  // 2. Siapkan Gerbang Password Acara
  const gateEl = document.getElementById("room-gate");
  const gateTitle = document.getElementById("room-gate-title");
  const gateForm = document.getElementById("room-gate-form");
  const passwordInput = document.getElementById("room-password-input");
  const gateError = document.getElementById("room-gate-error");

  if (!gateEl || !gateForm || !passwordInput) {
    unlockAndPopulateRoom();
    return;
  }

  if (gateTitle) gateTitle.textContent = `Diproteksi: Acara ${labelRomawi}`;
  passwordInput.focus();

  gateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const entered = passwordInput.value.trim();
    const expected = String(acara.password ?? "");

    if (entered === expected) {
      if (gateError) gateError.hidden = true;
      unlockAndPopulateRoom();
    } else {
      if (gateError) {
        gateError.textContent = `Sandi untuk Acara ${labelRomawi} tidak sesuai. Silakan coba lagi.`;
        gateError.hidden = false;
      }
      gateEl.classList.remove("is-shake");
      void gateEl.offsetWidth; // trigger reflow untuk mengulang animasi getar
      gateEl.classList.add("is-shake");
      passwordInput.select();
    }
  });
}

/* =====================================================================
   INTERAKSI UMUM (SPLASH, MENU ASISTEN, SCROLL REVEAL)
   ===================================================================== */

function initSplashAndGreeting() {
  const overlay = document.getElementById("splash-overlay");
  const skipBtn = document.getElementById("splash-skip");
  const typedTarget = document.getElementById("typed-greeting");
  if (!overlay && !typedTarget) return;

  const greetingText = "Halo, Praktikan!";
  let greetingStarted = false;
  let hideTimer = null;

  function startTyping(instant = false) {
    if (greetingStarted || !typedTarget) return;
    greetingStarted = true;
    if (instant) {
      typedTarget.textContent = greetingText;
      return;
    }
    let i = 0;
    const timer = setInterval(() => {
      typedTarget.textContent += greetingText[i];
      i += 1;
      if (i >= greetingText.length) clearInterval(timer);
    }, 65);
  }

  function closeSplash(instantGreeting = false) {
    if (!overlay || overlay.classList.contains("is-hidden")) return;
    overlay.classList.add("is-hidden");
    startTyping(instantGreeting);
  }

  function clearReturnFlag() {
    try {
      sessionStorage.removeItem("simkom_from_acara");
    } catch (_) {}
    try {
      if (window.location.search.includes("from=acara")) {
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState(null, "", cleanUrl);
      }
    } catch (_) {}
  }

  function playQuickLogoTransition() {
    if (!overlay) return;
    clearReturnFlag();
    if (hideTimer) clearTimeout(hideTimer);

    // Tampilkan logo secara instan tanpa kedipan lalu hilangkan setelah 0,2 detik
    overlay.style.transition = "none";
    overlay.classList.add("is-quick-return");
    overlay.classList.remove("is-hidden");
    void overlay.offsetWidth;
    overlay.style.transition = "";

    hideTimer = setTimeout(() => {
      closeSplash(true);
    }, 200);
  }

  // Tangani kembalinya halaman dari bfcache (tombol Back browser & swipe back di HP)
  window.addEventListener("pageshow", (event) => {
    let fromStorage = false;
    try {
      fromStorage = sessionStorage.getItem("simkom_from_acara") === "1";
    } catch (_) {}

    if (event.persisted || fromStorage) {
      playQuickLogoTransition();
    }
  });

  // Transisi cepat 0,2 detik jika halaman beranda dimuat ulang setelah keluar dari acara
  if (overlay && overlay.classList.contains("is-quick-return")) {
    clearReturnFlag();
    hideTimer = setTimeout(() => closeSplash(true), 200);
    return;
  }

  if (skipBtn) skipBtn.addEventListener("click", () => closeSplash(false));
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeSplash(false);
    });
  }
  hideTimer = setTimeout(() => closeSplash(false), 3200);
}

function initAsistenCarousel() {
  const track = document.getElementById("asisten-grid");
  if (!track) return;

  const prevBtn = document.getElementById("asisten-prev");
  const nextBtn = document.getElementById("asisten-next");
  const scrollStep = 282;

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -scrollStep, behavior: "smooth" });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: scrollStep, behavior: "smooth" });
    });
  }

  // Geser horizontal dengan tahan-klik mouse (drag to scroll) di desktop
  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let draggedDistance = 0;

  track.addEventListener("mousedown", (e) => {
    if (e.button !== 0 || e.target.closest("a")) return;
    isDown = true;
    draggedDistance = 0;
    startX = e.pageX - track.offsetLeft;
    startScrollLeft = track.scrollLeft;
    track.classList.add("is-dragging");
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    const x = e.pageX - track.offsetLeft;
    const walk = x - startX;
    draggedDistance = Math.abs(walk);
    if (draggedDistance > 4) {
      e.preventDefault();
      track.scrollLeft = startScrollLeft - walk * 1.15;
    }
  });

  window.addEventListener("mouseup", () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove("is-dragging");
    if (draggedDistance > 6) {
      track.dataset.justDragged = "1";
      setTimeout(() => {
        delete track.dataset.justDragged;
      }, 80);
    }
  });
}

function initAssistantContactMenus() {
  const track = document.getElementById("asisten-grid");
  const cards = document.querySelectorAll(".asisten-card");
  if (!cards.length) return;

  function closeAll() {
    cards.forEach((card) => {
      card.classList.remove("is-open");
      card.setAttribute("aria-expanded", "false");
    });
  }

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      if (track && track.dataset.justDragged === "1") return;
      const alreadyOpen = card.classList.contains("is-open");
      closeAll();
      if (!alreadyOpen) {
        card.classList.add("is-open");
        card.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".asisten-card")) closeAll();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  elements.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year-now");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initLiquidGlassOptics();
  renderAcaraList();
  renderAsistenGrid();
  renderAcaraRoom();
  initSplashAndGreeting();
  initAsistenCarousel();
  initAssistantContactMenus();
  initScrollReveal();
  initCursorLight();
});
