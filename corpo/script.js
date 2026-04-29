// 1. Dados dos Beats
const listaBeats = [
    { idYoutube: "lz3mW653CL8", artista: "KAIKY PROD" },
    { idYoutube: "mtzAqMH5z-E", artista: "KAIKY PROD" },
    { idYoutube: "dAl4mV4vxZA", artista: "KAIKY PROD" },
    { idYoutube: "ubBR3s_xyaM", artista: "KAIKY PROD" },
    { idYoutube: "BArHd8UY3X8", artista: "KAIKY PROD" },
    { idYoutube: "jX87GRfW6mw", artista: "KAIKY PROD" },
    { idYoutube: "gekZFuY1bC4", artista: "KAIKY PROD" },
    { idYoutube: "0NOT_hZe4yM", artista: "KAIKY PROD" }
];

let player;
let indiceMusicaAtual = 0;

// 2. RENDERIZAÇÃO IMEDIATA (Isso faz os cards aparecerem primeiro!)
function renderizarBeats() {
    const container = document.getElementById('beatsContainer');
    if (!container) {
        console.error("Erro: Não encontrei a div 'beatsContainer' no HTML");
        return;
    }

    container.innerHTML = listaBeats.map(beat => `
        <div class="beat-card">
            <div class="beat-image-container">
                <img src="https://img.youtube.com/vi/${beat.idYoutube}/maxresdefault.jpg" class="youtube-capa">
                <button class="spotify-play-btn" onclick="tocarBeat('${beat.idYoutube}')">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="beat-artist">
                <p class="beat-title">${beat.artista}</p>
                <p class="beat-status">Grátis ↓</p>
            </div>
        </div>
    `).join('');
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
        document.getElementById('current-track-name').innerText = dados.title;
        document.getElementById('btn-play-header').className = "fas fa-pause-circle play-main";
        atualizarProgresso();
    }
}

// 1. Função tocarBeat atualizada para manter o índice
function tocarBeat(idYoutube) {
    // Atualiza o índice para que as setas saibam qual música está tocando
    const novoIndice = listaBeats.findIndex(b => b.idYoutube === idYoutube);
    if (novoIndice !== -1) indiceMusicaAtual = novoIndice;

    if (player && player.loadVideoById) {
        player.loadVideoById(idYoutube);
    }
}

// 2. Função de Avançar
function proximaMusica() {
    indiceMusicaAtual = (indiceMusicaAtual + 1) % listaBeats.length;
    tocarBeat(listaBeats[indiceMusicaAtual].idYoutube);
}

// 3. Função de Voltar
function musicaAnterior() {
    indiceMusicaAtual = (indiceMusicaAtual - 1 + listaBeats.length) % listaBeats.length;
    tocarBeat(listaBeats[indiceMusicaAtual].idYoutube);
}

// 4. Função de Play/Pause (Botão do Header)
function togglePlay() {
    const btn = document.getElementById('btn-play-header');
    const estado = player.getPlayerState();

    if (estado === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        btn.className = "fas fa-play-circle play-main"; // Volta para ícone de Play
    } else {
        player.playVideo();
        btn.className = "fas fa-pause-circle play-main"; // Muda para ícone de Pause
    }
}

// FORMATAR TEMPO E PROGRESSO (Mantenha as funções que já criamos aqui...)
function formatarTempo(s) {
    const m = Math.floor(s / 60);
    const seg = Math.floor(s % 60);
    return `${m}:${seg < 10 ? '0' : ''}${seg}`;
}

function atualizarProgresso() {
    setInterval(() => {
        if (player && player.getPlayerState() === 1) {
            const t = player.getCurrentTime();
            const d = player.getDuration();
            document.getElementById('progress-fill').style.width = (t/d*100) + "%";
            document.getElementById('current-time').innerText = formatarTempo(t);
            document.getElementById('duration').innerText = formatarTempo(d);
        }
    }, 1000);
}

// GATILHO DE ENTRADA
document.addEventListener('DOMContentLoaded', renderizarBeats);