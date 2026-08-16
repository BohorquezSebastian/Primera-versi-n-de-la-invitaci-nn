"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import viewpointPhoto from "./assets/sonia-fernando-mirador.webp";
import goldenEnvelope from "./assets/sobre-dorado-3d-v1.webp";
import openGoldenEnvelope from "./assets/sobre-dorado-abierto-v2.png";

const WEDDING_DATE = new Date("2026-09-11T17:00:00-05:00").getTime();
const WHATSAPP_NUMBER = "573103223000";
const BREB_KEY = "@sanchez1569";

type Countdown = { days: number; hours: number; minutes: number; seconds: number };
type DressTone = "burgundy" | "gold" | "forest" | "navy" | "charcoal";

const DRESS_TONES: Array<{ id: DressTone; label: string }> = [
  { id: "burgundy", label: "Borgoña" },
  { id: "gold", label: "Dorado oscuro" },
  { id: "forest", label: "Verde bosque" },
  { id: "navy", label: "Azul noche" },
  { id: "charcoal", label: "Carbón" },
];

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
  const [dressTone, setDressTone] = useState<DressTone>("burgundy");
  const [giftOpened, setGiftOpened] = useState(false);
  const [brebCopied, setBrebCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setCountdown(getCountdown());
    const timer = setInterval(() => setCountdown(getCountdown()), 1_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => () => audioRef.current?.pause(), []);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -40px" });

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

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
      "PRODID:-//Fernando y Sonia//Boda//ES",
      "BEGIN:VEVENT",
      "UID:fernando-sonia-20260911@boda",
      "DTSTAMP:20260814T120000Z",
      "DTSTART:20260911T220000Z",
      "DTEND:20260912T040000Z",
      "SUMMARY:Boda de Fernando y Sonia",
      "LOCATION:Salón de Eventos - Conjunto Residencial Paseo de Santa Catalina",
      "DESCRIPTION:Nos encantará compartir este día contigo.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "boda-fernando-y-sonia.ics";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function shareInvitation() {
    const shareData = { title: "Boda de Fernando y Sonia", text: "Acompáñanos a celebrar nuestro amor", url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      window.alert("Enlace copiado");
    }
  }

  async function copyBrebKey() {
    try {
      await navigator.clipboard.writeText(BREB_KEY);
      setBrebCopied(true);
      window.setTimeout(() => setBrebCopied(false), 2_200);
    } catch {
      window.prompt("Copia la llave Bre-B:", BREB_KEY);
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
      "Confirmación enviada desde la invitación web de Fernando y Sonia.",
    ].filter(Boolean).join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setConfirmed(true);
  }

  return (
    <main className={`site-shell ${opened ? "invitation-open" : ""}`}>
      <audio
        ref={audioRef}
        preload="auto"
        loop
      >
        <source src="./audio/cancion-boda.mp3" type="audio/mpeg" />
        <source src="./audio/boda-suave.mp3" type="audio/mpeg" />
      </audio>
      <section className="opening-scene" aria-hidden={opened}>
        <div className="opening-copy">
          <span className="eyebrow">Tenemos algo que contarte</span>
          <h1>Una historia para siempre</h1>
          <p>Toca el sello para descubrir nuestra invitación.</p>
        </div>

        <button className="envelope-button" type="button" onClick={openInvitation} aria-label="Abrir invitación de boda">
          <span className="envelope">
            <img className="golden-envelope-art" src={goldenEnvelope} alt="" aria-hidden="true" />
            <span className="golden-seal-monogram" aria-hidden="true">FS</span>
            <span className="envelope-glint" aria-hidden="true" />
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
        <div className="petal-field" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
        </div>
        <div className="botanical botanical-left" aria-hidden="true"><span>⌇</span><span>❧</span><span>⌇</span></div>
        <div className="botanical botanical-right" aria-hidden="true"><span>⌇</span><span>❧</span><span>⌇</span></div>
        <div className="hero-content">
          <p className="hero-kicker">Nos casamos</p>
          <h2><span>Fernando</span><i>&amp;</i><span>Sonia</span></h2>
          <div className="ornament" aria-hidden="true"><span /><b>✦</b><span /></div>
          <p className="hero-intro">Hay momentos en la vida que son especiales por sí solos. Compartirlos con quienes amamos los convierte en inolvidables.</p>
          <div className="date-lockup" aria-label="11 de septiembre de 2026"><span>Viernes</span><strong>11</strong><span>Septiembre · 2026</span></div>
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

      <section className="story-section light-section" aria-labelledby="story-title">
        <div className="story-heading reveal-item" data-reveal>
          <p className="section-kicker">Fernando &amp; Sonia</p>
          <h3 id="story-title">Nuestra historia, nuestro para siempre</h3>
          <p>Los mejores recuerdos nacen de los momentos sencillos: una aventura, una celebración y la alegría de caminar juntos.</p>
        </div>

        <div className="story-collage">
          <figure className="story-photo story-photo-main reveal-item" data-reveal>
            <div className="photo-window"><img src={viewpointPhoto} alt="Fernando y Sonia juntos en un mirador de la ciudad" /></div>
            <figcaption>El mejor paisaje siempre será juntos</figcaption>
          </figure>
        </div>

        <div className="story-signature reveal-item" data-reveal aria-label="Fernando y Sonia">
          <span>Fernando</span><i>&amp;</i><span>Sonia</span>
        </div>
      </section>

      <section className="details-section dark-section">
        <div className="section-heading">
          <p className="section-kicker">El gran día</p>
          <h3>Te esperamos para celebrar</h3>
          <p>Será un día lleno de amor, alegría y momentos que queremos vivir contigo.</p>
        </div>
        <div className="event-grid single-event-grid">
          <article className="event-card featured-card">
            <span className="card-number">01</span>
            <div className="line-icon" aria-hidden="true">⌖</div>
            <p className="card-type">Ceremonia y recepción</p>
            <h4>Paseo de Santa Catalina</h4>
            <p>Viernes, 11 de septiembre de 2026</p>
            <p>5:00 p. m.</p>
            <p>Salón de Eventos del Conjunto Residencial</p>
            <a href="https://www.google.com/maps?q=4.732814,-74.064056" target="_blank" rel="noreferrer">Ver ubicación <span>↗</span></a>
          </article>
        </div>
      </section>

      <section className={`dress-section dress-${dressTone}`}>
        <div className="dress-copy">
          <p className="section-kicker">Código de vestuario</p>
          <h3>Cóctel de noche</h3>
          <p>Elegancia sofisticada para una celebración nocturna.</p>
          <div className="palette" aria-label="Paleta sugerida para cóctel de noche">
            {DRESS_TONES.map(({ id, label }) => (
              <button
                key={id}
                className={`tone-${id}`}
                type="button"
                title={label}
                aria-label={`Ver ambiente ${label}`}
                aria-pressed={dressTone === id}
                onClick={() => setDressTone(id)}
              />
            ))}
          </div>
          <span className="palette-hint">Toca un color para transformar la atmósfera.</span>
          <small>El blanco y los tonos marfil quedan reservados exclusivamente para la novia.</small>
        </div>
      </section>

      <section className="gift-section light-section">
        <div className="gift-mark" aria-hidden="true">✦</div>
        <p className="section-kicker">Un gesto de cariño</p>
        <h3>Tu presencia hace especial este día</h3>
        <p className="gift-intro">Compartir este momento contigo es nuestro mejor regalo. Si deseas acompañarnos con un detalle adicional, puedes abrir este sobre.</p>

        <div className={`gift-envelope-area ${giftOpened ? "is-open" : ""}`}>
          <div className="gift-letter" aria-hidden={!giftOpened}>
            <button className="gift-letter-close" type="button" onClick={() => setGiftOpened(false)} aria-label="Cerrar el sobre">×</button>
            <span className="gift-letter-kicker">Con cariño</span>
            <p>Para quienes deseen tener un detalle con nosotros, hemos dispuesto esta opción.</p>
            <small>Llave Bre-B</small>
            <strong>{BREB_KEY}</strong>
            <button className="gift-copy-button" type="button" onClick={copyBrebKey}>{brebCopied ? "¡Llave copiada!" : "Copiar llave"}</button>
          </div>

          <button
            className="gift-envelope-button"
            type="button"
            aria-expanded={giftOpened}
            onClick={() => setGiftOpened((value) => !value)}
          >
            <span className="gift-envelope">
              <img className="gift-envelope-closed" src={goldenEnvelope} alt="" aria-hidden="true" />
              <img className="gift-envelope-open" src={openGoldenEnvelope} alt="" aria-hidden="true" />
              <span className="gift-envelope-seal" aria-hidden="true">FS</span>
            </span>
            <span className="gift-open-label">Abrir sobre</span>
          </button>
        </div>
      </section>

      <section className="rsvp-section" id="rsvp">
        <div className="rsvp-card">
          <div className="section-heading">
            <p className="section-kicker">R. S. V. P.</p>
            <h3>¿Nos acompañas?</h3>
            <p>Confirma tu asistencia antes del 28 de agosto de 2026.</p>
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
        <h3>Fernando <i>&amp;</i> Sonia</h3>
        <span>11 · 09 · 2026</span>
        <button type="button" onClick={shareInvitation}>Compartir invitación ↗</button>
      </footer>
    </main>
  );
}
