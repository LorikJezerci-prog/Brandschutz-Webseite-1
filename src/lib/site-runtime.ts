/**
 * Scroll-Engine der Startseite, ohne Abhängigkeiten.
 *
 * - Schreibt die Zeitachse `--t` (0 … STORY_LENGTH) nur auf aktive Szenen.
 *   Die eigentliche Choreografie (Überblendung, Kamera, Zeichnen) steht in CSS.
 * - Steuert alle Abschnitte der Sicherheitslinie über `--draw` (scaleY/scaleX).
 * - Markiert passierte Wegpunkte.
 *
 * Läuft nur, wenn <html> die Klasse `js-story` trägt. Diese setzt ein
 * Inline-Skript im <head>, außer bei prefers-reduced-motion. Ohne JavaScript
 * zeigt die Seite eine statische Fassung aller Szenen.
 */

type Draw = { el: HTMLElement; axis: "x" | "y"; top: number; size: number; span: number };
type Node = { el: HTMLElement; top: number; passed: boolean };
type Layer = { el: HTMLElement; start: number; end: number; active: boolean | null };

const ANCHOR = 0.62;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function initSiteRuntime(doc: Document = document): () => void {
  const html = doc.documentElement;
  const win = doc.defaultView ?? window;
  const cleanups: (() => void)[] = [];

  initNav(doc, cleanups);

  if (!html.classList.contains("js-story")) {
    return () => cleanups.forEach((c) => c());
  }

  const story = doc.querySelector<HTMLElement>("[data-story]");
  const length = Number(story?.dataset.length ?? 0);
  const firstChapter = story?.querySelector<HTMLElement>("[data-chapter]");
  const layers: Layer[] = story
    ? Array.from(story.querySelectorAll<HTMLElement>("[data-layer]")).map((el) => ({
        el,
        start: Number(el.dataset.start),
        end: Number(el.dataset.end),
        active: null,
      }))
    : [];
  const followers = story ? Array.from(story.querySelectorAll<HTMLElement>("[data-follow-t]")) : [];
  let draws: Draw[] = [];
  let nodes: Node[] = [];

  let vh = win.innerHeight;
  let storyTop = 0;
  let chapterH = 1;
  let fade = 0.2;
  let ticking = false;
  let lastT = -1;

  const absTop = (el: HTMLElement) => el.getBoundingClientRect().top + win.scrollY;

  function measure() {
    vh = win.innerHeight;
    if (story && firstChapter) {
      storyTop = absTop(story);
      chapterH = firstChapter.offsetHeight || vh;
      fade = parseFloat(win.getComputedStyle(story).getPropertyValue("--fade")) || 0.2;
    }
    draws = Array.from(doc.querySelectorAll<HTMLElement>("[data-draw]")).map((el) => ({
      el,
      axis: el.dataset.draw === "x" ? "x" : "y",
      top: absTop(el),
      size: el.dataset.draw === "x" ? 0 : el.offsetHeight,
      span: Number(el.dataset.span ?? 0.18),
    }));
    nodes = Array.from(doc.querySelectorAll<HTMLElement>("[data-node]")).map((el) => ({
      el,
      top: absTop(el),
      passed: el.classList.contains("is-passed"),
    }));
    lastT = -1;
    update();
  }

  function update() {
    ticking = false;
    const y = win.scrollY;
    const tip = y + vh * ANCHOR;

    if (story) {
      const t = clamp((y - storyTop) / chapterH, 0, length);
      if (Math.abs(t - lastT) > 0.0005) {
        lastT = t;
        const ts = t.toFixed(4);
        for (const l of layers) {
          const active = t >= l.start - fade - 0.06 && t <= l.end + 0.06;
          if (active !== l.active) {
            l.active = active;
            l.el.classList.toggle("is-idle", !active);
          }
          if (active) l.el.style.setProperty("--t", ts);
        }
        for (const f of followers) f.style.setProperty("--t", ts);
      }
    }

    for (const d of draws) {
      const v = d.axis === "y" ? clamp((tip - d.top) / Math.max(1, d.size)) : clamp((tip - d.top) / (vh * d.span));
      d.el.style.setProperty("--draw", v.toFixed(4));
    }
    for (const n of nodes) {
      const passed = tip >= n.top;
      if (passed !== n.passed) {
        n.passed = passed;
        n.el.classList.toggle("is-passed", passed);
      }
    }
  }

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      win.requestAnimationFrame(update);
    }
  };

  let resizeTimer = 0;
  const onResize = () => {
    win.clearTimeout(resizeTimer);
    resizeTimer = win.setTimeout(measure, 120);
  };

  win.addEventListener("scroll", onScroll, { passive: true });
  win.addEventListener("resize", onResize);
  const ro = "ResizeObserver" in win ? new ResizeObserver(onResize) : null;
  ro?.observe(doc.body);
  doc.fonts?.ready.then(measure).catch(() => undefined);
  measure();
  html.classList.add("story-ready");

  cleanups.push(() => {
    win.removeEventListener("scroll", onScroll);
    win.removeEventListener("resize", onResize);
    ro?.disconnect();
    html.classList.remove("story-ready");
  });
  return () => cleanups.forEach((c) => c());
}

/** Mobiles Menü: <details> funktioniert ohne JS, hier nur Komfort (schließen bei Klick/Escape). */
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
