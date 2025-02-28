(function() {
    'use strict';

    console.log('ContentBuddy script is running');

    function insertTextAndSend(hauptkeyword, keyword, nebenkeywords, proofkeywords, w_fragen, outlineText = false, isBText = false) {
        let quillEditorContainer = document.querySelector('.v-ql-textarea.ql-container');
        let textAreaElement;

        if (!quillEditorContainer) {
            textAreaElement = document.querySelector('textarea.v-field__input');
        }

        let text;
        if (isBText) {
            text = window.promptBText;
        } else if (outlineText) {
            text = window.promptTextOutline;
        } else {
            text = window.promptTextDefault;
        }

        if (!text) {
            console.error('Prompt-Text nicht gefunden. Bitte stellen Sie sicher, dass die Prompt-Dateien korrekt geladen wurden.');
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
            console.error('Kein passendes Editor-Container-Element oder Textarea gefunden.');
        }
    }

    function createInputButtons(container) {
        const aTextButton = document.createElement('button');
        aTextButton.innerText = 'A-Text';
        aTextButton.style.width = '48%';
        aTextButton.style.marginRight = '4%';
        aTextButton.style.padding = '10px';
        aTextButton.style.backgroundColor = '#333';
        aTextButton.style.color = 'white';
        aTextButton.style.border = 'none';
        aTextButton.style.borderRadius = '5px';
        aTextButton.style.cursor = 'pointer';
        aTextButton.addEventListener('click', () => {
            const hauptkeyword = document.querySelector('input[placeholder="Hauptkeyword eingeben"]').value.trim();
            const nebenkeywords = document.querySelector('input[placeholder="Nebenkeyword eingeben"]').value.trim();
            const proofkeywords = document.querySelector('input[placeholder="Proofkeyword eingeben"]').value.trim();
            const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input')).map(input => input.value.trim()).filter(value => value).join(', ');
            insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
        });

        const bTextButton = document.createElement('button');
        bTextButton.innerText = 'B-Text';
        bTextButton.style.width = '48%';
        bTextButton.style.padding = '10px';
        bTextButton.style.backgroundColor = '#444';
        bTextButton.style.color = 'white';
        bTextButton.style.border = 'none';
        bTextButton.style.borderRadius = '5px';
        bTextButton.style.cursor = 'pointer';
        bTextButton.addEventListener('click', () => {
            const hauptkeyword = document.querySelector('input[placeholder="Hauptkeyword eingeben"]').value.trim();
            const nebenkeywords = document.querySelector('input[placeholder="Nebenkeyword eingeben"]').value.trim();
            const proofkeywords = document.querySelector('input[placeholder="Proofkeyword eingeben"]').value.trim();
            const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input')).map(input => input.value.trim()).filter(value => value).join(', ');
            insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen, false, true);
        });

        container.appendChild(aTextButton);
        container.appendChild(bTextButton);
    }

    function initializeContentBuddy() {
        if (document.querySelector('#contentBuddyButton')) {
            return;
        }

        const container = document.querySelector('.text-buddy-content');
        if (container) {
            createInputButtons(container);
        }
    }

    document.addEventListener('DOMContentLoaded', initializeContentBuddy);
})();
