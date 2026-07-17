# 🎵 Beats-Site — Prod. Kaiky

<p align="center">
  <img src="https://img.shields.io/github/stars/diegoorodrigues006/beats-site?style=for-the-badge&color=ccff00&labelColor=1a1a1a" alt="Stars">
  <img src="https://img.shields.io/github/forks/diegoorodrigues006/beats-site?style=for-the-badge&color=ccff00&labelColor=1a1a1a" alt="Forks">
  <img src="https://img.shields.io/github/license/diegoorodrigues006/beats-site?style=for-the-badge&color=ccff00&labelColor=1a1a1a" alt="License">
</p>

<p align="center">
  <a href="#-demonstração">Ver Demonstração</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-como-rodar">Como Rodar</a>
</p>

---

## 📌 Sobre o Projeto

O **Beats-Site** é uma plataforma web premium, moderna e totalmente responsiva desenvolvida para o produtor **KAIKY PROD**. O site funciona como um catálogo interativo e dinâmico de instrumentais, permitindo que artistas naveguem por gêneros, ouçam os beats em tempo real e façam a aquisição direta via integração com o WhatsApp.

O grande diferencial técnico do projeto é o consumo automatizado de dados através de uma planilha do Google Sheets (atuando como um CMS leve) combinado a um player global persistente que utiliza a API de IFrame do YouTube no background.

---

## 🚀 Demonstração

O projeto está publicado e pronto para ser testado homologado ao vivo:

👉 **[Acesse o site rodando no GitHub Pages](https://diegoorodrigues006.github.io/beats-site/)**

---

## ✨ Funcionalidades

### 🏠 Página Inicial (Home)
- **Painel Estatístico Real-time**: Exibição dinâmica do total de beats cadastrados, quantidade de gêneros trabalhados e um contador persistente de **reproduções (Plays)** integrado ao `localStorage`.
- **Letreiro Dinâmico (Marquee)**: Efeito de texto contínuo estilizado com identidade urbana e streetwear.
- **Carrosséis Fluidos**: Navegação horizontal otimizada por gestos no mobile (touch) e por botões de navegação no desktop.

### 🎵 Sistema de Player Global Persistente
- **Música Sem Interrupções**: Player fixo no rodapé que permite ao usuário continuar ouvindo o instrumental enquanto navega por diferentes páginas do site.
- **Controle Total**: Opções de Play, Pause, Avançar, Voltar, barra de progresso clicável com cálculo de tempo (`MM:SS`) e animação visual de onda sonora (Waveform).

### 🗂️ Filtros e Categorias
- **Páginas por Gênero**: Separação inteligente para Trap, Boombap, Detroit, Funk e Experimental.
- **Consumo de Planilha**: Adição, remoção ou alteração de preços e instrumentais feitas direto pelo Google Sheets, atualizando o site automaticamente sem necessidade de novos deploys de código.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias nativas para garantir o máximo de performance, carregamento instantâneo e fluidez visual:

- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) — Estruturação semântica.
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) — Design responsivo customizado, animações, efeitos neon (`text-shadow`) e layout adaptável (Grid/Flexbox).
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) — Lógica de estados, manipulação assíncrona do DOM e persistência com `localStorage`.
- ![YouTube API](https://img.shields.io/badge/YouTube_API-FF0000?style=for-the-badge&logo=youtube&logoColor=white) — Integração com a API oficial de IFrame do YouTube para streaming de áudio estável.

---


---

---

## 💻 Como Rodar o Projeto Localmente

* **Passo 1:** Clone o repositório executando o comando abaixo no seu terminal:
git clone https://github.com/diegoorodrigues006/beats-site.git

* **Passo 2:** Entre na pasta que foi criada:
cd beats-site

* **Passo 3:** Execute o projeto abrindo o arquivo `index.html` diretamente no seu navegador, ou utilize a extensão *Live Server* do VS Code para uma melhor experiência de desenvolvimento.

---

## 👤 Desenvolvedor

Desenvolvido com ⚡ por **Diego Rodrigues**.

* **GitHub:** https://github.com/diegoorodrigues006
