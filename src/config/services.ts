/**
 * Leistungskatalog von Brandschutz Ried (Grundlage: Tabelle „Leistungskatalog“).
 * Bewusst ohne Preise. Leistungen der Gruppe „partner“ werden nicht selbst
 * erbracht, sondern über qualifizierte Fachbetriebe vermittelt.
 */

export type Motif =
  | "beratung"
  | "bsb"
  | "ordnung"
  | "unterweisung"
  | "tuer"
  | "loescher"
  | "raeumung"
  | "heiss";

export type Group = "betreuung" | "dokumente" | "schulung" | "partner";

export interface Service {
  slug: string;
  /** Kürzel aus dem Leistungskatalog */
  code: string;
  title: string;
  short: string;
  motif: Motif;
  group: Group;
  summary: string;
  why: string;
  tasks: string[];
  benefit: string;
  /** Rechtliche oder fachliche Grundlage, wie im Leistungskatalog */
  basis: string;
  boundaries: string[];
}

export const groups: Record<Group, { title: string; lead: string; motif: Motif }> = {
  betreuung: {
    title: "Betreuung und Beratung",
    lead: "Ein fester Ansprechpartner, regelmäßige Begehungen und klare Empfehlungen.",
    motif: "bsb",
  },
  dokumente: {
    title: "Brandschutzordnung und Pläne",
    lead: "Dokumente, die zum Gebäude passen und im Ernstfall verstanden werden.",
    motif: "ordnung",
  },
  schulung: {
    title: "Schulungen und Übungen",
    lead: "Praxisnah vor Ort, mit Löschübung und echter Räumung.",
    motif: "unterweisung",
  },
  partner: {
    title: "Prüfungen über Fachbetriebe",
    lead: "Prüfungen, für die eine eigene Sachkunde nötig ist, führen qualifizierte Fachbetriebe durch. Ich behalte die Fristen im Blick und koordiniere.",
    motif: "tuer",
  },
};

export const services: Service[] = [
  {
    slug: "externer-brandschutzbeauftragter",
    code: "BSB",
    title: "Externer Brandschutzbeauftragter",
    short: "Fester Ansprechpartner, der berät, kontrolliert, dokumentiert und alles aktuell hält.",
    motif: "beratung",
    group: "betreuung",
    summary:
      "Als externer Brandschutzbeauftragter betreue ich Ihren Betrieb dauerhaft: mit Begehungen, Beratung der Leitung und einer Dokumentation, die bei Nachfragen trägt.",
    why: "Ob ein Brandschutzbeauftragter bestellt werden muss, ergibt sich oft aus der Baugenehmigung, den Bedingungen des Versicherers oder der Gefährdungsbeurteilung. Für kleine und mittlere Betriebe ist eine externe Bestellung meist einfacher, als eigene Beschäftigte ausbilden und freistellen zu lassen.",
    tasks: [
      "Ein bis zwei Brandschutzbegehungen pro Jahr mit Bericht",
      "Beratung der Unternehmensleitung und Abstimmung mit der Fachkraft für Arbeitssicherheit",
      "Pflege von Brandschutzordnung, Unterweisungen und Räumungsübungen",
      "Ansprechpartner für Behörden, Feuerwehr und Versicherer",
      "Laufende Dokumentation der Brandschutzorganisation",
    ],
    benefit: "Sie haben einen Ansprechpartner, der Ihren Betrieb kennt, und eine lückenlose Dokumentation.",
    basis: "DGUV Information 205-003",
    boundaries: [
      "Die Verantwortung für den Brandschutz bleibt beim Unternehmer. Der Brandschutzbeauftragte berät und unterstützt; die Bestellung erfolgt schriftlich durch das Unternehmen.",
    ],
  },
  {
    slug: "brandschutzbegehung",
    code: "BEG",
    title: "Brandschutzbegehung mit Bericht",
    short: "Rundgang durch den Betrieb, Mängel mit Fotos, Bericht mit klaren Maßnahmen.",
    motif: "bsb",
    group: "betreuung",
    summary:
      "Ich gehe mit Ihnen durch den Betrieb, halte Mängel mit Fotos fest und liefere einen Bericht mit priorisierten Maßnahmen.",
    why: "Verstellte Fluchtwege, verkeilte Brandschutztüren oder falsch gelagerte Stoffe fallen im Alltag kaum noch auf. Ein Blick von außen findet sie, bevor es die Feuerwehr oder der Versicherer tut.",
    tasks: [
      "Flucht- und Rettungswege, Notausgänge und Kennzeichnung",
      "Brandschutztüren und Rauchschutztüren im Alltag",
      "Feuerlöscher: Anzahl, Standort, Prüfplakette",
      "Lagerung brennbarer Stoffe und Ordnung in Technikräumen",
      "Bericht mit Fotos, Bewertung und Reihenfolge der Maßnahmen",
    ],
    benefit: "Sie wissen, wo Ihr Betrieb steht und was zuerst zu tun ist.",
    basis: "DGUV Information 205-003",
    boundaries: ["Die Begehung ersetzt keine Prüfung technischer Anlagen durch Sachkundige oder Prüfsachverständige."],
  },
  {
    slug: "gefaehrdungsbeurteilung-brandschutz",
    code: "GBU",
    title: "Gefährdungsbeurteilung Brandschutz",
    short: "Brandgefahren bewerten und Schutzmaßnahmen festlegen, gemeinsam mit Ihrer Sicherheitsfachkraft.",
    motif: "beratung",
    group: "betreuung",
    summary:
      "Ich bewerte die Brandgefahren in Ihrem Betrieb und lege mit Ihnen fest, welche Schutzmaßnahmen nötig sind.",
    why: "Jeder Arbeitgeber muss die Gefährdungen im Betrieb beurteilen, auch die Brandgefährdung. Daraus ergibt sich zum Beispiel, wie viele Brandschutzhelfer und Feuerlöscher gebraucht werden.",
    tasks: [
      "Brandlasten, Zündquellen und besondere Gefahren erfassen",
      "Brandgefährdung bewerten (normal oder erhöht)",
      "Maßnahmen festlegen und dokumentieren",
      "Abstimmung mit der Fachkraft für Arbeitssicherheit",
    ],
    benefit: "Eine nachvollziehbare Grundlage für alle weiteren Brandschutzmaßnahmen.",
    basis: "§ 5 ArbSchG, ASR A2.2",
    boundaries: ["Die Gefährdungsbeurteilung bleibt Aufgabe des Arbeitgebers. Ich erarbeite den Brandschutzteil mit Ihnen."],
  },
  {
    slug: "gefahrenverhuetungsschau",
    code: "GVS",
    title: "Gefahrenverhütungsschau vorbereiten und begleiten",
    short: "Vor dem Behördentermin prüfen, Mängel abstellen und beim Termin dabei sein.",
    motif: "bsb",
    group: "betreuung",
    summary:
      "Ich bereite Ihr Objekt auf die behördliche Gefahrenverhütungsschau vor und begleite Sie beim Termin.",
    why: "In Hessen besichtigt die Brandschutzdienststelle viele Objekte regelmäßig, zum Beispiel Pflegeheime, Versammlungsstätten und größere Betriebe. Wer vorher aufräumt, vermeidet Mängellisten, Nachbesichtigungen und Ärger.",
    tasks: [
      "Vorabbegehung mit Blick auf typische Beanstandungen",
      "Liste der Punkte, die vor dem Termin erledigt sein sollten",
      "Unterlagen bereitlegen: Brandschutzordnung, Prüfnachweise, Pläne",
      "Begleitung beim Termin mit der Brandschutzdienststelle",
    ],
    benefit: "Ein entspannter Termin und weniger Nacharbeit.",
    basis: "§ 15 Hessisches Brand- und Katastrophenschutzgesetz (HBKG)",
    boundaries: [
      "Die Gefahrenverhütungsschau selbst führt die zuständige Behörde durch (in Rheinland-Pfalz ebenfalls Gefahrenverhütungsschau, in Baden-Württemberg Brandverhütungsschau).",
    ],
  },
  {
    slug: "feuerloescher-bedarf",
    code: "FLB",
    title: "Feuerlöscher-Bedarfsberechnung",
    short: "Wie viele und welche Feuerlöscher Sie brauchen, und wo sie hängen sollten.",
    motif: "loescher",
    group: "betreuung",
    summary:
      "Ich berechne nach Löschmitteleinheiten, wie viele und welche Feuerlöscher Ihr Betrieb braucht, und lege die Standorte fest.",
    why: "Zu wenige Feuerlöscher sind ein Mangel, zu viele oder die falschen kosten unnötig Geld bei jeder Prüfung. Die Berechnung richtet sich nach Fläche und Brandgefährdung.",
    tasks: [
      "Grundfläche und Brandgefährdung je Bereich bestimmen",
      "Löschmitteleinheiten berechnen",
      "Geeignete Löschmittel festlegen (z. B. Fettbrand, Elektro)",
      "Standorte und Kennzeichnung planen",
    ],
    benefit: "Die richtige Ausstattung, nicht mehr und nicht weniger.",
    basis: "ASR A2.2",
    boundaries: ["Lieferung, Wartung und Prüfung der Feuerlöscher übernehmen Fachbetriebe."],
  },
  {
    slug: "heissarbeiten",
    code: "HEI",
    title: "Heißarbeiten sicher organisieren",
    short: "Erlaubnisschein für Schweißen, Flexen und Löten einführen, Personal einweisen, auf Wunsch Brandwache stellen.",
    motif: "heiss",
    group: "betreuung",
    summary:
      "Ich führe in Ihrem Betrieb ein Freigabeverfahren für Heißarbeiten ein und weise die Beteiligten ein.",
    why: "Schweißen, Trennschleifen und Löten gehören zu den häufigsten Brandursachen in Betrieben. Viele Versicherer verlangen dafür einen Erlaubnisschein.",
    tasks: [
      "Erlaubnisschein passend zum Betrieb",
      "Regeln für Brandwache und Nachkontrolle",
      "Einweisung von Verantwortlichen und Ausführenden",
      "Auf Wunsch Brandposten und Brandwache bei feuergefährlichen Arbeiten (planbare Einsätze)",
    ],
    benefit: "Weniger Brandrisiko und klare Nachweise gegenüber dem Versicherer.",
    basis: "DGUV Regel 100-500, Vorgaben der Versicherer (VdS)",
    boundaries: [
      "Brandposten und Brandwache übernehme ich nur bei feuergefährlichen Arbeiten im Betrieb. Brandsicherheitswachen bei Veranstaltungen stellt die Feuerwehr.",
    ],
  },
  {
    slug: "brandschutzordnung",
    code: "BSO",
    title: "Brandschutzordnung Teil A, B und C",
    short: "Aushang für alle, Regeln für Beschäftigte, Aufgaben für Personen mit Sonderaufgaben.",
    motif: "ordnung",
    group: "dokumente",
    summary:
      "Ich erstelle Ihre Brandschutzordnung nach DIN 14096 oder überarbeite die bestehende, passend zu Gebäude und Abläufen.",
    why: "Im Brandfall bleibt keine Zeit zum Nachlesen. Eine aktuelle Brandschutzordnung sagt jedem in kurzer Form, was zu tun ist.",
    tasks: [
      "Teil A: Aushang für alle Personen im Gebäude",
      "Teil B: Regeln für alle Beschäftigten, von Brandverhütung bis Sammelstelle",
      "Teil C: Aufgaben für Brandschutzhelfer, Evakuierungshelfer und Leitung",
      "Prüfung und Aktualisierung alle zwei Jahre",
    ],
    benefit: "Dokumente, die zu Ihrem Betrieb passen, statt Vorlagen aus der Schublade.",
    basis: "DIN 14096",
    boundaries: [],
  },
  {
    slug: "flucht-und-rettungsplaene",
    code: "FRP",
    title: "Flucht- und Rettungspläne",
    short: "Bestehende Pläne prüfen; neue Pläne mit einem Fachpartner zeichnen lassen.",
    motif: "ordnung",
    group: "dokumente",
    summary:
      "Ich prüfe Ihre Flucht- und Rettungspläne auf Aktualität und Lesbarkeit. Neue Pläne entstehen gemeinsam mit einem Fachpartner.",
    why: "Nach Umbauten oder Nutzungsänderungen stimmen Pläne oft nicht mehr. Ein falscher Plan führt im Ernstfall in die falsche Richtung.",
    tasks: [
      "Abgleich der Pläne mit dem tatsächlichen Gebäude",
      "Prüfung von Standort, Ausrichtung und Symbolen",
      "Koordination neuer Pläne mit einem Fachpartner",
    ],
    benefit: "Pläne, die stimmen und im Ernstfall verstanden werden.",
    basis: "ASR A2.3, DIN ISO 23601",
    boundaries: ["Das Zeichnen neuer Pläne übernimmt ein Fachpartner."],
  },
  {
    slug: "brandschutzhelfer",
    code: "BSH",
    title: "Brandschutzhelfer-Ausbildung",
    short: "Theorie und praktische Löschübung bei Ihnen vor Ort, mit Teilnahmebescheinigung.",
    motif: "loescher",
    group: "schulung",
    summary:
      "Ich bilde Ihre Brandschutzhelfer bei Ihnen vor Ort aus: Theorie und eine praktische Übung mit Feuerlöschern.",
    why: "In der Regel müssen 5 % der Beschäftigten als Brandschutzhelfer ausgebildet sein, bei erhöhter Brandgefährdung mehr. Urlaub, Schichten und Krankheit gehören in die Planung.",
    tasks: [
      "Grundlagen: Brandentstehung, Brandklassen, Löschmittel",
      "Verhalten im Brandfall und Zusammenspiel mit der Brandschutzordnung",
      "Praktische Löschübung mit Übungsfeuerlöschern",
      "Teilnahmebescheinigung für Ihre Unterlagen",
    ],
    benefit: "Ausreichend geschulte Helfer und ein dokumentierter Nachweis.",
    basis: "ASR A2.2, DGUV Information 205-023",
    boundaries: [],
  },
  {
    slug: "evakuierungshelfer",
    code: "EVH",
    title: "Evakuierungshelfer-Schulung",
    short: "Bereiche räumen, Personen zählen, Hilfsbedürftige begleiten.",
    motif: "raeumung",
    group: "schulung",
    summary:
      "Ich schule die Personen, die im Alarmfall Bereiche räumen, Personen zählen und Hilfsbedürftige begleiten.",
    why: "In Pflegeheimen, Hotels und großen Betrieben entscheidet eine geordnete Räumung über Minuten. Das klappt nur, wenn jeder seine Aufgabe kennt.",
    tasks: [
      "Aufgaben und Ablauf bei der Räumung",
      "Begleitung von Personen mit eingeschränkter Mobilität",
      "Vollzähligkeit an der Sammelstelle",
      "Gut kombinierbar mit der Brandschutzhelfer-Ausbildung",
    ],
    benefit: "Eine Räumung, die geordnet und vollständig abläuft.",
    basis: "ASR A2.3",
    boundaries: [],
  },
  {
    slug: "brandschutzunterweisung",
    code: "UNT",
    title: "Brandschutz-Unterweisung",
    short: "Kurze jährliche Unterweisung für die ganze Belegschaft.",
    motif: "unterweisung",
    group: "schulung",
    summary:
      "Ich unterweise Ihre Beschäftigten kurz und praxisnah: Fluchtwege, Brand melden, Feuerlöscher.",
    why: "Beschäftigte müssen mindestens einmal im Jahr unterwiesen werden, auch zum Verhalten im Brandfall. Gute Unterweisungen sind kurz und auf den eigenen Arbeitsplatz bezogen.",
    tasks: [
      "Verhalten im Brandfall nach Ihrer Brandschutzordnung",
      "Flucht- und Rettungswege, Sammelstelle",
      "Feuerlöscher erkennen und richtig einsetzen",
      "Dokumentation der Teilnahme",
    ],
    benefit: "Erfüllte Unterweisungspflicht und Beschäftigte, die wissen, was zu tun ist.",
    basis: "§ 12 ArbSchG, DGUV Vorschrift 1 § 4",
    boundaries: [],
  },
  {
    slug: "raeumungsuebung",
    code: "RÜ",
    title: "Räumungsübung",
    short: "Alarm planen, Übung durchführen, Zeit messen, Schwachstellen auswerten.",
    motif: "raeumung",
    group: "schulung",
    summary:
      "Ich plane die Räumungsübung mit Ihnen, begleite sie und werte sie mit Ihnen aus.",
    why: "Erst bei einer Übung zeigt sich, ob Alarm, Wege und Sammelstelle funktionieren. Regelmäßige Übungen sind empfohlen.",
    tasks: [
      "Planung und Abstimmung mit der Leitung",
      "Durchführung mit Zeitmessung",
      "Auswertung mit konkreten Verbesserungen",
    ],
    benefit: "Gewissheit, dass die Räumung im Ernstfall klappt.",
    basis: "ASR A2.3",
    boundaries: [],
  },
  {
    slug: "pruefung-feuerloescher",
    code: "LÖP",
    title: "Feuerlöscher-Prüfung organisieren",
    short: "Prüftermine im Blick, Prüfung durch einen sachkundigen Fachbetrieb.",
    motif: "loescher",
    group: "partner",
    summary: "Feuerlöscher müssen regelmäßig von Sachkundigen geprüft werden. Ich organisiere das mit einem Fachbetrieb.",
    why: "Die Prüfung ist in der Regel alle zwei Jahre fällig und geht im Alltag leicht unter.",
    tasks: ["Prüftermine im Blick behalten", "Fachbetrieb beauftragen und koordinieren", "Ergebnisse in die Dokumentation übernehmen"],
    benefit: "Keine vergessenen Prüftermine.",
    basis: "ASR A2.2 (Prüfung durch Sachkundige nach DIN 14406-4)",
    boundaries: ["Die Prüfung selbst führt ein sachkundiger Fachbetrieb durch, nicht Brandschutz Ried."],
  },
  {
    slug: "brandschutztueren-feststellanlagen",
    code: "TÜR",
    title: "Brandschutztüren: Prüffristen und Fachbetriebe",
    short: "Ich erfasse die Türen, überwache die Fristen und koordiniere die Prüfung durch Sachkundige.",
    motif: "tuer",
    group: "partner",
    summary:
      "Brandschutztüren und Feststellanlagen müssen regelmäßig geprüft und gewartet werden. Ich organisiere das mit qualifizierten Fachbetrieben.",
    why: "Eine Brandschutztür schützt nur, wenn sie zuverlässig schließt. Feststellanlagen brauchen eine jährliche Prüfung durch Sachkundige.",
    tasks: ["Erfassung der Türen und Feststellanlagen im Objekt", "Prüffristen überwachen", "Fachbetriebe koordinieren und Ergebnisse dokumentieren"],
    benefit: "Ein Überblick über alle Abschlüsse im Gebäude.",
    basis: "DIN 14677",
    boundaries: ["Prüfung und Wartung übernehmen sachkundige Fachbetriebe, nicht Brandschutz Ried."],
  },
];

export const servicesIn = (g: Group) => services.filter((s) => s.group === g);

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/**
 * Die drei Start-Pakete (Entscheidung 06.11.2026): Schulung, Brandschutzordnung
 * und Begehung. Sie stehen auf der Startseite vorn; alles andere läuft unter
 * „Weitere Leistungen“. Die Begehung ist der Einstieg in die dauerhafte
 * Betreuung als externer Brandschutzbeauftragter.
 */
export interface StartPackage {
  slug: string;
  label: string;
  title: string;
  pitch: string;
  forWhom: string;
  includes: string[];
  result: string;
  next?: string;
}

export const startPackages: StartPackage[] = [
  {
    slug: "brandschutzhelfer",
    label: "Pflicht erfüllen",
    title: "Brandschutzhelfer-Ausbildung bei Ihnen vor Ort",
    pitch: "Der schnellste Weg zu einer Pflicht, die fast jeder Betrieb hat.",
    forWhom: "Jeder Arbeitgeber. In der Regel müssen mindestens 5 % der Beschäftigten ausgebildet sein.",
    includes: [
      "Theorie zu Brandentstehung, Löschmitteln und Verhalten im Brandfall",
      "Praktische Löschübung mit Übungsfeuerlöschern auf Ihrem Gelände",
      "Berechnung, wie viele Helfer Sie mit Schichten und Urlaub wirklich brauchen",
    ],
    result: "Teilnahmebescheinigungen und ein Nachweis für Versicherer und Berufsgenossenschaft.",
  },
  {
    slug: "brandschutzordnung",
    label: "Ordnung schaffen",
    title: "Brandschutzordnung nach DIN 14096",
    pitch: "Teil A, B und C, passend zu Ihrem Gebäude statt aus der Schublade.",
    forWhom: "Betriebe ohne aktuelle Brandschutzordnung, nach Umbau oder vor einer Gefahrenverhütungsschau.",
    includes: [
      "Rundgang und Abstimmung von Alarmweg, Sammelstelle und Zuständigkeiten",
      "Teil A als Aushang, Teil B für alle Beschäftigten, Teil C für Personen mit Sonderaufgaben",
      "Druckfertige Dateien und Termin zur Überprüfung nach zwei Jahren",
    ],
    result: "Eine Brandschutzordnung, die stimmt und im Ernstfall verstanden wird.",
  },
  {
    slug: "brandschutzbegehung",
    label: "Klarheit gewinnen",
    title: "Brandschutzbegehung mit Mängelbericht",
    pitch: "Sie wissen danach, wo Ihr Betrieb steht und was zuerst zu tun ist.",
    forWhom: "Betriebe vor einem Versicherer- oder Behördentermin, nach Umbauten oder ohne eigenen Brandschutzbeauftragten.",
    includes: [
      "Rundgang: Fluchtwege, Brandschutztüren, Feuerlöscher, Lagerung, Technikräume",
      "Jeder Mangel mit Foto, Bewertung und konkreter Maßnahme",
      "Bericht mit klarer Reihenfolge: sofort, kurzfristig, bei Gelegenheit",
    ],
    result: "Ein Bericht, mit dem Sie gegenüber Versicherer und Behörde sauber dastehen.",
    next: "Auf Wunsch geht die Begehung in die dauerhafte Betreuung als externer Brandschutzbeauftragter über.",
  },
];

/** Häufige Fragen. Werden auf der Startseite gezeigt und als FAQPage ausgezeichnet. */
export const faqs: { q: string; a: string }[] = [
  {
    q: "Müssen wir einen Brandschutzbeauftragten bestellen?",
    a: "Das ergibt sich meist aus der Baugenehmigung oder dem Brandschutzkonzept (zum Beispiel bei Pflegeheimen und Verkaufsstätten), aus den Bedingungen Ihres Versicherers oder aus der Gefährdungsbeurteilung. Im Erstgespräch sehe ich mir Ihre Unterlagen an und sage Ihnen, was davon auf Sie zutrifft. Das ist eine fachliche Einschätzung, keine Rechtsberatung.",
  },
  {
    q: "Wie viele Brandschutzhelfer brauchen wir?",
    a: "Nach ASR A2.2 in der Regel mindestens 5 % der Beschäftigten, bei erhöhter Brandgefährdung mehr. In der Praxis zählen Schichten, Urlaub und Krankheit mit: Bei 40 Beschäftigten sind 2 Helfer das Minimum, 3 bis 4 sind realistisch.",
  },
  {
    q: "Was kostet das?",
    a: "Sie erhalten nach einem kurzen Gespräch ein schriftliches Angebot mit Festpreis. Die Betreuung als externer Brandschutzbeauftragter läuft zu einem festen Jahresbetrag. Offene Stundenabrechnungen gibt es nicht.",
  },
  {
    q: "Ersetzt das unsere Fachkraft für Arbeitssicherheit?",
    a: "Nein. Brandschutzbeauftragter und Fachkraft für Arbeitssicherheit haben unterschiedliche Aufgaben. Ich stimme mich mit Ihrer Fachkraft ab, damit nichts doppelt gemacht wird und nichts liegen bleibt.",
  },
  {
    q: "Prüfen Sie auch Feuerlöscher, Brandschutztüren und Anlagen?",
    a: "Nein. Diese Prüfungen führen Fachbetriebe mit der nötigen Sachkunde durch. Ich behalte die Fristen im Blick, koordiniere die Termine und übernehme die Ergebnisse in Ihre Dokumentation.",
  },
  {
    q: "Wo sind Sie tätig?",
    a: "Vor allem in Lampertheim, Bürstadt, Biblis, Viernheim und im Kreis Bergstraße. Worms und Mannheim auf Anfrage.",
  },
];
