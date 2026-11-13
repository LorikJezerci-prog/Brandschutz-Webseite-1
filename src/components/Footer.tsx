import { nav, site } from "@/config/site";
import { LogoMark } from "./Logo";
import { Val } from "./Val";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__grid">
        <div>
          <p className="site-footer__brand">
            <LogoMark size={22} /> {site.name}
          </p>
          <p className="site-footer__note">{site.region.areas.join(" · ")}</p>
        </div>
        <nav aria-label="Fußnavigation">
          <ul className="site-footer__links">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
            <li>
              <a href="/leistungen/">Alle Leistungen</a>
            </li>
          </ul>
        </nav>
        <div>
          <ul className="site-footer__links">
            <li>
              <a href="/impressum/">Impressum</a>
            </li>
            <li>
              <a href="/datenschutz/">Datenschutz</a>
            </li>
          </ul>
          <p className="site-footer__note">
            <Val v={site.contact.email} />
          </p>
        </div>
      </div>
      <div className="wrap site-footer__base">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>Keine Cookies, kein Tracking.</span>
      </div>
    </footer>
  );
}
