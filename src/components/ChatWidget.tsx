"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import styles from "./ChatWidget.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; url: string }[];
}

const GREETING =
  "Hej! Jag är Oscar Larssons Trafikskolas digitala assistent. Fråga mig om utbildningar, priser eller hur du bokar. Skriv aldrig personnummer eller lösenord här.";

const SUGGESTIONS = [
  "Vad kostar en körlektion?",
  "Vilka paket har ni?",
  "Hur bokar jag en körlektion?",
  "Kan jag ta körkort på automat?",
];

const MAX_LENGTH = 1000;

const SITE_PATHS = ["/utbildningar", "/priser", "/om-oss", "/kontakt", "/boka"];

/** Gör URL:er, hemsidans sökvägar, e-post och telefonnummer klickbara utan att tolka HTML. */
function linkify(text: string): ReactNode[] {
  const pattern =
    /(https?:\/\/[^\s)]+[^\s).,!?]|(?<![\w/])\/[a-z-]+(?:#[a-z-]+)?(?![\w/])|[\w.+-]+@[\w-]+\.[\w.]*\w|0\d{2,3}-\d{2,3}(?: ?\d{2,3}){1,2})/g;
  return text.split(pattern).map((part, i) => {
    if (i % 2 === 0) return part;
    if (part.startsWith("/")) {
      return SITE_PATHS.includes(part.replace(/#.*$/, "")) ? <a key={i} href={part}>{part}</a> : part;
    }
    if (part.startsWith("http")) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer">
          {part.replace(/^https?:\/\//, "")}
        </a>
      );
    }
    if (part.includes("@")) return <a key={i} href={`mailto:${part}`}>{part}</a>;
    return <a key={i} href={`tel:${part.replace(/\D/g, "")}`}>{part}</a>;
  });
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Skicka de senaste turerna så att konversationen håller sig inom serverns gräns.
        body: JSON.stringify({ messages: next.slice(-19).map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Något gick fel.");
      setMessages([...next, { role: "assistant", content: data.reply, sources: data.sources }]);
    } catch (e) {
      setMessages(messages);
      setInput(question);
      setError(e instanceof Error ? e.message : "Något gick fel.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <>
      {open && (
        <section className={styles.panel} aria-label="Chatt med Oscar Larssons Trafikskola">
          <header className={styles.header}>
            <div>
              <p className={styles.title}>Oscar Larssons Trafikskola</p>
              <p className={styles.subtitle}>Digital assistent · svarar utifrån hemsidan</p>
            </div>
            <button className={styles.close} onClick={() => setOpen(false)} aria-label="Stäng chatten">
              <CloseIcon />
            </button>
          </header>

          <div className={styles.messages} ref={listRef} aria-live="polite">
            <div className={`${styles.bubble} ${styles.assistant}`}>{GREETING}</div>
            {messages.length === 0 && (
              <div className={styles.suggestions}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} className={styles.chip} onClick={() => void send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`${styles.bubble} ${m.role === "user" ? styles.user : styles.assistant}`}>
                {linkify(m.content)}
                {m.sources && m.sources.length > 0 && (
                  <p className={styles.sources}>
                    Källa:{" "}
                    {m.sources.map((s, j) => (
                      <span key={s.url}>
                        {j > 0 && " · "}
                        <a href={s.url}>{s.title}</a>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            ))}
            {loading && (
              <div className={`${styles.bubble} ${styles.assistant} ${styles.typing}`} aria-label="Assistenten skriver">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <form className={styles.form} onSubmit={onSubmit}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              maxLength={MAX_LENGTH}
              rows={1}
              placeholder="Skriv din fråga…"
              aria-label="Din fråga"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
            />
            <button className={styles.send} type="submit" disabled={loading || !input.trim()}>
              Skicka
            </button>
          </form>
          <p className={styles.disclaimer}>
            Assistenten kan inte boka åt dig. Kontrollera alltid priser och datum med trafikskolan.
          </p>
        </section>
      )}

      <button
        className={`${styles.launcher} ${open ? styles.launcherOpen : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Stäng chatten" : "Öppna chatten"}
      >
        {open ? (
          <CloseIcon />
        ) : (
          <>
            <ChatIcon />
            <span className={styles.launcherLabel}>Frågor? Chatta med oss</span>
          </>
        )}
      </button>
    </>
  );
}
