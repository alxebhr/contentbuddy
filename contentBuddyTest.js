(function() {
  'use strict';

  console.log('ContentBuddy script is running');

  let loadingIndicator;
  let firstTime = true; // Track the first time the text is inserted
  let initialized = false; // Neues Flag: verhindert mehrfache Initialisierung

  function insertTextAndSend(hauptkeyword, text, nebenkeywords, proofkeywords, w_fragen) {
    let quillEditorContainer = document.querySelector('.v-ql-textarea.ql-container');
    console.log('Versuche, ".v-ql-textarea.ql-container" zu finden:', quillEditorContainer);

    let textAreaElement;

    if (!quillEditorContainer) {
      console.log('Erstes Element ".v-ql-textarea.ql-container" nicht gefunden. Versuche, "textarea.v-field__input" zu verwenden.');
      textAreaElement = document.querySelector('textarea.v-field__input');
      console.log('Versuche, "textarea.v-field__input" zu finden:', textAreaElement);
    }

    if (!text) {
      console.error('Prompt-Text nicht gefunden. Bitte stellen Sie sicher, dass die Prompt-Dateien korrekt geladen wurden.');
      return;
    }

    console.log('Text, der eingefügt werden soll:', text);

    if (quillEditorContainer) {
      let editorElement = quillEditorContainer.querySelector('.ql-editor');
      console.log('Editor gefunden:', editorElement);
      editorElement.innerHTML = text;
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

  function extractOutline() {
    console.log("extractOutline() wurde aufgerufen. Versuche die Gliederung zu extrahieren...");
    const elements = document.querySelectorAll('div[data-v-1780e672].v-col-md-10.v-col-12.px-0.pt-0.content');
    console.log(`Gefundene Elemente data-v-1780e672: ${elements.length}`);

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

      point.title = heading.innerText.trim();

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
            console.log(` Listenpunkt: "${listItemText}"`);
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

  function generateOutline(hauptkeyword, nebenkeywords, proofkeywords, w_fragen) {
    return window.promptTextDefault
      .replace(/\$\{hauptkeyword\}/g, hauptkeyword)
      .replace(/\$\{nebenkeywords\}/g, nebenkeywords)
      .replace(/\$\{proofkeywords\}/g, proofkeywords)
      .replace(/\$\{w_fragen\}/g, w_fragen);
  }

  function generateFinalText(hauptkeyword, nebenkeywords, proofkeywords, w_fragen, outline) {
    return window.promptTextOutline
      .replace(/\$\{hauptkeyword\}/g, hauptkeyword)
      .replace(/\$\{nebenkeywords\}/g, nebenkeywords)
      .replace(/\$\{proofkeywords\}/g, proofkeywords)
      .replace(/\$\{w_fragen\}/g, w_fragen)
      .replace(/\$\{outline\}/g, outline); // Hier wird die Gliederung verwendet
  }

  function generateBText(hauptkeyword, nebenkeywords, proofkeywords, w_fragen) {
    return window.promptBText
      .replace(/\$\{hauptkeyword\}/g, hauptkeyword)
      .replace(/\$\{nebenkeywords\}/g, nebenkeywords)
      .replace(/\$\{proofkeywords\}/g, proofkeywords)
      .replace(/\$\{w_fragen\}/g, w_fragen);
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
    const generateATextButton = document.createElement('button');
    generateATextButton.innerText = 'A-Text generieren';
    generateATextButton.style.width = '100%';
    generateATextButton.style.padding = '10px';
    generateATextButton.style.backgroundColor = '#333333';
    generateATextButton.style.color = 'white';
    generateATextButton.style.border = 'none';
    generateATextButton.style.borderRadius = '5px';
    generateATextButton.style.cursor = 'pointer';
    generateATextButton.style.marginBottom = '10px';

    const generateBTextButton = document.createElement('button');
    generateBTextButton.innerText = 'B-Text generieren';
    generateBTextButton.style.width = '100%';
    generateBTextButton.style.padding = '10px';
    generateBTextButton.style.backgroundColor = '#333333';
    generateBTextButton.style.color = 'white';
    generateBTextButton.style.border = 'none';
    generateBTextButton.style.borderRadius = '5px';
    generateBTextButton.style.cursor = 'pointer';
    generateBTextButton.style.marginBottom = '10px';

    header.insertBefore(generateATextButton, header.querySelector('button'));
    header.insertBefore(generateBTextButton, header.querySelector('button'));

    generateATextButton.addEventListener('click', () => {
      console.log("A-Text generieren geklickt.");
      const hauptkeyword = document.querySelector('input[placeholder="Hauptkeyword eingeben"]').value.trim();
      const nebenkeywords = document.querySelector('input[placeholder="Nebenkeyword eingeben"]').value.trim();
      const proofkeywords = document.querySelector('input[placeholder="Proofkeyword eingeben"]').value.trim();
      const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input'))
        .map(input => input.value.trim())
        .filter(value => value)
        .join(', ');

      if (hauptkeyword) {
        const outlineText = generateOutline(hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
        insertTextAndSend(hauptkeyword, outlineText, nebenkeywords, proofkeywords, w_fragen);
        console.log("A-Text generiert und gesendet.");
        createLoadingIndicator(container); // Ladeanimation anzeigen
      }
    });

    generateBTextButton.addEventListener('click', () => {
      console.log("B-Text generieren geklickt.");
      const hauptkeyword = document.querySelector('input[placeholder="Hauptkeyword eingeben"]').value.trim();
      const nebenkeywords = document.querySelector('input[placeholder="Nebenkeyword eingeben"]').value.trim();
      const proofkeywords = document.querySelector('input[placeholder="Proofkeyword eingeben"]').value.trim();
      const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input'))
        .map(input => input.value.trim())
        .filter(value => value)
        .join(', ');

      if (hauptkeyword) {
        const bText = generateBText(hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
        insertTextAndSend(hauptkeyword, bText, nebenkeywords, proofkeywords, w_fragen);
        console.log("B-Text generiert und gesendet.");
      }
    });
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

    return overlay;
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
    monitorConsoleMessages();
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
