/** Enkel validering för hemsidans formulär. Delas av kontakt- och bokningsformuläret. */

export type Errors = Record<string, string>;

export interface FieldRule {
  label: string;
  required?: boolean;
  type?: "email" | "phone";
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s-]{7,15}$/;

export function validateField(rule: FieldRule, value: string): string | undefined {
  const v = value.trim();
  if (!v) return rule.required ? `Fyll i ${rule.label.toLowerCase()}.` : undefined;
  if (rule.type === "email" && !EMAIL.test(v)) return "Skriv e-postadressen som namn@exempel.se.";
  if (rule.type === "phone" && !PHONE.test(v)) return "Skriv telefonnumret med siffror, till exempel 070-123 45 67.";
  return undefined;
}

export function validateForm(rules: Record<string, FieldRule>, data: FormData): Errors {
  const errors: Errors = {};
  for (const [name, rule] of Object.entries(rules)) {
    const error = validateField(rule, String(data.get(name) ?? ""));
    if (error) errors[name] = error;
  }
  return errors;
}
