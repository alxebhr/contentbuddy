(function() {
  'use strict';

  console.log('ContentBuddy script is running');

  let loadingIndicator;
  let firstTime = true; // Track the first time the text is inserted
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

  let text = window.promptBText; // Verwende den neuen Prompt für die Textgenerierung

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

  const insertButton = document.createElement('button');
  insertButton.innerText = 'Text generieren';
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
  console.log("Text generieren geklickt.");
  const hauptkeyword = mainKeywordInput.value.trim();
  const nebenkeywords = subKeywordInput.value.trim();
  const proofkeywords = proofKeywordInput.value.trim();

  console.log("Hauptkeyword:", hauptkeyword);
  console.log("Nebenkeywords:", nebenkeywords);
  console.log("Proofkeywords:", proofkeywords);

  if (hauptkeyword) {
  insertTextAndSend(hauptkeyword, nebenkeywords, proofkeywords);
  console.log("Prompt zum Generieren des Textes gesendet.");
  insertButton.style.display = 'none';
  createLoadingIndicator(content);
  }
  });
  content.appendChild(insertButton);

  return overlay;
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
  loadingIndicator.innerText = 'Generiere Text... ';

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

  function initializeContentBuddy() {
  if (initialized) {
  console.log("initializeContentBuddy() abgebrochen, da schon initialized = true.");
  return;
  }
  if (document.querySelector('#contentBuddyButton')) {
  console.log("initializeContentBuddy() abgebrochen, Button existiert bereits.");
  return; 
  }

  createButton();
  monitorResetButton();
  console.log('ContentBuddy initialized.');
  initialized = true;
  
  observer.disconnect();
  }

  const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
  if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
  initializeContentBuddy();
  }
  });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  initializeContentBuddy();

})();
