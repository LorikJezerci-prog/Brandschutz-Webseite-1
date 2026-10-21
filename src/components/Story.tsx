import type { CSSProperties, ComponentType } from "react";
import { chapters, scenes, STORY_LENGTH, type SceneId } from "@/config/story";
import { Blueprint } from "./scenes/Blueprint";
import { Consultation } from "./scenes/Consultation";
import { Corridor } from "./scenes/Corridor";
import { DoorSystem } from "./scenes/DoorSystem";
import { EscapePlan } from "./scenes/EscapePlan";
import { Facade } from "./scenes/Facade";
import { FireDoor } from "./scenes/FireDoor";
import type { SceneProps } from "./scenes/palette";

const sceneComponents: Record<SceneId, ComponentType<SceneProps>> = {
  facade: Facade,
  blueprint: Blueprint,
  plan: EscapePlan,
  door: FireDoor,
  system: DoorSystem,
  corridor: Corridor,
  table: Consultation,
};

/**
 * Die durchgehende Geschichte der Startseite: eine fixierte Bühne mit allen
 * Szenen, darüber die Kapiteltexte und die Sicherheitslinie.
 * Reihenfolge in der statischen Fassung: Hero, dann je Szene Bild und Text.
 */
export function Story() {
  return (
    <section className="story" data-story data-length={STORY_LENGTH} aria-labelledby="hero-title">
      <div className="stage-wrap">
        <div className="stage">
          {scenes.map((s, i) => {
            const Scene = sceneComponents[s.id];
            const style = {
              "--start": s.start,
              "--span": s.end - s.start,
              "--order": i * 2 + 1,
            } as CSSProperties;
            return (
              <div
                key={s.id}
                className={`layer layer--${s.id}`}
                data-layer
                data-start={s.start}
                data-end={s.end}
                style={style}
                aria-hidden="true"
              >
                <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" focusable="false">
                  <Scene id={`s-${s.id}`} />
                </svg>
              </div>
            );
          })}
          <div className="stage__shade" data-follow-t aria-hidden="true" />
          <div className="stage__grain" aria-hidden="true" />
        </div>
      </div>

      <div className="story-line" data-draw="y" aria-hidden="true">
        <span className="story-line__stroke" />
      </div>

      <header className="hero">
        <div className="hero__inner">
          <p className="kicker kicker--light">Brandschutz im Hessischen Ried und an der Bergstraße</p>
          <h1 id="hero-title" className="hero__title">
            Brandschutz beginnt, bevor etwas passiert.
          </h1>
          <p className="hero__lead">
            Durchdachte Brandschutzlösungen für Unternehmen, Gebäude und Menschen. Regional, strukturiert und mit Blick
            auf die praktische Umsetzung.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#kontakt">
              Beratung anfragen
            </a>
            <a className="btn btn--ghost" href="#leistungen">
              Leistungen entdecken
            </a>
          </div>
        </div>
        <p className="hero__cue" aria-hidden="true">
          <span>Scrollen</span>
        </p>
      </header>

      <div className="chapters">
        <div className="chapter chapter--spacer" data-chapter aria-hidden="true" />
        {chapters.map((c) => {
          const sceneIndex = scenes.findIndex((s) => c.index >= s.start && c.index < s.end);
          return (
            <article
              key={c.index}
              className={`chapter chapter--${c.side}`}
              data-chapter
              style={{ ["--order" as string]: sceneIndex * 2 + 2 }}
              aria-labelledby={`chapter-${c.index}`}
            >
              <span className="chapter__node" data-node aria-hidden="true" />
              <div className="chapter__card">
                <p className="kicker">{c.kicker}</p>
                <h2 id={`chapter-${c.index}`} className="chapter__title">
                  {c.title}
                </h2>
                <p className="chapter__body">{c.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
