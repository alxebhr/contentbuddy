window.promptTextOutline = `Nutze dein Wissen zu Kundin, Tonalität und Zielstellung des Textes um die weitere Konversation zu optimieren. 
Du bist in der Rolle eines Werbetexters mit tiefem Verständnis für Suchmaschinenoptimierung. Ich will, dass du mir für folgendes Keyword bzw. Thema einen Text nach meinen Vorgaben generierst.
Keyword: "\${hauptkeyword}"
Der Text soll ein Kaufberatertext auf einer Produktlistenseite unterhalb der Produkte sein. Er soll SEO-optimiert und leicht lesbar sein und die Produktlistenseite für Google für das Keyword bzw. Thema optimieren. 
Tonalität und Wording:
Der Text soll eher informell geschrieben sein. Die Tonalität ist locker, unbeschwert und leicht freundschaftlich. Wird die Kundin angesprochen, dann mit „Sie“. Die Sprache darf auch blumig sein und wie ein Gespräch zwischen zwei Bekannten wirken.
Wenn im Text Situationen und Anlässe aufgegriffen werden, dann zu Freizeitaktivitäten bodenständiger Frau zwischen 50 und 60 Jahren.  
Beachte diese Informationen zu Shop und Kundin sowohl bei der Formulierung des Textes als auch beim Setzen inhaltlicher Schwerpunkte.  
SEO-Vorgaben:
Basierend auf einer gründlichen Keyword-Recherche wurden folgende Haupt- und Nebenkeywords identifiziert: 
Hauptkeyword: "\${hauptkeyword}"
Folgene Nebenkeywords müssen zwingend im Text genannt werden: "\${nebenkeywords}"
Achte darauf, die Nebenkeywords unbedingt effektiv zu integrieren, aber ohne den natürlichen Lesefluss zu stören. Baue die Nebenkeywords bitte grammatikalisch korrekt in den Text ein. 
Die folgenden Wörter sind semantisch relevant und müssen unbedingt auch eingebaut werden: "\${proofkeywords}"
Inhalt:
Thematisch dreht sich der Text um eine Produktkategorie aus dem Modesegment. Der Text soll demnach für verschiedene Fragestellung zu dem Thema beraten, welche dem Leser vor einem Kauf helfen können. Jeder Satz muss dem Leser echten Mehrwert bieten, indem du spezifische Tipps und Ratschläge zu dem jeweiligen Thema erteilst. Echten Mehrwert bieten beispielsweise spezifische Kombinationstipps und Outfit-Tipps, Erklärungen zu Materialien und deren Vor- und Nachteile, Passformberatung, Stil- und Outfit-Beratung für verschiedene Anlässe, Pflege- und Aufbewahrungstipps, Eigenschaften und Attribute für besonderen Komfort, Beratung zur Wahl von Farben und Mustern, Hervorheben von besonders schmeichelhaften Schnitten für verschiedene Körpertypen. 
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
Du bist ein erfahrener SEO- und Copywriting-Experte mit umfassendem Wissen über die Bedürfnisse von Kundinnen im Bereich Damenmode und Damenunterwäsche. Erstelle eine strukturierte Gliederung zum Thema "${hauptkeyword}" für eine Produktlistenseite eines Online-Shops.
Ziel: Die Gliederung soll potenziellen Kundinnen wertvolle Informationen bieten, häufig gestellte Fragen zu dem Produkt beantworten und unterstützende Informationen bereitstellen, die eine Kaufentscheidung ermöglichen. Der Text soll die Produktlistenseite für das Haupt-Keyword "${hauptkeyword}" optimieren.
Zielgruppe: Frauen mittleren Alters, die bei heine nach stilvollen Outfits mit dem besonderen Etwas für jeden Anlass suchen. Sie legen Wert auf modische Inspirationen, Trends und Styling.
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
•	Vermeide Formulierungen wie „exklusiv“ oder „luxuriös“. Verwende stattdessen Begriffe wie „feminin“, „chic“, „lässig“, „modern“, „figurschmeichelnd“, „farbenfroh“, „trendstark“ und „selbstbewusst“. 
Folgende Text-Beispiele sollen dir helfen, den richtigen Ton zu treffen: 
•	Der Herbst bringt Farbe ins Spiel – nicht nur in der Natur, auch im Kleiderschrank
•	Spontan mit den Freundinnen in die City?! Gerne, mit diesen Kombikünstlern bin ich ruckzuck fertig!
•	Diese Streifen will jeder sehen! So wunderbar lässig – fast schon oskarverdächtig!
•	Hier ist er: superbequem, super lässig, super trendy. Das attraktive Rautenmuster in den schönsten Herbsttönen machen die Strickjacke zum echten Kombi-Liebling. Ein tolles Outfit für Spaziergänge im Park, Café-Dates mit den Freundinnen und einfach alles, was Sie so vorhaben.
•	Unser Tipp: Longwesten! Denn die schmeicheln perfekt Ihrer Figur, halten warm und verleihen jedem Look einen sportiven Charakter.
•	Jeans mit Jeans kombinieren? Ja, bitte! Unser Tipp: Durch einen stylischen Farbtupfer wie dem sonnengelben Pullunder kommt ein bisschen Pep ins Mode-Spiel

`;
