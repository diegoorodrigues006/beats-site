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
];

let player; // Variável global do YouTube
let indiceMusicaAtual = 0; // Para controlar qual música está tocando

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

// Esta função é chamada automaticamente sempre que o estado do vídeo muda
function onPlayerStateChange(event) {
    // YT.PlayerState.PLAYING significa que a música começou a tocar (Estado 1)
    if (event.data === YT.PlayerState.PLAYING) {
        
        // BUSCA OS DADOS DIRETAMENTE DO YOUTUBE
        const dadosDoVideo = player.getVideoData();
        const tituloReal = dadosDoVideo.title;

        // Atualiza o nome no seu mini-player lá no topo
        document.getElementById('current-track-name').innerText = tituloReal;
        
        // Muda o ícone para Pause
        document.getElementById('btn-play-header').className = "fas fa-pause-circle play-main";
        
        // Inicia a barra de progresso e o tempo
        atualizarProgresso();
    }

    if (event.data === YT.PlayerState.ENDED) {
        proximaMusica(); // Opcional: pula para a próxima quando acabar
    }
}// Esta função é chamada automaticamente sempre que o estado do vídeo muda
function onPlayerStateChange(event) {
    // YT.PlayerState.PLAYING significa que a música começou a tocar (Estado 1)
    if (event.data === YT.PlayerState.PLAYING) {
        
        // BUSCA OS DADOS DIRETAMENTE DO YOUTUBE
        const dadosDoVideo = player.getVideoData();
        const tituloReal = dadosDoVideo.title;

        // Atualiza o nome no seu mini-player lá no topo
        document.getElementById('current-track-name').innerText = tituloReal;
        
        // Muda o ícone para Pause
        document.getElementById('btn-play-header').className = "fas fa-pause-circle play-main";
        
        // Inicia a barra de progresso e o tempo
        atualizarProgresso();
    }

    if (event.data === YT.PlayerState.ENDED) {
        proximaMusica(); // Opcional: pula para a próxima quando acabar
    }
}

function onPlayerReady(event) {
    console.log("Player do YouTube pronto!");
}

// 3. Função para os CARDS de baixo iniciarem a música
function tocarBeat(idYoutube) {
    if (player && player.loadVideoById) {
        player.loadVideoById(idYoutube);
        // O nome será atualizado pela função onPlayerStateChange acima!
    }
}
    
    player.loadVideoById(idYoutube);
    document.getElementById('current-track-name').innerText = nomeBeat;
    document.getElementById('btn-play-header').className = "fas fa-pause-circle play-main";
    atualizarProgresso();


function proximaMusica() {
    indiceMusicaAtual++;
    
    // Se chegar no fim da lista, volta para a primeira (loop)
    if (indiceMusicaAtual >= listaBeats.length) {
        indiceMusicaAtual = 0;
    }
    
    const proximoBeat = listaBeats[indiceMusicaAtual];
    tocarBeat(proximoBeat.idYoutube, proximoBeat.artista);
}

function musicaAnterior() {
    indiceMusicaAtual--;
    
    // Se estiver na primeira e voltar, vai para a última
    if (indiceMusicaAtual < 0) {
        indiceMusicaAtual = listaBeats.length - 1;
    }
    
    const beatAnterior = listaBeats[indiceMusicaAtual];
    tocarBeat(beatAnterior.idYoutube, beatAnterior.artista);
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
// 1. Função que converte segundos em MM:SS (Lógica de CC)
function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    // O '${seg < 10 ? '0' : ''}' garante que apareça 2:05 em vez de 2:5
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
}

// 2. Atualização da Barra e dos Textos
function atualizarProgresso() {
    setInterval(() => {
        // Verificamos se o player existe e se a música está tocando (Estado 1)
        if (player && player.getPlayerState() === 1) {
            const tempoAtual = player.getCurrentTime();
            const duracaoTotal = player.getDuration();
            
            if (duracaoTotal > 0) {
                // Atualiza a Barra Verde
                const progresso = (tempoAtual / duracaoTotal) * 100;
                document.getElementById('progress-fill').style.width = progresso + "%";
                
                // Atualiza os Números de Tempo
                document.getElementById('current-time').innerText = formatarTempo(tempoAtual);
                document.getElementById('duration').innerText = formatarTempo(duracaoTotal);
            }
        }
    }, 1000); // Roda a cada 1 segundo
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

// Inicializa tudo
// No final do seu script.js, substitua o window.onload por isso:
document.addEventListener('DOMContentLoaded', () => {
    renderizarBeats();
});