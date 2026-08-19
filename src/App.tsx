import { useEffect, useRef } from 'react';

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio autoplay blocked."));
    }
  }, []);

  return (
    <div className="invitation-container">
      <audio ref={audioRef} src="./audio/cancion-boda.mp3" loop />
      <header className="header">
        <h1>¡Nos Casamos!</h1>
        <p>Estás invitado a celebrar con nosotros</p>
      </header>
      
      <main className="details">
        <section className="names">
          <h2>María & Juan</h2>
        </section>
        
        <section className="date-time">
          <p>Sábado, 24 de Octubre de 2026</p>
          <p>16:00 HRS</p>
        </section>

        <section className="location">
          <h3>La Recepción</h3>
          <p>Finca Los Rosales, Ciudad</p>
        </section>

        <button className="rsvp-btn" onClick={() => audioRef.current?.play()}>
          Confirmar Asistencia
        </button>
      </main>
    </div>
  )
}

export default App;