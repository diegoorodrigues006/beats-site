const beatsCsv = [
  "id,artista,nome,genero,preco",
  "video-trap,Kaiky,Beat Trap Teste,trap,R$ 60",
  "video-boombap,Kaiky,Beat Boombap Teste,boombap,R$ 70",
  "video-funk,Kaiky,Beat Funk Teste,funk,R$ 80",
].join("\n");

describe("Site Prod. Kaiky", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/spreadsheets/**", {
      statusCode: 200,
      headers: { "content-type": "text/csv; charset=utf-8" },
      body: beatsCsv,
    });

    cy.intercept("GET", "https://www.gstatic.com/firebase/**", {
      statusCode: 200,
      headers: { "content-type": "application/javascript" },
      body: "",
    });

    cy.intercept("GET", "https://www.youtube.com/iframe_api", {
      statusCode: 200,
      headers: { "content-type": "application/javascript" },
      body: "",
    });
  });

  it("carrega a página inicial e exibe os beats e gêneros", () => {
    cy.visit("/");

    cy.title().should("contain", "Prod. Kaiky");
    cy.get(".hero-title").should("be.visible").and("contain", "KAIKY");
    cy.get("#hero-beats-count").should("have.text", "3");
    cy.get("#hero-genres-count").should("have.text", "5");
    cy.get("#beats-carousel .beat-card").should("have.length", 3);
    cy.get("#playlists-carousel a").should("have.length", 5);
  });

  it("navega da página inicial para Beats e Playlists pelo menu", () => {
    cy.visit("/");

    cy.get(".nav-links").contains("a", "BEATS").click();
    cy.location("pathname").should("include", "/src/pages/beats.html");
    cy.get(".page-banner-title").should("contain", "TODOS OS BEATS");
    cy.get("#beats-grid .beat-card").should("have.length", 3);

    cy.get(".nav-links").contains("a", "PLAYLISTS").click();
    cy.location("pathname").should("include", "/src/pages/playlists.html");
    cy.get(".page-banner-title").should("contain", "PLAYLISTS");
    cy.get("#playlists-grid .playlist-card").should("have.length", 5);
  });

  it("filtra beats pelo gênero e volta a exibir todos", () => {
    cy.visit("/src/pages/beats.html");

    cy.get("#beats-grid .beat-card").should("have.length", 3);
    cy.get('.filter-btn[data-genre="funk"]').click();
    cy.get("#beats-grid .beat-card").should("have.length", 1);
    cy.get("#beats-grid .beat-genre-tag").should("have.text", "funk");

    cy.get('.filter-btn[data-genre="todos"]').click();
    cy.get("#beats-grid .beat-card").should("have.length", 3);
  });

  it("abre uma playlist de gênero e permite voltar à lista", () => {
    cy.visit("/src/pages/playlists.html");

    cy.get(".playlist-card")
      .contains(".playlist-card-title", "trap")
      .click();

    cy.location("pathname").should("include", "/src/pages/playlist-detail.html");
    cy.location("search").should("contain", "genero=trap");
    cy.get("#playlist-banner-title").should("have.text", "trap");
    cy.get("#playlist-beat-count").should("have.text", "1");
    cy.get("#playlist-detail-grid .beat-card").should("have.length", 1);

    cy.get(".back-link").click();
    cy.location("pathname").should("include", "/src/pages/playlists.html");
  });

  it("usa o controle de rolagem do carrossel de beats", () => {
    cy.visit("/");

    cy.get("#beats-carousel").then(($carousel) => {
      cy.stub($carousel[0], "scrollBy").as("scrollBeats");
    });

    cy.get("#scroll-beats-right").click();
    cy.get("@scrollBeats").should(
      "have.been.calledWith",
      Cypress.sinon.match({ left: 220, behavior: "smooth" })
    );
  });

  it("mantém links de contato externos configurados para nova aba", () => {
    cy.visit("/");

    cy.get('.nav-links a[href^="https://wa.me/"]')
      .should("have.attr", "target", "_blank")
      .and("have.attr", "rel")
      .and("contain", "noopener");
  });
});
