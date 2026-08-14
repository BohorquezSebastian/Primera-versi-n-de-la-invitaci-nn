"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

const WEDDING_DATE = new Date("2027-05-22T15:30:00-05:00").getTime();
const WHATSAPP_NUMBER = "573045933820";

type Countdown = { days: number; hours: number; minutes: number; seconds: number };

const COUNTDOWN_LABELS: Array<[keyof Countdown, string]> = [
  ["days", "Días"],
  ["hours", "Horas"],
  ["minutes", "Min"],
  ["seconds", "Seg"],
];

function getCountdown(): Countdown {
  const distance = Math.max(0, WEDDING_DATE - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [musicOn, setMusicOn] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setCountdown(getCountdown());
    const timer = setInterval(() => setCountdown(getCountdown()), 1_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => () => audioRef.current?.pause(), []);

  async function startMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.32;
    try {
      await audio.play();
      setMusicOn(true);
    } catch {
      // Some browsers can still restrict playback. The visible control remains
      // available so the guest can start it with a single touch.
      setMusicOn(false);
    }
  }

  function openInvitation() {
    setOpened(true);
    void startMusic();
  }

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setMusicOn(false);
      return;
    }
    await startMusic();
  }

  function downloadCalendar() {
    const calendar = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Camila y Mateo//Boda//ES",
      "BEGIN:VEVENT",
      "UID:camila-mateo-20270522@boda",
      "DTSTAMP:20260813T120000Z",
      "DTSTART:20270522T203000Z",
      "DTEND:20270523T030000Z",
      "SUMMARY:Boda de Camila y Mateo",
      "LOCATION:Hacienda San Rafael, Sopó, Cundinamarca",
      "DESCRIPTION:Nos encantará compartir este día contigo.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "boda-camila-y-mateo.ics";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function shareInvitation() {
    const shareData = { title: "Boda de Camila y Mateo", text: "Acompáñanos a celebrar nuestro amor", url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      window.alert("Enlace copiado");
    }
  }

  function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const attendance = String(formData.get("attendance") ?? "");
    const guests = String(formData.get("guests") ?? "1");
    const guestMessage = String(formData.get("message") ?? "").trim();

    const whatsappMessage = [
      "💌 *Confirmación de asistencia*",
      "",
      `Hola, soy *${name}*.`,
      `Respuesta: *${attendance}*.`,
      `Número de asistentes: *${guests}*.`,
      guestMessage ? `Mensaje: ${guestMessage}` : "",
      "",
      "Confirmación enviada desde la invitación web de Camila y Mateo.",
    ].filter(Boolean).join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setConfirmed(true);
  }

  return (
    <main className={`site-shell ${opened ? "invitation-open" : ""}`}>
      <audio
        ref={audioRef}
        src="./audio/boda-suave.mp3"
        preload="auto"
        loop
      />
      <section className="opening-scene" aria-hidden={opened}>
        <div className="opening-copy">
          <span className="eyebrow">Tenemos algo que contarte</span>
          <h1>Una historia para siempre</h1>
          <p>Toca el sello para descubrir nuestra invitación.</p>
        </div>

        <button className="envelope-button" type="button" onClick={openInvitation} aria-label="Abrir invitación de boda">
          <span className="envelope">
            <span className="envelope-back" />
            <span className="letter-preview">
              <span className="letter-mark">C <i>&amp;</i> M</span>
              <span className="letter-date">22 · 05 · 2027</span>
            </span>
            <span className="envelope-front" />
            <span className="envelope-flap" />
            <span className="wax-seal"><span className="seal-monogram">CM</span><span className="seal-orbit" /></span>
          </span>
          <span className="open-label">Abrir invitación</span>
        </button>
      </section>

      <button className="music-toggle" type="button" onClick={toggleMusic} aria-pressed={musicOn} aria-label={musicOn ? "Silenciar música" : "Reproducir música"}>
        <span className={musicOn ? "sound-wave active" : "sound-wave"} aria-hidden="true"><i /><i /><i /></span>
        {musicOn ? "Silenciar" : "Música"}
      </button>

      <section className="hero" aria-hidden={!opened}>
        <div className="hero-grain" />
        <div className="botanical botanical-left" aria-hidden="true"><span>⌇</span><span>❧</span><span>⌇</span></div>
        <div className="botanical botanical-right" aria-hidden="true"><span>⌇</span><span>❧</span><span>⌇</span></div>
        <div className="hero-content">
          <p className="hero-kicker">Nos casamos</p>
          <h2><span>Camila</span><i>&amp;</i><span>Mateo</span></h2>
          <div className="ornament" aria-hidden="true"><span /><b>✦</b><span /></div>
          <p className="hero-intro">Hay momentos en la vida que son especiales por sí solos. Compartirlos con quienes amamos los convierte en inolvidables.</p>
          <div className="date-lockup" aria-label="22 de mayo de 2027"><span>Sábado</span><strong>22</strong><span>Mayo · 2027</span></div>
          <button className="scroll-cue" type="button" onClick={() => document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" })}>Descubre la celebración <span aria-hidden="true">↓</span></button>
        </div>
      </section>

      <section className="countdown-section light-section" id="countdown">
        <p className="section-kicker">Guarda la fecha</p>
        <h3>Cada día falta un poco menos</h3>
        <div className="countdown" aria-label={`${countdown.days} días, ${countdown.hours} horas, ${countdown.minutes} minutos y ${countdown.seconds} segundos`}>
          {COUNTDOWN_LABELS.map(([key, label]) => (
            <div className="countdown-unit" key={key}><strong>{String(countdown[key]).padStart(2, "0")}</strong><span>{label}</span></div>
          ))}
        </div>
        <button className="primary-button dark-button" type="button" onClick={downloadCalendar}>Agregar al calendario</button>
      </section>

      <section className="details-section dark-section">
        <div className="section-heading">
          <p className="section-kicker">El gran día</p>
          <h3>Te esperamos para celebrar</h3>
          <p>Será un día lleno de amor, alegría y momentos que queremos vivir contigo.</p>
        </div>
        <div className="event-grid">
          <article className="event-card">
            <span className="card-number">01</span>
            <div className="line-icon" aria-hidden="true">♢</div>
            <p className="card-type">Ceremonia</p>
            <h4>Capilla San José</h4>
            <p>Sábado, 22 de mayo</p><p>3:30 p. m.</p><p>Sopó, Cundinamarca</p>
            <a href="https://www.google.com/maps/search/?api=1&query=Capilla+San+Jose+Sopo+Cundinamarca" target="_blank" rel="noreferrer">Ver ubicación <span>↗</span></a>
          </article>
          <article className="event-card featured-card">
            <span className="card-number">02</span>
            <div className="line-icon" aria-hidden="true">✦</div>
            <p className="card-type">Recepción</p>
            <h4>Hacienda San Rafael</h4>
            <p>Sábado, 22 de mayo</p><p>5:30 p. m.</p><p>Sopó, Cundinamarca</p>
            <a href="https://www.google.com/maps/search/?api=1&query=Hacienda+San+Rafael+Sopo+Cundinamarca" target="_blank" rel="noreferrer">Cómo llegar <span>↗</span></a>
          </article>
        </div>
      </section>

      <section className="timeline-section light-section">
        <div className="section-heading dark-copy">
          <p className="section-kicker">Nuestro itinerario</p>
          <h3>Un día para recordar</h3>
        </div>
        <div className="timeline">
          <div className="timeline-item"><span>3:30</span><i>✦</i><div><strong>Ceremonia</strong><p>El momento de decir “sí”.</p></div></div>
          <div className="timeline-item"><span>5:00</span><i>✦</i><div><strong>Cóctel</strong><p>Brindemos por el amor.</p></div></div>
          <div className="timeline-item"><span>6:30</span><i>✦</i><div><strong>Cena</strong><p>Sabores para compartir.</p></div></div>
          <div className="timeline-item"><span>8:30</span><i>✦</i><div><strong>Celebración</strong><p>Que comience la fiesta.</p></div></div>
        </div>
      </section>

      <section className="dress-section">
        <div className="dress-copy">
          <p className="section-kicker">Código de vestuario</p>
          <h3>Elegante</h3>
          <p>Queremos verte increíble. Traje formal para ellos y vestido largo o midi para ellas.</p>
          <div className="palette" aria-label="Paleta sugerida"><span /><span /><span /><span /><span /></div>
          <small>El blanco está reservado para la novia.</small>
        </div>
      </section>

      <section className="gift-section light-section">
        <div className="gift-mark" aria-hidden="true">♡</div>
        <p className="section-kicker">Tu presencia es nuestro regalo</p>
        <h3>Lluvia de sobres</h3>
        <p>Lo más importante para nosotros es compartir este día contigo. Si deseas hacernos un obsequio, tendremos disponible una lluvia de sobres.</p>
      </section>

      <section className="rsvp-section" id="rsvp">
        <div className="rsvp-card">
          <div className="section-heading">
            <p className="section-kicker">R. S. V. P.</p>
            <h3>¿Nos acompañas?</h3>
            <p>Confirma tu asistencia antes del 22 de abril de 2027.</p>
          </div>
          {confirmed ? (
            <div className="confirmation-message" role="status">
              <span>✓</span>
              <h4>¡Ya casi terminamos!</h4>
              <p>Se abrió WhatsApp con tu confirmación. Revísala y toca el botón Enviar para que los novios la reciban.</p>
              <button className="retry-button" type="button" onClick={() => setConfirmed(false)}>Cambiar respuesta</button>
            </div>
          ) : (
            <form onSubmit={submitRsvp}>
              <label>Nombre completo<input name="name" required placeholder="Escribe tu nombre" /></label>
              <label>¿Podrás acompañarnos?<select name="attendance" required defaultValue=""><option value="" disabled>Selecciona una opción</option><option>Sí, allí estaré</option><option>No podré asistir</option></select></label>
              <label>Número de asistentes<select name="guests" defaultValue="1"><option value="1">1 persona</option><option value="2">2 personas</option><option value="3">3 personas</option></select></label>
              <label>Mensaje para los novios<textarea name="message" placeholder="Déjanos unas palabras…" rows={3} /></label>
              <button className="primary-button" type="submit">Confirmar asistencia</button>
            </form>
          )}
        </div>
      </section>

      <footer>
        <p>Con amor</p>
        <h3>Camila <i>&amp;</i> Mateo</h3>
        <span>22 · 05 · 2027</span>
        <button type="button" onClick={shareInvitation}>Compartir invitación ↗</button>
      </footer>
    </main>
  );
}
