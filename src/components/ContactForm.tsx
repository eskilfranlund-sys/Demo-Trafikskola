"use client";

import Icon from "./Icon";
import { ErrorSummary, FieldError, SubmitButton } from "./FormParts";
import { useDemoForm } from "./useDemoForm";
import type { FieldRule } from "@/lib/form";

const RULES: Record<string, FieldRule> = {
  namn: { label: "Namn", required: true },
  epost: { label: "E-post", required: true, type: "email" },
  meddelande: { label: "Meddelande", required: true },
};

export default function ContactForm() {
  const { errors, summary, sending, sent, setSent, summaryRef, onBlur, onSubmit, fieldProps } = useDemoForm(RULES);

  if (sent) {
    return (
      <div className="success" role="status">
        <Icon name="circleCheck" size={32} />
        <h3>Tack för ditt meddelande!</h3>
        <p>Det här är en demo, så inget har skickats. På en riktig sida hade vi svarat inom en arbetsdag.</p>
        <button type="button" className="btn btn-secondary" onClick={() => setSent(false)}>
          Skriv ett nytt meddelande
        </button>
      </div>
    );
  }

  return (
    <form className="form" noValidate onSubmit={onSubmit} onBlur={onBlur} aria-labelledby="kontakt-form-rubrik">
      <h2 id="kontakt-form-rubrik" style={{ fontSize: "1.5rem" }}>
        Skicka ett meddelande
      </h2>
      <ErrorSummary errors={summary} rules={RULES} summaryRef={summaryRef} />
      <div className="form-row">
        <div className="field">
          <label htmlFor="namn">
            Namn <span className="req" aria-hidden="true">*</span>
          </label>
          <input type="text" autoComplete="name" required {...fieldProps("namn")} />
          <FieldError id="namn-fel" message={errors.namn} />
        </div>
        <div className="field">
          <label htmlFor="epost">
            E-post <span className="req" aria-hidden="true">*</span>
          </label>
          <input type="email" inputMode="email" autoComplete="email" required {...fieldProps("epost")} />
          <FieldError id="epost-fel" message={errors.epost} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="amne">Vad gäller det?</label>
        <select id="amne" name="amne" defaultValue="Allmän fråga">
          <option>Allmän fråga</option>
          <option>Körlektioner</option>
          <option>Riskutbildning</option>
          <option>Handledarkurs</option>
          <option>Faktura och betalning</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="meddelande">
          Meddelande <span className="req" aria-hidden="true">*</span>
        </label>
        <textarea required {...fieldProps("meddelande", "meddelande-hint")} />
        <p id="meddelande-hint" className="hint">
          Skriv inte personnummer här.
        </p>
        <FieldError id="meddelande-fel" message={errors.meddelande} />
      </div>
      <p className="hint">Fält markerade med * är obligatoriska.</p>
      <div>
        <SubmitButton sending={sending}>
          Skicka meddelande
          <Icon name="arrowRight" size={18} />
        </SubmitButton>
      </div>
    </form>
  );
}
