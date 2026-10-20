import './App.css';

function App() {
  return (
    <div className="container">
      {/* Cabeçalho da Newsletter */}
      <header>
        <h1>MusicDrop 🎵</h1>
        <p>A sua dose diária de novidades, artistas, indicações e os melhores álbuns do mundo.</p>
      </header>

      {/* Painel 1: Notícias do Mundo da Música */}
      <section>
        <h2>📰 Últimas Notícias</h2>
        <div className="card">
          <h3>Anúncio de Nova turnê global</h3>
          <p>Fique por dentro das datas e dos artistas que vão agitar os palcos este ano.</p>
        </div>
      </section>

      {/* Painel 2: Indicações para Ouvir */}
      <section>
        <h2>🎧 Indicações da Semana</h2>
        <div className="card">
          <h4>Álbum / Single Destaque</h4>
          <p>Um som fresco para adicionar à sua playlist de favoritos hoje mesmo.</p>
        </div>
      </section>

      {/* Painel 3: Melhores Álbuns do Mundo */}
      <section>
        <h2>🌟 Melhores Álbuns do Mundo</h2>
        <ul>
          <li><strong>Thriller</strong> - Michael Jackson</li>
          <li><strong>Dark Side of the Moon</strong> - Pink Floyd</li>
          <li><strong>Abbey Road</strong> - The Beatles</li>
        </ul>
      </section>
    </div>
  );
}

export default App;