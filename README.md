<div align="center">

  <!-- Header Banner Visual -->
  <table>
    <tr>
      <td align="center" width="1000" rgba(204,255,0,0.1)>
        <br>
        <h1>⚡ PROD. KAIKY — BEATS SITE</h1>
        <p><i>Platform for Streaming, Catalogue Management & Digital Licensing</i></p>
        <code>TRAP</code> • <code>BOOMBAP</code> • <code>DETROIT</code> • <code>FUNK</code> • <code>EXPERIMENTAL</code>
        <br><br>
      </td>
    </tr>
  </table>

  <br>

  <!-- Badges Tecnológicas -->
  <img src="https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript" alt="JS">
  <img src="https://img.shields.io/badge/HTML5-Semantic-orange?style=flat-square&logo=html5" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-Modular-blue?style=flat-square&logo=css3" alt="CSS3">
  <img src="https://img.shields.io/badge/Firebase-Realtime-red?style=flat-square&logo=firebase" alt="Firebase">
  <img src="https://img.shields.io/badge/API-YouTube_IFrame-red?style=flat-square&logo=youtube" alt="YouTube API">
  <img src="https://img.shields.io/badge/Performance-60_FPS-brightgreen?style=flat-square" alt="Performance">

  <br><br>

  <a href="https://diegoorodrigues006.github.io/beats-site/"><strong>🌐 Acesse a Plataforma</strong></a> | 
  <a href="https://wa.me/553171821903"><strong>💬 Contato Comercial</strong></a>

</div>

---

## 🎧 Visão Geral

O **Beats Site** é uma aplicação web desenvolvida sob medida para a apresentação e comercialização de instrumental autoral. A plataforma resolve o desafio de entregar áudio contínuo e navegação de alta velocidade, integrando um player persistente, contadores globais sincronizados e conversão direta para o WhatsApp.

---

## ⚡ Engenharia de Front-End & Desempenho

A aplicação foi construída em **Vanilla JavaScript**, priorizando a eficiência na manipulação do DOM e a economia de memória em dispositivos móveis.

<details>
<summary><strong>▶ Clique para abrir a análise de arquitetura do DOM</strong></summary>

<br>

### 🟢 1. Injeção em Lote (`DocumentFragment`)
O carregamento de cards de áudio evita repasses consecutivos de renderização (*reflows*). As estruturas HTML são construídas e organizadas em memória via `DocumentFragment` antes de uma única inserção no DOM.

### 🟢 2. Gestão de Eventos via Delegação
Em vez de alocar ouvintes de clique para cada nó de card criado, os eventos são tratados de forma centralizada pelo contêiner pai via `event.target.closest('.beat-card')`.

### 🟢 3. Atualizações Cirúrgicas de Interface
A troca de estados de reprodução não reconstrói a árvore de nós. A função de controle atualiza exclusivamente as propriedades necessárias (`classList`, atributos `d` de vetores SVG e `backgroundImage`) de forma pontual usando a referência `previousActiveId`.

### 🟢 4. Animações com `Intersection Observer`
As transições visuais de scroll dependem de observadores assíncronos nativos. Ao entrar na *viewport*, a classe visual é ativada e o observador é imediatamente desativado (`unobserve`), liberando a *Main Thread*.

</details>

---

## 📊 Arquitetura de Dados & Integrações

| Componente | Função no Sistema | Método de Comunicação |
| :--- | :--- | :--- |
| **YouTube IFrame API** | Motor invisível para reprodução de áudio | Eventos assíncronos baseados em estado (`onStateChange`) |
| **Firebase Realtime DB** | Sincronização do contador global de plays | Escuta contínua via WebSockets (`on('value')`) |
| **Google Sheets CSV** | CMS Headless para catálogo de beats | Fetch HTTP nativo e parsing de CSV customizado |

---

## 📂 Estrutura de Módulos

```text
beats-site/
 ├── index.html           # Página Principal (Hero, Destaques e Call to Action)
 ├── beats.html           # Catálogo Geral com Filtro de Gêneros
 ├── playlists.html       # Visualização das Categorias Musicais
 ├── playlist-detail.html # Detalhes da Playlist Temática
 ├── style.css            # Estilização Global, Neon Utilitários e Responsividade
 └── app.js               # Gerenciador do Estado Global, Player e DOM

💻 Instruções para Instalação Local
Clone o repositório para o seu ambiente local:

Bash
git clone [https://github.com/diegoorodrigues006/beats-site.git](https://github.com/diegoorodrigues006/beats-site.git)
Entre na pasta do projeto:

Bash
cd beats-site
Execute o arquivo:
A aplicação é 100% estática. Abra o arquivo index.html em qualquer navegador moderno ou via extensão Live Server no VS Code.

Desenvolvido por Diego Rodrigues • Todos os direitos autorais reservados a Prod. Kaiky (2026)
