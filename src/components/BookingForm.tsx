"use client";

import Link from "next/link";
import Icon from "./Icon";
import { ErrorSummary, FieldError, SubmitButton } from "./FormParts";
import { useDemoForm } from "./useDemoForm";
import type { FieldRule } from "@/lib/form";

export const BOOKING_OPTIONS = [
  { value: "korlektion", label: "Körlektion B" },
  { value: "start", label: "Startpaket" },
  { value: "korkort", label: "Körkortspaket" },
  { value: "intensiv", label: "Intensivpaket" },
  { value: "riskutbildning", label: "Riskutbildning" },
  { value: "introduktionsutbildning", label: "Handledarkurs" },
  { value: "teori", label: "Teorikväll" },
  { value: "am-kurs", label: "AM-kurs (moped)" },
  { value: "be-och-b96", label: "BE eller B96" },
] as const;

const TIMES = ["Förmiddag", "Eftermiddag", "Kväll", "Lördag"];

const RULES: Record<string, FieldRule> = {
  namn: { label: "Namn", required: true },
  telefon: { label: "Telefon", required: true, type: "phone" },
  epost: { label: "E-post", type: "email" },
};

export default function BookingForm({ initial }: { initial?: string }) {
  const { errors, summary, sending, sent, setSent, summaryRef, onBlur, onSubmit, fieldProps } = useDemoForm(RULES);
  const selected = BOOKING_OPTIONS.some((o) => o.value === initial) ? initial : "korlektion";

  if (sent) {
    return (
      <div className="success" role="status">
        <Icon name="circleCheck" size={32} />
        <h2 style={{ fontSize: "1.5rem" }}>Förfrågan mottagen!</h2>
        <p>
          Det här är en demo, så ingen förfrågan har skickats. På en riktig trafikskola hade vi ringt upp dig inom en
          arbetsdag för att boka en tid.
        </p>
        <div className="btn-row">
          <button type="button" className="btn btn-secondary" onClick={() => setSent(false)}>
            Gör en ny förfrågan
          </button>
          <Link href="/" className="btn btn-dark">
            Till startsidan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="form" noValidate onSubmit={onSubmit} onBlur={onBlur} aria-label="Bokningsförfrågan">
      <ErrorSummary errors={summary} rules={RULES} summaryRef={summaryRef} />

      <div className="field">
        <label htmlFor="utbildning">Vad vill du boka?</label>
        <select id="utbildning" name="utbildning" defaultValue={selected}>
          {BOOKING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="field">
        <legend>Växellåda</legend>
        <div className="options" style={{ marginTop: 6 }}>
          {[
            { value: "automat", label: "Automat (elbil)", icon: "zap" as const },
            { value: "manuell", label: "Manuell", icon: "car" as const },
            { value: "vet-inte", label: "Vet inte än", icon: "info" as const },
          ].map((o, i) => (
            <label key={o.value} className="option">
              <input type="radio" name="vaxellada" value={o.value} defaultChecked={i === 0} />
              <span>
                <Icon name={o.icon} size={18} />
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>När passar det bäst?</legend>
        <p className="hint" id="tider-hint">
          Välj gärna flera.
        </p>
        <div className="options" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          {TIMES.map((t) => (
            <label key={t} className="option">
              <input type="checkbox" name="tider" value={t} aria-describedby="tider-hint" />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-row">
        <div className="field">
          <label htmlFor="namn">
            Namn <span className="req" aria-hidden="true">*</span>
          </label>
          <input type="text" autoComplete="name" required {...fieldProps("namn")} />
          <FieldError id="namn-fel" message={errors.namn} />
        </div>
        <div className="field">
          <label htmlFor="telefon">
            Telefon <span className="req" aria-hidden="true">*</span>
          </label>
          <input type="tel" inputMode="tel" autoComplete="tel" required {...fieldProps("telefon", "telefon-hint")} />
          <p id="telefon-hint" className="hint">
            Vi ringer upp för att bekräfta tiden.
          </p>
          <FieldError id="telefon-fel" message={errors.telefon} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="epost">E-post</label>
        <input type="email" inputMode="email" autoComplete="email" {...fieldProps("epost")} />
        <FieldError id="epost-fel" message={errors.epost} />
      </div>

      <div className="field">
        <label htmlFor="ovrigt">Något vi bör veta?</label>
        <textarea id="ovrigt" name="ovrigt" aria-describedby="ovrigt-hint" />
        <p id="ovrigt-hint" className="hint">
          Till exempel hur mycket du har övningskört. Skriv inte personnummer här.
        </p>
      </div>

      <p className="hint">Fält markerade med * är obligatoriska.</p>
      <div>
        <SubmitButton sending={sending}>
          Skicka förfrågan
          <Icon name="arrowRight" size={18} />
        </SubmitButton>
      </div>
    </form>
  );
}
