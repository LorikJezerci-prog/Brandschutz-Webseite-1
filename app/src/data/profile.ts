/** Angaben, die im Mängelbericht erscheinen. Offene Punkte bewusst als leerer Text. */
export const profile = {
  company: 'Brandschutz Ried',
  owner: 'Lorik Jezerci',
  role: 'Brandschutzbeauftragter (DGUV Information 205-003)',
  phone: '0176 62974724',
  email: '', // Geschäftsmail fehlt noch
  address: 'Friedrichstraße 42, 68623 Lampertheim',
  /** Erst ab dem Lehrgangsabschluss darf die Qualifikation im Bericht stehen */
  qualifiedFrom: '2026-12-03',
};

export const isQualified = (now = new Date()) => now >= new Date(profile.qualifiedFrom + 'T00:00:00');
