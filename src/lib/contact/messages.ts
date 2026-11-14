/** Fehlertexte, gemeinsam für API-Antwort (mit JS) und Weiterleitung (ohne JS) */
export const contactMessages: Record<string, string> = {
  invalid: "Bitte prüfen Sie die markierten Felder.",
  rate: "Es wurden zu viele Anfragen in kurzer Zeit gesendet. Bitte versuchen Sie es später erneut.",
  origin: "Die Anfrage konnte nicht zugeordnet werden. Bitte laden Sie die Seite neu.",
  format: "Die Anfrage hatte ein unerwartetes Format.",
  size: "Die Anfrage ist zu groß.",
  config: "Das Kontaktformular ist noch nicht eingerichtet. Bitte nehmen Sie direkt per E-Mail oder Telefon Kontakt auf.",
  failed: "Ihre Anfrage konnte gerade nicht versendet werden. Bitte versuchen Sie es später erneut oder schreiben Sie direkt eine E-Mail.",
};
