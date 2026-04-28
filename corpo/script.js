// 1. A lista de dados (podem ser quantos beats você quiser)
const listaBeats = [
    { idYoutube: "lz3mW653CL8", artista: "KAIKY PROD" },
    { idYoutube: "mtzAqMH5z-E", artista: "KAIKY PROD" },
    { idYoutube: "dAl4mV4vxZA", artista: "KAIKY PROD" },
    { idYoutube: "ubBR3s_xyaM", artista: "KAIKY PROD" },
    { idYoutube: "BArHd8UY3X8", artista: "KAIKY PROD" },
    { idYoutube: "jX87GRfW6mw", artista: "KAIKY PROD" },
    { idYoutube: "gekZFuY1bC4", artista: "KAIKY PROD" },
    { idYoutube: "0NOT_hZe4yM", artista: "KAIKY PROD" },

let player; // Variável global do YouTube

// 2. Inicializa a API do YouTube (Função obrigatória da API)
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player-api', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: { 'autoplay': 0, 'controls': 0, 'disablekb': 1 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log("Player do YouTube pronto!");
}

// 3. Função para os CARDS de baixo iniciarem a música
function tocarBeat(idYoutube, nomeBeat) {
    player.loadVideoById(idYoutube);
    document.getElementById('current-track-name').innerText = nomeBeat;
    document.getElementById('btn-play-header').className = "fas fa-pause-circle play-main";
    
    // Inicia o contador da barra de progresso
    atualizarProgresso();
}

// 4. Função Play/Pause no Header
function togglePlay() {
    const btn = document.getElementById('btn-play-header');
    if (player.getPlayerState() === 1) { // 1 = Tocando
        player.pauseVideo();
        btn.className = "fas fa-play-circle play-main";
    } else {
        player.playVideo();
        btn.className = "fas fa-pause-circle play-main";
    }
}

// 5. Lógica da Barra de Progresso
function atualizarProgresso() {
    setInterval(() => {
        if (player && player.getCurrentTime) {
            const tempoAtual = player.getCurrentTime();
            const duracaoTotal = player.getDuration();
            if (duracaoTotal > 0) {
                const progresso = (tempoAtual / duracaoTotal) * 100;
                document.getElementById('progress-fill').style.width = progresso + "%";
            }
        }
    }, 1000); // Atualiza a cada 1 segundo
}

// 6. Quando a música mudar de estado (ex: acabou)
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        document.getElementById('btn-play-header').className = "fas fa-play-circle play-main";
        document.getElementById('progress-fill').style.width = "0%";
    }
}

// 7. Renderizar os cards na tela
function renderizarBeats() {
    const container = document.getElementById('beatsContainer');
    if (!container) return;

    container.innerHTML = listaBeats.map(beat => `
        <div class="beat-card">
            <div class="beat-image-container">
                <img src="https://img.youtube.com/vi/${beat.idYoutube}/maxresdefault.jpg" class="youtube-capa">
                <button class="spotify-play-btn" onclick="tocarBeat('${beat.idYoutube}', '${beat.artista}')">
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

// Inicializa tudo
window.onload = renderizarBeats;