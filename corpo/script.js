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

// 2. A função que "desenha" os cards
function renderizarBeats() {
    const container = document.getElementById('beatsContainer');
    
    // Se o JS não achar o ID no HTML, ele para aqui para não dar erro
    if (!container) return; 

    // O .map percorre a lista e cria o HTML de cada card
container.innerHTML = listaBeats.map(beat => `
    <div class="beat-card">
        <div class="beat-image" style="background: url('https://img.youtube.com/vi/${beat.idYoutube}/maxresdefault.jpg') center/cover;">
            <button class="spotify-play-btn">
                <i class="fas fa-play"></i>
            </button>
        </div>
        <div class="beat-artist">
            <p class="beat-title">${beat.artista}</p>
             <p class="beat-status">Grátis ↓</p>      
             </div>
    </div>
`).join('');}

// 3. A função das setas (que você já tinha no HTML)
function scrollBeats(direction) {
    const container = document.getElementById('beatsContainer');
    const scrollAmount = 320; // Largura do card + gap
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// 4. Manda o navegador rodar a função assim que terminar de carregar a página
window.onload = renderizarBeats;