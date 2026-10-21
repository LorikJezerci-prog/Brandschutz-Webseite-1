/**
 * Einfache Begrenzung im Arbeitsspeicher: höchstens `limit` Anfragen je IP im Zeitfenster.
 * Hinweis: Auf Serverless-Plattformen gilt der Zähler je Instanz. Für stärkeren
 * Schutz einen gemeinsamen Speicher (z. B. Redis/Upstash) anbinden.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return function check(key: string, now = Date.now()): boolean {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
    return true;
  };
}
