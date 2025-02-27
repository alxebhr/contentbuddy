(function() {
  'use strict';

  console.log('ContentBuddy script is running');

  let loadingIndicator;
  let initialized = false; // Neues Flag: verhindert mehrfache Initialisierung

  function insertTextAndSend(hauptkeyword, nebenkeywords, proofkeywords) {
    let quillEditorContainer = document.querySelector('.v-ql-textarea.ql-container');
    console.log('Versuche, ".v-ql-textarea.ql-container" zu finden:', quillEditorContainer);

    let textAreaElement;

    if (!quillEditorContainer) {
      console.log('Erstes Element ".v-ql-textarea.ql-container" nicht gefunden. Versuche, "textarea.v-field__input" zu verwenden.');
      textAreaElement = document.querySelector('textarea.v-field__input');
      console.log('Versuche, "textarea.v-field__input" zu finden:', textAreaElement);
    }

    let text = window.promptBText; // Verwende den neuen Prompt
    if (!text) {
      console.error('Prompt-Text nicht gefunden. Bitte stellen Sie sicher, dass die Prompt-Dateien korrekt geladen wurden.');
      return;
    }

    text = text.replace(/\$\{hauptkeyword\}/g, hauptkeyword)
      .replace(/\$\{nebenkeywords\}/g, nebenkeywords)
      .replace(/\$\{proofkeywords\}/g, proofkeywords);

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

  function createInputField(labelText, placeholder) {
    const container = document.createElement('div');
    container.style.marginBottom = '10px';

    const label = document.createElement('label');
    label.innerText = labelText;
    label.style.display = 'block';
    label.style.fontSize = '0.9em';
    label.style.color = '#4F4F4F';
    label.style.marginBottom = '5px';
    container.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    input.style.width = '100%';
    input.style.padding = '10px';
    input.style.borderRadius = '5px';
    input.style.border = '1px solid #ddd';
    input.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
    container.appendChild(input);

    return { container, input };
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
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.right = '0';
      overlay.style.top = '0';
      overlay.style.width = '350px';
      overlay.style.height = '100vh';
      overlay.style.backgroundColor = '#ffffff';
      overlay.style.color = '#333333';
      overlay.style.zIndex = '1000';
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      overlay.style.padding = '20px';
      overlay.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      document.body.appendChild(overlay);

      const { container: mainKeywordContainer, input: mainKeywordInput } = createInputField('Haupt-Keyword', 'Hauptkeyword eingeben');
      overlay.appendChild(mainKeywordContainer);

      const { container: subKeywordContainer, input: subKeywordInput } = createInputField('Neben-Keywords', 'Nebenkeyword eingeben');
      overlay.appendChild(subKeywordContainer);

      const { container: proofKeywordContainer, input: proofKeywordInput } = createInputField('Proof-Keywords', 'Proofkeyword eingeben');
      overlay.appendChild(proofKeywordContainer);

      const insertButton = document.createElement('button');
      insertButton.innerText = 'Text generieren';
      insertButton.style.width = '100%';
      insertButton.style.padding = '10px';
      insertButton.style.backgroundColor = '#333333';
      insertButton.style.color = 'white';
      insertButton.style.border = 'none';
      insertButton.style.borderRadius = '5px';
      insertButton.style.cursor = 'pointer';
      insertButton.style.marginTop = '10px';
      insertButton.addEventListener('click', () => {
        const hauptkeyword = mainKeywordInput.value.trim();
        const nebenkeywords = subKeywordInput.value.trim();
        const proofkeywords = proofKeywordInput.value.trim();

        if (hauptkeyword) {
          insertTextAndSend(hauptkeyword, nebenkeywords, proofkeywords);
          document.body.removeChild(overlay); // Overlay schließen
        }
      });
      overlay.appendChild(insertButton);
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
