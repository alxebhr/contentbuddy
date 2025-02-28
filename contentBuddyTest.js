(function() {
    'use strict';

    console.log('ContentBuddy script is running');

    function insertTextAndSend(hauptkeyword, keyword, nebenkeywords, proofkeywords, w_fragen, outlineText = false, isBText = false) {
        let quillEditorContainer = document.querySelector('.v-ql-textarea.ql-container');
        let textAreaElement = quillEditorContainer ? null : document.querySelector('textarea.v-field__input');
        
        let text;
        if (isBText) {
            text = window.promptBText;
        } else if (outlineText) {
            text = window.promptTextOutline;
        } else {
            text = window.promptTextDefault;
        }
        
        if (!text) {
            console.error('Prompt-Text nicht gefunden.');
            return;
        }

        text = text.replace(/\$\{hauptkeyword\}/g, hauptkeyword)
                   .replace(/\$\{keyword\}/g, keyword)
                   .replace(/\$\{nebenkeywords\}/g, nebenkeywords)
                   .replace(/\$\{proofkeywords\}/g, proofkeywords)
                   .replace(/\$\{w_fragen\}/g, w_fragen);

        if (quillEditorContainer) {
            let editorElement = quillEditorContainer.querySelector('.ql-editor');
            editorElement.innerHTML = text;
            simulateEnterPress(editorElement);
        } else if (textAreaElement) {
            insertTextInTextareaAndSubmit(textAreaElement, text);
        } else {
            console.error('Kein passendes Editor-Element gefunden.');
        }
    }

    function extractOutline() {
        console.log('Extrahiere Gliederung...');
        const elements = document.querySelectorAll('div[data-v-1780e672].v-col-md-10.v-col-12.px-0.pt-0.content');
        if (!elements.length) {
            console.error('Keine passenden Elemente für die Gliederung gefunden.');
            return null;
        }

        let sourceElement = elements[elements.length - 1];
        const outline = [];
        const headings = sourceElement.querySelectorAll('h3');
        
        headings.forEach(heading => {
            const point = { title: heading.innerText.trim(), content: [] };
            let nextElement = heading.nextElementSibling;
            while (nextElement && nextElement.tagName !== 'UL') {
                nextElement = nextElement.nextElementSibling;
            }
            if (nextElement && nextElement.tagName === 'UL') {
                const items = Array.from(nextElement.querySelectorAll('li')).map(li => li.innerText.trim());
                point.content.push(...items);
            }
            outline.push(point);
        });
        
        console.log('Extrahierte Gliederung:', outline);
        return outline;
    }

    function handleAText() {
        console.log('A-Text Button geklickt. Generiere Gliederung.');
        let hauptkeyword = document.querySelector('input[placeholder="Hauptkeyword eingeben"]').value.trim();
        let nebenkeywords = document.querySelector('input[placeholder="Nebenkeyword eingeben"]').value.trim();
        let proofkeywords = document.querySelector('input[placeholder="Proofkeyword eingeben"]').value.trim();
        let w_fragen = Array.from(document.querySelectorAll('.w-frage-box input')).map(input => input.value.trim()).filter(value => value).join(', ');
        
        if (hauptkeyword) {
            insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
            setTimeout(() => {
                const outline = extractOutline();
                if (outline) {
                    createOutlineButton(outline, hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
                }
            }, 5000);
        }
    }

    function createOutlineButton(outline, hauptkeyword, nebenkeywords, proofkeywords, w_fragen) {
        let button = document.createElement('button');
        button.innerText = '🖋️✨';
        styleButton(button);
        button.addEventListener('click', () => {
            let outlineText = outline.map(point => `${point.title}: ${point.content.join(', ')}`).join('\n');
            insertTextAndSend(hauptkeyword, outlineText, nebenkeywords, proofkeywords, w_fragen, true);
        });
        document.body.appendChild(button);
    }

    function handleBText() {
        console.log('B-Text Button geklickt. Erstelle sofort den Text.');
        let hauptkeyword = document.querySelector('input[placeholder="Hauptkeyword eingeben"]').value.trim();
        let nebenkeywords = document.querySelector('input[placeholder="Nebenkeyword eingeben"]').value.trim();
        let proofkeywords = document.querySelector('input[placeholder="Proofkeyword eingeben"]').value.trim();
        let w_fragen = Array.from(document.querySelectorAll('.w-frage-box input')).map(input => input.value.trim()).filter(value => value).join(', ');
        
        if (hauptkeyword) {
            insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen, false, true);
        }
    }

    function replaceInsertButton() {
        let insertButton = document.querySelector('button:contains("Gliederung abfragen")');
        if (insertButton) {
            let container = insertButton.parentNode;
            insertButton.remove();
            createInsertButtons(container);
        }
    }

    function createInsertButtons(container) {
        let buttonA = document.createElement('button');
        buttonA.innerText = 'A-Text';
        styleButton(buttonA);
        buttonA.addEventListener('click', handleAText);
        
        let buttonB = document.createElement('button');
        buttonB.innerText = 'B-Text';
        styleButton(buttonB);
        buttonB.addEventListener('click', handleBText);
        
        container.appendChild(buttonA);
        container.appendChild(buttonB);
    }

    replaceInsertButton();
})();
