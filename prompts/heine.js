window.promptTextOutline = `Nutze dein Wissen zu Kundin, Tonalität und Zielstellung des Textes um die weitere Konversation zu optimieren. 
Du bist in der Rolle eines Werbetexters mit tiefem Verständnis für Suchmaschinenoptimierung. Ich will, dass du mir für folgendes Keyword bzw. Thema einen Text nach meinen Vorgaben generierst.
Keyword: "\${hauptkeyword}"
Der Text soll ein Kaufberatertext auf einer Produktlistenseite unterhalb der Produkte sein. Er soll SEO-optimiert und leicht lesbar sein und die Produktlistenseite für Google für das Keyword bzw. Thema optimieren. 
Tonalität und Wording:
Schreibe sprachlich versiert (nicht flapsig), natürlich, authentisch, ehrlich, modisch kompetent und wortgewandt. Vermittle Nahbarkeit und Lebensfreude im Text. Er darf Mode-Magazin-Charakter haben. Wenn du die Leser/in direkt ansprichst, dann mit "Sie". Gib sprachlich das Gefühl, im Kreis Gleichgesinnter zu sein. Sprich mit der Kundin wie mit einer guten Bekannten.
Wenn du im Text Situationen und Anlässe aufgreifst, darfst du Sehnsuchtsorte kreieren. Verwende eine bildhafte, emotionale Sprache.
Beachte diese Informationen zu Shop und Kundin sowohl bei der Formulierung des Textes als auch beim Setzen inhaltlicher Schwerpunkte.  
SEO-Vorgaben:
Basierend auf einer gründlichen Keyword-Recherche wurden folgende Haupt- und Nebenkeywords identifiziert: 
Hauptkeyword: "\${hauptkeyword}"
Folgende Nebenkeywords müssen zwingend im Text genannt werden: "\${nebenkeywords}"
Achte darauf, die Nebenkeywords unbedingt effektiv zu integrieren, aber ohne den natürlichen Lesefluss zu stören. Baue die Nebenkeywords bitte grammatikalisch korrekt in den Text ein. 
Die folgenden Wörter sind semantisch relevant und müssen unbedingt auch eingebaut werden: "\${proofkeywords}"
Inhalt: Thematisch dreht sich der Text um eine Produktkategorie aus dem Modesegment. Der Text soll demnach für verschiedene Fragestellung zu dem Thema beraten, welche dem Leser vor einem Kauf helfen können. Jeder Satz muss dem Leser echten Mehrwert bieten, indem du spezifische Tipps und Ratschläge zu dem jeweiligen Thema erteilst. Echten Mehrwert bieten beispielsweise spezifische Kombinationstipps und Outfit-Tipps, Erklärungen zu Materialien und deren Vor- und Nachteile, Passformberatung, Stil- und Outfit-Beratung für verschiedene Anlässe, Pflege- und Aufbewahrungstipps, Eigenschaften und Attribute für besonderen Komfort, Beratung zur Wahl von Farben und Mustern, Hervorheben von besonders schmeichelhaften Schnitten für verschiedene Körpertypen. 
Schreibe im Text nichts über folgende Themen: Nachhaltigkeit, Pelz, Kundenmeinung, Zahlungsmöglichkeiten, Marken.
Struktur:
Orientiere dich an folgender Gliederung:
"\${keyword}"

Der Text soll in dieser Struktur aufgebaut sein:
## Überschriften (Formatiere diese als ##)
Absätze zu Überschriften (mindestens 100 Tokens lang)
Format:
Achte auf eine gute Lesbarkeit. Nutze dafür auch Stilelemente wie zum Beispiel Stichpunkte und Aufzählungen in den einzelnen Absätzen.
Du sollst bereits im Text wichtige Wörter für den Lesefluss **fett** markieren. Beschränke dich mit den Fettungen auf maximal drei wichtige Wörter pro Absatz. Wichtige Wörter sind z. B. Eigenschaften, Merkmale oder Produktkategorien.
`;

window.promptTextDefault = `Du bist ein erfahrener SEO- und Copywriting-Experte mit umfassendem Wissen über die Bedürfnisse von Kundinnen zwischen 50 und 60 Jahren im Bereich Damenmode und Damenunterwäsche. Erstelle eine strukturierte Gliederung zum Thema "\${hauptkeyword}" für eine Produktlistenseite eines Online-Shops. 
Ziel: Die Gliederung soll potenziellen Kundinnen wertvolle Informationen bieten, häufig gestellte Fragen zu dem Produkt beantworten und unterstützende Informationen bereitstellen, die eine Kaufentscheidung ermöglichen. Sie soll SEO-optimiert und leicht lesbar sein und die Produktlistenseite für Google für das Keyword bzw. Thema optimieren.
Der Text ist für einen Onlineshop für Frauen mittleren Alters, der schwerpunktmäßig Mode mit dem besonderen Etwas anbietet. Die Kundin sucht bei heine das perfekte, stilsichere Outfit von Kopf bis Fuß für jeden Anlass. Sie legt Wert auf ein modisches Äußeres, liebt Inspirationen, ist mode-affin und hat Spaß an Trends und Styling.
Lege den Schwerpunkt im Text auf Eigenschaften und Merkmale, die für die Kundin relevant sind und einen echten Mehrwert bieten. Echter Mehrwert bedeutet: Spezifische Inhalte abgestimmt auf das jeweilige Thema mit konkreten Tipps in Bezug auf "${hauptkeyword}". Die Kundin interessiert sich besonders für: Outfit- und Kombinationsideen für alle Anlässe, vom Alltag bis zum Event, konkrete Vorteile sowie Eigenschaften von Materialien und Qualitäten, Beratung hinsichtlich Figurtyp und -styling. 
Format: Gib mir je Gliederungspunkt eine Überschrift (###), nummeriere diese aber nicht. Packe unter jeden Punkt genau einen Stichpunkt (-) mit kurzen, stichpunktartigen Informationen (formatiere hier nichts **fett**) um was es sich bei dem Gliederungspunkt thematisch handeln soll. Schreibe hinter jeden Stichpunkt außerdem in Klammern () ob dieser Punkt in Form eines Fließtextes oder mit einer Kombination aus Text und Aufzählung abgehandelt werden soll.
Inhalt: Schreibe über die aus deiner Sicht wichtigsten Themen bezogen auf das Hauptkeyword "\${hauptkeyword}". Berücksichtige bei der Auswahl der Inhalte spezifische Aspekte und Herausforderungen, die typischerweise bei dieser Produktkategorie entstehen, und konzentriere dich darauf, wie du diese in der Gliederung adressieren kannst, um der Leserin einen echten Mehrwert zu bieten. Folgende Fragen soll der Text unter anderem beantworten: 
"\${w_fragen}"
Du sollst dich aber nur daran orientieren. Wenn aus deiner Sicht ein anderes Thema bezogen auf das Keyword "\${hauptkeyword}" besser ist, dann schreibe darüber. Wichtig ist, dass die Leserin mit dem Text eine bessere Kaufentscheidung treffen kann, weil sie sich mit genau diesem Thema nach dem Lesen des Textes besser auskennt und weiß, worauf sie beim Kauf achten sollte. 
Beachte folgende Anweisungen bei der Erstellung der Gliederung: 
•   Starte mit einem kurzen einleitenden Abschnitt.
•   Vermeide Wiederholungen.
•   Halte die Gliederung möglichst kompakt und beschränke dich bei der Auswahl der Gliederungspunkte auf die wichtigsten Inhalte zu diesem Thema.
•   Vermeide den Verweis auf Kundenerfahrungen und Bewertungen.
•   Vermeide einen Abschnitt zu häufig gestellten Fragen.
•   Wenn du die Leserin direkt ansprichst, dann mit "Sie".
•   Gestalte die Inhalte informativ und beratend (nicht werblich).
•   Verzichte auf ein Fazit oder eine Zusammenfassung am Schluss.
•   Schreibe nichts über folgende Themen: Nachhaltigkeit, Pelz, Kundenmeinung, Zahlungsmöglichkeiten, Marken.
     
Überschriften:
•   Strukturiere die Themen bereits als ausführliche Überschriften.
•   Schreibe die Überschriften interessant und informativ.
•   Integriere in die Überschriften geschickt Haupt- oder Nebenkeywords. Stelle die Keywords so um, dass in jedem Fall ein grammatikalisch korrekter Satz entsteht. Verwende sie so, dass es sich nach einem natürlichen Sprachgebrauch anhört.
•   Um die SEO-Relevanz zu steigern, verwende in den Überschriften die folgenden Nebenkeywords: "\${nebenkeywords}".
•   Sei kreativ, formuliere abwechslungsreich und emotional.
•   Vermeide Formulierungen wie „praktisch“, „günstig“, „flott“, „adrett“, „schmeicheln“, „-Liebling“, „elitär“, „großen Auftritt“. Vermeide lehrmeisterhafte Sätze. Nutze stattdessen Formulierungen wie exklusiv, anspruchsvoll, hochwertig, trendy, elegant, stilbewusst, perfekt gestylt, prima, modisch, selbstbewusst, lebensfroh, verspielt, positiv, natürlich, femininer Charme, sich von seiner besten Seite zeigen, farbenfroh, Leichtigkeit, Lieblings-Pullover, Lieblingslook.
Folgende Text-Beispiele sollen dir helfen, den richtigen Ton zu treffen:
•   Basics machen Ihren Look perfekt und Ihr Styling jeden Tag ganz leicht!
•   Was diesen Style zum Trendfavoriten macht? Sanfte Töne, starke Details und eine hochwertige Qualität.
•   Feminines Kleid? Modische Hose? Uni oder extravagant gemustert? Egal – Sie machen immer eine gute Figur.
•   Mäntel zeigen sich von ihrer schönsten Seite – so wie Sie.
•   Eine Umarmung an kalten Tagen: softe Pullover.
•   Unbeschreiblich weiblich – farbenfroh geht es schöner durch den Tag.
`;
