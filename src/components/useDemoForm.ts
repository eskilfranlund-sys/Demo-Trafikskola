"use client";

import { useRef, useState, type FocusEvent, type FormEvent } from "react";
import { validateField, validateForm, type Errors, type FieldRule } from "@/lib/form";

/**
 * Formulärlogik för demosajten: validerar när fältet lämnas och vid skick,
 * flyttar fokus till felsammanfattningen och låtsas skicka (inget lämnar webbläsaren).
 */
export function useDemoForm(rules: Record<string, FieldRule>) {
  const [errors, setErrors] = useState<Errors>({});
  const [summaryErrors, setSummaryErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  function onBlur(e: FocusEvent<HTMLFormElement>) {
    const target: EventTarget = e.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    const rule = rules[target.name];
    if (!rule) return;
    const error = validateField(rule, target.value);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[target.name] = error;
      else delete next[target.name];
      return next;
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateForm(rules, new FormData(e.currentTarget));
    setErrors(found);
    setSummaryErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSent(true);
  }

  /** Props för ett fält: koppla fel och hjälptext till fältet för skärmläsare. */
  function fieldProps(name: string, hintId?: string) {
    const error = errors[name];
    const describedBy = [hintId, error ? `${name}-fel` : undefined].filter(Boolean).join(" ") || undefined;
    return { id: name, name, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy } as const;
  }

  // Sammanfattningen visar bara fel från senaste skickförsöket som fortfarande finns kvar.
  const summary = Object.fromEntries(Object.keys(summaryErrors).filter((k) => errors[k]).map((k) => [k, errors[k]]));

  return { errors, summary, sending, sent, setSent, summaryRef, onBlur, onSubmit, fieldProps };
}
