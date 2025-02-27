(function() {
  'use strict';

  console.log('ContentBuddy script is running');

  let loadingIndicator;
  let firstTime = true; // Track the first time the text is inserted
  let initialized = false; // Neues Flag: verhindert mehrfache Initialisierung

  function insertTextAndSend(hauptkeyword, keyword, nebenkeywords, proofkeywords, w_fragen, outlineText = false) {
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
    if (outlineText) {
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
      editorElement.innerHTML = text; // Verwende innerHTML für den Quill-Editor
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
      simulateEnterPress(chatbox);
    }, 10); // Kleine Verzögerung, um sicherzustellen, dass der Text zuerst eingefügt wird
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
      console.log(`Verarbeite Überschrift Nr. ${index+1}: ${heading.innerText.trim()}`);

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
            console.log(`  Listenpunkt: "${listItemText}"`);
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
      console.log(`Box #${index+1} wird erstellt mit Titel: "${point.title}"`);
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
      console.log(`Box #${index+1} mit Titel "${point.title}" hinzugefügt`);
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

    // Erstelle die Buttons "A-Text" und "B-Text"
    const generateATextButton = document.createElement('button');
    generateATextButton.innerText = 'A-Text';
    generateATextButton.style.width = 'auto';
    generateATextButton.style.padding = '10px';
    generateATextButton.style.backgroundColor = '#d2d3db';
    generateATextButton.style.color = 'white';
    generateATextButton.style.border = '1px solid #000000';
    generateATextButton.style.borderRadius = '50px';
    generateATextButton.style.cursor = 'pointer';
    generateATextButton.style.marginLeft = '10px';
    generateATextButton.style.transition = 'background-color 0.3s';

    generateATextButton.addEventListener('click', () => {
      console.log("Button A-Text wurde geklickt.");
      const hauptkeyword = mainKeywordInput.value.trim();
      const nebenkeywords = subKeywordInput.value.trim();
      const proofkeywords = proofKeywordInput.value.trim();
      const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input')).map(input => input.value.trim()).filter(value => value).join(', ');

      if (hauptkeyword) {
        insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
        console.log("Prompt zum Generieren der Gliederung gesendet. Erstelle Gliederung...");

        createLoadingIndicator(content); // Ladeanimation anzeigen

        setTimeout(() => {
          const outline = extractOutline();
          if (outline) {
            const container = document.querySelector('.text-buddy-content');
            if (container) {
              createOutlineBoxes(outline, container);
              const generateFinalTextButton = document.createElement('button');
              generateFinalTextButton.innerText = 'Finalen Text generieren';
              generateFinalTextButton.style.width = '100%';
              generateFinalTextButton.style.padding = '10px';
              generateFinalTextButton.style.backgroundColor = '#333333';
              generateFinalTextButton.style.color = 'white';
              generateFinalTextButton.style.border = 'none';
              generateFinalTextButton.style.borderRadius = '5px';
              generateFinalTextButton.style.cursor = 'pointer';
              generateFinalTextButton.style.marginTop = '10px';
              generateFinalTextButton.addEventListener('click', () => {
                const outlineText = outline.map(point => `${point.title}\n${point.content.join(' ')}`).join('\n\n');
                const finalText = generateBText(hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
                insertTextAndSend(hauptkeyword, outlineText + '\n\n' + finalText, nebenkeywords, proofkeywords, w_fragen, true);
              });
              container.appendChild(generateFinalTextButton);
            }
          }
        }, 10000);
      }
    });

    const generateBTextButton = document.createElement('button');
    generateBTextButton.innerText = 'B-Text';
    generateBTextButton.style.width = 'auto';
    generateBTextButton.style.padding = '10px';
    generateBTextButton.style.backgroundColor = '#d2d3db';
    generateBTextButton.style.color = 'white';
    generateBTextButton.style.border = '1px solid #000000';
    generateBTextButton.style.borderRadius = '50px';
    generateBTextButton.style.cursor = 'pointer';
    generateBTextButton.style.marginLeft = '10px';
    generateBTextButton.style.transition = 'background-color 0.3s';

    generateBTextButton.addEventListener('click', () => {
      console.log("Button B-Text wurde geklickt.");
      const hauptkeyword = mainKeywordInput.value.trim();
      const nebenkeywords = subKeywordInput.value.trim();
      const proofkeywords = proofKeywordInput.value.trim();
      const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input')).map(input => input.value.trim()).filter(value => value).join(', ');

      const generatedText = generateBText(hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
      insertTextAndSend(hauptkeyword, generatedText, nebenkeywords, proofkeywords, w_fragen, false);
      console.log('Text wurde eingefügt für B-Text:', hauptkeyword, generatedText, nebenkeywords, proofkeywords, w_fragen);
    });

    header.insertBefore(generateATextButton, header.querySelector('button'));
    header.insertBefore(generateBTextButton, header.querySelector('button'));
    console.log('Buttons A-Text und B-Text hinzugefügt');
  }

  function generateBText(hauptkeyword, nebenkeywords, proofkeywords, w_fragen) {
    return window.promptBText
      .replace(/\$\{hauptkeyword\}/g, hauptkeyword)
      .replace(/\$\{nebenkeywords\}/g, nebenkeywords)
      .replace(/\$\{proofkeywords\}/g, proofkeywords)
      .replace(/\$\{w_fragen\}/g, w_fragen);
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

    const insertButton = document.createElement('button');
    insertButton.innerText = 'Gliederung abfragen';
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
      console.log("Gliederung abfragen geklickt.");
      const hauptkeyword = mainKeywordInput.value.trim();
      const nebenkeywords = subKeywordInput.value.trim();
      const proofkeywords = proofKeywordInput.value.trim();
      const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input'))
        .map(input => input.value.trim())
        .filter(value => value)
        .join(', ');

      console.log("Hauptkeyword:", hauptkeyword);
      console.log("Nebenkeywords:", nebenkeywords);
      console.log("Proofkeywords:", proofkeywords);
      console.log("W-Fragen:", w_fragen);

      if (hauptkeyword) {
        insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
        console.log("Prompt zum Generieren der Gliederung gesendet. Verberge Insert-Button und zeige Ladeindikator.");
        insertButton.style.display = 'none'; // Button verschwinden lassen
        createLoadingIndicator(content); // Ladeanimation anzeigen

        // NUR JETZT startet der 10-Sekunden-Fallback
        setTimeout(() => {
          console.log("Fallback-Check nach 10 Sekunden ab KLICK auf 'Gliederung abfragen'...");
          if (firstTime) {
            console.log("Erster Aufruf war noch nicht erfolgt. Führe extractOutline() jetzt aus...");
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
            console.log("Fallback nicht nötig, da firstTime bereits false ist.");
          }
        }, 10000);
      }
    });
    content.appendChild(insertButton);

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
    // Stelle sicher, dass nur einmal initialisiert wird
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
     
    // Nach erfolgter Initialisierung Observer deaktivieren, um mehrfaches Triggern zu vermeiden
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
