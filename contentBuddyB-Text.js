(function() {
 'use strict';

 console.log('ContentBuddy script is running');

 let loadingIndicator;
 let initialized = false; // Neues Flag: verhindert mehrfache Initialisierung

 function insertTextAndSend(hauptkeyword, keyword, nebenkeywords, proofkeywords, w_fragen) {
  let quillEditorContainer = document.querySelector('.v-ql-textarea.ql-container');
  console.log('Versuche, ".v-ql-textarea.ql-container" zu finden:', quillEditorContainer);

  let textAreaElement;

  if (!quillEditorContainer) {
   console.log('Erstes Element ".v-ql-textarea.ql-container" nicht gefunden. Versuche, "textarea.v-field__input" zu verwenden.');
   textAreaElement = document.querySelector('textarea.v-field__input');
   console.log('Versuche, "textarea.v-field__input" zu finden:', textAreaElement);
  }

  let text = window.promptBText; // Verwende den neuen Prompt für den Text
  console.log('Text für die Generierung:', text); // Debugging

  if (!text) {
   console.error('Prompt-Text nicht gefunden. Bitte stellen Sie sicher, dass die Prompt-Dateien korrekt geladen wurden.');
   return;
  }

  text = text.replace(/\$\{hauptkeyword\}/g, hauptkeyword)
    .replace(/\$\{keyword\}/g, keyword)
    .replace(/\$\{nebenkeywords\}/g, nebenkeywords)
    .replace(/\$\{proofkeywords\}/g, proofkeywords)
    .replace(/\$\{w_fragen\}/g, w_fragen);

  console.log('Text, der eingefügt werden soll:', text);

  if (quillEditorContainer) {
   let editorElement = quillEditorContainer.querySelector('.ql-editor');
   console.log('Editor gefunden:', editorElement);
   editorElement.innerHTML = text; // Verwende innerHTML für den Quill-Editor
   console.log('Text im Quill-Editor eingefügt:', editorElement.innerHTML);
   simulateEnterPress(editorElement);
  } else if (textAreaElement) {
   insertTextInTextareaAndSubmit(textAreaElement, text);
  } else {
   console.error('Kein passendes Editor-Container-Element oder Textarea gefunden.');
  }
 }

 function insertTextInTextareaAndSubmit(chatbox, text) {
  chatbox.click();
  console.log('Klick in die Textarea simuliert.');

  chatbox.value = text;
  console.log('Text in die Textarea eingefügt:', chatbox.value);

  let inputEvent = new Event('input', { bubbles: true });
  chatbox.dispatchEvent(inputEvent);

  let changeEvent = new Event('change', { bubbles: true });
  chatbox.dispatchEvent(changeEvent);

  setTimeout(() => {
   simulateEnterPress(chatbox);
  }, 10);
 }

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

 function createButton() {
  console.log("Erstelle Haupt-Button für ContentBuddy...");
  const button = document.createElement('button');
  button.innerText = 'ContentBuddy';
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
  button.onclick = () => {
    const hauptkeyword = document.querySelector('input[placeholder="Hauptkeyword eingeben"]').value.trim();
    const nebenkeywords = document.querySelector('input[placeholder="Nebenkeyword eingeben"]').value.trim();
    const proofkeywords = document.querySelector('input[placeholder="Proofkeyword eingeben"]').value.trim();
    const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input')).map(input => input.value.trim()).filter(value => value).join(', ');

    console.log("Hauptkeyword:", hauptkeyword);
    console.log("Nebenkeywords:", nebenkeywords);
    console.log("Proofkeywords:", proofkeywords);
    console.log("W-Fragen:", w_fragen);
    insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
  };
  document.body.appendChild(button);
 }

 function initializeContentBuddy() {
  if (initialized) {
    console.log("initializeContentBuddy() abgebrochen, da schon initialized = true.");
    return;
  }
  createButton();
  console.log('ContentBuddy initialized.');
  initialized = true;
 }

 initializeContentBuddy();

})();
