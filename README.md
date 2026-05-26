# ⚡ Beats Site - Prod.Kaiky

Uma aplicação web SPA-like (Single Page Application architecture principles) desenvolvida para exposição, streaming e comercialização de instrumentais (beats) do produtor Kaiky. O projeto foca em performance client-side, modularização de componentes via manipulação dinâmica do DOM e consumo assíncrono de APIs.

---

## 🏗️ Arquitetura e Engenharia do Projeto

A aplicação foi estruturada seguindo o desacoplamento entre dados e interface. Os dados das faixas são centralizados em estruturas de objetos JSON (atualmente mapeados via Array em memória e em transição para camada de persistência externa).

### Recursos Técnicos Implementados:
* **Dynamic Routing por Query Strings:** Captura e parsing de parâmetros de URL (`URLSearchParams`) para controle de estado das views e filtragem reativa de catálogos sem necessidade de recarregamento de página.
* **Asynchronous Media Streaming:** Integração síncrona com a **YouTube Iframe Player API**. Encapsulamento de estados do player (`onStateChange`) para controle customizado de fila, progressão de tempo (`setInterval` para polling de `getCurrentTime`) e manipulação de interface nativa via interceptação de eventos.
* **Componentização via Template Literals:** Renderização dinâmica baseada em iterações estruturais (`Array.prototype.map` e `Array.prototype.join`) injetadas diretamente em nós específicos do DOM via propriedade `innerHTML`.
* **Otimização de Renderização Layout (CSS Grid/Flexbox):** Prevenção de reflows desnecessários utilizando propriedades modernas de layouting (`grid-template-columns: repeat(auto-fill, ...)`), garantindo responsividade fluida e controle estrutural via hardware acceleration (GPU) em efeitos de transição (`transform: translateY`).

---

## 🛠️ Stack Tecnológica

* **Runtime/Client Context:** ECMAScript 6+ (ES6+), HTML5 Semântico, CSS3 Advanced Layouting.
* **Third-Party APIs:** Google YouTube Iframe Player API, Font Awesome Core Engine.
* **DevOps / Infra:** GitHub Pages Environment.

---

## 🧬 Estrutura do Data Schema (Modelo de Dados)

Os objetos que compõem o catálogo seguem rigorosamente a seguinte interface de modelagem:

```typescript
interface Beat {
  idYoutube: string;   // Chave alfanumérica identificadora do vídeo/áudio no ecossistema Google
  artista: string;     // Nome do produtor/detentor dos direitos intelectuais
  nome: string;        // String de exibição pública da faixa
  genero: string;      // Tag de controle de escopo (trap | boombap | detroit | funk | experimental)
}
