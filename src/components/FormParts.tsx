import type { ReactNode, RefObject } from "react";
import Icon from "./Icon";
import type { Errors, FieldRule } from "@/lib/form";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      <Icon name="alert" size={16} />
      {message}
    </p>
  );
}

/** Sammanfattning högst upp efter ett misslyckat försök. Länkarna flyttar fokus till fältet. */
export function ErrorSummary({
  errors,
  rules,
  summaryRef,
}: {
  errors: Errors;
  rules: Record<string, FieldRule>;
  summaryRef: RefObject<HTMLDivElement | null>;
}) {
  const entries = Object.entries(errors);
  if (!entries.length) return null;
  return (
    <div className="error-summary" role="alert" tabIndex={-1} ref={summaryRef} aria-labelledby="fel-rubrik">
      <h2 id="fel-rubrik">
        {entries.length === 1 ? "Ett fält behöver rättas" : `${entries.length} fält behöver rättas`}
      </h2>
      <ul>
        {entries.map(([name, message]) => (
          <li key={name}>
            <a href={`#${name}`}>
              {rules[name]?.label}: {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SubmitButton({ sending, children }: { sending: boolean; children: ReactNode }) {
  return (
    <button type="submit" className="btn btn-dark" disabled={sending} aria-disabled={sending}>
      {sending ? (
        <>
          <span className="spinner" aria-hidden="true" />
          Skickar…
        </>
      ) : (
        children
      )}
    </button>
  );
}
