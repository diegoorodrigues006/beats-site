// 1. Dados dos Beats (Configurados por Gênero)
const listaBeats = [
    { idYoutube: "lz3mW653CL8", artista: "KAIKY PROD", nome: "Trap Beat #1", genero: "trap" },
    { idYoutube: "mtzAqMH5z-E", artista: "KAIKY PROD", nome: "Boombap Classic", genero: "boombap" },
    { idYoutube: "dAl4mV4vxZA", artista: "KAIKY PROD", nome: "Detroit Style #1", genero: "detroit" },
    { idYoutube: "ubBR3s_xyaM", artista: "KAIKY PROD", nome: "Detroit Style #2", genero: "detroit" },
    { idYoutube: "BArHd8UY3X8", artista: "KAIKY PROD", nome: "Funk Beat", genero: "funk" },
    { idYoutube: "jX87GRfW6mw", artista: "KAIKY PROD", nome: "Experimental Vibes", genero: "experimental" }
];

let player; 
let indiceMusicaAtual = 0;

// ========== FUNÇÕES DE CONTAGEM DE BEATS ==========
// Inicializa o sistema (compatibilidade)
function inicializarPlaylists() {
    // Função mantida para compatibilidade com o HTML
}

// Retorna a contagem de músicas disponíveis para um gênero
function contarMusicas(genero) {
    const beatsDogenero = listaBeats.filter(beat => beat.genero === genero);
    return beatsDogenero.length;
}

// 2. RENDERIZAÇÃO DA INDEX (Beats Gerais)
function renderizarBeats() {
    const container = document.getElementById('beatsContainer');
    if (!container) return; 

    container.innerHTML = listaBeats.map(beat => `
        <div class="beat-card">
            <div class="beat-image-container">
                <img src="https://img.youtube.com/vi/${beat.idYoutube}/maxresdefault.jpg" class="youtube-capa">
                <button class="spotify-play-btn" onclick="tocarBeat('${beat.idYoutube}', '${beat.nome}')">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <p style="color:white; text-align:center; margin-top:10px;">${beat.nome}</p>
        </div>
    `).join('');
}

// 2.5 RENDERIZAÇÃO DAS PLAYLISTS NA PÁGINA INICIAL
function renderizarPlaylists() {
    const container = document.getElementById('playlistsContainer');
    if (!container) return;

    const playlists = [
        { genero: 'trap', nome: 'TRAP BR', imagem: 'beats-trap.jpeg' },
        { genero: 'boombap', nome: 'BOOMBAP', imagem: 'beats-boombap.jpeg' },
        { genero: 'detroit', nome: 'DETROIT', imagem: 'beats-detroit.jpeg' },
        { genero: 'funk', nome: 'FUNK', imagem: 'beats-funk.jpeg' },
        { genero: 'experimental', nome: 'EXPERIMENTAL', imagem: 'beats-experimental.jpeg' }
    ];

    container.innerHTML = playlists.map(playlist => {
        const count = contarMusicas(playlist.genero);
        return `
            <a href="playlist-detalhe.html?genero=${playlist.genero}" class="playlist-card" style="text-decoration: none; color: inherit;">
                <div class="playlist-image" style="background-image: url('${playlist.imagem}'); background-size: cover; background-position: center;"></div>
                <div class="playlist-info">
                    <h3>${playlist.nome}</h3>
                    <p>${count} Beats</p>
                </div>
            </a>
        `;
    }).join('');
}

// 3. Inicialização da API do YouTube
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player-api', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: { 'autoplay': 0, 'controls': 0, 'disablekb': 1 },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        const dados = player.getVideoData();
        const nomeExibicao = document.getElementById('current-track-name').innerText;
        if(nomeExibicao === "Selecione um Beat" || nomeExibicao === "") {
            document.getElementById('current-track-name').innerText = dados.title;
        }
        document.getElementById('btn-play-header').className = "fas fa-pause-circle play-main";
        atualizarProgresso();
    }
}

// 4. FUNÇÕES DE CONTROLE
function tocarBeat(idYoutube, nome) {
    const novoIndice = listaBeats.findIndex(b => b.idYoutube === idYoutube);
    if (novoIndice !== -1) indiceMusicaAtual = novoIndice;
    if (nome) document.getElementById('current-track-name').innerText = nome;
    if (player && player.loadVideoById) {
        player.loadVideoById(idYoutube);
    }
}

function proximaMusica() {
    indiceMusicaAtual = (indiceMusicaAtual + 1) % listaBeats.length;
    const beat = listaBeats[indiceMusicaAtual];
    tocarBeat(beat.idYoutube, beat.nome);
}

function musicaAnterior() {
    indiceMusicaAtual = (indiceMusicaAtual - 1 + listaBeats.length) % listaBeats.length;
    const beat = listaBeats[indiceMusicaAtual];
    tocarBeat(beat.idYoutube, beat.nome);
}

function togglePlay() {
    const btn = document.getElementById('btn-play-header');
    const estado = player.getPlayerState();
    if (estado === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        btn.className = "fas fa-play-circle play-main";
    } else {
        player.playVideo();
        btn.className = "fas fa-pause-circle play-main";
    }
}

// 5. UTILITÁRIOS
function formatarTempo(s) {
    const m = Math.floor(s / 60);
    const seg = Math.floor(s % 60);
    return `${m}:${seg < 10 ? '0' : ''}${seg}`;
}   

function atualizarProgresso() {
    const intervalo = setInterval(() => {
        if (player && typeof player.getPlayerState === "function" && player.getPlayerState() === 1) {
            const t = player.getCurrentTime();
            const d = player.getDuration();
            if(d > 0) {
                document.getElementById('progress-fill').style.width = (t/d*100) + "%";
                document.getElementById('current-time').innerText = formatarTempo(t);
                document.getElementById('duration').innerText = formatarTempo(d);
            }
        } else {
            clearInterval(intervalo);
        }
    }, 1000);
}

// 6. PLAYLIST-DETALHE (Lógica Dinâmica)
function carregarPlaylistDinamica(genero) {
    const titulo = document.getElementById('playlist-title');
    const capaPlaylist = document.getElementById('playlist-cover');
    const listaContainer = document.getElementById('lista-tracks-dinamica');
    
    const autorElemento = document.getElementById('playlist-author'); 

    if(!listaContainer) return;

    // Filtra os beats pelo gênero atual
    const beatsFiltrados = listaBeats.filter(beat => beat.genero === genero);
    
    // Atualiza o título (ex: DETROIT)
    if(titulo) titulo.innerText = genero.toUpperCase();
    
    // ATUALIZA O CONTADOR DO BANNER COM A CONTAGEM TOTAL DE BEATS DO GÊNERO
    if(autorElemento) {
        const countTotal = contarMusicas(genero);
        autorElemento.innerHTML = `PROD.KAIKY • <span id="track-count" style="color: #ccff00; font-weight: bold;">${countTotal}</span> Beats`;
    }

    // Configuração da capa da playlist
    const imagemHero = (genero === 'trap') ? 'beats-trap.jpeg' : `beats-${genero}.jpeg`;
    if(capaPlaylist) capaPlaylist.src = imagemHero;

    // Renderiza a grade de músicas com capas do YouTube
    listaContainer.innerHTML = beatsFiltrados.map(beat => `
        <div class="track-card-mini">
            <div class="card-img-container">
                <img src="https://img.youtube.com/vi/${beat.idYoutube}/maxresdefault.jpg" alt="${beat.nome}">
                <div class="play-overlay" onclick="tocarBeat('${beat.idYoutube}', '${beat.nome}')">
                    <i class="fas fa-play-circle"></i>
                </div>
            </div>
            <div class="track-info-mini">
                <p class="track-name-text">${beat.nome}</p>
                <button class="btn-buy-green">R$ 60,00</button>
            </div>
        </div>
    `).join('');

    // Efeitos de hover
    document.querySelectorAll('.card-img-container').forEach(card => {
        card.onmouseover = () => card.querySelector('.play-overlay').style.opacity = "1";
        card.onmouseout = () => card.querySelector('.play-overlay').style.opacity = "0";
    });
}


// 7. FUNÇÃO PARA TOCAR PRIMEIRA MÚSICA DA PLAYLIST
function tocarPrimeira() {
    const urlParams = new URLSearchParams(window.location.search);
    const genero = urlParams.get('genero');
    const beatsFiltrados = listaBeats.filter(beat => beat.genero === genero);
    
    if (beatsFiltrados.length > 0) {
        const primeiroBeat = beatsFiltrados[0];
        indiceMusicaAtual = listaBeats.findIndex(b => b.idYoutube === primeiroBeat.idYoutube);
        tocarBeat(primeiroBeat.idYoutube, primeiroBeat.nome);
        if (player) player.playVideo();
    }
}