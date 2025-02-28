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

    function createInsertButtons(container) {
        let buttonA = document.createElement('button');
        buttonA.innerText = 'A-Text';
        styleButton(buttonA);
        buttonA.addEventListener('click', () => {
            handleAText();
        });
        
        let buttonB = document.createElement('button');
        buttonB.innerText = 'B-Text';
        styleButton(buttonB);
        buttonB.addEventListener('click', () => {
            handleBText();
        });
        
        container.appendChild(buttonA);
        container.appendChild(buttonB);
    }

    function handleAText() {
        console.log('A-Text Button geklickt. Generiere Gliederung.');
        let hauptkeyword = document.querySelector('input[placeholder="Hauptkeyword eingeben"]').value.trim();
        let nebenkeywords = document.querySelector('input[placeholder="Nebenkeyword eingeben"]').value.trim();
        let proofkeywords = document.querySelector('input[placeholder="Proofkeyword eingeben"]').value.trim();
        let w_fragen = Array.from(document.querySelectorAll('.w-frage-box input')).map(input => input.value.trim()).filter(value => value).join(', ');
        
        if (hauptkeyword) {
            insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
        }
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

    function styleButton(button) {
        button.style.width = '100%';
        button.style.padding = '10px';
        button.style.backgroundColor = '#333333';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.marginBottom = '10px';
        button.style.transition = 'background-color 0.3s';
        button.onmouseover = () => button.style.backgroundColor = '#444444';
        button.onmouseout = () => button.style.backgroundColor = '#333333';
    }

    function replaceInsertButton() {
        let insertButton = document.querySelector('button:contains("Gliederung abfragen")');
        if (insertButton) {
            let container = insertButton.parentNode;
            insertButton.remove();
            createInsertButtons(container);
        }
    }

    replaceInsertButton();
})();
