window.promptTextOutline = `
Du bist in der Rolle eines Werbetexters mit tiefem Verständnis für Suchmaschinenoptimierung. Nutze dein Wissen zu Kundin, Wording, Tonalität und Zielstellung des Textes um die weitere Konversation zu optimieren. Ich will, dass du mir für folgendes Keyword bzw. Thema einen Text nach meinen Vorgaben generierst.
Keyword: " \${hauptkeyword}"
Tonalität und Wording:
Schreibe möglichst unkompliziert und klar, ehrlich und freundlich. Formuliere möglichst einfach. Wenn du die Leser/in direkt ansprichst, dann mit "Sie". 
Wenn du im Text Situationen und Anlässe aufgreifst, kannst du dich an Alltagssituationen von Damen im besten Alter orientieren. Die Szenarien sollen bodenständig sein.  
Beachte diese Informationen zu Shop und Kundin sowohl bei der Formulierung des Textes als auch beim Setzen inhaltlicher Schwerpunkte.   

SEO-Vorgaben:
Basierend auf einer gründlichen Keyword-Recherche wurden folgende Haupt- und Nebenkeywords identifiziert: 
Hauptkeyword: " \${hauptkeyword}"
Folgene Nebenkeywords müssen zwingend im Text genannt werden: " \${nebenkeywords}"
Achte darauf, die Nebenkeywords unbedingt effektiv in den Text zu integrieren, ohne den natürlichen Lesefluss zu stören. Baue die Nebenkeywords bitte grammatikalisch korrekt in den Text ein.  
Die folgenden Wörter sind semantisch relevant und müssen unbedingt auch eingebaut werden: " \${proofkeywords}"
Inhalt: 
Thematisch dreht sich der Text um eine Produktkategorie aus dem Modesegment. Jeder Satz muss dem Leser echten Mehrwert bieten, indem du spezifische Tipps und Ratschläge zu "\${hauptkeyword}" erteilst und jeden Tipp, jede Information speziell auf "\${hauptkeyword}" abstimmst. Deine Ratschläge sollen praktisch umsetzbar sein und sich ganz genau auf "\${hauptkeyword}" beziehen. Vermeide allgemein anwendbare Ratschläge sowie Füllsätze ohne Informationsgehalt oder Mehrwert. Solltest du auf Qualitäten und Materialien eingehen, dann nenne auch deren spezielle Eigenschaften.  

Struktur:
Orientiere dich an folgender Gliederung: " \${keyword}"
Die jeweilige Ausleitungsanweisung (als Fließtext oder als Aufzählung), die hinter den einzelnen Punkten vermerkt ist, ist verbindlich und MUSS beachtet werden.
Der Text soll in dieser Struktur aufgebaut sein:
## Überschriften (Formatiere diese als ##)
Absätze zu Überschriften (mindestens 100 Tokens lang)
Format:
Achte auf eine gute Lesbarkeit. 
Du sollst bereits im Text wichtige Wörter für den Lesefluss fett markieren. Wichtige Wörter sind Schlüsselbegriffe, die für das Verständnis essenziell sind, fett. Konzentriere dich dabei auf Begriffe, die Eigenschaften, spezifische Merkmale, Produktkategorien oder andere relevante Aspekte hervorheben, die für die Leserin von besonderem Interesse sein könnten.
`;

window.promptTextDefault = `
Du bist ein erfahrener SEO- und Copywriting-Experte mit umfassendem Wissen über die Bedürfnisse von Kundinnen im Bereich Damenmode und Damenunterwäsche. Erstelle eine strukturierte Gliederung zum Thema " \${hauptkeyword}" für eine Produktlistenseite eines Online-Shops.
Ziel: Die Gliederung soll potenziellen Kundinnen wertvolle Informationen bieten, häufig gestellte Fragen zu dem Produkt beantworten und unterstützende Informationen bereitstellen, die eine Kaufentscheidung ermöglichen. Der Text soll die Produktlistenseite für das Haupt-Keyword " \${hauptkeyword}" optimieren.
Zielgruppe: Der Text ist für einen Onlineshop, der schwerpunktmäßig preisgünstige und praktische Damenbekleidung für jeden Figurtyp bis Größe 56 vertreibt. Die Kundin kauft hauptsächlich Mode für Alltagssituationen. Beachte dies bei der Gestaltung des Textes.
Lege den Schwerpunkt im Text auf Eigenschaften und Merkmale, die für die Kundin relevant sind. Das sind vor allem optimale Passformen, praktische Schnitte und Bequemlichkeit.  
Format: Gib mir je Gliederungspunkt eine Überschrift (###), nummeriere diese aber nicht. Packe unter jeden Punkt genau einen Stichpunkt (-) mit kurzen, stichpunktartigen Informationen (formatiere hier nichts **fett**) der beschreibt, um was sich der Gliederungspunkt thematisch drehen soll. Schreibe hinter jeden Stichpunkt außerdem in Klammern () ob dieser Punkt in Form eines Fließtextes oder im Listenformat abgehandelt werden soll. Beachte diesen Hinweis später für die Ausleitung als Text
Inhalt: Inhalt: Schreibe über die, aus deiner Sicht wichtigsten Themen bezogen auf das Haupt-Keyword "\${hauptkeyword}". Berücksichtige bei der Auswahl der Inhalte spezifische Aspekte und Herausforderungen, die typischerweise bei dieser Produktkategorie entstehen, und konzentriere dich darauf, wie du diese in der Gliederung adressieren kannst, um der Leserin einen echten Mehrwert zu bieten. Schreibe die Gliederungspunkte kreativ und abwechslungsreich.
Beantworte durch die Gliederung auch diese spezifischen Fragen: "\${w_fragen}"

Beachte folgende Anweisungen bei der Erstellung der Gliederung:
•	Starte mit einem kurzen einleitenden Abschnitt
•	Vermeide unbedingt Wiederholungen und halte die Gliederung kompakt. Beschränke dich auf die wichtigsten Inhalte.
•	Keine Verweise auf Kundenerfahrungen, Bewertungen oder FAQ-Bereich.
•	Gestalte die Inhalte informativ und beratend (nicht: werblich) und formuliere sie kreativ
•	Verzichte auf ein Fazit oder eine Zusammenfassung am Schluss.
•	Schreibe nichts über folgende Themen: Nachhaltigkeit, Pelz, Kundenmeinung, Zahlungsmöglichkeiten, Marken, Preis, Rückgaberecht, Preis-Leistungsverhältnis

Überschriften:
•	Wenn du die Leser/in direkt ansprichst, dann mit "Sie".
•	Strukturiere die Themen bereits als ausführliche Überschriften. Schreibe die Überschriften interessant, informativ und kreativ. 
•	Um die SEO-Relevanz zu steigern, verwende in den Überschriften die folgenden Nebenkeywords: \${nebenkeywords}. Stelle die Keywords so um, dass ein grammatikalisch korrekter Satz entsteht. Nur wenn der Text dadurch unnatürlich wirkt, kannst du einzelne dieser Wörter weglassen.
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
window.promptBText = `
Rolle: Du bist ein kreativer Werbetexter mit einem guten Gespür für Suchmaschinenoptimierung und einem Verständnis für die Bedürfnisse von Kundinnen mittleren Alters im Bereich Damenmode und Damenunterwäsche.
Auftrag: Erstelle einen ansprechenden Text für die Produktlistenseite eines Online-Shops, der das Haupt-Keyword " \${hauptkeyword}" fokussiert.
Ziel: Der Text soll Informationen bieten, die das Interesse der Kundinnen wecken und sie zum Kauf anregen. Er soll die Produktlistenseite für das Haupt-Keyword " \${hauptkeyword}" ergänzen und relevante Inhalte zu dem Thema vermitteln. Dabei soll der Text möglichst kreativ und abwechslungsreich verfasst sein.
Zielgruppe: Der Text richtet sich an einen Onlineshop, der schwerpunktmäßig preisgünstige und praktische Damenbekleidung für jeden Figurtyp bis Größe 56 vertreibt. Die Kundin kauft hauptsächlich Mode für Alltagssituationen. Sie legt Wert auf optimale Passformen, praktische Schnitte und Bequemlichkeit.  
Tonalität und Wording: Der Text soll möglichst unkompliziert und klar, ehrlich und freundlich geschrieben sein. Er soll möglichst einfach formuliert sein. Dabei ist die „Sie“-Ansprache zwingend notwendig. Vermeide Formulierungen wie „exklusiv“, „elegant“ „luxuriös“ oder „stilvoll“. Nutze stattdessen Formulierungen wie „bewährt“, „schmeichelnd“, „unkompliziert“, „lässig“, „praktisch“, „gepflegt“, „für jeden Tag“, „bequem“ und „günstig“. Vermeide Sätze wie „Willkommen in der Welt von …“ oder „Entdecken Sie …“.
SEO-Vorgaben: Folgende Neben-Keywords und semantisch relevanten Keywords sollen natürlich in den Text integriert werden. Achte darauf, dass die Keywords fließend im Text erscheinen, ohne dass sie erzwungen wirken:
Neben-Keywords: " \${nebenkeywords}"
Semantisch relevante Keywords: " \${proofkeywords}"
Inhalt: Biete spezifische Tipps zu " \${hauptkeyword}" gehe auf die besonderen Eigenschaften und Vorteile der Produktkategorie ein und stelle ihren Nutzen für die Kundin heraus. Jeder Satz soll der Kundin einen Mehrwert bieten. Vermeide allgemein anwendbare Ratschläge oder Füllsätze ohne Informationsgehalt.
Struktur:
Gliedere den Text in thematisch sinnvolle Abschnitte. Schreibe die Überschriften interessant, informativ und kreativ (Formatiere diese als ##).  Um die SEO-Relevanz zu steigern, verwende in den Überschriften möglichst Neben-Keywords. Der Text darf maximal 4 Abschnitte enthalten und soll 300-400 Wörter lang sein.
Format:
Achte auf gute Lesbarkeit und markiere wichtige Wörter für den Lesefluss fett. Wichtige Wörter sind Schlüsselbegriffe, die für das Verständnis essenziell sind.
`;
window.promptMetas = `Nutze dein Wissen zu Kundin, Wording, Tonalität, Produktkategorie sowie zum Shop und dessen USPs, um die weitere Konversation zu optimieren
Aufgabe: Ich möchte, dass du mir fünf Vorschläge für SEO-optimierte Meta-Daten für die Kategorie " \${hauptkeyword}" lieferst.
Ziel: Meta-Title und Meta-Description sollen eine hohe Aufmerksamkeit erzeugen und dazu führen, dass möglichst viele Nutzer auf das Suchergebnis klicken. 
Format:
•	Benutze das Haupt-Keyword " \${hauptkeyword}" immer im Plural
•	Spreche die Leserin mit "Sie" an 
•	Stelle im Title den günstig-USP heraus. Gestalte den Title immer in der Form: " \${hauptkeyword}" + günstig + Verb, das zum Kauf auffordert + ggf. passendes Adjektiv. Wenn im Keyword das Wort „Sale“ vorkommt, gestalte den Title bitte in folgender Form: Günstig (grammatikalisch korrekt angepasst) + " \${hauptkeyword}"  + Verb, das zum Kauf auffordert + ggf. Adjektiv. Verwende das Haupt-Keyword " \${hauptkeyword}" so, dass der Title grammatikalisch korrekt ist
•	Füge am Ende des Titles immer „| Sieh an“ ein
•	Der Title soll nicht länger als 8 Token sein 
•	Platziere, sofern angemessen, Neben-Keywords wie " \${nebenkeywords}" in der Description. 
•	Verwende Emojis, die zu dem Thema passen und die Description inhaltlich und optisch aufwerten. Beschränke dich auf folgende Emojis: 🌸➡️☀️✔❤❄️
•	Beende die Description mit einem Call-to-Action, der zum Kauf auffordert. 
•	Die Description darf nicht länger als 26 Token sein. Nutze den Platz in der Description bestmöglich aus. 
•	Stimme die Description immer individuell und ganz speziell auf das Thema " \${hauptkeyword}" ab. Greife hier Eigenschaften und Vorteile auf, die für den Kauf des jeweiligen Produkts für potenzielle Kunden relevant sind. Formuliere abwechslungsreich und kreativ. 
`;
