import { nav } from "@/config/site";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <div className="site-header__inner">
        <Logo />
        <nav className="site-nav" aria-label="Hauptnavigation">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--primary btn--small site-header__cta" href="/#kontakt">
          Beratung anfragen
        </a>
        <details className="menu" data-menu>
          <summary className="menu__toggle">
            <span className="menu__icon" aria-hidden="true" />
            <span className="menu__label">Menü</span>
          </summary>
          <nav className="menu__panel" aria-label="Mobile Navigation">
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
            <a className="btn btn--primary" href="/#kontakt">
              Beratung anfragen
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
