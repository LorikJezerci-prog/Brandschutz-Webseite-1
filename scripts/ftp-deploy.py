#!/usr/bin/env python3
"""Lädt ./out per FTPS in den Domain-Ordner bei all-inkl.

Umgebung: FTP_SERVER, FTP_USERNAME, FTP_PASSWORD, FTP_DIR (z. B. brandschutz-ried.de/).
Lädt alle Dateien hoch, entfernt veraltete Build-Ordner unter _next/ und räumt
einmalig die Reste des ersten Uploads aus der FTP-Wurzel.
"""
import ftplib
import os
import sys
import time
from pathlib import Path

LOCAL = Path("out")
TARGET = os.environ.get("FTP_DIR", "brandschutz-ried.de/").strip("/")

# Was der erste Upload versehentlich in die Wurzel gelegt hat
ROOT_LEFTOVERS = [
    ".ftp-deploy-sync-state.json", ".htaccess", "404.html", "__next.__PAGE__.txt",
    "__next._full.txt", "__next._tree.txt", "icon.svg", "index.html", "index.txt",
    "kontakt.php", "robots.txt", "sitemap.xml",
    "_next", "_not-found", "404", "datenschutz", "impressum", "kontakt", "leistungen",
]


class ReusingFTP_TLS(ftplib.FTP_TLS):
    """Viele FTP-Server verlangen, dass der Datenkanal die TLS-Sitzung wiederverwendet."""

    def ntransfercmd(self, cmd, rest=None):
        conn, size = ftplib.FTP.ntransfercmd(self, cmd, rest)
        if self._prot_p:
            conn = self.context.wrap_socket(conn, server_hostname=self.host, session=self.sock.session)
        return conn, size


def connect() -> ftplib.FTP_TLS:
    for attempt in range(4):
        try:
            ftp = ReusingFTP_TLS(os.environ["FTP_SERVER"].strip(), timeout=60)
            ftp.login(os.environ["FTP_USERNAME"].strip(), os.environ["FTP_PASSWORD"].strip())
            ftp.prot_p()
            return ftp
        except ftplib.error_perm as exc:
            sys.exit(f"Login abgelehnt ({exc}). FTP-Secrets prüfen.")
        except (OSError, ftplib.Error) as exc:
            print(f"Verbindung fehlgeschlagen ({exc}), neuer Versuch …")
            time.sleep(5 * (attempt + 1))
    sys.exit("Keine FTP-Verbindung möglich.")


def is_dir(ftp, path: str) -> bool:
    here = ftp.pwd()
    try:
        ftp.cwd(path)
        return True
    except ftplib.error_perm:
        return False
    finally:
        ftp.cwd(here)


def names(ftp, path: str):
    try:
        return [n.rsplit("/", 1)[-1] for n in ftp.nlst(path) if n.rsplit("/", 1)[-1] not in (".", "..")]
    except ftplib.error_perm:
        return []


def rmtree(ftp, path: str):
    if is_dir(ftp, path):
        for n in names(ftp, path):
            rmtree(ftp, f"{path}/{n}")
        ftp.rmd(path)
    else:
        ftp.delete(path)
    print(f"  entfernt: {path}")


def ensure_dirs(ftp, rel: str, made: set):
    parts = rel.split("/")
    for i in range(1, len(parts) + 1):
        d = "/".join(parts[:i])
        if d in made:
            continue
        try:
            ftp.mkd(d)
        except ftplib.error_perm:
            pass  # existiert schon
        made.add(d)


def main():
    if not (LOCAL / "index.html").exists():
        sys.exit("out/index.html fehlt – erst bauen.")
    ftp = connect()
    root = ftp.pwd()

    # 1) Reste in der Wurzel aufräumen (nur wenn der Fehl-Upload erkennbar ist)
    root_names = names(ftp, ".")
    if ".ftp-deploy-sync-state.json" in root_names:
        print("Räume Reste des ersten Uploads aus der Wurzel …")
        for n in ROOT_LEFTOVERS:
            if n in root_names:
                rmtree(ftp, n)

    # 2) Hochladen
    files = sorted(p for p in LOCAL.rglob("*") if p.is_file())
    made = set()
    ensure_dirs(ftp, TARGET, made)
    for i, p in enumerate(files, 1):
        rel = p.relative_to(LOCAL).as_posix()
        remote = f"{TARGET}/{rel}"
        if "/" in rel:
            ensure_dirs(ftp, remote.rsplit("/", 1)[0], made)
        for attempt in range(3):
            try:
                with p.open("rb") as fh:
                    ftp.storbinary(f"STOR {remote}", fh)
                break
            except (OSError, ftplib.error_temp) as exc:
                print(f"  {rel}: {exc}, neuer Versuch")
                try:
                    ftp.quit()
                except Exception:
                    pass
                ftp = connect()
                ftp.cwd(root)
        else:
            sys.exit(f"Upload fehlgeschlagen: {rel}")
        if i % 25 == 0 or i == len(files):
            print(f"  {i}/{len(files)} Dateien")

    # 3) Veraltete Build-Ordner unter _next/ entfernen
    local_next = {p.name for p in (LOCAL / "_next").iterdir()} if (LOCAL / "_next").exists() else set()
    local_static = {p.name for p in (LOCAL / "_next/static").iterdir()} if (LOCAL / "_next/static").exists() else set()
    for n in names(ftp, f"{TARGET}/_next"):
        if n not in local_next:
            rmtree(ftp, f"{TARGET}/_next/{n}")
    for n in names(ftp, f"{TARGET}/_next/static"):
        if n not in local_static:
            rmtree(ftp, f"{TARGET}/_next/static/{n}")

    # Platzhalter von all-inkl entfernen
    if "index.htm" in names(ftp, TARGET):
        ftp.delete(f"{TARGET}/index.htm")
        print("  Platzhalter index.htm entfernt")
    if ".ftp-deploy-sync-state.json" in names(ftp, TARGET):
        ftp.delete(f"{TARGET}/.ftp-deploy-sync-state.json")

    ftp.quit()
    print(f"Fertig: {len(files)} Dateien nach /{TARGET}/")


if __name__ == "__main__":
    main()
