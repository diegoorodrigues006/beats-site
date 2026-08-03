<div align="center">

  <!-- Banner do Projeto -->
  <img src="https://raw.githubusercontent.com/diegoorodrigues006/beats-site/main/corpo/beats-trap.jpeg" alt="Beats Site Banner" width="100%" style="border-radius: 12px; max-height: 280px; object-fit: cover;">

  <br><br>

  # 🎵 BEATS SITE — PROD. KAIKY

  **Plataforma Web de Apresentação e Comercialização de Beats Autorais**

  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
  [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![YouTube API](https://img.shields.io/badge/YouTube_API-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://developers.google.com/youtube/iframe_api_reference)

  <br>

  [🖥️ **Acessar o Site**](https://diegoorodrigues006.github.io/beats-site/) • [📱 **Falar no WhatsApp**](https://wa.me/553171821903)

</div>

---

## 📌 Visão Geral

O **Beats Site** é uma aplicação web moderna, responsiva e de alta performance criada para exibir o portfólio de instrumental do **Prod. Kaiky**. O sistema oferece uma experiência fluida para ouvintes e artistas navegarem por gêneros musicais, ouvirem faixas em um player persistente e comprarem autorizações diretamente pelo WhatsApp.

---

## ⚡ Diferenciais de Arquitetura & Otimizações do DOM

<details>
<summary><b>🔍 Clique aqui para expandir os detalhes técnicos de performance</b></summary>

<br>

| Otimização | Técnica Utilizada | Impacto no Projeto |
| :--- | :--- | :--- |
| **Renderização em Lote** | `DocumentFragment` | Monta os cards em memória antes de injetar na árvore DOM, evitando múltiplos re-renders. |
| **Gerenciamento de Memória** | `Event Delegation` | Utiliza um único escutador no container pai para tratar cliques com `.closest()`. |
| **Prevenção de Thrashing** | Rastreamento no `state` | Modifica apenas atributos pontuais dos cards (`.active`, SVG) sem destruir elementos HTML. |
| **Animações Aceleradas** | `Intersection Observer` | Monitora elementos na tela e desacopla a observação (`unobserve`) após a animação. |

</details>

---

## 🛠️ Recursos e Funcionalidades

```text
├── 🎧 Player Global Persistente   -> Permanece ativo e sincronizado durante a navegação.
├── 🎛️ Filtro Dinâmico por Gênero  -> Trap, Boombap, Detroit, Funk e Experimental sem reload.
├── 🔥 Contador em Tempo Real      -> Plays sincronizados globalmente via Firebase Realtime.
├── 📊 Integração via Planilha     -> Beats carregados automaticamente via Google Sheets CSV.
└── 💬 Checkout via WhatsApp       -> Gera mensagens pré-formatadas com o beat e o valor.
📂 Estrutura do Repositório
beats-site/
 ├── 📄 index.html          # Página Inicial (Hero, Carrosséis e CTA)
 ├── 📄 beats.html          # Catálogo Completo com Filtros Dinâmicos
 ├── 📄 playlists.html      # Visão Geral das Categorias de Gênero
 ├── 📄 playlist-detail.html# Lista de beats do gênero selecionado
 ├── 🎨 style.css           # Estilos Globais, Animações Neon e Responsividade
 └── ⚡ app.js              # Gerenciamento de Estado, Player e Otimizações
