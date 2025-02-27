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

 let text = window.promptBText; // Verwende den neuen Prompt für die Textgenerierung
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

 function reloadPage() {
 location.reload();
 }

 function monitorResetButton() {
 const resetButton = document.querySelector('.v-btn.v-btn--size-x-large');

 if (resetButton) {
  resetButton.addEventListener('click', function() {
  reloadPage();
  });
  console.log("Reset-Button gefunden und EventListener hinzugefügt.");
 } else {
  console.error("Reset-Button nicht gefunden.");
 }
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
  insertTextAndSend(
   mainKeywordInput.value.trim(),
   mainKeywordInput.value.trim(), // Keyword ist das Hauptkeyword
   subKeywordInput.value.trim(),
   proofKeywordInput.value.trim(),
   Array.from(document.querySelectorAll('.w-frage-box input')).map(input => input.value.trim()).filter(value => value).join(', ')
  );
 };
 document.body.appendChild(button);
 }

 function initializeContentBuddy() {
 if (initialized) {
  console.log("initializeContentBuddy() abgebrochen, da schon initialized = true.");
  return;
 }
 createButton();
 monitorResetButton();
 console.log('ContentBuddy initialized.');
 initialized = true;
 }

 initializeContentBuddy();

})();
