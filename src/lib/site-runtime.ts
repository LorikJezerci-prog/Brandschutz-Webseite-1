/**
 * Kleine Verhaltensweisen der Seite, ohne Abhängigkeiten. Ohne JavaScript
 * bleibt alles bedienbar; diese Funktionen ergänzen nur.
 *
 * - Mobiles Menü schließt nach Klick und mit Escape.
 * - Fluchtweg-Leiste unter der Kopfzeile zeigt den Lesefortschritt.
 * - Rettungszeichen „nach oben“ erscheint nach dem ersten Bildschirm.
 * - Schnellcheck wertet bei jeder Eingabe neu aus.
 */

import { evaluate, type Answers } from "./quick-check";

export function initSiteRuntime(doc: Document = document): () => void {
  const cleanups: (() => void)[] = [];
  initNav(doc, cleanups);
  initScroll(doc, cleanups);
  initQuickCheck(doc, cleanups);
  return () => cleanups.forEach((c) => c());
}

function initNav(doc: Document, cleanups: (() => void)[]) {
  const menu = doc.querySelector<HTMLDetailsElement>("[data-menu]");
  if (!menu) return;
  const onClick = (e: Event) => {
    if ((e.target as HTMLElement).closest("a")) menu.open = false;
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary")?.focus();
    }
  };
  menu.addEventListener("click", onClick);
  doc.addEventListener("keydown", onKey);
  cleanups.push(() => {
    menu.removeEventListener("click", onClick);
    doc.removeEventListener("keydown", onKey);
  });
}

function initScroll(doc: Document, cleanups: (() => void)[]) {
  const win = doc.defaultView ?? window;
  const bar = doc.querySelector<HTMLElement>("[data-progress]");
  const top = doc.querySelector<HTMLElement>("[data-totop]");
  let frame = 0;
  const update = () => {
    frame = 0;
    const max = doc.documentElement.scrollHeight - win.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, win.scrollY / max)) : 0;
    bar?.style.setProperty("--p", p.toFixed(4));
    top?.classList.toggle("is-visible", win.scrollY > win.innerHeight * 0.9);
  };
  const onScroll = () => {
    if (!frame) frame = win.requestAnimationFrame(update);
  };
  update();
  win.addEventListener("scroll", onScroll, { passive: true });
  win.addEventListener("resize", onScroll);
  cleanups.push(() => {
    win.removeEventListener("scroll", onScroll);
    win.removeEventListener("resize", onScroll);
    if (frame) win.cancelAnimationFrame(frame);
  });
}


function initQuickCheck(doc: Document, cleanups: (() => void)[]) {
  const root = doc.querySelector<HTMLElement>("[data-quickcheck]");
  const form = root?.querySelector("form");
  const list = root?.querySelector<HTMLElement>("[data-hints]");
  if (!form || !list) return;
  const render = () => {
    const f = form.elements as HTMLFormControlsCollection & Record<string, HTMLInputElement>;
    const a: Answers = {
      staff: f.staff.value,
      floors: f.floors.checked,
      visitors: f.visitors.checked,
      hazard: f.hazard.checked,
      bso: f.bso.checked,
      briefed: f.briefed.checked,
    };
    list.replaceChildren(
      ...evaluate(a).map((h) => {
        const li = doc.createElement("li");
        li.className = `hint hint--${h.tone}`;
        const t = doc.createElement("p");
        t.className = "hint__title";
        t.textContent = h.title;
        const d = doc.createElement("p");
        d.className = "hint__text";
        d.textContent = h.text;
        li.append(t, d);
        return li;
      }),
    );
  };
  const onSubmit = (e: Event) => e.preventDefault();
  form.addEventListener("input", render);
  form.addEventListener("change", render);
  form.addEventListener("submit", onSubmit);
  render();
  cleanups.push(() => {
    form.removeEventListener("input", render);
    form.removeEventListener("change", render);
    form.removeEventListener("submit", onSubmit);
  });
}
