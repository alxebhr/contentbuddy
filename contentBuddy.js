(function() {
    'use strict';

    console.log('ContentBuddy script is running');

    let loadingIndicator;
    let firstTime = true; // Track the first time the text is inserted
    let initialized = false; // Neues Flag: verhindert mehrfache Initialisierung

    function insertTextAndSend(hauptkeyword, keyword, nebenkeywords, proofkeywords, w_fragen, outlineText = "") {
        // Versuche zuerst den Quill-Editor zu finden
        let quillEditorContainer = document.querySelector('.v-ql-textarea.ql-container');
        console.log('🔍 Suche nach Quill-Editor:', quillEditorContainer);
        
        if (!quillEditorContainer) {
            console.warn('⚠️ Quill-Editor nicht gefunden. Warte 1 Sekunde und versuche es erneut...');
            setTimeout(() => {
                let retryQuill = document.querySelector('.v-ql-textarea.ql-container');
                console.log('🔄 Zweiter Versuch - Quill-Editor gefunden?', retryQuill);
            }, 1000);
        }

        // Text für den Editor erstellen
        // Text für den Editor erstellen
        let text;
        if (outlineText === 'bText') {
            text = window.promptBText;
        } else if (outlineText === 'metaText') {  // 🆕 Meta-Daten Prompt hinzufügen
            text = window.promptMetas;
        } else if (outlineText === true) {
            text = window.promptTextOutline;
        } else {
            text = window.promptTextDefault;
        }

        // Überprüfen, ob der Prompt-Text vorhanden ist
        if (!text) {
            console.error('Prompt-Text nicht gefunden. Bitte stellen Sie sicher, dass die Prompt-Dateien korrekt geladen wurden.');
            return;
        }

        // Ersetzen der Platzhalter im Text
        text = text.replace(/\$\{hauptkeyword\}/g, hauptkeyword)
                   .replace(/\$\{keyword\}/g, keyword)
                   .replace(/\$\{nebenkeywords\}/g, nebenkeywords)
                   .replace(/\$\{proofkeywords\}/g, proofkeywords)
                   .replace(/\$\{w_fragen\}/g, w_fragen);

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
    function createMetaDataButton() {
        console.log("Erstelle Meta-Daten-Button...");
    
        // **Header-Container holen, wo auch der 🖋️✨-Button ist**
        const header = document.querySelector('.text-buddy-content').previousElementSibling;
    
        if (!header) {
            console.error("Header für Meta-Daten-Button nicht gefunden!");
            return;
        }
    
        // **Den 🖋️✨-Button suchen**
        const generateTextButton = header.querySelector('button'); // Der erste Button im Header ist der 🖋️✨-Button
    
        // **Neuen Button erstellen**
        const metaButton = document.createElement('button');
        metaButton.innerText = 'Metas 🚀';
        metaButton.style.width = 'auto';
        metaButton.style.padding = '10px';
        metaButton.style.backgroundColor = '#ffffff'; // 🆕 Weißer Hintergrund wie 🖋️✨
        metaButton.style.color = '#333'; // Dunkle Schrift
        metaButton.style.border = '1px solid #000000'; // Dünne schwarze Umrandung
        metaButton.style.borderRadius = '50px';
        metaButton.style.cursor = 'pointer';
        metaButton.style.marginLeft = '10px';
        metaButton.style.transition = 'background-color 0.3s';
        metaButton.onmouseover = () => {
            metaButton.style.backgroundColor = '#f0f0f0'; // Leichte Grau-Hervorhebung beim Hover
        };
        metaButton.onmouseout = () => {
            metaButton.style.backgroundColor = '#ffffff';
        };
    
        // **Click-Event für das Generieren der Meta-Daten**
        metaButton.addEventListener('click', () => {
            console.log("Meta-Daten-Button geklickt.");
    
            // **Haupt- & Nebenkeywords aus den Input-Feldern holen**
            const hauptkeyword = document.querySelector('input[placeholder="Hauptkeyword eingeben"]').value.trim();
            const nebenkeywords = document.querySelector('input[placeholder="Nebenkeyword eingeben"]').value.trim();
            const proofkeywords = document.querySelector('input[placeholder="Proofkeyword eingeben"]').value.trim();
            const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input'))
                .map(input => input.value.trim())
                .filter(value => value)
                .join(', ');
    
            // **Sicherstellen, dass window.promptMetas existiert**
            if (!window.promptMetas) {
                console.error('window.promptMetas ist nicht definiert!');
                return;
            }
    
            // **Platzhalter im Prompt ersetzen**
            let metaPrompt = window.promptMetas;
            metaPrompt = metaPrompt.replace(/\$\{hauptkeyword\}/g, hauptkeyword)
                                   .replace(/\$\{nebenkeywords\}/g, nebenkeywords)
                                   .replace(/\$\{proofkeywords\}/g, proofkeywords)
                                   .replace(/\$\{w_fragen\}/g, w_fragen);
    
            console.log('Metadaten-Prompt nach Platzhalter-Ersetzung:', metaPrompt);
    
            // **Prompt in den Editor einfügen**
            insertTextAndSend(hauptkeyword, metaPrompt, nebenkeywords, proofkeywords, w_fragen, "metaText");
        });
    
        // **Den Button erst einfügen, wenn er noch nicht existiert**
        if (!document.querySelector('#metaDataButton')) {
            metaButton.id = 'metaDataButton';
            header.insertBefore(metaButton, generateTextButton); // Direkt neben 🖋️✨-Button einfügen
            console.log("Meta-Daten-Button wurde eingefügt!");
    
            // 🆕 **🖋️✨-Button ausblenden**
            if (generateTextButton && generateTextButton.innerText.includes("🖋️✨")) {
                generateTextButton.style.display = 'none';
                console.log("🖋️✨-Button wurde ausgeblendet.");
            }
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
            createMetaDataButton();
        }, 3000); // 🕒 3 Sekunden Verzögerung, damit es flüssig aussieht
        
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

    // Funktion zum Extrahieren der Gliederung
    function extractOutline() {
        console.log("extractOutline() wurde aufgerufen. Versuche die Gliederung zu extrahieren...");
        // HIER MUSS MEISTENS DAS ELEMENT INNERHALB DES DIV AUSGETAUSCHT WERDEN
        const elements = document.querySelectorAll('div[data-v-3897b197].v-col-md-10.v-col-12.px-0.pt-0.content');
        console.log(`Gefundene Elemente data-v-3eaf8fbc: ${elements.length}`);

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
        const headings = sourceElement.querySelectorAll('h3');
        console.log(`Gefundene <h3>-Überschriften: ${headings.length}`);

        if (headings.length === 0) {
            console.error('Keine <h3>-Tags im ausgewählten Element gefunden.');
            return null;
        }

        headings.forEach((heading, index) => {
            const point = { title: '', content: [] };
            console.log(`Verarbeite Überschrift Nr. ${index + 1}: ${heading.innerText.trim()}`);

            // Extrahiere den Titel des <h3>-Tags
            point.title = heading.innerText.trim();

            // Prüfe das nächste Element auf <ul>
            let nextElement = heading.nextElementSibling;
            while (nextElement && nextElement.tagName !== 'UL') {
                nextElement = nextElement.nextElementSibling;
            }

            if (nextElement && nextElement.tagName === 'UL') {
                console.log('UL gefunden. Lese Listenpunkte aus.');
                const processList = (ulElement) => {
                    const sublistItems = ulElement.querySelectorAll(':scope > li');
                    const content = [];

                    sublistItems.forEach((subitem) => {
                        let listItemText = subitem.firstChild.textContent.trim();
                        const nestedUl = subitem.querySelector(':scope > ul');
                        if (nestedUl) {
                            const nestedItems = processList(nestedUl);
                            if (nestedItems.length > 0) {
                                listItemText = `${listItemText}: ${nestedItems.join(' ')}`;
                            }
                        }
                        content.push(listItemText);
                        console.log(`    Listenpunkt: "${listItemText}"`);
                    });

                    return content;
                };

                const items = processList(nextElement);
                point.content.push(...items);
            } else {
                console.warn(`Kein <ul>-Element nach <h3> "${point.title}" gefunden.`);
            }

            if (point.content.length > 0) {
                outline.push(point);
            } else {
                console.warn(`Leerer Punkt nach <h3> "${point.title}" wird nicht hinzugefügt.`);
            }
        });

        console.log("Extrahierte Gliederung:", outline);
        return outline;
    }

    function createOutlineBoxes(outline, container) {
        console.log("Erstelle Outline Boxes...");
        outline.forEach((point, index) => {
            console.log(`Box #${index + 1} wird erstellt mit Titel: "${point.title}"`);
            const box = document.createElement('div');
            box.style.position = 'relative';
            box.style.border = '1px solid #ddd';
            box.style.padding = '40px 10px 10px 10px';
            box.style.marginBottom = '10px';
            box.style.borderRadius = '5px';
            box.contentEditable = 'true';

            const moveContainer = document.createElement('div');
            moveContainer.style.position = 'absolute';
            moveContainer.style.top = '10px';
            moveContainer.style.left = '10px';
            moveContainer.style.display = 'flex';
            moveContainer.style.gap = '15px';

            function createMoveButton(symbol) {
                const button = document.createElement('button');
                button.innerText = symbol;
                button.style.width = '25px';
                button.style.height = '25px';
                button.style.borderRadius = '3px';
                button.style.backgroundColor = 'transparent';
                button.style.color = '#333';
                button.style.border = '1px solid #ccc';
                button.style.cursor = 'pointer';
                button.style.fontSize = '14px';
                button.style.display = 'flex';
                button.style.alignItems = 'center';
                button.style.justifyContent = 'center';
                button.style.padding = '0';
                button.title = symbol === '↑' ? 'Nach oben verschieben' : 'Nach unten verschieben';
                return button;
            }

            const moveUpButton = createMoveButton('↑');
            moveUpButton.onclick = () => {
                const previousBox = box.previousElementSibling;
                if (previousBox) {
                    container.insertBefore(box, previousBox);
                    updateMoveButtons(container);
                }
            };
            moveContainer.appendChild(moveUpButton);

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

            const closeButton = document.createElement('button');
            closeButton.innerText = '✕';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
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

            const title = document.createElement('h4');
            title.innerText = point.title;
            box.appendChild(title);

            point.content.forEach(content => {
                const paragraph = document.createElement('p');
                paragraph.innerText = content;
                box.appendChild(paragraph);
            });

            container.appendChild(box);
            console.log(`Box #${index + 1} mit Titel "${point.title}" hinzugefügt`);
        });

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

        updateMoveButtons(container);

        const header = container.closest('.text-buddy-content').previousElementSibling;
        console.log('Header gefunden:', header);
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
            console.log("🖋️✨-Button zum Generieren des Textes wurde geklickt.");
        
            const allTextBoxes = Array.from(document.querySelectorAll('.text-buddy-content div[contenteditable="true"]'));
            const outlinePoints = allTextBoxes.map((box, i) => {
                const titleText = box.querySelector('h4') ? box.querySelector('h4').innerText.trim() : '';
                const paragraphs = box.querySelectorAll('p');
                const contentText = Array.from(paragraphs).map(p => p.innerText.trim()).join(' ');
                return `${titleText}\n${contentText}`;
            }).filter(text => text);
        
            const outlineText = outlinePoints.join('\n\n');
            const proofkeywords = document.querySelector('input[placeholder="Proofkeyword eingeben"]').value.trim();
            const mainkeyword = document.querySelector('input[placeholder="Hauptkeyword eingeben"]').value.trim();
            const subkeywords = document.querySelector('input[placeholder="Nebenkeyword eingeben"]').value.trim();
            const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input'))
                .map(input => input.value.trim())
                .filter(value => value)
                .join(', ');
        
            console.log('Mainkeyword:', mainkeyword);
            console.log('Proofkeywords:', proofkeywords);
            console.log('Subkeywords:', subkeywords);
            console.log('W-Fragen:', w_fragen);
        
            // **Generierten Text in den Editor einfügen**
            insertTextAndSend(mainkeyword, outlineText, subkeywords, proofkeywords, w_fragen, true);
            console.log('Text wurde eingefügt:', mainkeyword, outlineText, subkeywords, proofkeywords, w_fragen);
        
            // **🖋️✨-Button deaktivieren, um doppelte Klicks zu verhindern**
            generateTextButton.style.backgroundColor = '#cccccc';
            generateTextButton.style.cursor = 'not-allowed';
            generateTextButton.disabled = true;
        
            // **🕒 Meta-Button mit Verzögerung anzeigen, NACHDEM die Textgenerierung abgeschlossen ist**
            setTimeout(() => {
                createMetaDataButton();
            }, 3000); // ⏳ 3 Sekunden Verzögerung, um sicherzugehen, dass der Text im Editor ist
        });
        

        header.insertBefore(generateTextButton, header.querySelector('button'));
        console.log('Button zum Generieren des Textes hinzugefügt');
    }

    function createLoadingIndicator(container) {
        console.log("Erstelle Loading-Indicator...");
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
        console.log("Loading-Indicator erstellt.");
    }

    function createOverlay(button) {
        console.log("Erstelle Overlay...");
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
            console.log("W-Frage hinzufügen angeklickt.");
            const wFrageBox = document.createElement('div');
            wFrageBox.className = 'w-frage-box';
            wFrageBox.style.position = 'relative';
            wFrageBox.style.marginBottom = '10px';

            const wFrageInput = document.createElement('input');
            wFrageInput.type = 'text';
            wFrageInput.placeholder = 'W-Frage eingeben';
            wFrageInput.style.width = 'calc(100% - 40px)';
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
                console.log("W-Frage entfernt.");
                wFrageBox.remove();
            };
            wFrageBox.appendChild(removeWFrageButton);

            wFragenContainer.appendChild(wFrageBox);
        };
        wFragenContainer.appendChild(addWFrageButton);
        inputContainer.appendChild(wFragenContainer);

        const aTextButton = document.createElement('button');
        aTextButton.innerText = 'Premium-Text';
        aTextButton.style.width = '48%';
        aTextButton.style.padding = '10px';
        aTextButton.style.backgroundColor = '#333333';
        aTextButton.style.color = 'white';
        aTextButton.style.border = 'none';
        aTextButton.style.borderRadius = '5px';
        aTextButton.style.cursor = 'pointer';
        aTextButton.style.transition = 'background-color 0.3s';
        aTextButton.onmouseover = () => aTextButton.style.backgroundColor = '#444444';
        aTextButton.onmouseout = () => aTextButton.style.backgroundColor = '#333333';

        const bTextButton = document.createElement('button');
        bTextButton.innerText = 'Basis-Text';
        bTextButton.style.width = '48%';
        bTextButton.style.padding = '10px';
        bTextButton.style.backgroundColor = '#555555';
        bTextButton.style.color = 'white';
        bTextButton.style.border = 'none';
        bTextButton.style.borderRadius = '5px';
        bTextButton.style.cursor = 'pointer';
        bTextButton.style.transition = 'background-color 0.3s';
        bTextButton.onmouseover = () => bTextButton.style.backgroundColor = '#666666';
        bTextButton.onmouseout = () => bTextButton.style.backgroundColor = '#555555';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.appendChild(aTextButton);
        buttonContainer.appendChild(bTextButton);
        content.appendChild(buttonContainer);

        aTextButton.addEventListener('click', () => {
            console.log("A-Text angefordert.");
            const hauptkeyword = mainKeywordInput.value.trim();
            const nebenkeywords = subKeywordInput.value.trim();
            const proofkeywords = proofKeywordInput.value.trim();
            const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input'))
                .map(input => input.value.trim())
                .filter(value => value)
                .join(', ');
        
            if (hauptkeyword) {
                insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
                aTextButton.style.display = 'none';
                bTextButton.style.display = 'none';
                createLoadingIndicator(content);
                setTimeout(() => {
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
                        firstTime = false;
                    }
                }, 10000);
                
            }
        });
        

        bTextButton.addEventListener('click', () => {
            console.log("B-Text direkt generieren.");
            const hauptkeyword = mainKeywordInput.value.trim();
            const nebenkeywords = subKeywordInput.value.trim();
            const proofkeywords = proofKeywordInput.value.trim();
            const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input'))
                .map(input => input.value.trim())
                .filter(value => value)
                .join(', ');
        
            if (hauptkeyword) {
                let bTextPrompt = window.promptBText;
                bTextPrompt = bTextPrompt.replace(/\$\{hauptkeyword\}/g, hauptkeyword)
                    .replace(/\$\{keyword\}/g, hauptkeyword)
                    .replace(/\$\{nebenkeywords\}/g, nebenkeywords)
                    .replace(/\$\{proofkeywords\}/g, proofkeywords)
                    .replace(/\$\{w_fragen\}/g, w_fragen);
        
                insertTextAndSend(hauptkeyword, bTextPrompt, nebenkeywords, proofkeywords, w_fragen, "bText");
                setTimeout(() => {
                    createMetaDataButton();
                }, 2000); // 🕒 2 Sekunden Verzögerung für B-Text                
        
                // 🆕 Meta-Button einfügen (jetzt mit korrektem Prompt!)
                createMetaDataButton(content, hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
            }
        });
        
        
                

        return overlay;
    }

    function createButton() {
        console.log("Erstelle Haupt-Button für ContentBuddy...");
        const button = document.createElement('button');
        button.innerText = 'ContentBuddy ' + (window.selectedOption || '');
        button.id = 'contentBuddyButton';
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
        document.body.appendChild(overlay);
    }

    /**
     * Überwacht die Console-Logs, um u.a. auf "llm generation stream closed" zu reagieren.
     * Anders als vorher KEIN Timer hier, da wir wollen, dass der 10-Sekunden-Fallback
     * erst nach Klick auf "Gliederung abfragen" startet.
     */
    function monitorConsoleMessages() {
        console.log("monitorConsoleMessages() gestartet.");
        const originalConsoleLog = console.log;

        // Ersetzt console.log durch eine eigene Funktion, um auf bestimmte Nachrichten zu reagieren.
        console.log = function (message) {
            if (typeof message === 'string') {
                // Debug-Ausgabe, um zu sehen, welche Log-Messages ankommen
                originalConsoleLog("[monitorConsoleMessages] - Intercepted:", message);

                if (message.includes('llm generation stream closed')) {
                    console.log("Die Nachricht enthält 'llm generation stream closed'.");
                    if (firstTime) {
                        console.log("firstTime ist noch true. Entferne loadingIndicator und führe extractOutline() aus...");
                        if (loadingIndicator) {
                            loadingIndicator.remove();
                        }
                        const outline = extractOutline();
                        if (outline) {
                            const container = document.querySelector('.text-buddy-content');
                            if (container) {
                                createOutlineBoxes(outline, container);
                            } else {
                                console.log("Kein .text-buddy-content gefunden, kann Outline Boxes nicht erstellen.");
                            }
                        } else {
                            console.log("outline war null, also keine Boxes.");
                        }
                        firstTime = false; 
                    } else {
                        console.log("firstTime war bereits false, daher keine Aktion.");
                    }
                }
            }
            // Ruft das ursprüngliche console.log auf, damit nichts verloren geht.
            originalConsoleLog.apply(console, arguments);
        };
    }

    function initializeContentBuddy() {
    console.log('🚀 initializeContentBuddy() wird ausgeführt...');
    
    if (initialized) {
        console.log('⚠️ Abbruch: initializeContentBuddy() wurde bereits aufgerufen.');
        return;
    }
    
    if (document.querySelector('#contentBuddyButton')) {
        console.log('⚠️ Abbruch: ContentBuddy-Button existiert bereits.');
        return;
    }

    console.log('🛠️ Erstelle ContentBuddy-Button...');
    
    createButton();
    monitorConsoleMessages();
    monitorResetButton();
    
    console.log('✅ ContentBuddy erfolgreich initialisiert.');
    initialized = true;
    }


    const observer = new MutationObserver((mutations) => {
    let changesDetected = false;
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            changesDetected = true;
        }
    });

    if (changesDetected) {
        console.log('🔄 MutationObserver hat Änderungen erkannt. Starte ContentBuddy...');
        observer.disconnect(); // Stoppe den Observer, damit er nicht mehrfach feuert
        setTimeout(() => initializeContentBuddy(), 500); // Warte 500ms, um doppelte Starts zu vermeiden
    }
    });
    observer.observe(document.body, { childList: true, subtree: true });


    initializeContentBuddy();

})();
