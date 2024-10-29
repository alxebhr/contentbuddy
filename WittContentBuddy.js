(function() {
    'use strict';

    console.log('ContentBuddy script is running');

    let loadingIndicator;
    let firstTime = true; // Track the first time the text is inserted

    function insertTextAndSend(hauptkeyword, keyword, nebenkeywords, proofkeywords, w_fragen, outlineText = false) {
        // Versuche zuerst den Quill-Editor zu finden
        let quillEditorContainer = document.querySelector('.v-ql-textarea.ql-container');
        console.log('Versuche, ".v-ql-textarea.ql.container" zu finden:', quillEditorContainer);

        let textAreaElement;

        // Falls der Quill-Editor nicht gefunden wird, suche das Textarea-Element
        if (!quillEditorContainer) {
            console.log('Erstes Element ".v-ql-textarea.ql.container" nicht gefunden. Versuche, "textarea.v-field__input" zu verwenden.');
            textAreaElement = document.querySelector('textarea.v-field__input');
            console.log('Versuche, "textarea.v-field__input" zu finden:', textAreaElement);
        }

        // Text für den Editor erstellen
        let text;
        if (outlineText) {
            text = `Nutze dein Wissen zu Kundin, Tonalität und Zielstellung des Textes um die weitere Konversation zu optimieren. 
                        Du bist in der Rolle eines Werbetexters mit tiefem Verständnis für Suchmaschinenoptimierung. Ich will, dass du mir für folgendes Keyword bzw. Thema einen Text nach meinen Vorgaben generierst.
                        Keyword: "${hauptkeyword}"
                        Der Text soll ein Kaufberatertext auf einer Produktlistenseite unterhalb der Produkte sein. Er soll SEO-optimiert und leicht lesbar sein und die Produktlistenseite für Google für das Keyword bzw. Thema optimieren. 
                        Tonalität und Wording:
                        Der Text soll eher informell geschrieben sein. Die Tonalität ist locker, unbeschwert und leicht freundschaftlich. Wird die Kundin angesprochen, dann mit „Sie“. Die Sprache darf auch blumig sein und wie ein Gespräch zwischen zwei Bekannten wirken.
                        Wenn im Text Situationen und Anlässe aufgegriffen werden, dann zu Freizeitaktivitäten bodenständiger Frau zwischen 50 und 60 Jahren.  
                        Beachte diese Informationen zu Shop und Kundin sowohl bei der Formulierung des Textes als auch beim Setzen inhaltlicher Schwerpunkte.  
                        SEO-Vorgaben:
                        Basierend auf einer gründlichen Keyword-Recherche wurden folgende Haupt- und Nebenkeywords identifiziert: 
                        Hauptkeyword: "${hauptkeyword}"
                        Folgene Nebenkeywords müssen zwingend im Text genannt werden: "${nebenkeywords}"
                        Achte darauf, die Nebenkeywords unbedingt effektiv zu integrieren, aber ohne den natürlichen Lesefluss zu stören. Baue die Nebenkeywords bitte grammatikalisch korrekt in den Text ein. 
                        Die folgenden Wörter sind semantisch relevant und müssen unbedingt auch eingebaut werden: "${proofkeywords}"
                        Inhalt:
                        Thematisch dreht sich der Text um eine Produktkategorie aus dem Modesegment. Der Text soll demnach für verschiedene Fragestellung zu dem Thema beraten, welche dem Leser vor einem Kauf helfen können. Jeder Satz muss dem Leser echten Mehrwert bieten, indem du spezifische Tipps und Ratschläge zu dem jeweiligen Thema erteilst. Echten Mehrwert bieten beispielsweise spezifische Kombinationstipps und Outfit-Tipps, Erklärungen zu Materialien und deren Vor- und Nachteile, Passformberatung, Stil- und Outfit-Beratung für verschiedene Anlässe, Pflege- und Aufbewahrungstipps, Eigenschaften und Attribute für besonderen Komfort, Beratung zur Wahl von Farben und Mustern, Hervorheben von besonders schmeichelhaften Schnitten für verschiedene Körpertypen. 
                        Schreibe im Text nichts über folgende Themen: Nachhaltigkeit, Pelz, Kundenmeinung, Zahlungsmöglichkeiten, Marken
                        Struktur:
                        Orientiere dich an folgender Gliederung:
                        "${keyword}"
                        
                        Der Text soll in dieser Struktur aufgebaut sein:
                        ## Überschriften (Formatiere diese als ##)
                        Absätze zu Überschriften (mindestens 100 Tokens lang)
                        Format:
                        Achte auf eine gute Lesbarkeit. Nutze dafür auch Stilelemente wie zum Beispiel Stichpunkte, Aufzählungen in den einzelnen Absätzen.
                        Du sollst bereits im Text wichtige Wörter für den Lesefluss fett markieren. Beschränke dich mit den Fettungen auf maximal drei wichtige Wörter pro Absatz. Wichtige Wörter sind z.B. Eigenschaften, Merkmale oder Produktkategorien.
                `;
        } else {
            text = `
            Du bist ein erfahrener SEO- und Copywriting-Experte mit umfassendem Wissen über die Bedürfnisse von Kundinnen zwischen 50 und 60 Jahren im Bereich Damenmode und Damenunterwäsche. Erstelle eine strukturierte Gliederung zum Thema "${hauptkeyword}" für eine Produktlistenseite eines Online-Shops. 
                Ziel: Die Gliederung soll potenziellen Kundinnen wertvolle Informationen bieten, häufig gestellte Fragen zu dem Produkt beantworten und unterstützende Informationen bereitstellen, die eine Kaufentscheidung ermöglichen. Er soll SEO-optimiert und leicht lesbar sein und die Produktlistenseite für Google für das Keyword bzw. Thema optimieren.
                Kundin: Der Text ist für einen Onlineshop, der schwerpunktmäßig Damenmode für Frauen mittleren Alters vertreibt. Der Shop zeichnet sich vor allem durch figurschmeichelnde und bequeme Passformen aus und überzeugt mit einer breiten Größenpalette und einem ansprechenden Preis-Leistungs-Verhältnis. Die Kundin kennt ihren Stil und möchte Problemzönchen kaschieren und ihrer Figur optimal schmeicheln. Sie kleidet sich gerne modisch und selbstbewusst und schätzt Tipps zu Kombinationen, Styling, Trends oder Farben. 
                Lege den Schwerpunkt im Text auf Informationen, Eigenschaften und Merkmale, die für die Kundin relevant sind und einen echten Mehrwert bieten. Ein Mehrwert sind beispielsweise der Vorteil einer Qualität, die Flexibilität eines Kleidungsstückes, eine perfekte Passform und schmeichelnde Schnitte.
                Format: Gib mir je Gliederungspunkt eine Überschrift (###), nummeriere diese aber nicht. Packe unter jeden Punkt genau einen Stichpunkt (-) mit sehr kurzen, stichpunktartigen Informationen (formatiere hier nichts **fett**) um was es bei dem Gliederungspunkt thematisch gehen soll. Schreibe hinter jeden Stichpunkt außerdem in Klammern () ob dieser Punkt in Form eines Fließtextes oder im Listenformat abgehandelt werden soll. 
                Inhalt: Schreibe über die, aus deiner Sicht wichtigsten Themen bezogen auf das Haupt-Keyword "${hauptkeyword}". Berücksichtige bei der Auswahl der Inhalte spezifische Aspekte und Herausforderungen, die typischerweise bei dieser Produktkategorie entstehen, und konzentriere dich darauf, wie du diese in der Gliederung adressieren kannst, um der Leserin einen echten Mehrwert zu bieten. Folgende Fragen soll der Text unter anderem beantworten: 
                "${w_fragen}"
                Du sollst dich aber nur daran orientieren. Wenn aus deiner Sicht ein anderes Thema bezogen auf das Keyword "${hauptkeyword}" besser ist, dann schreibe darüber. Wichtig ist, dass der Leser mit dem Text eine bessere Kaufentscheidung treffen kann, weil er sich mit genau diesem Thema nach dem Lesen des Textes besser auskennt und weiß, worauf er beim Kauf achten sollte. 
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
                •	Um die SEO-Relevanz zu steigern, verwende in den Überschriften die folgenden Nebenkeywords: "${neben-keywords}". Stelle die Keywords so um, dass ein grammatikalisch korrekter Satz entsteht. Verwende sie so, dass es sich nach einem natürlichen Sprachgebrauch anhört. Versuche das, so gut es geht. Nur wenn der Text dadurch unnatürlich wirkt, kannst du einzelne dieser Wörter weglassen.
                •	Vermeide Formulierungen wie „exklusiv“ oder „luxuriös“. Verwende stattdessen Begriffe wie „feminin“, „chic“, „lässig“, „modern“, „figurschmeichelnd“, „farbenfroh“, „trendstark“ und „selbstbewusst“. 
                Folgende Text-Beispiele sollen dir helfen, den richtigen Ton zu treffen: 
                •	Der Herbst bringt Farbe ins Spiel – nicht nur in der Natur, auch im Kleiderschrank. Entdecken Sie unsere Outfit-Ideen für goldene Herbsttage, die alles mitmachen, was Sie so vorhaben.
                •	Spontan mit den Freundinnen in die City?! Gerne, mit diesen Kombikünstlern bin ich ruckzuck fertig!
                •	Diese Streifen will jeder sehen! So wunderbar lässig – fast schon oskarverdächtig!
                •	Hier ist er: superbequem, super lässig, super trendy. Das attraktive Rautenmuster in den schönsten Herbsttönen machen die Strickjacke zum echten Kombi-Liebling. Ein tolles Outfit für Spaziergänge im Park, Café-Dates mit den Freundinnen und einfach alles, was Sie so vorhaben.
                •	Unser Tipp: Longwesten! Denn die schmeicheln perfekt Ihrer Figur, halten warm und verleihen jedem Look einen sportiven Charakter.
                •	Jeans mit Jeans kombinieren? Ja, bitte! Unser Tipp: Durch einen stylischen Farbtupfer wie dem sonnengelben Pullunder kommt ein bisschen Pep ins Mode-Spiel! Wir finden: Der perfekte Wohlfühl-Look für schöne Herbsttage!
                `;
        }

        console.log('Text, der eingefügt werden soll:', text);

        // Wenn ein Quill-Editor gefunden wurde, Text einfügen
        if (quillEditorContainer) {
            let editorElement = quillEditorContainer.querySelector('.ql-editor');
            console.log('Editor gefunden:', editorElement);
            editorElement.innerHTML = text;  // Verwende innerHTML für den Quill-Editor
            console.log('Text im Quill-Editor eingefügt:', editorElement.innerHTML);
            simulateEnterPress(editorElement); // Simuliere Enter-Taste
        }
        // Wenn ein Textarea-Element gefunden wird, führe die spezielle Logik für Textarea aus
        else if (textAreaElement) {
            insertTextInTextareaAndSubmit(textAreaElement, text); // Text und Logik für Textarea verwenden
        } else {
            console.error('Kein passendes Editor-Container-Element oder Textarea gefunden.');
        }
    }

    // Funktion zum Einfügen von Text in die Textarea und Absenden
    function insertTextInTextareaAndSubmit(chatbox, text) {
        // Simuliere einen Klick auf die Textarea
        chatbox.click();
        console.log('Klick in die Textarea simuliert.');

        // Text in die Textarea einfügen
        chatbox.value = text;
        console.log('Text in die Textarea eingefügt:', chatbox.value);

        // Erstelle ein Input-Event, um die Änderung im Text zu registrieren
        let inputEvent = new Event('input', { bubbles: true });
        chatbox.dispatchEvent(inputEvent);

        // Erstelle ein Change-Event, um sicherzustellen, dass jede Änderung erkannt wird
        let changeEvent = new Event('change', { bubbles: true });
        chatbox.dispatchEvent(changeEvent);

        // Simuliere Enter-Taste nach einer kleinen Verzögerung
        setTimeout(() => {
            simulateEnterPress(chatbox);
        }, 10); // Kleine Verzögerung, um sicherzustellen, dass der Text zuerst eingefügt wird
    }

    // Funktion zum Simulieren des Drückens der Enter-Taste
    function simulateEnterPress(element) {
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            bubbles: true,
            cancelable: true
        });
        console.log('Simuliere Enter-Tasten-Event:', event);
        element.dispatchEvent(event);
    }

    // Funktion zum Neuladen der Seite (zum vollständigen Zurücksetzen des Skripts)
    function reloadPage() {
        location.reload(); // Neuladen der Seite
    }

    // Funktion zum Überwachen des "Neuer Chat"-Buttons
    function monitorResetButton() {
        const resetButton = document.querySelector('.v-btn.v-btn--size-x-large'); // Finde den "Neuer Chat"-Button

        if (resetButton) {
            resetButton.addEventListener('click', function() {
                reloadPage(); // Seite neu laden und Skript komplett neu starten
            });
            console.log("Reset-Button gefunden und EventListener hinzugefügt.");
        } else {
            console.error("Reset-Button nicht gefunden.");
        }
    }

    // Verbessertes extractOutline mit ausführlichem Debugging
    function extractOutline() {
        // Suche nach allen Elementen mit data-v-cab495df und der Klasse "v-col-md-10 v-col-12 px-0 pt-0 content"
        const elements = document.querySelectorAll('div[data-v-7e7d456d].v-col-md-10.v-col-12.px-0.pt-0.content');

        console.log(`Gefundene Elemente mit data-v-7e7d456d und der Klasse "v-col-md-10 v-col-12 px-0 pt-0 content": ${elements.length}`);

        // Fallback-Logik: Nimm das dritte Element, wenn verfügbar, sonst das zweite, sonst das erste
        let sourceElement;
        if (elements.length >= 3) {
            sourceElement = elements[2];
            console.log('Drittes Element ausgewählt.');
        } else if (elements.length >= 2) {
            sourceElement = elements[1];
            console.log('Weniger als drei Elemente gefunden. Zweites Element ausgewählt.');
        } else if (elements.length >= 1) {
            sourceElement = elements[0];
            console.log('Weniger als zwei Elemente gefunden. Erstes Element ausgewählt.');
        } else {
            console.error('Es wurden keine passenden Elemente gefunden.');
            return null;
        }

        const outline = [];

        // Suche nach allen <h3>-Tags im ausgewählten Element
        const headings = sourceElement.querySelectorAll('h3');
        console.log(`Gefundene <h3>-Überschriften: ${headings.length}`);

        if (headings.length === 0) {
            console.error('Keine <h3>-Tags im ausgewählten Element gefunden.');
            return null;
        }

        headings.forEach((heading, index) => {
            const point = { title: '', content: [] };

            // Extrahiere den Titel des <h3>-Tags
            point.title = heading.innerText.trim();
            console.log(`Extrahierter Titel #${index + 1}: "${point.title}"`);

            // Prüfe das nächste Element auf <ul>
            let nextElement = heading.nextElementSibling;
            while (nextElement && nextElement.tagName !== 'UL') {
                nextElement = nextElement.nextElementSibling;
            }

            if (nextElement && nextElement.tagName === 'UL') {
                const processList = (ulElement) => {
                    const sublistItems = ulElement.querySelectorAll(':scope > li');
                    const content = [];

                    sublistItems.forEach((subitem) => {
                        let listItemText = subitem.firstChild.textContent.trim();

                        // Prüfe, ob das <li> ein verschachteltes <ul> enthält
                        const nestedUl = subitem.querySelector(':scope > ul');
                        if (nestedUl) {
                            const nestedItems = processList(nestedUl); // Rekursive Verarbeitung
                            if (nestedItems.length > 0) {
                                listItemText = `${listItemText}: ${nestedItems.join(' ')}`;
                            }
                        }

                        content.push(listItemText);
                        console.log(`Hinzugefügter Listeneintrag: "${listItemText}"`);
                    });

                    return content;
                };

                const items = processList(nextElement);
                point.content.push(...items);
            } else {
                console.warn(`Kein <ul>-Element nach <h3> "${point.title}" gefunden.`);
            }

            // Füge den Punkt zur Outline hinzu, wenn er nicht leer ist
            if (point.content.length > 0) {
                outline.push(point);
            } else {
                console.warn(`Leerer Punkt nach <h3> "${point.title}" wurde übersprungen.`);
            }
        });

        console.log("Extrahierte Gliederung:", outline);
        return outline;
    }

    function createOutlineBoxes(outline, container) {
        console.log("Creating Outline Boxes...");
        outline.forEach((point, index) => {
            const box = document.createElement('div');
            box.style.position = 'relative';
            box.style.border = '1px solid #ddd';
            box.style.padding = '40px 10px 10px 10px'; // Oberer Padding vergrößert für die Buttons
            box.style.marginBottom = '10px';
            box.style.borderRadius = '5px';
            box.contentEditable = 'true';

            // --- Container für Verschiebungsschaltflächen ---
            const moveContainer = document.createElement('div');
            moveContainer.style.position = 'absolute';
            moveContainer.style.top = '10px'; // Anpassung für besseren Abstand
            moveContainer.style.left = '10px'; // Anpassung für besseren Abstand
            moveContainer.style.display = 'flex';
            moveContainer.style.gap = '15px'; // Mehr Abstand zwischen den Buttons

            // Funktion zum Erstellen eines Move-Buttons
            function createMoveButton(symbol) {
                const button = document.createElement('button');
                button.innerText = symbol;
                button.style.width = '25px';
                button.style.height = '25px';
                button.style.borderRadius = '3px';
                button.style.backgroundColor = 'transparent'; // Keine Hintergrundfarbe
                button.style.color = '#333'; // Pfeilfarbe
                button.style.border = '1px solid #ccc'; // Leichter Rahmen
                button.style.cursor = 'pointer';
                button.style.fontSize = '14px';
                button.style.display = 'flex';
                button.style.alignItems = 'center';
                button.style.justifyContent = 'center';
                button.style.padding = '0';
                button.title = symbol === '↑' ? 'Nach oben verschieben' : 'Nach unten verschieben';
                return button;
            }

            // Move Up Button ("↑")
            const moveUpButton = createMoveButton('↑');
            moveUpButton.onclick = () => {
                const previousBox = box.previousElementSibling;
                if (previousBox) {
                    container.insertBefore(box, previousBox);
                    updateMoveButtons(container);
                }
            };
            moveContainer.appendChild(moveUpButton);

            // Move Down Button ("↓")
            const moveDownButton = createMoveButton('↓');
            moveDownButton.onclick = () => {
                const nextBox = box.nextElementSibling;
                if (nextBox) {
                    container.insertBefore(nextBox, box);
                    updateMoveButtons(container);
                }
            };
            moveContainer.appendChild(moveDownButton);

            box.appendChild(moveContainer);
            // --- Ende des Verschiebungsschaltflächen-Containers ---

            // --- Close-Button ---
            const closeButton = document.createElement('button');
            closeButton.innerText = '✕';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px'; // Anpassung für besseren Abstand
            closeButton.style.right = '10px'; // Anpassung für besseren Abstand
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.color = '#333';
            closeButton.style.border = 'none';
            closeButton.style.cursor = 'pointer';
            closeButton.style.fontSize = '18px';
            closeButton.style.padding = '5px';
            closeButton.title = 'Box entfernen';
            closeButton.onclick = () => {
                box.remove();
                updateMoveButtons(container);
            };
            box.appendChild(closeButton);
            // --- Ende des Close-Buttons ---

            const title = document.createElement('h4');
            title.innerText = point.title;
            box.appendChild(title);

            point.content.forEach(content => {
                const paragraph = document.createElement('p');
                paragraph.innerText = content;
                box.appendChild(paragraph);
            });

            container.appendChild(box);
            console.log("Added box for point:", point);
        });

        // Funktion zur Aktualisierung der Move-Buttons (Deaktivieren, wenn keine Bewegung möglich ist)
        function updateMoveButtons(container) {
            const allBoxes = container.querySelectorAll('div[contenteditable="true"]');
            allBoxes.forEach((box, index) => {
                const moveUpButton = box.querySelector('button:nth-of-type(1)');
                const moveDownButton = box.querySelector('button:nth-of-type(2)');
                if (index === 0) {
                    moveUpButton.disabled = true;
                    moveUpButton.style.opacity = '0.5';
                    moveUpButton.style.cursor = 'not-allowed';
                } else {
                    moveUpButton.disabled = false;
                    moveUpButton.style.opacity = '1';
                    moveUpButton.style.cursor = 'pointer';
                }
                if (index === allBoxes.length - 1) {
                    moveDownButton.disabled = true;
                    moveDownButton.style.opacity = '0.5';
                    moveDownButton.style.cursor = 'not-allowed';
                } else {
                    moveDownButton.disabled = false;
                    moveDownButton.style.opacity = '1';
                    moveDownButton.style.cursor = 'pointer';
                }
            });
        }

        // Initiales Update nach dem Erstellen aller Boxen
        updateMoveButtons(container);

        // Erstellen des "Text generieren" Buttons im Header
        const header = container.closest('.text-buddy-content').previousElementSibling;
        console.log('Header gefunden:', header); // Debugging: Überprüfen, ob der Header gefunden wird
        const generateTextButton = document.createElement('button');
        generateTextButton.innerText = '🖋️✨';
        generateTextButton.style.width = 'auto';
        generateTextButton.style.padding = '10px';
        generateTextButton.style.backgroundColor = '#d2d3db';
        generateTextButton.style.color = 'white';
        generateTextButton.style.border = '1px solid #000000';
        generateTextButton.style.borderRadius = '50px';
        generateTextButton.style.cursor = 'pointer';
        generateTextButton.style.marginLeft = '10px';
        generateTextButton.style.transition = 'background-color 0.3s';
        generateTextButton.onmouseover = () => {
            generateTextButton.style.backgroundColor = '#f0f0f0';
        };
        generateTextButton.onmouseout = () => {
            generateTextButton.style.backgroundColor = '#ffffff';
        };
        generateTextButton.addEventListener('click', () => {
            const allTextBoxes = Array.from(container.querySelectorAll('div[contenteditable="true"]'));
            const outlinePoints = allTextBoxes.map((box, index) => {
                const titleText = box.querySelector('h4') ? box.querySelector('h4').innerText.trim() : '';
                const paragraphs = box.querySelectorAll('p');
                const contentText = Array.from(paragraphs).map(p => p.innerText.trim()).join(' ');
                return `Punkt ${index + 1}: [${titleText} - ${contentText}]`;
            }).filter(text => text);
            const outlineText = outlinePoints.join('\n');
            const proofkeywords = document.querySelector('input[placeholder="Proofkeyword eingeben"]').value.trim();
            const mainkeyword = document.querySelector('input[placeholder="Hauptkeyword eingeben"]').value.trim();
            const subkeywords = document.querySelector('input[placeholder="Nebenkeyword eingeben"]').value.trim();
            const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input')).map(input => input.value.trim()).filter(value => value).join(', ');
            console.log('Mainkeyword:', mainkeyword); // Debugging: Haupt-Keyword überprüfen
            console.log('Proofkeywords:', proofkeywords); // Debugging: Proof-Keywords überprüfen
            console.log('Subkeywords:', subkeywords); // Debugging: Neben-Keywords überprüfen
            console.log('W-Fragen:', w_fragen); // Debugging: W-Fragen überprüfen
            insertTextAndSend(mainkeyword, outlineText, subkeywords, proofkeywords, w_fragen, true);
            console.log('Text wurde eingefügt:', mainkeyword, outlineText, subkeywords, proofkeywords, w_fragen); // Debugging: Text erfolgreich eingefügt?

            // Button grau hinterlegen und deaktivieren
            generateTextButton.style.backgroundColor = '#cccccc';
            generateTextButton.style.cursor = 'not-allowed';
            generateTextButton.disabled = true;
        });

        header.insertBefore(generateTextButton, header.querySelector('button'));
        console.log('Button deaktiviert und ausgegraut'); // Debugging: Button deaktiviert?
    }

    function createLoadingIndicator(container) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '50%';
        loadingIndicator.style.left = '50%';
        loadingIndicator.style.transform = 'translate(-50%, -50%)';
        loadingIndicator.style.zIndex = '1001';
        loadingIndicator.style.backgroundColor = 'rgba(255, 255, 255)';
        loadingIndicator.style.border = '1px solid #ddd';
        loadingIndicator.style.padding = '20px';
        loadingIndicator.style.borderRadius = '5px';
        loadingIndicator.style.display = 'flex';
        loadingIndicator.style.justifyContent = 'center';
        loadingIndicator.style.alignItems = 'center';
        loadingIndicator.innerText = 'Gliederung... ';

        const spinner = document.createElement('div');
        spinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
        spinner.style.borderTop = '4px solid #333';
        spinner.style.borderRadius = '50%';
        spinner.style.width = '24px';
        spinner.style.height = '24px';
        spinner.style.animation = 'spin 1s linear infinite';
        loadingIndicator.appendChild(spinner);

        container.appendChild(loadingIndicator);

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    function createOverlay(button) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.right = '0';
        overlay.style.top = '0';
        overlay.style.width = '350px';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = '#ffffff';
        overlay.style.color = '#333333';
        overlay.style.zIndex = '1000';
        overlay.style.display = 'none';
        overlay.style.borderRadius = '0 10px 10px 0';
        overlay.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        overlay.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        overlay.style.transform = 'translateX(100%)';
        overlay.style.opacity = '0';
        document.body.appendChild(overlay);

        const header = document.createElement('div');
        header.style.backgroundColor = '#333333';
        header.style.color = '#ffffff';
        header.style.padding = '10px';
        header.style.borderRadius = '0 10px 0 0';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        overlay.appendChild(header);

        const headerTitle = document.createElement('h2');
        headerTitle.innerText = 'ContentBuddy';
        headerTitle.style.margin = '0';
        headerTitle.style.fontSize = '1.2em';
        header.appendChild(headerTitle);

        const closeButton = document.createElement('button');
        closeButton.innerText = '✕';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.color = '#ffffff';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '1.2em';
        closeButton.onclick = () => {
            overlay.style.transform = 'translateX(100%)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                button.style.display = 'block';
            }, 300);
            document.body.style.marginRight = '0';
        };
        header.appendChild(closeButton);

        const content = document.createElement('div');
        content.className = 'text-buddy-content';
        content.style.padding = '20px';
        content.style.overflowY = 'auto';
        content.style.height = 'calc(100vh - 60px)';
        overlay.appendChild(content);

        // Container für die Eingabefelder mit gewünschtem Styling
        const inputContainer = document.createElement('div');
        inputContainer.style.backgroundColor = '#F7F7F7';
        inputContainer.style.border = '1px solid #B7B5B4';
        inputContainer.style.borderRadius = '10px';
        inputContainer.style.padding = '15px';
        inputContainer.style.marginBottom = '20px';
        content.appendChild(inputContainer);

        function createLabel(text) {
            const label = document.createElement('label');
            label.innerText = text;
            label.style.display = 'block';
            label.style.fontSize = '0.9em';
            label.style.color = '#4F4F4F';
            label.style.marginBottom = '5px';
            return label;
        }

        const mainKeywordLabel = createLabel('Haupt-Keyword');
        inputContainer.appendChild(mainKeywordLabel);
        const mainKeywordInput = document.createElement('input');
        mainKeywordInput.type = 'text';
        mainKeywordInput.placeholder = 'Hauptkeyword eingeben';
        mainKeywordInput.style.width = '100%';
        mainKeywordInput.style.padding = '10px';
        mainKeywordInput.style.marginBottom = '10px';
        mainKeywordInput.style.borderRadius = '5px';
        mainKeywordInput.style.border = '1px solid #ddd';
        mainKeywordInput.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
        inputContainer.appendChild(mainKeywordInput);

        const subKeywordLabel = createLabel('Neben-Keywords');
        inputContainer.appendChild(subKeywordLabel);
        const subKeywordInput = document.createElement('input');
        subKeywordInput.type = 'text';
        subKeywordInput.placeholder = 'Nebenkeyword eingeben';
        subKeywordInput.style.width = '100%';
        subKeywordInput.style.padding = '10px';
        subKeywordInput.style.marginBottom = '10px';
        subKeywordInput.style.borderRadius = '5px';
        subKeywordInput.style.border = '1px solid #ddd';
        subKeywordInput.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
        inputContainer.appendChild(subKeywordInput);

        const proofKeywordLabel = createLabel('Proof-Keywords');
        inputContainer.appendChild(proofKeywordLabel);
        const proofKeywordInput = document.createElement('input');
        proofKeywordInput.type = 'text';
        proofKeywordInput.placeholder = 'Proofkeyword eingeben';
        proofKeywordInput.style.width = '100%';
        proofKeywordInput.style.padding = '10px';
        proofKeywordInput.style.marginBottom = '10px';
        proofKeywordInput.style.borderRadius = '5px';
        proofKeywordInput.style.border = '1px solid #ddd';
        proofKeywordInput.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
        inputContainer.appendChild(proofKeywordInput);

        // W-Fragen Section
        const wFragenContainer = document.createElement('div');
        wFragenContainer.className = 'w-fragen-container';
        wFragenContainer.style.border = '1px solid #ddd';
        wFragenContainer.style.padding = '10px';
        wFragenContainer.style.borderRadius = '5px';
        wFragenContainer.style.marginBottom = '10px';
        wFragenContainer.style.position = 'relative';

        const wFragenLabel = document.createElement('label');
        wFragenLabel.innerText = 'W-Fragen';
        wFragenLabel.style.display = 'block';
        wFragenLabel.style.fontSize = '0.98em';
        wFragenLabel.style.color = '#353535';
        wFragenLabel.style.marginBottom = '5px';
        wFragenContainer.appendChild(wFragenLabel);

        const addWFrageButton = document.createElement('button');
        addWFrageButton.innerText = '+';
        addWFrageButton.style.position = 'absolute';
        addWFrageButton.style.top = '5px';
        addWFrageButton.style.right = '5px';
        addWFrageButton.style.backgroundColor = '#000000';
        addWFrageButton.style.color = '#ffffff';
        addWFrageButton.style.border = 'none';
        addWFrageButton.style.borderRadius = '50%';
        addWFrageButton.style.width = '30px';
        addWFrageButton.style.height = '30px';
        addWFrageButton.style.cursor = 'pointer';
        addWFrageButton.style.fontSize = '20px';
        addWFrageButton.onclick = () => {
            const wFrageBox = document.createElement('div');
            wFrageBox.className = 'w-frage-box';
            wFrageBox.style.position = 'relative';
            wFrageBox.style.marginBottom = '10px';

            const wFrageInput = document.createElement('input');
            wFrageInput.type = 'text';
            wFrageInput.placeholder = 'W-Frage eingeben';
            wFrageInput.style.width = 'calc(100% - 40px)'; // Anpassung für Platz des Remove-Buttons
            wFrageInput.style.padding = '10px';
            wFrageInput.style.borderRadius = '5px';
            wFrageInput.style.border = '1px solid #ddd';
            wFrageInput.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
            wFrageBox.appendChild(wFrageInput);

            const removeWFrageButton = document.createElement('button');
            removeWFrageButton.innerText = '✕';
            removeWFrageButton.style.position = 'absolute';
            removeWFrageButton.style.top = '50%';
            removeWFrageButton.style.right = '5px';
            removeWFrageButton.style.transform = 'translateY(-50%)';
            removeWFrageButton.style.backgroundColor = 'transparent';
            removeWFrageButton.style.color = '#333';
            removeWFrageButton.style.border = 'none';
            removeWFrageButton.style.cursor = 'pointer';
            removeWFrageButton.style.fontSize = '14px';
            removeWFrageButton.onclick = () => {
                wFrageBox.remove();
            };
            wFrageBox.appendChild(removeWFrageButton);

            wFragenContainer.appendChild(wFrageBox);
        };
        wFragenContainer.appendChild(addWFrageButton);
        inputContainer.appendChild(wFragenContainer);

        const insertButton = document.createElement('button');
        insertButton.innerText = 'Gliederung abfragen';
        insertButton.style.width = '100%';
        insertButton.style.padding = '10px';
        insertButton.style.backgroundColor = '#333333';
        insertButton.style.color = 'white';
        insertButton.style.border = 'none';
        insertButton.style.borderRadius = '5px';
        insertButton.style.cursor = 'pointer';
        insertButton.style.marginBottom = '10px';
        insertButton.style.transition = 'background-color 0.3s';
        insertButton.onmouseover = () => {
            insertButton.style.backgroundColor = '#444444';
        };
        insertButton.onmouseout = () => {
            insertButton.style.backgroundColor = '#333333';
        };
        insertButton.addEventListener('click', () => {
            const hauptkeyword = mainKeywordInput.value.trim();
            const nebenkeywords = subKeywordInput.value.trim();
            const proofkeywords = proofKeywordInput.value.trim();
            const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input')).map(input => input.value.trim()).filter(value => value).join(', ');
            if (hauptkeyword) {
                insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
                insertButton.style.display = 'none'; // Button verschwinden lassen
                createLoadingIndicator(content); // Ladeanimation anzeigen
            }
        });
        content.appendChild(insertButton);

        return overlay;
    }

    function createButton() {
        const button = document.createElement('button');
        button.innerText = 'ContentBuddy';
        button.id = 'contentBuddyButton'; // Assign an ID for checking existence
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#333333';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';
        button.onmouseover = () => {
            button.style.backgroundColor = '#444444';
        };
        button.onmouseout = () => {
            button.style.backgroundColor = '#333333';
        };
        button.onclick = () => {
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.style.transform = 'translateX(0)';
                overlay.style.opacity = '1';
            }, 10);
            document.body.style.marginRight = '350px';
            button.style.display = 'none';
        };
        document.body.appendChild(button);

        const overlay = createOverlay(button);
    }

    function monitorConsoleMessages() {
        const originalConsoleLog = console.log;
        console.log = function (message) {
            if (typeof message === 'string' && message.includes('llm generation stream closed')) {
                if (firstTime) {
                    if (loadingIndicator) {
                        loadingIndicator.remove();
                    }
                    const outline = extractOutline();
                    if (outline) {
                        const container = document.querySelector('.text-buddy-content');
                        if (container) {
                            createOutlineBoxes(outline, container);
                        }
                    }
                    firstTime = false; // Ensure the text is inserted only the first time
                }
            }
            originalConsoleLog.apply(console, arguments);
        };
    }

    // Funktion zur Initialisierung des Skripts
    function initializeContentBuddy() {
        // Überprüfe, ob der ContentBuddy-Button bereits existiert
        if (document.querySelector('#contentBuddyButton')) {
            return; // Button existiert bereits, keine erneute Initialisierung nötig
        }
        createButton();
        monitorConsoleMessages();
        monitorResetButton();
        console.log('ContentBuddy initialized.');
    }

    // Verwende MutationObserver, um Änderungen im DOM zu überwachen
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                initializeContentBuddy();
            }
        });
    });

    // Beginne mit der Beobachtung des Body für hinzugefügte Knoten
    observer.observe(document.body, { childList: true, subtree: true });

    // Initialer Aufruf zur Einrichtung des ContentBuddy
    initializeContentBuddy();

})();
