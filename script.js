/* =====================================================================
   ENGINE OPTIK LIQUID GLASS (Ringan 60fps — tanpa SVG displacement readback)
   ===================================================================== */

function initLiquidGlassOptics() {
  if (typeof LIQUID_GLASS_CONFIG === "undefined") return;
  const cfg = LIQUID_GLASS_CONFIG;
  const root = document.documentElement;
  root.style.setProperty("--lg-radius", `${cfg.cornerRadius}px`);
  root.style.setProperty("--lg-saturate", String(1 + cfg.saturation));
}

/**
 * Cahaya reaktif bergaya iOS Liquid Glass (dioptimalkan bebas layout thrashing):
 * Target di-cache sekali, fase baca (getBoundingClientRect) dipisah dari fase tulis CSS.
 */
function initCursorLight() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const PROXIMITY_RADIUS = 300;
  let targets = Array.from(document.querySelectorAll(".lg-panel, .header-nav a, .room-back-btn"));
  let pointerX = -9999;
  let pointerY = -9999;
  let rafPending = false;

  // Sediakan penyegaran daftar target setelah ruang acara dibuka
  window.__refreshGlassTargets = () => {
    targets = Array.from(document.querySelectorAll(".lg-panel, .header-nav a, .room-back-btn"));
  };

  function updateGlassLighting() {
    rafPending = false;
    const vh = window.innerHeight;
    const updates = [];

    // Fase 1: BACA seluruh posisi terlebih dahulu (mencegah forced reflow / layout thrashing)
    for (let i = 0; i < targets.length; i += 1) {
      const el = targets[i];
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.bottom < -PROXIMITY_RADIUS || rect.top > vh + PROXIMITY_RADIUS) {
        if (el._lgLit) updates.push({ el, lit: false });
        continue;
      }

      const dx = Math.max(rect.left - pointerX, 0, pointerX - rect.right);
      const dy = Math.max(rect.top - pointerY, 0, pointerY - rect.bottom);
      const dist = Math.hypot(dx, dy);

      if (dist < PROXIMITY_RADIUS) {
        const intensity = Math.pow(1 - dist / PROXIMITY_RADIUS, 1.5);
        updates.push({
          el,
          lit: true,
          mx: pointerX - rect.left,
          my: pointerY - rect.top,
          intensity
        });
      } else if (el._lgLit) {
        updates.push({ el, lit: false });
      }
    }

    // Fase 2: TULIS properti CSS sekaligus dalam satu batch
    for (let i = 0; i < updates.length; i += 1) {
      const u = updates[i];
      if (u.lit) {
        u.el._lgLit = true;
        u.el.style.setProperty("--mx", `${u.mx.toFixed(1)}px`);
        u.el.style.setProperty("--my", `${u.my.toFixed(1)}px`);
        u.el.style.setProperty("--lg-light", u.intensity.toFixed(3));
      } else {
        u.el._lgLit = false;
        u.el.style.setProperty("--lg-light", "0");
      }
    }
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
    targets.forEach((el) => {
      if (el._lgLit) {
        el._lgLit = false;
        el.style.setProperty("--lg-light", "0");
      }
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

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatAcaraTitle(judul, sorotan) {
  const safeTitle = String(judul || "");
  if (sorotan) {
    const idx = safeTitle.toLowerCase().indexOf(String(sorotan).toLowerCase());
    if (idx !== -1) {
      const before = safeTitle.slice(0, idx);
      const match = safeTitle.slice(idx, idx + sorotan.length);
      const after = safeTitle.slice(idx + sorotan.length);
      return `${escapeHtml(before)}<span class="acara-title-accent">${escapeHtml(match)}</span>${escapeHtml(after)}`;
    }
  }

  // Fallback otomatis: beri warna aksen pada 2 kata terakhir bila sorotan tidak diisi
  const words = safeTitle.trim().split(/\s+/);
  if (words.length <= 2) {
    return `<span class="acara-title-accent">${escapeHtml(safeTitle)}</span>`;
  }
  const lead = words.slice(0, -2).join(" ");
  const accent = words.slice(-2).join(" ");
  return `${escapeHtml(lead)} <span class="acara-title-accent">${escapeHtml(accent)}</span>`;
}

function getShowcaseItems() {
  if (typeof ACARA_LIST === "undefined") return [];
  const items = ACARA_LIST.map((item, index) => {
    const urutan = Number.parseInt(item.nomor, 10) || index + 1;
    return {
      nomor: item.nomor,
      labelKanan: `Acara ${urutan}`,
      eyebrow: `ACARA ${urutan}`,
      judul: item.judul,
      sorotan: item.sorotan,
      narasi: "",
      foto: item.foto || "",
      link: `acara.html?id=${encodeURIComponent(item.nomor)}`,
      external: false
    };
  });

  if (typeof STUDI_KASUS_ITEM !== "undefined" && STUDI_KASUS_ITEM) {
    items.push({
      nomor: STUDI_KASUS_ITEM.nomor || String(items.length + 1).padStart(2, "0"),
      labelKanan: STUDI_KASUS_ITEM.labelKanan || "Studi Kasus",
      eyebrow: STUDI_KASUS_ITEM.eyebrow || "STUDI KASUS",
      judul: STUDI_KASUS_ITEM.judul || "Studi Kasus Perencanaan Tambang",
      sorotan: STUDI_KASUS_ITEM.sorotan || "Perencanaan Tambang",
      narasi: STUDI_KASUS_ITEM.narasi || "",
      foto: STUDI_KASUS_ITEM.foto || "",
      link: STUDI_KASUS_ITEM.link || "#",
      external: Boolean(STUDI_KASUS_ITEM.external)
    });
  }

  return items;
}

function renderAcaraList() {
  const container = document.getElementById("acara-list");
  const previewStage = document.getElementById("acara-preview-stage");
  const showcaseItems = getShowcaseItems();
  if (!container || !showcaseItems.length) return;

  // 1. Render daftar vertikal urutan acara (Acara 1–8 + Studi Kasus) pada kolom kanan
  container.innerHTML = showcaseItems
    .map((item, index) => {
      const activeClass = index === 0 ? "is-active" : "";
      const extAttrs = item.external ? ' target="_blank" rel="noopener noreferrer"' : "";

      return `
        <a href="${item.link}"${extAttrs} class="acara-row ${activeClass}" data-acara-index="${index}">
          <div class="acara-row-content">
            <h3>${escapeHtml(item.labelKanan)}</h3>
          </div>
          <span class="acara-row-badge" aria-hidden="true">&rarr;</span>
        </a>
      `;
    })
    .join("");

  // 2. Render judul acara dwikromatik (atau narasi pendek Studi Kasus) pada kolom kiri sticky
  if (previewStage) {
    previewStage.innerHTML = showcaseItems
      .map((item, index) => {
        const activeClass = index === 0 ? "is-active" : "";
        const judulFormatted = formatAcaraTitle(item.judul, item.sorotan);
        const hasNarrativeClass = item.narasi ? " has-narrative" : "";
        const narrativeHtml = item.narasi
          ? `<p class="acara-preview-narrative">${escapeHtml(item.narasi)}</p>`
          : "";
        const inner = item.foto
          ? `<img src="${item.foto}" alt="${escapeHtml(item.labelKanan)}: ${escapeHtml(item.judul)}" />`
          : `<div class="acara-preview-fallback${hasNarrativeClass}">
               <span class="acara-preview-fallback-num">${escapeHtml(item.eyebrow)}</span>
               <strong class="acara-preview-fallback-title">${judulFormatted}</strong>
               ${narrativeHtml}
             </div>`;
        return `<div class="acara-preview-slide ${activeClass}" data-preview-index="${index}">${inner}</div>`;
      })
      .join("");
  }

  initAcaraStickySync(showcaseItems);
}

/**
 * Sinkronisasi scroll & hover bergaya PT Putra Perkasa Abadi:
 * Saat kolom kanan digulir, baris yang berada di titik fokus otomatis aktif
 * dan pratinjau judul/narasi pada kolom kiri ikut berpindah mulus.
 */
function initAcaraStickySync(showcaseItems) {
  const rows = Array.from(document.querySelectorAll(".acara-row"));
  if (!rows.length || !showcaseItems || !showcaseItems.length) return;

  const slides = Array.from(document.querySelectorAll(".acara-preview-slide"));
  const previewLink = document.getElementById("acara-preview-link");
  const counterEl = document.getElementById("acara-preview-counter");
  const progressFill = document.getElementById("acara-preview-progress-fill");
  const total = showcaseItems.length;
  let activeIndex = 0;

  function setActiveAcara(index) {
    if (index < 0 || index >= total) return;
    activeIndex = index;
    const current = showcaseItems[index];

    rows.forEach((row, i) => row.classList.toggle("is-active", i === index));
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));

    if (previewLink) {
      previewLink.setAttribute("href", current.link);
      if (current.external) {
        previewLink.setAttribute("target", "_blank");
        previewLink.setAttribute("rel", "noopener noreferrer");
      } else {
        previewLink.removeAttribute("target");
        previewLink.removeAttribute("rel");
      }
    }
    if (counterEl) {
      counterEl.textContent = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    }
    if (progressFill) progressFill.style.width = `${((index + 1) / total) * 100}%`;
  }

  // Hover langsung pada salah satu baris juga memindahkan pratinjau kiri
  rows.forEach((row, idx) => {
    row.addEventListener("mouseenter", () => setActiveAcara(idx));
    row.addEventListener("focus", () => setActiveAcara(idx));
  });

  // Hitung baris yang paling dekat dengan garis fokus saat halaman digulir
  let rafPending = false;
  function syncOnScroll() {
    rafPending = false;
    const focusY = window.innerWidth <= 860 ? window.innerHeight * 0.56 : window.innerHeight * 0.45;
    let closestIdx = activeIndex;
    let closestDist = Infinity;

    rows.forEach((row, idx) => {
      const rect = row.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const dist = Math.abs(center - focusY);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeIndex) {
      setActiveAcara(closestIdx);
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(syncOnScroll);
      }
    },
    { passive: true }
  );

  setActiveAcara(0);
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
            href="https://api.whatsapp.com/send/?phone=${asisten.wa}&text&type=phone_number&app_absent=0"
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

      const studiKasusLink =
        typeof STUDI_KASUS_ITEM !== "undefined" && STUDI_KASUS_ITEM.link
          ? STUDI_KASUS_ITEM.link
          : "index.html?from=acara#acara-showcase";

      const nextHtml = nextAcara
        ? `<a href="acara.html?id=${encodeURIComponent(nextAcara.nomor)}" class="room-nav-card room-nav-next lg-panel">
             <span class="room-nav-dir">Acara Berikutnya &rarr;</span>
             <strong>Acara ${nextAcara.nomor}: ${nextAcara.judul}</strong>
           </a>`
        : `<a href="${studiKasusLink}" target="_blank" rel="noopener noreferrer" class="room-nav-card room-nav-next lg-panel">
             <span class="room-nav-dir">Lanjut ke Tahap Akhir &rarr;</span>
             <strong>Studi Kasus Perencanaan Tambang</strong>
           </a>`;

      footerNavEl.innerHTML = `${prevHtml}${nextHtml}`;
    }

    const gateEl = document.getElementById("room-gate");
    const protectedEl = document.getElementById("room-protected-content");
    if (gateEl) gateEl.hidden = true;
    if (protectedEl) {
      protectedEl.hidden = false;
      protectedEl.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      if (typeof window.__refreshGlassTargets === "function") {
        window.__refreshGlassTargets();
      }
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
