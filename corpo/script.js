// ============================================================
// CONFIGURAÇÃO DA PLANILHA (ALIMENTAÇÃO DINÂMICA)
// ============================================================
const urlPlanilha = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS42I_YX0kzYxpH6143oUulw6EQYS8wLwhQV72F8EmfS0d7-rJyJIMu2fEUrIPWKMHuih8Ffk4DARX8/pub?output=csv";
let listaBeats = []; 
let player; 
let indiceMusicaAtual = 0;

// REQUISITA E CONVERTE OS DADOS DO GOOGLE SHEETS COM LIMPEZA AGRESSIVA DE ASPAS
async function carregarBeatsDaPlanilha() {
    try {
        console.log("🔄 Iniciando fetch da planilha...");
        const resposta = await fetch(urlPlanilha);
        const dadosCSV = await resposta.text();
        
        const linhas = dadosCSV.split(/\r?\n/);
        console.log("📋 Total de linhas no CSV:", linhas.length);
        console.log("📋 Primeira linha (cabeçalho):", linhas[0]);
        
        listaBeats = []; 
        
        // ===== PARSER CSV ROBUSTO =====
        // Funciona com campos entre aspas que contêm vírgulas
        const parseCSVLine = (line) => {
            const colunas = [];
            let atual = '';
            let dentroAspas = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    dentroAspas = !dentroAspas;
                } else if (char === ',' && !dentroAspas) {
                    colunas.push(atual);
                    atual = '';
                } else {
                    atual += char;
                }
            }
            colunas.push(atual);
            return colunas;
        };
        
        for (let i = 1; i < linhas.length; i++) {
            const line = linhas[i].trim();
            if (line === '') continue; 
            
            const colunas = parseCSVLine(line);
            
            // FUNÇÃO CORRIGIDA: Higienização AGRESSIVA de aspas CSV + caracteres especiais
            const limparCampo = (campo) => {
                if (!campo) return "";
                // Passo 1: Remove espaços externos
                let limpo = campo.trim();
                // Passo 2: Remove aspas simples e duplas do início e fim
                limpo = limpo.replace(/^["']+|["']+$/g, '');
                // Passo 3: Converte sequências repetidas de aspas duplas "" em simples "
                limpo = limpo.replace(/""/g, '"');
                // Passo 4: Remove sequências de 3+ aspas de QUALQUER tipo (""",...,""")
                limpo = limpo.replace(/"{3,}/g, '"');
                limpo = limpo.replace(/'{3,}/g, "'");
                // Passo 5: Remove espaços novamente após limpeza
                return limpo.trim();
            };

            const idYoutube = limparCampo(colunas[0]);
            const artista = limparCampo(colunas[1]) || "KAIKY PROD";
            const nome = limparCampo(colunas[2]);
            const genero = colunas[3] ? limparCampo(colunas[3]).toLowerCase() : "";

            console.log(`📌 Linha ${i}: ID="${idYoutube}", Nome="${nome}", Gênero="${genero}"`);

            if (idYoutube && nome) {
                listaBeats.push({
                    idYoutube: idYoutube,
                    artista: artista,
                    nome: nome,
                    genero: genero
                });
            }
        }
        
        console.log("✅ Planilha sincronizada com sucesso!");
        console.log("📊 Total de beats carregados:", listaBeats.length);
        console.log("📊 Beats por gênero:", {
            trap: listaBeats.filter(b => b.genero === 'trap').length,
            boombap: listaBeats.filter(b => b.genero === 'boombap').length,
            detroit: listaBeats.filter(b => b.genero === 'detroit').length,
            funk: listaBeats.filter(b => b.genero === 'funk').length,
            experimental: listaBeats.filter(b => b.genero === 'experimental').length
        });
        console.log("🎵 Primeiros 3 beats:", listaBeats.slice(0, 3));
        
        executarRenderizacaoGlobal();

    } catch (erro) {
        console.error("❌ Erro crítico ao ler dados da planilha remota:", erro);
        listaBeats = [
            { idYoutube: "lz3mW653CL8", artista: "KAIKY PROD", nome: "brandao #1", genero: "trap" }
        ];
        executarRenderizacaoGlobal();
    }
}

// CENTRALIZA AS CHAMADAS DE TELA APÓS CARREGAR OS DADOS
function executarRenderizacaoGlobal() {
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

// Retorna o total real de beats vindos da planilha
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

// ========== RENDERIZADORES DE LAYOUT BLINDADOS ==========
function renderizarBeats() {
    const container = document.getElementById('beatsContainer');
    if (!container) return; 

    container.innerHTML = listaBeats.map(beat => {
        // ESCAPE SEGURO EM HTML: Usa entidades HTML para evitar quebras de atributos
        // Escapa aspas simples para JavaScript dentro do atributo onclick
        const nomeTratado = beat.nome
            .replace(/\\/g, '\\\\')           // Barra invertida primeiro
            .replace(/'/g, "\\'")              // Simples com escape
            .replace(/"/g, '&quot;');          // Duplas com entidade HTML
        
        return `
            <div class="beat-card">
                <div class="beat-image-container">
                    <img src="https://img.youtube.com/vi/${beat.idYoutube}/hqdefault.jpg" class="youtube-capa">
                    <button class="spotify-play-btn" onclick="tocarBeat('${beat.idYoutube}', '${nomeTratado}')">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <p style="color:white; text-align:center; margin-top:10px;">${beat.nome}</p>
            </div>
        `;
    }).join('');
}

function renderizarTodosBeats(generoFiltro = 'todos') {
    const container = document.getElementById('lista-todos-beats');
    if (!container) return; 

    const beatsFiltrados = generoFiltro === 'todos' ? listaBeats : listaBeats.filter(beat => beat.genero === generoFiltro);

    container.innerHTML = beatsFiltrados.map(beat => {
        // ESCAPE SEGURO EM HTML: Usa entidades HTML para evitar quebras de atributos
        const nomeTratado = beat.nome
            .replace(/\\/g, '\\\\')           // Barra invertida primeiro
            .replace(/'/g, "\\'")              // Simples com escape
            .replace(/"/g, '&quot;');          // Duplas com entidade HTML
        
        return `
            <div class="track-card-mini">
                <div class="card-img-container">
                    <img src="https://img.youtube.com/vi/${beat.idYoutube}/hqdefault.jpg" alt="${beat.nome}">
                    <div class="play-overlay" onclick="tocarBeat('${beat.idYoutube}', '${nomeTratado}')">
                        <i class="fas fa-play-circle"></i>
                    </div>
                </div>
                <div class="track-info-mini">
                    <p class="track-name-text">${beat.nome}</p>
                    <button class="btn-buy-green">R$ 60,00</button>
                </div>
            </div>
        `;
    }).join('');
}

function filtrarBeats(genero) {
    const botoes = document.querySelectorAll('.filter-btn');
    botoes.forEach(btn => btn.classList.remove('active'));
    if (window.event && window.event.target) {
        window.event.target.classList.add('active');
    }
    renderizarTodosBeats(genero);
}

function renderizarPlaylists() {
    const container = document.getElementById('playlistsContainer');
    if (!container) return; 

    const generos = ['trap', 'boombap', 'detroit', 'funk', 'experimental'];
    
    // DEBUG: Log para verificar estado de listaBeats
    console.log("🎵 renderizarPlaylists() chamado. listaBeats.length =", listaBeats.length);
    if (listaBeats.length > 0) {
        console.log("🎵 Amostra de beat:", listaBeats[0]);
        console.log("🎵 Gêneros únicos encontrados:", [...new Set(listaBeats.map(b => b.genero))]);
    }
    
    container.innerHTML = generos.map(genero => {
        // CORREÇÃO: Conta diretamente do array atualizado 'listaBeats' no momento da renderização
        const beatsDogenero = listaBeats.filter(beat => beat.genero === genero);
        const total = beatsDogenero.length;
        
        console.log(`📊 Gênero "${genero}": ${total} beats`);
        
        const imagemCapa = (genero === 'trap') ? 'beats-trap.jpeg' : `beats-${genero}.jpeg`;
        return `
            <div class="playlist-card" onclick="window.location.href='playlist-detalhe.html?genero=${genero}'">
                <div class="playlist-image" style="background: url('${imagemCapa}'); background-size: cover; background-position: center;">
                </div>
                <div class="playlist-info">
                    <h3>${genero.toUpperCase()}</h3>
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

    listaContainer.innerHTML = beatsFiltrados.map(beat => {
        // ESCAPE SEGURO EM HTML: Usa entidades HTML para evitar quebras de atributos
        const nomeTratado = beat.nome
            .replace(/\\/g, '\\\\')           // Barra invertida primeiro
            .replace(/'/g, "\\'")              // Simples com escape
            .replace(/"/g, '&quot;');          // Duplas com entidade HTML
        
        return `
            <div class="track-card-mini">
                <div class="card-img-container">
                    <img src="https://img.youtube.com/vi/${beat.idYoutube}/hqdefault.jpg" alt="${beat.nome}">
                    <div class="play-overlay" onclick="tocarBeat('${beat.idYoutube}', '${nomeTratado}')">
                        <i class="fas fa-play-circle"></i>
                    </div>
                </div>
                <div class="track-info-mini">
                    <p class="track-name-text">${beat.nome}</p>
                    <button class="btn-buy-green">R$ 60,00</button>
                </div>
            </div>
        `;
    }).join('');
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

// ========== CONTROLADORES DE PLAYER E API DO YOUTUBE ==========
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
    const checkbox = document.getElementById('play-toggle');
    if (event.data === YT.PlayerState.PLAYING) {
        incrementarPlays(); 
        if (checkbox) checkbox.checked = true;
        atualizarProgresso();
    } else if (event.data === YT.PlayerState.PAUSED) {
        if (checkbox) checkbox.checked = false;
    }
}

function tocarBeat(idYoutube, nome) {
    const novoIndice = listaBeats.findIndex(b => b.idYoutube === idYoutube);
    if (novoIndice !== -1) indiceMusicaAtual = novoIndice;
    
    // Atualiza o título do beat
    if (nome) {
        document.getElementById('player-title').innerText = nome;
    }
    
    // Injeta a imagem da capa do YouTube como background-image usando hqdefault estável
    const albumArtDiv = document.getElementById('player-album-art');
    if (albumArtDiv && idYoutube) {
        albumArtDiv.style.backgroundImage = `url('https://img.youtube.com/vi/${idYoutube}/hqdefault.jpg')`;
        // Remove o placeholder de música quando há imagem
        const placeholder = albumArtDiv.querySelector('.player-placeholder');
        if (placeholder) placeholder.style.display = 'none';
    }
    
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
    const checkbox = document.getElementById('play-toggle');
    if (!player || typeof player.getPlayerState !== "function") return;
    
    const estado = player.getPlayerState();
    if (estado === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        if (checkbox) checkbox.checked = false;
    } else {
        player.playVideo();
        if (checkbox) checkbox.checked = true;
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
                const progressFill = document.getElementById('progress-fill');
                const currentTime = document.getElementById('current-time');
                const duration = document.getElementById('duration');
                
                if (progressFill) progressFill.style.width = (t/d*100) + "%";
                if (currentTime) currentTime.innerText = formatarTempo(t);
                if (duration) duration.innerText = formatarTempo(d);
            }
        } else {
            clearInterval(intervalo);
        }
    }, 1000);
}

// ========== EVENTOS DE INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log("📌 DOMContentLoaded disparado!");
    inicializarPlays();
    carregarBeatsDaPlanilha();
    
    // Force re-render das playlists após 2 segundos caso ainda estejam em "0 Beats"
    setTimeout(() => {
        console.log("⏱️ Verificação de contingência: listaBeats.length =", listaBeats.length);
        if (listaBeats.length > 0) {
            renderizarPlaylists();
            console.log("✅ Re-renderização das playlists executada!");
        }
    }, 2000);
});

window.addEventListener('load', () => {
    console.log("📌 Window 'load' disparado!");
    const loader = document.getElementById('global-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 300);
    }
});

// ============================================================
// SISTEMA DE BARRA DE PROGRESSO DE ROLAGEM (SCROLL PROGRESS)
// ============================================================
window.addEventListener('scroll', () => {
    const barra = document.getElementById('scrollBar');
    if (!barra) return;

    const pixelsRolados = window.scrollY || document.documentElement.scrollTop;
    const alturaTotalPagina = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (alturaTotalPagina > 0) {
        const porcentagem = (pixelsRolados / alturaTotalPagina) * 100;
        barra.style.width = porcentagem + "%";
    }
});

// ============================================================
// PROGRESSO DA BARRA HORIZONTAL DO CARROSSEL DE BEATS
// ============================================================
const containerBeats = document.getElementById('beatsContainer');
const indicadorCarrossel = document.getElementById('carouselBar');

if (containerBeats && indicadorCarrossel) {
    containerBeats.addEventListener('scroll', () => {
        const scrollEsquerda = containerBeats.scrollLeft;
        const scrollMaximo = containerBeats.scrollWidth - containerBeats.clientWidth;
        
        if (scrollMaximo > 0) {
            const porcentagem = (scrollEsquerda / scrollMaximo) * 100;
            const posicaoBarra = (porcentagem / 100) * 70; 
            indicadorCarrossel.style.left = posicaoBarra + "%";
        }
    });
}