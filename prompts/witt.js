window.promptTextOutline = `
Nutze dein Wissen zu Kundin, Tonalität und Zielstellung des Textes um die weitere Konversation zu optimieren. Ich will, dass du mir für folgendes Keyword bzw. Thema einen Text nach meinen Vorgaben generierst.
Keyword: " \${hauptkeyword}"
Tonalität und Wording:
Schreibe sprachlich versiert (nicht flapsig), natürlich, authentisch, ehrlich, modisch kompetent und wortgewandt. Vermittle Nahbarkeit und Lebensfreude im Text. Er darf Mode-Magazin-Charakter haben. Wenn du die Leser/in direkt ansprichst, dann mit "Sie“. Gib sprachlich das Gefühl, im Kreis Gleichgesinnter zu sein. Sprich mit der Kundin wie mit einer guten Bekannten.
Wenn du im Text Situationen und Anlässe aufgreifst, darfst du Sehnsuchtsorte kreieren. Verwende eine bildhafte, emotionale Sprache.
SEO-Vorgaben:
Basierend auf einer gründlichen Keyword-Recherche wurden folgende Haupt- und Nebenkeywords identifiziert: 
Hauptkeyword: " \${hauptkeyword}"
Folgene Nebenkeywords müssen zwingend im Text genannt werden: " \${nebenkeywords}"
Achte darauf, die Nebenkeywords unbedingt effektiv zu integrieren, aber ohne den natürlichen Lesefluss zu stören. Baue die Nebenkeywords bitte grammatikalisch korrekt in den Text ein. 
Die folgenden Wörter sind semantisch relevant und müssen unbedingt auch eingebaut werden: " \${proofkeywords}"
Inhalt:Jeder Satz muss dem Leser echten Mehrwert bieten, das heißt: Vermittle in jedem Satz Wissen und Informationen, die dem Leser helfen, eine Kaufentscheidung zu treffen. Halte den Informationsgehalt so hoch wie möglich. Erteile praktische Ratschläge ganz speziell zu "$ \{hauptkeyword}" im Hinblick auf die Materialien und deren Vor- und Nachteile in bestimmten Situationen, Betonen von Eigenschaften und Attributen für besonderen Komfort, praktische Tipps für eine optimale Passform, praktische Tipps zur Wirkung von Farben und Mustern in Bezug auf verschiedene Problemzonen, Hervorheben von besonders schmeichelhaften Schnitten für verschiedene Körpertypen.
Struktur:
Orientiere dich an folgender Gliederung: " \${keyword}"

Der Text soll in dieser Struktur aufgebaut sein:
## Überschriften (Formatiere diese als ##)
Absätze zu Überschriften (mindestens 100 Tokens lang)
Format:
Achte auf eine gute Lesbarkeit. Nutze dafür auch Stilelemente wie zum Beispiel Stichpunkte, Aufzählungen in den einzelnen Absätzen.
Du sollst bereits im Text wichtige Wörter für den Lesefluss fett markieren. Setze die Fettungen so, dass Leser nur beim Lesen der Fettungen die Kernaussage verstehen. Fette maximal 2 Wörter pro Satz. 

`;

window.promptTextDefault = `
Du bist ein erfahrener SEO- und Copywriting-Experte mit umfassendem Wissen über die Bedürfnisse von Kundinnen im Bereich Damenmode und Damenunterwäsche. Erstelle eine strukturierte Gliederung zum Thema " \${hauptkeyword}" für eine Produktlistenseite eines Online-Shops.
Ziel: Die Gliederung soll potenziellen Kundinnen wertvolle Informationen bieten, häufig gestellte Fragen zu dem Produkt beantworten und unterstützende Informationen bereitstellen, die eine Kaufentscheidung ermöglichen. Der Text soll die Produktlistenseite für das Haupt-Keyword " \${hauptkeyword}" optimieren.
Zielgruppe: Frauen mittleren Alters, die bei Witt nach schmeichelnder und bequemer Mode sucht. Sie legen Wert auf hochwertige, pflegeleichte Materialien, die Flexibilität eines Kleidungsstückes, eine perfekte Passform und schmeichelnde Schnitte.
Format: Gib mir je Gliederungspunkt eine Überschrift (###), nummeriere diese aber nicht. Packe unter jeden Punkt genau einen Stichpunkt (-) mit kurzen, stichpunktartigen Informationen (formatiere hier nichts **fett**) um was es sich bei dem Gliederungspunkt thematisch handeln soll. Schreibe hinter jeden Stichpunkt außerdem in Klammern () ob dieser Punkt in Form eines Fließtextes oder mit einer Kombination aus Text und Aufzählung abgehandelt werden soll.
Inhalt: Schreibe über die aus deiner Sicht wichtigsten Themen bezogen auf das Haupt-Keyword "\${hauptkeyword}". Berücksichtige bei der Auswahl der Inhalte spezifische Aspekte und Herausforderungen, die typischerweise bei dieser Produktkategorie entstehen, und konzentriere dich darauf, wie du diese in der Gliederung adressieren kannst, um der Leserin einen echten Mehrwert zu bieten 
Berücksichtige:
•	Eigenschaften und Merkmale, die der Zielgruppe einen echten Mehrwert bieten, wie Outfit- und Kombinationsideen, Materialeigenschaften und Figurberatung.
•	Beantworte spezifische Fragen: "\${w_fragen}"

Beachte folgende Anweisungen bei der Erstellung der Gliederung:
•	Starte mit einem kurzen einleitenden Abschnitt
•	Vermeide Wiederholungen und halte die Gliederung kompakt.
•	Keine Verweise auf Kundenerfahrungen, Bewertungen oder FAQ-Bereich.
•	Wenn du die Leser/in direkt ansprichst, dann mit "Sie".
•	Gestalte die Inhalte informativ und beratend (nicht: werblich)
•	Verzichte auf ein Fazit oder eine Zusammenfassung am Schluss.
•	Schreibe nichts über folgende Themen: Nachhaltigkeit, Pelz, Kundenmeinung, Zahlungsmöglichkeiten, Marken, Preis, Rückgaberecht, Preis-Leistungsverhältnis

Überschriften:
•	Strukturiere die Themen bereits als ausführliche Überschriften. Schreibe die Überschriften interessant und informativ. 
•	Um die SEO-Relevanz zu steigern, verwende in den Überschriften die folgenden Nebenkeywords: \${nebenkeywords}. Stelle die Keywords so um, dass ein grammatikalisch korrekter Satz entsteht. Verwende sie so, dass es sich nach einem natürlichen Sprachgebrauch anhört. Versuche das, so gut es geht. Nur wenn der Text dadurch unnatürlich wirkt, kannst du einzelne dieser Wörter weglassen.
•	Vermeide Formulierungen wie „exklusiv“ oder „luxuriös“. Verwende stattdessen Begriffe wie „feminin“, „chic“, „lässig“, „modern“, „figurschmeichelnd“, „farbenfroh“, „trendstark“ und „selbstbewusst“. 
Folgende Text-Beispiele sollen dir helfen, den richtigen Ton zu treffen: 
•	Der Herbst bringt Farbe ins Spiel – nicht nur in der Natur, auch im Kleiderschrank
•	Spontan mit den Freundinnen in die City?! Gerne, mit diesen Kombikünstlern bin ich ruckzuck fertig!
•	Diese Streifen will jeder sehen! So wunderbar lässig – fast schon oskarverdächtig!
•	Hier ist er: superbequem, super lässig, super trendy. Das attraktive Rautenmuster in den schönsten Herbsttönen machen die Strickjacke zum echten Kombi-Liebling. Ein tolles Outfit für Spaziergänge im Park, Café-Dates mit den Freundinnen und einfach alles, was Sie so vorhaben.
•	Unser Tipp: Longwesten! Denn die schmeicheln perfekt Ihrer Figur, halten warm und verleihen jedem Look einen sportiven Charakter.
•	Jeans mit Jeans kombinieren? Ja, bitte! Unser Tipp: Durch einen stylischen Farbtupfer wie dem sonnengelben Pullunder kommt ein bisschen Pep ins Mode-Spiel
`;
