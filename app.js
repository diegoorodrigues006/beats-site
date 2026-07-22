/* ── Constants ── */
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS42I_YX0kzYxpH6143oUulw6EQYS8wLwhQV72F8EmfS0d7-rJyJIMu2fEUrIPWKMHuih8Ffk4DARX8/pub?output=csv";

const API_URL =
  "https://script.google.com/macros/s/AKfycbyty7nVgl-tYlk9YEjani2-3msDihw06HZf7JrNHCQ/dev";
const WA_NUMBER = "553171821903";

const GENRES = ["trap", "boombap", "detroit", "funk", "experimental"];

const GENRE_IMAGES = {
  trap: "https://raw.githubusercontent.com/diegoorodrigues006/beats-site/main/corpo/beats-trap.jpeg",
  boombap: "https://raw.githubusercontent.com/diegoorodrigues006/beats-site/main/corpo/beats-boombap.jpeg",
  detroit: "https://raw.githubusercontent.com/diegoorodrigues006/beats-site/main/corpo/beats-detroit.jpeg",
  funk: "https://raw.githubusercontent.com/diegoorodrigues006/beats-site/main/corpo/beats-funk.jpeg",
  experimental: "https://raw.githubusercontent.com/diegoorodrigues006/beats-site/main/corpo/beats-experimental.jpeg",
};

const GENRE_COLORS = {
  trap: "#ccff00",
  boombap: "#ccff00",
  detroit: "#ccff00",
  funk: "#ccff00",
  experimental: "#ccff00",
};

const MARQUEE_WORDS = ["TRAP", "BOOMBAP", "DETROIT", "FUNK", "EXPERIMENTAL", "PROD.KAIKY", "BEATS", "AUTORAL"];

/* ── State ── */
const state = {
  beats: [],
  currentBeat: null,
  currentPlaylist: [],
  isPlaying: false,
  progress: 0,
  currentTime: 0,
  duration: 0,
  totalPlays: 0,
};

let ytPlayer = null;
let progressInterval = null;

/* ── SISTEMA DE CONTADORES DE PLAYS GLOBAIS (GOOGLE SHEETS) ── */
async function carregarPlaysGlobais() {
  // 1. Carrega imediatamente o último valor do cache local para não exibir zero
  const cachedPlays = localStorage.getItem("cachedTotalPlays");
  if (cachedPlays !== null) {
    state.totalPlays = parseInt(cachedPlays) || 0;
    updatePlaysUI();
  }

  try {
    // 2. Busca o valor atualizado na planilha via API
    const res = await fetch(API_URL);
    const data = await res.json();
    if (data && typeof data.total_plays !== "undefined") {
      state.totalPlays = parseInt(data.total_plays) || 0;
      localStorage.setItem("cachedTotalPlays", state.totalPlays);
      updatePlaysUI();
    }
  } catch (e) {
    console.error("Erro ao carregar plays globais da planilha:", e);
  }
}

function incrementarPlaysGlobais() {
  // Incrementa na hora para dar retorno instantâneo na interface
  state.totalPlays += 1;
  localStorage.setItem("cachedTotalPlays", state.totalPlays);
  updatePlaysUI();

  // Envia a requisição para somar +1 na planilha
  fetch(`${API_URL}?action=increment`)
    .then((res) => res.json())
    .then((data) => {
      if (data && typeof data.total_plays !== "undefined") {
        state.totalPlays = parseInt(data.total_plays) || 0;
        localStorage.setItem("cachedTotalPlays", state.totalPlays);
        updatePlaysUI();
      }
    })
    .catch((err) => console.error("Erro ao incrementar play global:", err));
}

function updatePlaysUI() {
  const heroPlays = document.getElementById("hero-plays-count");
  if (heroPlays) {
    heroPlays.textContent = state.totalPlays;
  }
  const elPlays = document.getElementById("nav-total-plays");
  if (elPlays) {
    elPlays.textContent = state.totalPlays;
  }
}

/* ── CSV Parser ── */
function parseCSVLine(line) {
  const cols = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === "," && !inQuotes) { cols.push(cur); cur = ""; }
    else { cur += ch; }
  }
  cols.push(cur);
  return cols;
}

function clean(s) {
  if (!s) return "";
  return s.trim().replace(/^["']+|["']+$/g, "").replace(/""/g, '"').trim();
}

/* ── Load beats from Google Sheets ── */
async function loadBeats() {
  try {
    const res = await fetch(SHEET_URL);
    const csv = await res.text();
    const lines = csv.split(/\r?\n/);
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = parseCSVLine(line);
      const id = clean(cols[0]);
      const nome = clean(cols[2]);
      if (!id || !nome) continue;
      result.push({
        idYoutube: id,
        artista: clean(cols[1]) || "KAIKY PROD",
        nome,
        genero: clean(cols[3]).toLowerCase() || "trap",
        preco: clean(cols[4]) || "R$ 60,00",
      });
    }
    state.beats = result;
  } catch (e) {
    state.beats = [
      { idYoutube: "lz3mW653CL8", artista: "KAIKY PROD", nome: "brandao #1", genero: "trap", preco: "R$ 60,00" }
    ];
  }
}

/* ── YouTube IFrame API ── */
window.onYouTubeIframeAPIReady = function () {
  const container = document.createElement("div");
  container.id = "yt-player-container";
  container.style.cssText = "position:fixed;bottom:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
  document.body.appendChild(container);

  ytPlayer = new YT.Player("yt-player-container", {
    width: "1",
    height: "1",
    playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, rel: 0 },
    events: {
      onStateChange: onPlayerStateChange,
      onReady: () => { /* player ready */ },
    },
  });
};

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    state.isPlaying = true;
    incrementarPlaysGlobais(); // Incrementa o contador global na planilha
    startProgressTimer();
    updatePlayerUI();
  } else if (event.data === YT.PlayerState.PAUSED) {
    state.isPlaying = false;
    stopProgressTimer();
    updatePlayerUI();
  } else if (event.data === YT.PlayerState.ENDED) {
    next();
  }
}

function startProgressTimer() {
  stopProgressTimer();
  progressInterval = setInterval(() => {
    if (!ytPlayer || typeof ytPlayer.getPlayerState !== "function") return;
    if (ytPlayer.getPlayerState() === 1) {
      const t = ytPlayer.getCurrentTime();
      const d = ytPlayer.getDuration();
      if (d > 0) {
        state.currentTime = t;
        state.duration = d;
        state.progress = (t / d) * 100;
        updateProgressUI();
      }
    }
  }, 500);
}

function stopProgressTimer() {
  if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
}

/* ── Player controls ── */
function isSameBeat(beat) {
  return !!state.currentBeat && state.currentBeat.idYoutube === beat.idYoutube;
}

function play(beat, playlist = null) {
  if (!beat) return;

  if (playlist) {
    state.currentPlaylist = playlist;
  }

  state.currentBeat = beat;
  state.currentTime = 0;
  state.duration = 0;
  state.progress = 0;

  if (ytPlayer && ytPlayer.loadVideoById) {
    ytPlayer.loadVideoById(beat.idYoutube);
    state.isPlaying = true;
    startProgressTimer();
  }

  showPlayer();
  updatePlayerUI();
  highlightActiveCards();
}

function toggleBeatPlayback(beat, event, playlist = null) {
  if (!beat) return;

  if (playlist) {
    state.currentPlaylist = playlist;
  }

  const target = event?.target;
  if (target instanceof Element && target.closest(".beat-buy")) return;

  if (isSameBeat(beat)) {
    if (state.isPlaying) {
      ytPlayer?.pauseVideo?.();
      state.isPlaying = false;
      stopProgressTimer();
    } else {
      ytPlayer?.playVideo?.();
      state.isPlaying = true;
      startProgressTimer();
    }
  } else {
    play(beat, playlist);
    return;
  }

  showPlayer();
  updatePlayerUI();
}

function togglePlay() {
  if (!state.currentBeat) return;

  if (state.isPlaying) {
    ytPlayer?.pauseVideo?.();
    state.isPlaying = false;
    stopProgressTimer();
  } else {
    ytPlayer?.playVideo?.();
    state.isPlaying = true;
    startProgressTimer();
  }

  showPlayer();
  updatePlayerUI();
}

function next() {
  const list = state.currentPlaylist.length ? state.currentPlaylist : state.beats;
  if (!list.length || !state.currentBeat) return;
  const idx = list.findIndex(b => b.idYoutube === state.currentBeat.idYoutube);
  const nextBeat = list[(idx + 1) % list.length];
  if (nextBeat) play(nextBeat, list);
}

function prev() {
  const list = state.currentPlaylist.length ? state.currentPlaylist : state.beats;
  if (!list.length || !state.currentBeat) return;
  const idx = list.findIndex(b => b.idYoutube === state.currentBeat.idYoutube);
  const prevBeat = list[(idx - 1 + list.length) % list.length];
  if (prevBeat) play(prevBeat, list);
}

/* ── Player UI ── */
function showPlayer() {
  const player = document.getElementById("global-player");
  if (player) {
    player.classList.add("visible");
    document.body.classList.add("player-open");
  }
}

function updatePlayerUI() {
  const beat = state.currentBeat;
  if (!beat) return;

  const art = document.getElementById("player-art");
  const title = document.getElementById("player-title");
  const playBtn = document.getElementById("player-play-btn");
  const waveform = document.getElementById("player-waveform");

  if (art) {
    art.style.backgroundImage = `url(https://img.youtube.com/vi/${beat.idYoutube}/hqdefault.jpg)`;
  }
  if (title) title.textContent = beat.nome;
  if (playBtn) {
    playBtn.classList.toggle("playing", state.isPlaying);
    playBtn.innerHTML = state.isPlaying
      ? `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
      : `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  }
  if (waveform) {
    waveform.classList.toggle("paused", !state.isPlaying);
  }

  highlightActiveCards();
}

function updateProgressUI() {
  const fill = document.getElementById("player-progress-fill");
  const time = document.getElementById("player-time");
  if (fill) fill.style.width = state.progress + "%";
  if (time) time.textContent = fmt(state.currentTime) + " / " + fmt(state.duration);
}

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

function highlightActiveCards() {
  document.querySelectorAll(".beat-card").forEach(card => {
    const isActive = state.currentBeat && card.dataset.id === state.currentBeat.idYoutube;
    card.classList.toggle("active", isActive);

    const name = card.querySelector(".beat-name");
    if (name) name.classList.toggle("playing", isActive);

    const badge = card.querySelector(".beat-active-badge");
    if (badge) badge.style.display = isActive ? "block" : "none";

    const playIcon = card.querySelector(".beat-thumb-overlay .beat-play-btn svg");
    if (playIcon && isActive && state.isPlaying) {
      playIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
    } else if (playIcon) {
      playIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
    }
  });
}

/* ── Render helpers ── */
function renderBeatCard(beat, playlist = null) {
  const div = document.createElement("div");
  div.className = "beat-card" + (state.currentBeat?.idYoutube === beat.idYoutube ? " active" : "");
  div.dataset.id = beat.idYoutube;
  const isActive = state.currentBeat?.idYoutube === beat.idYoutube;

  div.innerHTML = `
    <div class="beat-thumb">
      <img src="https://img.youtube.com/vi/${beat.idYoutube}/hqdefault.jpg" alt="${escHtml(beat.nome)}" loading="lazy">
      <div class="beat-thumb-overlay">
        <div class="beat-play-btn">
          <svg viewBox="0 0 24 24" style="fill:#000;width:20px;height:20px;">
            <path d="${isActive && state.isPlaying ? "M6 19h4V5H6v14zm8-14v14h4V5h-4z" : "M8 5v14l11-7z"}"/>
          </svg>
        </div>
      </div>
      <div class="beat-active-badge" style="display:${isActive ? "block" : "none"}">▶</div>
      <div class="beat-genre-tag">${escHtml(beat.genero)}</div>
    </div>
    <div class="beat-info">
      <p class="beat-name${isActive ? " playing" : ""}">${escHtml(beat.nome)}</p>
      <button class="beat-buy" data-nome="${escHtml(beat.nome)}" data-preco="${escHtml(beat.preco)}">${escHtml(beat.preco)}</button>
    </div>
  `;

  div.addEventListener("click", (e) => {
    toggleBeatPlayback(beat, e, playlist);
  });

  div.querySelector(".beat-buy").addEventListener("click", (e) => {
    e.stopPropagation();
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Tenho interesse no beat: " + beat.nome + " - " + beat.preco)}`;
    window.open(url, "_blank");
  });

  return div;
}

function renderSkeletons(container, count, width, height) {
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const div = document.createElement("div");
    div.className = "skeleton";
    div.style.cssText = `width:${width}px;height:${height}px;flex-shrink:0;`;
    container.appendChild(div);
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ── Global Player HTML injection ── */
function injectGlobalPlayer() {
  if (document.getElementById("global-player")) return;
  const html = `
    <div id="global-player">
      <div class="player-progress progress-track" id="player-progress-track">
        <div class="progress-fill" id="player-progress-fill"></div>
      </div>
      <div class="player-body">
        <div class="player-art" id="player-art">
          <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
        </div>
        <div class="player-info">
          <p class="player-title" id="player-title">Selecione um Beat</p>
          <p class="player-artist">PROD. KAIKY</p>
        </div>
        <div class="player-controls">
          <button class="player-ctrl-btn" id="player-prev-btn" title="Anterior">
            <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
          </button>
          <button class="player-play-btn" id="player-play-btn" title="Play/Pause">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button class="player-ctrl-btn" id="player-next-btn" title="Próxima">
            <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm2-8.14 4.96 3.5L8 16.48V9.86zM16 6h2v12h-2z"/></svg>
          </button>
        </div>
        <div class="player-time" id="player-time">0:00 / 0:00</div>
        <div class="player-waveform" id="player-waveform">
          <div class="waveform-bar"></div>
          <div class="waveform-bar"></div>
          <div class="waveform-bar"></div>
          <div class="waveform-bar"></div>
          <div class="waveform-bar"></div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  document.getElementById("player-play-btn").addEventListener("click", togglePlay);
  document.getElementById("player-prev-btn").addEventListener("click", prev);
  document.getElementById("player-next-btn").addEventListener("click", next);

  const track = document.getElementById("player-progress-track");
  track.addEventListener("click", (e) => {
    if (!ytPlayer || typeof ytPlayer.getDuration !== "function") return;
    const rect = track.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    ytPlayer.seekTo(pct * ytPlayer.getDuration(), true);
  });
}

/* ── Navbar active link ── */
function setActiveNavLink() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href") || "";
    const match =
      (path === "index.html" && href === "index.html") ||
      (path === "beats.html" && href === "beats.html") ||
      (path === "playlists.html" && href === "playlists.html") ||
      (path === "playlist-detail.html" && href === "playlists.html");
    link.classList.toggle("active", match);
  });
}

/* ── Scroll progress ── */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + "%" : "0%";
  }, { passive: true });
}

/* ── Loader hide ── */
function hideLoader() {
  const loader = document.getElementById("global-loader");
  if (loader) loader.classList.add("hidden");
}

/* ── Marquee builder ── */
function buildMarquee(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const words = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  container.innerHTML = words
    .map((w, i) => `<span class="marquee-item${i % 3 === 0 ? " accent" : ""}">${w} ✦</span>`)
    .join("");
}

/* ── Navbar beats count ── */
function updateNavCount() {
  const elBeats = document.querySelector(".nav-beats-count .count");
  if (elBeats) elBeats.textContent = state.beats.length;
  updatePlaysUI();
}

/* ── HOME page ── */
async function initHome() {
  carregarPlaysGlobais();
  injectGlobalPlayer();
  initScrollProgress();
  setActiveNavLink();
  buildMarquee("marquee-track");

  const heroBeats = document.getElementById("hero-beats-count");
  const heroGenres = document.getElementById("hero-genres-count");

  renderSkeletons(document.getElementById("beats-carousel"), 6, 200, 320);
  renderSkeletons(document.getElementById("playlists-carousel"), 5, 200, 250);

  await loadBeats();
  hideLoader();
  updateNavCount();

  if (heroBeats) heroBeats.textContent = state.beats.length;
  if (heroGenres) heroGenres.textContent = GENRES.length;

  const beatsCarousel = document.getElementById("beats-carousel");
  if (beatsCarousel) {
    const homeBeats = state.beats.slice(0, 12);
    beatsCarousel.innerHTML = "";
    homeBeats.forEach(beat => beatsCarousel.appendChild(renderBeatCard(beat, homeBeats)));
  }

  const playlistsCarousel = document.getElementById("playlists-carousel");
  if (playlistsCarousel) {
    playlistsCarousel.innerHTML = "";
    GENRES.forEach(genre => {
      const count = state.beats.filter(b => b.genero === genre).length;
      const card = document.createElement("a");
      card.href = `playlist-detail.html?genero=${genre}`;
      card.className = "card-lift";
      card.style.cssText = `position:relative;flex-shrink:0;width:200px;height:250px;border-radius:12px;overflow:hidden;border:1.5px solid #1f1f1f;display:block;text-decoration:none;`;
      card.innerHTML = `
        <img src="${GENRE_IMAGES[genre]}" alt="${genre}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
        <div class="genre-overlay" style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.4) 50%,transparent 100%);"></div>
        <div style="position:absolute;bottom:0;left:0;right:0;padding:16px;">
          <h3 style="font-size:1.125rem;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;color:#fff;">${genre}</h3>
          <p style="font-size:0.875rem;color:#ccff00;">${count} Beats</p>
        </div>
      `;
      playlistsCarousel.appendChild(card);
    });
  }

  document.getElementById("scroll-beats-left")?.addEventListener("click", () =>
    document.getElementById("beats-carousel")?.scrollBy({ left: -220, behavior: "smooth" }));
  document.getElementById("scroll-beats-right")?.addEventListener("click", () =>
    document.getElementById("beats-carousel")?.scrollBy({ left: 220, behavior: "smooth" }));
  document.getElementById("scroll-playlists-left")?.addEventListener("click", () =>
    document.getElementById("playlists-carousel")?.scrollBy({ left: -220, behavior: "smooth" }));
  document.getElementById("scroll-playlists-right")?.addEventListener("click", () =>
    document.getElementById("playlists-carousel")?.scrollBy({ left: 220, behavior: "smooth" }));
}

/* ── BEATS page ── */
let activeGenre = "todos";

async function initBeats() {
  carregarPlaysGlobais();
  injectGlobalPlayer();
  initScrollProgress();
  setActiveNavLink();

  renderSkeletons(document.getElementById("beats-grid"), 12, 200, 320);

  await loadBeats();
  hideLoader();
  updateNavCount();
  renderBeatsGrid();
  updateFilterCounts();

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeGenre = btn.dataset.genre;
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderBeatsGrid();
    });
  });
}

function renderBeatsGrid() {
  const grid = document.getElementById("beats-grid");
  if (!grid) return;
  const filtered = activeGenre === "todos"
    ? state.beats
    : state.beats.filter(b => b.genero === activeGenre);

  grid.innerHTML = "";
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="icon">🎵</div><p>Nenhum beat encontrado</p></div>`;
    return;
  }
  filtered.forEach(beat => grid.appendChild(renderBeatCard(beat, filtered)));
}

function updateFilterCounts() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    const g = btn.dataset.genre;
    const count = g === "todos" ? state.beats.length : state.beats.filter(b => b.genero === g).length;
    const span = btn.querySelector(".filter-count");
    if (span) span.textContent = `(${count})`;
  });
}

/* ── PLAYLISTS page ── */
async function initPlaylists() {
  carregarPlaysGlobais();
  injectGlobalPlayer();
  initScrollProgress();
  setActiveNavLink();

  await loadBeats();
  hideLoader();
  updateNavCount();

  const grid = document.getElementById("playlists-grid");
  if (!grid) return;
  grid.innerHTML = "";

  GENRES.forEach(genre => {
    const count = state.beats.filter(b => b.genero === genre).length;
    const color = GENRE_COLORS[genre] || "#ccff00";

    const a = document.createElement("a");
    a.href = `playlist-detail.html?genero=${genre}`;
    a.className = "playlist-card";

    a.innerHTML = `
      <img src="${GENRE_IMAGES[genre]}" alt="${genre}">
      <div class="playlist-card-overlay"></div>
      <div class="playlist-card-accent" style="background:${color};"></div>
      <div class="playlist-card-content">
        <div class="playlist-card-meta">
          <div>
            <p class="playlist-card-eyebrow" style="color:${color};">Playlist</p>
            <h3 class="playlist-card-title">${genre}</h3>
            <p class="playlist-card-count">${count} Beats</p>
          </div>
          <div class="playlist-play-icon" style="background:${color};">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(a);
  });
}

/* ── PLAYLIST DETAIL page ── */
async function initPlaylistDetail() {
  carregarPlaysGlobais();
  injectGlobalPlayer();
  initScrollProgress();
  setActiveNavLink();

  const params = new URLSearchParams(window.location.search);
  const genre = params.get("genero") || "trap";

  const bannerImg = document.getElementById("playlist-banner-img");
  const bannerTitle = document.getElementById("playlist-banner-title");
  const playAllBtn = document.getElementById("playlist-play-all");

  if (bannerImg) bannerImg.src = GENRE_IMAGES[genre] || GENRE_IMAGES.trap;
  if (bannerTitle) bannerTitle.textContent = genre;
  document.title = `${genre.toUpperCase()} — Prod. Kaiky`;

  await loadBeats();
  hideLoader();
  updateNavCount();

  const genreBeats = state.beats.filter(b => b.genero === genre);

  const countEl = document.getElementById("playlist-beat-count");
  if (countEl) countEl.textContent = genreBeats.length;

  if (playAllBtn) {
    playAllBtn.addEventListener("click", () => {
      if (genreBeats.length > 0) play(genreBeats[0], genreBeats);
    });
  }

  const grid = document.getElementById("playlist-detail-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (genreBeats.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="width:100%;"><div class="icon">🎵</div><p>Nenhum beat nesse gênero ainda</p></div>`;
    return;
  }
  genreBeats.forEach(beat => grid.appendChild(renderBeatCard(beat, genreBeats)));
}