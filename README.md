<div align="center">

# 🎧 Beats Site — Prod. Kaiky

**Plataforma web de alta performance para exibição, streaming de áudio e comercialização de beats autorais.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](#)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime_DB-FFCA28?style=flat-square&logo=firebase&logoColor=black)](#)
[![Google Sheets API](https://img.shields.io/badge/CMS-Google_Sheets_CSV-34A853?style=flat-square&logo=googlesheets&logoColor=white)](#)

---

</div>

## 📌 Sobre o Projeto

O **Beats Site** é um catálogo interativo desenvolvido para o produtor **Kaiky**, permitindo que artistas explorem, ouçam e adquiram instrumentalizações autorais de diversos gêneros urbanos: **Trap, Boombap, Detroit, Funk e Experimental**.

A aplicação utiliza uma abordagem *Headless CMS* usando o Google Sheets como gerenciador de conteúdo e o Firebase como banco em tempo real para controle de métricas.

---

## 🏗️ Arquitetura de Dados

| Camada | Tecnologia | Função |
| :--- | :--- | :--- |
| **CMS Headless** | Google Sheets (CSV) | Armazenamento dinâmico dos metadados dos beats (título, BPM, tom, capa, link de áudio). |
| **Realtime Metrics** | Firebase Realtime DB | Registro e sincronização em tempo real do contador de *plays* por beat. |
| **Audio Engine** | YouTube IFrame Player API | Gerenciamento do player de áudio integrado, controles e carregamento assíncrono. |

---

## ⚡ Otimizações de Performance & DOM

<details>
<summary><b>1. Renderização em lote com DocumentFragment</b></summary>

> Minimiza o número de *reflows* e *repaints* no navegador, inserindo múltiplos elementos de mídia no DOM de uma única vez.
</details>

<details>
<summary><b>2. Delegação de Eventos (.closest())</b></summary>

> Evita a criação excessiva de escutadores de evento (*listeners*). Apenas um único escutador na árvore pai gerencia a interação de reprodução de toda a lista de beats.
</details>

<details>
<summary><b>3. Prevenção de Layout Thrashing</b></summary>

> Controle cirúrgico do estado ativo via `previousActiveId`, impedindo relayouts desnecessários da página durante a troca de faixas.
</details>

<details>
<summary><b>4. Intersection Observer API</b></summary>

> Animações de scroll performáticas e carregamento otimizado de imagens/recursos de mídia conforme o usuário navega pela tela.
</details>

---

## 📂 Estrutura de Arquivos

```text
beats-site/
├── public/
│   └── assets/             # Banners, capas e mídias estáticas
├── src/
│   ├── css/
│   │   └── style.css       # Estilização global do projeto
│   ├── js/
│   │   └── app.js          # Lógica principal, Firebase e Player API
│   └── pages/              # Páginas secundárias
│       ├── beats.html
│       ├── playlist-detail.html
│       └── playlists.html
├── .gitignore              # Arquivos ignorados pelo Git
├── index.html              # Landing page principal
└── README.md               # Documentação do repositório

Bash
cd beats-site
Execute o arquivo:
A aplicação é 100% estática. Abra o arquivo index.html em qualquer navegador moderno ou via extensão Live Server no VS Code.

Desenvolvido por Diego Rodrigues • Todos os direitos autorais reservados a Prod. Kaiky (2026)
