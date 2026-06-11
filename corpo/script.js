// ============================================================
// CONFIGURAÇÃO DA PLANILHA (ALIMENTAÇÃO DINÂMICA)
// ============================================================
// Colunas recomendadas no Sheets: idYoutube, artista, nome, genero
const urlPlanilha = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS42I_YX0kzYxpH6143oUulw6EQYS8wLwhQV72F8EmfS0d7-rJyJIMu2fEUrIPWKMHuih8Ffk4DARX8/pub?output=csv";

let listaBeats = []; // Inicializa o array vazio para receber os dados do Sheets
let player; 
let indiceMusicaAtual = 0;

// REQUISITA E CONVERTE OS DADOS DO GOOGLE SHEETS (CORRIGIDO PARA PREÇOS COM VÍRGULA)
async function carregarBeatsDaPlanilha() {
    try {
        const resposta = await fetch(urlPlanilha);
        const dadosCSV = await resposta.text();
        
        const linhas = dadosCSV.split('\n');
        listaBeats = []; 
        
        // Loop começa em 1 para ignorar a linha de cabeçalhos
        for (let i = 1; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (linha === '') continue; 
            
            // EXPRESSÃO REGULAR: Divide por vírgula, mas ignora vírgulas dentro de aspas (ex: "60,00")
            const colunas = linha.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || linha.split(',');
            
            // Limpa as aspas extras que o CSV coloca ao redor dos campos modificados
            const limparCampo = (campo) => campo ? campo.replace(/^"| Kent$/g, '').trim() : "";

            listaBeats.push({
                idYoutube: limparCampo(colunas[0]),
                artista: limparCampo(colunas[1]) || "KAIKY PROD",
                nome: limparCampo(colunas[2]),
                genero: limparCampo(colunas[3]).toLowerCase()
            });
        }
        
        console.log("Planilha integrada com sucesso e aspas/vírgulas tratadas!", listaBeats);
        executarRenderizacaoGlobal();

    } catch (erro) {
        console.error("Erro crítico ao ler dados da planilha remota:", erro);
        // Fallback de segurança caso a internet falhe
        listaBeats = [
            { idYoutube: "lz3mW653CL8", artista: "KAIKY PROD", nome: "brandao #1", genero: "trap" }
        ];
        executarRenderizacaoGlobal();
    }
}

// CENTRALIZA AS CHAMADAS DE TELA APÓS CARREGAR OS DADOS
function ejecutarRenderizacaoGlobal() {
    atualizarStats();
    renderizarBeats();      // Renderização da Index
    renderizarTodosBeats(); // Renderização da página musicas.html
    renderizarPlaylists();  // Renderização dos blocos das playlists
    
    // Captura o parâmetro de gênero caso esteja na página de detalhes
    const urlParams = new URLSearchParams(window.location.search);
    const generoParam = urlParams.get('genero');
    if (generoParam) {
        carregarPlaylistDinamica(generoParam);
    }
}

// ========== SISTEMA DE CONTADORES ==========
function inicializarPlays() {
    if (!localStorage.getItem('totalPlays')) {
        localStorage.setItem('totalPlays', '0');
    }
}

function incrementarPlays() {
    inicializarPlays();
    const totalPlays = parseInt(localStorage.getItem('totalPlays')) || 0;
    localStorage.setItem('totalPlays', totalPlays + 1);
    atualizarStats();
}

function getTotalBeats() {
    return listaBeats.length;
}

function getTotalPlays() {
    inicializarPlays();
    return parseInt(localStorage.getItem('totalPlays')) || 0;
}

function atualizarStats() {
    const statsItems = document.querySelectorAll('.stat-item strong');
    if (statsItems.length >= 2) {
        statsItems[0].innerText = getTotalBeats();
        statsItems[1].innerText = getTotalPlays();
    }
}

function inicializarPlaylists() {
    inicializarPlays();
}

function contarMusicas(genero) {
    const beatsDogenero = listaBeats.filter(beat => beat.genero === genero);
    return beatsDogenero.length;
}

// ========== RENDERIZADORES DE LAYOUT ==========
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

function renderizarTodosBeats(generoFiltro = 'todos') {
    const container = document.getElementById('lista-todos-beats');
    if (!container) return; 

    const beatsFiltrados = generoFiltro === 'todos' ? listaBeats : listaBeats.filter(beat => beat.genero === generoFiltro);

    container.innerHTML = beatsFiltrados.map(beat => `
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
}

function filtrarBeats(genero) {
    const botoes = document.querySelectorAll('.filter-btn');
    botoes.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    renderizarTodosBeats(genero);
}

function renderizarPlaylists() {
    const container = document.getElementById('playlistsContainer');
    if (!container) return; 

    const generos = ['trap', 'boombap', 'detroit', 'funk', 'experimental'];
    
    container.innerHTML = generos.map(genero => {
        const total = contarMusicas(genero);
        const imagemCapa = (genero === 'trap') ? 'beats-trap.jpeg' : `beats-${genero}.jpeg`;
        return `
            <div class="playlist-card" onclick="window.location.href='playlist-detalhe.html?genero=${genero}'">
                <div class="playlist-image" style="background: url('${imagemCapa}'); background-size: cover; background-position: center;">
                </div>
                <div class="playlist-info">
                    <h3>${genero}</h3>
                    <p>${total} Beats</p>
                </div>
            </div>
        `;
    }).join('');
}

// ========== DINÂMICA INTERNA DE PLAYLISTS ==========
function carregarPlaylistDinamica(genero) {
    const titulo = document.getElementById('playlist-title');
    const capaPlaylist = document.getElementById('playlist-cover');
    const listaContainer = document.getElementById('lista-tracks-dinamica');
    const autorElemento = document.getElementById('playlist-author'); 

    if(!listaContainer) return;

    const beatsFiltrados = listaBeats.filter(beat => beat.genero === genero);
    
    if(titulo) titulo.innerText = genero.toUpperCase();
    
    if(autorElemento) {
        const countTotal = beatsFiltrados.length;
        autorElemento.innerHTML = `PROD.KAIKY • <span id="track-count" style="color: #ccff00; font-weight: bold;">${countTotal}</span> Beats`;
    }

    const imagemHero = (genero === 'trap') ? 'beats-trap.jpeg' : `beats-${genero}.jpeg`;
    if(capaPlaylist) capaPlaylist.src = imagemHero;

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
}

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

// ========== CONTROLADORES DE PLAYER E API ==========
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
        incrementarPlays(); 
        const dados = player.getVideoData();
        const nomeExibicao = document.getElementById('current-track-name').innerText;
        if(nomeExibicao === "Selecione um Beat" || nomeExibicao === "") {
            document.getElementById('current-track-name').innerText = dados.title;
        }
        document.getElementById('btn-play-header').className = "fas fa-pause-circle play-main";
        atualizarProgresso();
    }
}

function tocarBeat(idYoutube, nome) {
    const novoIndice = listaBeats.findIndex(b => b.idYoutube === idYoutube);
    if (novoIndice !== -1) indiceMusicaAtual = novoIndice;
    if (nome) document.getElementById('current-track-name').innerText = nome;
    if (player && player.loadVideoById) {
        player.loadVideoById(idYoutube);
    }
}

function proximaMusica() {
    if (listaBeats.length === 0) return;
    indiceMusicaAtual = (indiceMusicaAtual + 1) % listaBeats.length;
    const beat = listaBeats[indiceMusicaAtual];
    tocarBeat(beat.idYoutube, beat.nome);
}

function musicaAnterior() {
    if (listaBeats.length === 0) return;
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

// ========== EVENTOS DE INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    inicializarPlays();
    carregarBeatsDaPlanilha(); // Dispara o carregamento do Google Sheets
});

window.addEventListener('load', () => {
    const loader = document.getElementById('global-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 300);
    }
});