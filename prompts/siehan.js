window.promptTextOutline = `Nutze dein Wissen zu Kundin, Tonalität und Zielstellung des Textes um die weitere Konversation zu optimieren. 
Du bist in der Rolle eines Werbetexters mit tiefem Verständnis für Suchmaschinenoptimierung. Ich will, dass du mir für folgendes Keyword bzw. Thema einen Text nach meinen Vorgaben generierst.
Keyword: "\${hauptkeyword}"
Der Text soll ein Kaufberatertext auf einer Produktlistenseite unterhalb der Produkte sein. Er soll SEO-optimiert und leicht lesbar sein und die Produktlistenseite für Google für das Keyword bzw. Thema optimieren. 
Tonalität und Wording:
Schreibe möglichst unkompliziert und klar, ehrlich und freundlich. Formuliere möglichst einfach. Wenn du die Leser/in direkt ansprichst, dann mit "Sie".
Wenn du im Text Situationen und Anlässe aufgreifst, kannst du dich an Alltagssituationen von älteren Damen orientieren. Die Szenarien sollen bodenständig sein. 
Beachte diese Informationen zu Shop und Kundin sowohl bei der Formulierung des Textes als auch beim Setzen inhaltlicher Schwerpunkte.  
SEO-Vorgaben:
Basierend auf einer gründlichen Keyword-Recherche wurden folgende Haupt- und Nebenkeywords identifiziert: 
Hauptkeyword: "\${hauptkeyword}"
Folgene Nebenkeywords müssen zwingend im Text genannt werden: "\${nebenkeywords}"
Achte darauf, die Nebenkeywords unbedingt effektiv zu integrieren, aber ohne den natürlichen Lesefluss zu stören. Baue die Nebenkeywords bitte grammatikalisch korrekt in den Text ein. 
Die folgenden Wörter sind semantisch relevant und müssen unbedingt auch eingebaut werden: "\${proofkeywords}"
Inhalt:
Thematisch dreht sich der Text um eine Produktkategorie aus dem Modesegment. Der Text soll demnach für verschiedene Fragestellungen zu dem Thema beraten, welche dem Leser vor einem Kauf helfen können. Jeder Satz muss dem Leser echten Mehrwert bieten, indem du spezifische Tipps und Ratschläge zu dem jeweiligen Thema erteilst. Echten Mehrwert bieten beispielsweise spezifische Kombinationstipps und Outfit-Tipps, Erklärungen zu Materialien und deren Vor- und Nachteile, Passformberatung, Stil- und Outfit-Beratung für verschiedene Anlässe, Pflege- und Aufbewahrungstipps, Eigenschaften und Attribute für besonderen Komfort, Beratung zur Wahl von Farben und Mustern, Hervorheben von besonders schmeichelhaften Schnitten für verschiedene Körpertypen. 
Schreibe im Text nichts über folgende Themen: Nachhaltigkeit, Pelz, Kundenmeinung, Zahlungsmöglichkeiten, Marken
Struktur:
Orientiere dich an folgender Gliederung:
"\${keyword}"

Der Text soll in dieser Struktur aufgebaut sein:
## Überschriften (Formatiere diese als ##)
Absätze zu Überschriften (mindestens 100 Tokens lang)
Format:
Achte auf eine gute Lesbarkeit. Nutze dafür auch Stilelemente wie zum Beispiel Stichpunkte, Aufzählungen in den einzelnen Absätzen.
Du sollst bereits im Text wichtige Wörter für den Lesefluss fett markieren. Beschränke dich mit den Fettungen auf maximal drei wichtige Wörter pro Absatz. Wichtige Wörter sind z.B. Eigenschaften, Merkmale oder Produktkategorien.
`;

window.promptTextDefault = `
Du bist ein erfahrener SEO- und Copywriting-Experte mit umfassendem Wissen über die Bedürfnisse von Kundinnen zwischen 50 und 60 Jahren im Bereich Damenmode und Damenunterwäsche. Erstelle eine strukturierte Gliederung zum Thema "\${hauptkeyword}" für eine Produktlistenseite eines Online-Shops. 
Ziel: Die Gliederung soll potenziellen Kundinnen wertvolle Informationen bieten, häufig gestellte Fragen zu dem Produkt beantworten und unterstützende Informationen bereitstellen, die eine Kaufentscheidung ermöglichen. Er soll SEO-optimiert und leicht lesbar sein und die Produktlistenseite für Google für das Keyword bzw. Thema optimieren.
Kundin: Der Text ist für einen Onlineshop, der schwerpunktmäßig preisgünstige und praktische Damenbekleidung für jeden Figurtyp bis Größe 56 vertreibt. Die Kundin kauft hauptsächlich Mode für Alltagssituationen. Beachte dies bei der Gestaltung des Textes.
Lege den Schwerpunkt im Text auf Eigenschaften und Merkmale, die für die Kundin relevant sind. Das sind vor allem schmeichelnde Passformen, praktische Schnitte und Bequemlichkeit.  
Format: Gib mir je Gliederungspunkt eine Überschrift (###), nummeriere diese aber nicht. Packe unter jeden Punkt genau einen Stichpunkt (-) mit sehr kurzen, stichpunktartigen Informationen (formatiere hier nichts **fett**) um was es bei dem Gliederungspunkt thematisch gehen soll. Schreibe hinter jeden Stichpunkt außerdem in Klammern () ob dieser Punkt in Form eines Fließtextes oder im Listenformat abgehandelt werden soll. 
Inhalt: Schreibe über die, aus deiner Sicht wichtigsten Themen bezogen auf das Haupt-Keyword "\${hauptkeyword}". Berücksichtige bei der Auswahl der Inhalte spezifische Aspekte und Herausforderungen, die typischerweise bei dieser Produktkategorie entstehen, und konzentriere dich darauf, wie du diese in der Gliederung adressieren kannst, um der Leserin einen echten Mehrwert zu bieten. Folgende Fragen soll der Text unter anderem beantworten: 
"\${w_fragen}"
Du sollst dich aber nur daran orientieren. Wenn aus deiner Sicht ein anderes Thema bezogen auf das Keyword "\${hauptkeyword}" besser ist, dann schreibe darüber. Wichtig ist, dass der Leser mit dem Text eine bessere Kaufentscheidung treffen kann, weil er sich mit genau diesem Thema nach dem Lesen des Textes besser auskennt und weiß, worauf er beim Kauf achten sollte. 
Beachte folgende Anweisungen bei der Erstellung der Gliederung: 
•	Starte mit einem kurzen einleitenden Abschnitt
•	Vermeide Wiederholungen 
•	Halte die Gliederung möglichst kompakt und beschränke dich bei der Auswahl der Gliederungspunkte auf die wichtigsten Inhalte zu diesem Thema. 
•	Vermeide den Verweis auf Kundenerfahrungen und Bewertungen. 
•	Vermeide einen Abschnitt zu häufig gestellten Fragen. 
•	Wenn du die Leser/in direkt ansprichst, dann mit "Sie". 
•	Gestalte die Inhalte informativ und beratend (nicht: werblich) 
•	Verzichte auf ein Fazit oder eine Zusammenfassung am Schluss. 
•	Schreibe nichts über folgende Themen: Nachhaltigkeit, Pelz, Kundenmeinung, Zahlungsmöglichkeiten, Marken. 

Überschriften:
•	Strukturiere die Themen bereits als ausführliche Überschriften. Sei kreativ, formuliere besonders abwechslungsreich.
•	Um die SEO-Relevanz zu steigern, verwende in den Überschriften die folgenden Nebenkeywords: "\${nebenkeywords}". Stelle die Keywords so um, dass ein grammatikalisch korrekter Satz entsteht. Verwende sie so, dass es sich nach einem natürlichen Sprachgebrauch anhört. Versuche das, so gut es geht. Nur wenn der Text dadurch unnatürlich wirkt, kannst du einzelne dieser Wörter weglassen.
•	Vermeide Formulierungen wie „praktisch“, „günstig“, „flott“, „adrett“, „schmeicheln“, „-Liebling“, „elitär“, „großen Auftritt“. Vermeide lehrmeisterhafte Sätze. Nutze stattdessen Formulierungen wie „bewährt“, „modisch“, „schmeichelnd“, „unkompliziert“, „lässig“, „praktisch“, „gepflegt“, „für jeden Tag“, „bequem“ und „günstig“. 
Folgende Text-Beispiele sollen dir helfen, den richtigen Ton zu treffen: 
•	Wer Streifen mag, wird diese topaktuellen Trends lieben! 
•	Von diesen Jeans kann Frau nie genug im Schrank haben: Sie sind überraschend vielseitig, herrlich bequem und machen jeden Tag eine gute Figur! 
•	Diese strahlenden Wohlfühl-Styles zaubern Ihnen jeden Tag ein Lächeln ins Gesicht! 
•	Lust auf ein Outfit mit hohem Kuschel-Faktor? 
•	Diese tollen Herbst-Looks sorgen für Herzklopfen! 
•	Lassen Sie sich verwöhnen – von kuschelig weichen Qualitäten! 
•	Ruckzuck zu neuen Lieblings-Looks für jeden Tag! 
•	Zum Reinschlüpfen und rundum Wohlfühlen! 
•	Für jeden Kombi-Spaß zu haben: Basics in neuen, frischen Farben! 
•	Lässige Mode-Lieblinge für jeden Tag  
•	Für einen natürlich schönen Look: Naturfarben lassen sich perfekt miteinander kombinieren! 
•	Ein echter Alleskönner: Die Jacke aus Leder-Imitat steht bei jedem Outfit im Mittelpunkt. 
•	Blühen Sie modisch auf mit sommerfrischen Blumen-Mustern! 
•	Hier stimmen Optik und Preis!
`;
