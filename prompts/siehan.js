window.promptTextOutline = `
Nutze dein Wissen zu Kundin, Tonalität und Zielstellung des Textes um die weitere Konversation zu optimieren. Ich will, dass du mir für folgendes Keyword bzw. Thema einen Text nach meinen Vorgaben generierst.
Keyword: " \${hauptkeyword}"
Tonalität und Wording:
Schreibe möglichst unkompliziert und klar, ehrlich und freundlich. Formuliere möglichst einfach. Wenn du die Leser/in direkt ansprichst, dann mit "Sie".
Wenn du im Text Situationen und Anlässe aufgreifst, kannst du dich an Alltagssituationen von älteren Damen orientieren. Die Szenarien sollen bodenständig sein. 
SEO-Vorgaben:
Basierend auf einer gründlichen Keyword-Recherche wurden folgende Haupt- und Nebenkeywords identifiziert: 
Hauptkeyword: " \${hauptkeyword}"
Folgene Nebenkeywords müssen zwingend im Text genannt werden: " \${nebenkeywords}"
Achte darauf, die Nebenkeywords unbedingt effektiv zu integrieren, aber ohne den natürlichen Lesefluss zu stören. Baue die Nebenkeywords bitte grammatikalisch korrekt in den Text ein. 
Die folgenden Wörter sind semantisch relevant und müssen unbedingt auch eingebaut werden: " \${proofkeywords}"
Inhalt:
Jeder Satz muss dem Leser echten Mehrwert bieten, das heißt: Vermittle in jedem Satz Wissen und Informationen, die dem Leser helfen, eine Kaufentscheidung zu treffen. Halte den Informationsgehalt so hoch wie möglich. Erteile praktische Ratschläge ganz speziell zu "$ \{hauptkeyword}". Gehe beispielsweise auf Details, Eigenschaften und Funktionen ein, die für besonderen Komfort und Bequemlichkeit von "$ \{hauptkeyword}" sorgen. Gebe praktische Tipps für eine optimale Passform von "$ \{hauptkeyword}". Gehe darauf ein, welche Eigenschaften oder Details "$ \{hauptkeyword}" besonders praktisch für den Alltag machen. 

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
Zielgruppe: Frauen mittleren Alters, die preisgünstige und praktische Damenbekleidung bis Größe 56 für den Alltag suchen. Der Fokus liegt auf schmeichelnden Passformen, praktischen Schnitten und Bequemlichkeit.
Format: Gib mir je Gliederungspunkt eine Überschrift (###), nummeriere diese aber nicht. Packe unter jeden Punkt genau einen Stichpunkt (-) mit kurzen, stichpunktartigen Informationen (formatiere hier nichts **fett**) um was es sich bei dem Gliederungspunkt thematisch handeln soll. Schreibe hinter jeden Stichpunkt außerdem in Klammern () ob dieser Punkt in Form eines Fließtextes oder mit einer Kombination aus Text und Aufzählung abgehandelt werden soll.
Inhalt: Inhalt: Schreibe über die, aus deiner Sicht wichtigsten Themen bezogen auf das Haupt-Keyword "\${hauptkeyword}". Berücksichtige bei der Auswahl der Inhalte spezifische Aspekte und Herausforderungen, die typischerweise bei dieser Produktkategorie entstehen, und konzentriere dich darauf, wie du diese in der Gliederung adressieren kannst, um der Leserin einen echten Mehrwert zu bieten 
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
•	Vermeide Formulierungen wie „exklusiv“, „elegant“ „luxuriös“ oder „stilvoll“. Nutze stattdessen Formulierungen wie „bewährt“, „schmeichelnd“, „unkompliziert“, „lässig“, „praktisch“, „gepflegt“, „für jeden Tag“, „bequem“ und „günstig“. 
Folgende Text-Beispiele sollen dir helfen, den richtigen Ton zu treffen: 
•	Wer Streifen mag, wird diese topaktuellen Trends lieben! 
•	Von diesen Jeans kann Frau nie genug im Schrank haben: Sie sind überraschend vielseitig, herrlich bequem und machen jeden Tag eine gute Figur! 
•	Diese strahlenden Wohlfühl-Styles zaubern Ihnen jeden Tag ein Lächeln ins Gesicht! 
•	Lust auf ein Outfit mit hohem Kuschel-Faktor? 
•	Diese tollen Herbst-Looks sorgen für Herzklopfen! 
•	Lassen Sie sich verwöhnen – von kuschelig weichen Qualitäten! 
•	Ruckzuck zu neuen Lieblings-Looks für jeden Tag! 
•	Zum Reinschlüpfen und rundum Wohlfühlen! 
`;
