<div align="center">

  <!-- Banner do Projeto -->
  <img src="https://raw.githubusercontent.com/diegoorodrigues006/beats-site/main/corpo/beats-trap.jpeg" alt="Beats Site Banner" width="100%" style="border-radius: 12px; max-height: 320px; object-fit: cover;">

  <br><br>

  # 🎵 BEATS SITE — PROD. KAIKY
  
  *Plataforma Web de Alta Performance para Exibição, Streaming e Comercialização de Beats Autorais*

  <br>

  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
  [![JavaScript ES6+](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
  [![Firebase Realtime](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![YouTube IFrame API](https://img.shields.io/badge/YouTube_API-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://developers.google.com/youtube/iframe_api_reference)
  [![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)](https://pages.github.com/)

  <br>

  [🔗 **Acessar Aplicação Online**](https://diegoorodrigues006.github.io/beats-site/) • [📱 **Entrar em Contato no WhatsApp**](https://wa.me/553171821903)

</div>

---

## 📑 Sumário

- [Visão Geral & Conceito](#-visão-geral--conceito)
- [Funcionalidades e Experiência do Usuário](#-funcionalidades-e-experiência-do-usuário)
- [Arquitetura de Software & Performance do DOM](#-arquitetura-de-software--performance-do-dom)
- [Integrações e APIs Externas](#-integrações-e-apis-externas)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Como Executar Localmente](#-como-executar-localmente)
- [Autor & Contato](#-autor--contato)

---

## 📌 Visão Geral & Conceito

O **Beats Site — Prod. Kaiky** é uma plataforma web estática porém dinâmica, construída para servir como catálogo digital e vitrine interativa de produções musicais. O objetivo principal do projeto é entregar uma experiência imersiva de streaming de áudio sem interrupções, aliada a um processo direto de conversão para vendas via WhatsApp.

Desenvolvido inteiramente em **Vanilla JavaScript** (sem a utilização de frameworks pesados como React ou Vue), o projeto se destaca pela sua leveza, carregamento ultrarrápido, e aplicação rigorosa de padrões de otimização de renderização e manipulação do DOM.

---

## 🛠️ Funcionalidades e Experiência do Usuário

```text
├── 🎧 Player Global Persistente
│   └── Permanece fixo no rodapé e continua a reprodução perfeitamente ao navegar pela aplicação.
├── 🎛️ Filtragem Dinâmica sem Reload
│   └── Troca de gêneros (Trap, Boombap, Detroit, Funk, Experimental) com resposta instantânea.
├── 🔥 Contador Global de Plays em Tempo Real
│   └── Sincronização via banco de dados para contabilizar execuções acumuladas de todos os ouvintes.
├── 📊 Gestão de Catálogo via Planilha (CMS Headless)
│   └── Atualização automática de novos beats através da publicação de dados do Google Sheets em CSV.
└── 💬 Workflow Automatizado de Vendas
    └── Links dinâmicos no botão de compra que abrem o WhatsApp com mensagem e dados do beat preenchidos.

⚡ Arquitetura de Software & Performance do DOM
A engenharia do front-end foi desenhada com foco na manutenção de uma taxa estável de 60 FPS (Frames Per Second) mesmo em dispositivos móveis de menor capacidade de processamento.

1. Prevenção de Layout Thrashing (Reflow & Repaint)
Em aplicações tradicionais, ler propriedades de dimensões do DOM e logo em seguida escrever atributos força o navegador a recalcular a geometria da tela repetidamente (Layout Thrashing).

Solução: Na função highlightActiveCards, controlamos a troca de estado utilizando a propriedade state.previousActiveId. Em vez de fazer uma varredura com querySelectorAll em toda a página para limpar e ativar cards, o sistema acessa exclusivamente o elemento que precisa perder o destaque e o novo elemento que precisa ganhar.

2. Montagem em Memória via DocumentFragment
Injetar elementos na árvore do DOM dentro de loops cria reflows dispendiosos para cada nó adicionado.

Solução: As funções renderBeatsGrid e renderBeatCard constroem toda a estrutura de cards primeiro dentro de um nó em memória usando document.createDocumentFragment(). Apenas uma única operação de escrita no DOM real é disparada ao final do processo.

3. Delegação de Eventos (Event Delegation)
Criar um event listener para cada botão ou card em listas extensas gera consumo excessivo de memória RAM.

Solução: O evento de clique é escutado apenas no elemento pai (#beats-grid ou carrosséis) através da função handleContainerBeatClick. A identificação do elemento clicado é resolvida via otimização do método event.target.closest('.beat-card').

4. Ciclo de Animação com Intersection Observer API
Em vez de escutar o evento window.onscroll (que dispara dezenas de vezes por segundo), o sistema utiliza a API nativa Intersection Observer. Quando os cards entram na área visível (viewport), a classe de animação é aplicada e o observador é imediatamente desconectado (unobserve), poupando ciclos de CPU.

5. Decodificação de Imagens Fora da Main Thread
Todas as capas importadas do YouTube possuem os atributos loading="lazy" e decoding="async". Isso garante que o navegador decodifique a imagem das miniaturas de forma assíncrona, liberando a thread principal para a execução suave de áudio e interações.

🔌 Integrações e APIs Externas
Tecnologia / API	Utilização no Projeto
YouTube IFrame API	Atua como a engine invisível do player de áudio. Permite reproduzir o som dos vídeos sem exibir os controles pesados do YouTube na interface.
Firebase Realtime Database	Armazena e sincroniza o contador total_plays em tempo real entre todas as instâncias ativas do site via websockets.
Google Sheets (CSV Endpoint)	Funciona como um CMS (Content Management System) sem custo. A adição de novas faixas na planilha atualiza a interface sem necessidade de novo deploy.
📁 Estrutura do Repositório
beats-site/
 ├── 📄 index.html          # Home da aplicação (Hero, Carrosséis de destaque e CTA)
 ├── 📄 beats.html          # Catálogo completo de faixas com filtros interativos
 ├── 📄 playlists.html      # Página de listagem geral das categorias de gêneros
 ├── 📄 playlist-detail.html# Detalhe temático e listagem por gênero selecionado
 ├── 🎨 style.css           # Estilos globais, temas neon, utilitários e CSS Responsivo
 └── ⚡ app.js              # Script único: estado global, player, parser CSV e manipuladores do DOM
