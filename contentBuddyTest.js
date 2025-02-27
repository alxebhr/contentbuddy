(function() {
 'use strict';

 console.log('ContentBuddy script is running');

 let loadingIndicator;
 let firstTime = true; // Track the first time the text is inserted
 let initialized = false; // Neues Flag: verhindert mehrfache Initialisierung

 function insertTextAndSend(hauptkeyword, keyword, nebenkeywords, proofkeywords, w_fragen) {
  // Versuche zuerst den Quill-Editor zu finden
  let quillEditorContainer = document.querySelector('.v-ql-textarea.ql-container');
  console.log('Versuche, ".v-ql-textarea.ql-container" zu finden:', quillEditorContainer);

  let textAreaElement;

  // Falls der Quill-Editor nicht gefunden wird, suche das Textarea-Element
  if (!quillEditorContainer) {
   console.log('Erstes Element ".v-ql-textarea.ql-container" nicht gefunden. Versuche, "textarea.v-field__input" zu verwenden.');
   textAreaElement = document.querySelector('textarea.v-field__input');
   console.log('Versuche, "textarea.v-field__input" zu finden:', textAreaElement);
  }

  // Text für den Editor erstellen
  let text;
  const textType = document.querySelector('select').value; // Texttyp auswählen

  if (textType === 'A') {
   // Verwende den Prompt für die Gliederung
   text = window.promptTextDefault.replace(/\$\{hauptkeyword\}/g, hauptkeyword)
                   .replace(/\$\{nebenkeywords\}/g, nebenkeywords)
                   .replace(/\$\{proofkeywords\}/g, proofkeywords)
                   .replace(/\$\{w_fragen\}/g, w_fragen);
  } else if (textType === 'B') {
   // Verwende den B-Text-Prompt
   text = window.promptBText.replace(/\$\{hauptkeyword\}/g, hauptkeyword)
                .replace(/\$\{nebenkeywords\}/g, nebenkeywords)
                .replace(/\$\{proofkeywords\}/g, proofkeywords)
                .replace(/\$\{w_fragen\}/g, w_fragen);
  }

  // Überprüfen, ob der Prompt-Text vorhanden ist
  if (!text) {
   console.error('Prompt-Text nicht gefunden. Bitte stellen Sie sicher, dass die Prompt-Dateien korrekt geladen wurden.');
   return;
  }

  console.log('Text, der eingefügt werden soll:', text);

  // Wenn ein Quill-Editor gefunden wurde, Text einfügen
  if (quillEditorContainer) {
   let editorElement = quillEditorContainer.querySelector('.ql-editor');
   console.log('Editor gefunden:', editorElement);
   editorElement.innerHTML = text; // Verwende innerHTML für den Quill-Editor
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

 // ... (restlicher Code bleibt unverändert)

})();
