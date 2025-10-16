// ==UserScript==
// @name         ContentBuddy – robust send & outline flow
// @namespace    contentbuddy.witt
// @version      1.1.1
// @description  Fügt Prompts ein, sendet sie zuverlässig und verhindert Re-Insert nach dem Absenden. Erstellt Outline-UI und Meta-Button.
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  console.log('ContentBuddy script is running');

  /* ==========================================================
   *   Globale Guards / Signatur-Tools (gegen Re-Insert)
   * ========================================================== */
  let isSending = false;   // verhindert Inserts während Send
  let lastSentSig = null;  // Merker der zuletzt gesendeten Textsignatur

  const normalizeText = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const sigOf = (s) => {
    const t = normalizeText(s);
    let h = 0;
    for (let i = 0; i < t.length; i++) h = ((h << 5) - h) + t.charCodeAt(i) | 0;
    return String(h) + ':' + t.length;
  };

  // Beobachtet den Editor kurz nach dem Senden und leert ihn,
  // falls exakt derselbe Text erneut eingespeist wird.
  function postSendCleanup(editorEl, sig, { windowMs = 3000 } = {}) {
    const deadline = Date.now() + windowMs;
    let cleared = false;

    const step = () => {
      if (cleared || Date.now() > deadline) { isSending = false; return; }
      const cur = normalizeText(editorEl.innerText || editorEl.textContent || editorEl.value || '');
      if (cur && sigOf(cur) === sig) {
        editorEl.innerHTML = '';
        try {
          editorEl.dispatchEvent(new InputEvent('input', { bubbles: true }));
        } catch (_) {
          editorEl.dispatchEvent(new Event('input', { bubbles: true }));
        }
        cleared = true;
      }
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  /* ================================
   *   Helpers für Editor & Send
   * ================================ */

  // Bevorzugt den Editor im Footer (#editor), Fallback auf beliebiges contenteditable
  function getEditorEl() {
    let el = document.querySelector('#editor[contenteditable="true"]');
    if (el) return el;
    el = document.querySelector('#chat-footer [contenteditable="true"]');
    if (el) return el;
    return document.querySelector('[contenteditable="true"]');
  }

  // Fügt HTML/Text in ein contenteditable ein und triggert Framework-Events
  function setContentEditable(el, html) {
    if (!el) return false;
    if (isSending) { console.warn('[Guard] Noch im Send-Prozess – Insert übersprungen.'); return false; }

    el.focus();
    document.execCommand('selectAll', false, null);

    let ok = document.execCommand('insertHTML', false, html);
    if (!ok) {
      document.execCommand('insertText', false, html);
      if ((el.innerHTML || '').trim() !== html.trim()) el.innerHTML = html; // Notnagel
    }

    try {
      el.dispatchEvent(new InputEvent('input', {
        bubbles: true, cancelable: true, inputType: 'insertFromPaste', data: html
      }));
    } catch (_) {
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  // Findet den Senden-Button
  function findSendButton() {
    const icon = document.querySelector('#chat-footer .input-panel .mdi-send');
    if (icon) {
      const btn = icon.closest('button');
      if (btn) return btn;
    }
    const primary = document.querySelector('#chat-footer .input-panel .v-btn.bg-primary');
    if (primary) return primary;

    const btn = Array.from(
      document.querySelectorAll('#chat-footer .input-panel button, #chat-footer button')
    ).find((b) => {
      const t = (b.textContent || '').toLowerCase();
      const a = (b.getAttribute('aria-label') || '').toLowerCase();
      return /senden|send|abschicken|absenden/.test(t + a) || b.type === 'submit';
    });
    return btn || null;
  }

  function sendMessage() {
    const btn = findSendButton();
    if (!btn) { console.warn('Send-Button nicht gefunden.'); return false; }

    isSending = true;
    btn.click();

    // kurze Doppelklick-Dämpfung
    try { btn.disabled = true; setTimeout(() => (btn.disabled = false), 4000); } catch (_) {}
    return true;
  }

  /* ==========================================================
   *   Robuster Klassen-Wait (ohne hartes "send/stop"-Wissen)
   * ========================================================== */
  function findButtonIconEl() {
    const btn = findSendButton();
    if (!btn) return null;
    return (
      btn.querySelector('i, svg, [class*="mdi-"], [class*="fa-"], [class*="ri-"]') ||
      btn.querySelector('[class*="icon"]') ||
      btn
    );
  }

  function extractGlyphSignature(iconEl) {
    if (!iconEl) return '';
    const cls = Array.from((iconEl.classList || []));
    const glyph =
      cls.find((c) => c.startsWith('mdi-') && c !== 'mdi') ||
      cls.find((c) => c.startsWith('fa-')) ||
      cls.find((c) => c.startsWith('ri-'));
    if (glyph) return glyph;
    return cls.sort().join('.');
  }

  async function waitForLLMByClassChange({
    appearTimeoutMs = 60000,
    finishTimeoutMs = 180000,
    stableForMs = 800,
    log = true,
  } = {}) {
    const logf = (...a) => log && console.log('[CLASS-WAIT]', ...a);

    // 1) Icon-Element erscheinen lassen
    let icon = findButtonIconEl();
    const tAppear = Date.now();
    while (!icon) {
      if (Date.now() - tAppear > appearTimeoutMs) throw new Error('Icon-Element nicht gefunden');
      await new Promise((r) => setTimeout(r, 80));
      icon = findButtonIconEl();
    }
    let baseGlyph = extractGlyphSignature(icon);
    if (!baseGlyph) baseGlyph = (icon.outerHTML || '').slice(0, 200);
    logf('Baseline glyph:', baseGlyph);

    // 2) Auf Start (Glyph != Baseline) warten
    const tStartMax = Date.now();
    while (true) {
      const fresh = findButtonIconEl() || icon;
      icon = fresh;
      const g = extractGlyphSignature(icon);
      if (g && g !== baseGlyph) { logf('Start erkannt. Current glyph:', g); break; }
      if (Date.now() - tStartMax > appearTimeoutMs) { logf('Start nicht gesehen – fahre fort.'); break; }
      await new Promise((r) => setTimeout(r, 80));
    }

    // 3) Auf Rückkehr zur Baseline + Stabilität warten
    const tFinishMax = Date.now();
    let stableSince = null;
    const watchTarget = (findSendButton() || document.body);
    let lastMutation = Date.now();
    const mo = new MutationObserver(() => { lastMutation = Date.now(); });
    try { mo.observe(watchTarget, { attributes: true, childList: true, subtree: true }); } catch (_) {}

    while (true) {
      const fresh = findButtonIconEl() || icon;
      icon = fresh;
      const glyph = extractGlyphSignature(icon);

      if (glyph === baseGlyph) {
        if (stableSince == null) stableSince = Date.now();
        const noDomChangeFor = Date.now() - lastMutation;
        const stableFor = Date.now() - stableSince;
        if (stableFor >= stableForMs && noDomChangeFor >= Math.min(stableForMs, 500)) {
          mo.disconnect();
          logf('Baseline (stabil) erreicht.');
          break;
        }
      } else {
        stableSince = null;
      }

      if (Date.now() - tFinishMax > finishTimeoutMs) {
        mo.disconnect();
        logf('Timeout beim Zurückkehren zur Baseline – fahre fort.');
        break;
      }
      await new Promise((r) => setTimeout(r, 100));
    }
    return true;
  }

  /* ================================
   *   State / Flags
   * ================================ */
  let loadingIndicator;
  let firstTime = true;
  let initialized = false;

  /* ================================
   *   Hauptfunktion: Prompt einfügen + senden
   * ================================ */
  function insertTextAndSend(
    hauptkeyword,
    keyword,
    nebenkeywords,
    proofkeywords,
    w_fragen,
    outlineFlag = '',
    autoSend = true
  ) {
    // Template wählen
    let text =
      outlineFlag === 'bText'    ? window.promptBText :
      outlineFlag === 'metaText' ? window.promptMetas :
      outlineFlag === true       ? window.promptTextOutline :
                                   window.promptTextDefault;

    if (!text) { console.error('Prompt-Template fehlt (window.prompt*).'); return; }

    // Platzhalter ersetzen
    text = text
      .replace(/\$\{hauptkeyword\}/g, hauptkeyword || '')
      .replace(/\$\{keyword\}/g,      keyword || '')
      .replace(/\$\{nebenkeywords\}/g, nebenkeywords || '')
      .replace(/\$\{proofkeywords\}/g, proofkeywords || '')
      .replace(/\$\{w_fragen\}/g,     w_fragen || '');

    console.log('Text, der eingefügt werden soll:', text);

    const editorEl = getEditorEl();
    if (!editorEl) { console.error('Kein contenteditable-Editor gefunden (#editor).'); return; }

    if (!setContentEditable(editorEl, text)) return;

    if (autoSend) {
      lastSentSig = sigOf(text);
      setTimeout(() => {
        if (sendMessage()) postSendCleanup(editorEl, lastSentSig, { windowMs: 3000 });
      }, 50);
    }
  }

  /* ================================
   *   Meta-Daten Button
   * ================================ */
  function createMetaDataButton() {
    console.log('Erstelle Meta-Daten-Button...');

    const header = document.querySelector('.text-buddy-content')?.previousElementSibling;
    if (!header) { console.error('Header für Meta-Daten-Button nicht gefunden!'); return; }

    const generateTextButton = header.querySelector('button');

    const metaButton = document.createElement('button');
    metaButton.id = 'metaDataButton';
    metaButton.innerText = 'Metas 🚀';
    metaButton.style.width = 'auto';
    metaButton.style.padding = '10px';
    metaButton.style.backgroundColor = '#ffffff';
    metaButton.style.color = '#333';
    metaButton.style.border = '1px solid #000000';
    metaButton.style.borderRadius = '50px';
    metaButton.style.cursor = 'pointer';
    metaButton.style.marginLeft = '10px';
    metaButton.style.transition = 'background-color 0.3s';
    metaButton.onmouseover = () => (metaButton.style.backgroundColor = '#f0f0f0');
    metaButton.onmouseout = () => (metaButton.style.backgroundColor = '#ffffff');

    metaButton.addEventListener('click', () => {
      console.log('Meta-Daten-Button geklickt.');

      const hauptkeyword =
        document.querySelector('input[placeholder="Hauptkeyword eingeben"]')?.value.trim() || '';
      const nebenkeywords =
        document.querySelector('input[placeholder="Nebenkeyword eingeben"]')?.value.trim() || '';
      const proofkeywords =
        document.querySelector('input[placeholder="Proofkeyword eingeben"]')?.value.trim() || '';
      const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input'))
        .map((input) => input.value.trim())
        .filter(Boolean)
        .join(', ');

      // Wichtig: wir nutzen das Template window.promptMetas via outlineFlag='metaText'
      insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen, 'metaText');
    });

    if (!document.querySelector('#metaDataButton')) {
      header.insertBefore(metaButton, generateTextButton || header.firstChild);
      console.log('Meta-Daten-Button wurde eingefügt!');
      if (generateTextButton && generateTextButton.innerText.includes('🖋️✨')) {
        generateTextButton.style.display = 'none';
        console.log('🖋️✨-Button wurde ausgeblendet.');
      }
    }
  }

  /* ================================
   *   (Legacy) Textarea-Helper (Fallback)
   * ================================ */
  function insertTextInTextareaAndSubmit(chatbox, text) {
    if (!chatbox) return;
    chatbox.click();
    chatbox.value = text;
    chatbox.dispatchEvent(new Event('input', { bubbles: true }));
    chatbox.dispatchEvent(new Event('change', { bubbles: true }));
    setTimeout(() => createMetaDataButton(), 3000);
  }

  /* ================================
   *   Reset, Outline, UI
   * ================================ */

  function reloadPage() { location.reload(); }

  function monitorResetButton() {
    const resetButton = document.querySelector('.v-btn.v-btn--size-x-large');
    if (resetButton) {
      resetButton.addEventListener('click', () => reloadPage());
      console.log('Reset-Button gefunden und EventListener hinzugefügt.');
    } else {
      console.warn('Reset-Button nicht gefunden.');
    }
  }

  /** Robuste Auswahl des Outline-Containers */
  function pickOutlineSourceFromChatMessages() {
    const chat = document.querySelector('#chat-messages');
    if (!chat) { console.error('#chat-messages nicht gefunden.'); return null; }

    const kids = Array.from(chat.children).filter(
      (el) => el.nodeType === 1 && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE'
    );
    console.log(
      `Kinder unter #chat-messages: ${kids.length}`,
      kids.map((el, i) => ({ idx: i, tag: el.tagName.toLowerCase(), id: el.id || null, classes: Array.from(el.classList).join(' ') }))
    );

    let source = kids[1] || null;
    if (!source || !source.querySelector('h3, ul')) {
      const withHeadings = kids.find((el) => el.querySelector('h3, ul, h2, h4'));
      if (withHeadings) source = withHeadings;
    }
    if (!source) source = kids[0] || null;

    console.log('Gewähltes Outline-Source-Element:', source);
    return source || null;
  }

  function extractOutline() {
    console.log('extractOutline() gestartet …');

    const sourceElement = pickOutlineSourceFromChatMessages();
    if (!sourceElement) { console.error('Kein geeignetes Outline-Element gefunden.'); return null; }

    let headings = sourceElement.querySelectorAll('h3');
    if (headings.length === 0) headings = sourceElement.querySelectorAll('h2, h4');
    console.log(`Gefundene Überschriften (h2/h3/h4): ${headings.length}`);

    if (headings.length === 0) { console.error('Keine Überschriften im gewählten Element gefunden.'); return null; }

    const outline = [];
    headings.forEach((heading) => {
      const point = { title: '', content: [] };
      const titleText = (heading.innerText || heading.textContent || '').trim();
      console.log(`Überschrift: ${titleText}`);
      point.title = titleText;

      let nextElement = heading.nextElementSibling;
      while (nextElement && nextElement.tagName !== 'UL') nextElement = nextElement.nextElementSibling;

      if (nextElement && nextElement.tagName === 'UL') {
        const processList = (ulEl) => {
          const items = [];
          ulEl.querySelectorAll(':scope > li').forEach((li) => {
            let text = (li.firstChild?.textContent || '').trim();
            const nested = li.querySelector(':scope > ul');
            if (nested) {
              const nestedItems = processList(nested);
              if (nestedItems.length) text = `${text}: ${nestedItems.join(' ')}`;
            }
            if (text) items.push(text);
          });
          return items;
        };
        point.content.push(...processList(nextElement));
      } else {
        console.warn(`Kein <ul> nach "${point.title}" gefunden.`);
      }

      if (point.content.length) outline.push(point);
    });

    console.log('Extrahierte Gliederung:', outline);
    return outline;
  }

  function createOutlineBoxes(outline, container) {
    console.log('Erstelle Outline Boxes...');
    outline.forEach((point) => {
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

      point.content.forEach((content) => {
        const paragraph = document.createElement('p');
        paragraph.innerText = content;
        box.appendChild(paragraph);
      });

      container.appendChild(box);
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

    const header = container.closest('.text-buddy-content')?.previousElementSibling;
    console.log('Header gefunden:', header);
    const generateTextButton = document.createElement('button');
    generateTextButton.innerText = '🖋️✨';
    generateTextButton.style.width = 'auto';
    generateTextButton.style.padding = '10px';
    generateTextButton.style.backgroundColor = '#d2d3db';
    generateTextButton.style.color = 'white';
    generateTextButton.style.border = '1px solid #000000';
    generateTextButton.style.borderRadius = '50px';
    generateTextButton.style.cursor = 'pointer';
    generateTextButton.style.marginLeft = '10px';
    generateTextButton.style.transition = 'background-color 0.3s';
    generateTextButton.onmouseover = () => (generateTextButton.style.backgroundColor = '#f0f0f0');
    generateTextButton.onmouseout = () => (generateTextButton.style.backgroundColor = '#ffffff');
    generateTextButton.addEventListener('click', () => {
      console.log('🖋️✨-Button zum Generieren des Textes wurde geklickt.');

      const allTextBoxes = Array.from(
        document.querySelectorAll('.text-buddy-content div[contenteditable="true"]')
      );
      const outlinePoints = allTextBoxes
        .map((box) => {
          const titleText = box.querySelector('h4') ? box.querySelector('h4').innerText.trim() : '';
          const paragraphs = box.querySelectorAll('p');
          const contentText = Array.from(paragraphs).map((p) => p.innerText.trim()).join(' ');
          return `${titleText}\n${contentText}`.trim();
        })
        .filter(Boolean);

      const outlineText = outlinePoints.join('\n\n');
      const proofkeywords =
        document.querySelector('input[placeholder="Proofkeyword eingeben"]')?.value.trim() || '';
      const mainkeyword =
        document.querySelector('input[placeholder="Hauptkeyword eingeben"]')?.value.trim() || '';
      const subkeywords =
        document.querySelector('input[placeholder="Nebenkeyword eingeben"]')?.value.trim() || '';
      const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input'))
        .map((input) => input.value.trim())
        .filter(Boolean)
        .join(', ');

      console.log('Mainkeyword:', mainkeyword);
      console.log('Proofkeywords:', proofkeywords);
      console.log('Subkeywords:', subkeywords);
      console.log('W-Fragen:', w_fragen);

      insertTextAndSend(mainkeyword, outlineText, subkeywords, proofkeywords, w_fragen, true);
      console.log('Text wurde eingefügt:', mainkeyword, outlineText, subkeywords, proofkeywords, w_fragen);

      generateTextButton.style.backgroundColor = '#cccccc';
      generateTextButton.style.cursor = 'not-allowed';
      generateTextButton.disabled = true;

      setTimeout(() => createMetaDataButton(), 3000);
    });

    if (header) {
      header.insertBefore(generateTextButton, header.querySelector('button'));
      console.log('Button zum Generieren des Textes hinzugefügt');
    }
  }

  function createLoadingIndicator(container) {
    console.log('Erstelle Loading-Indicator...');
    loadingIndicator = document.createElement('div');
    loadingIndicator.style.position = 'fixed';
    loadingIndicator.style.top = '50%';
    loadingIndicator.style.left = '50%';
    loadingIndicator.style.transform = 'translate(-50%, -50%)';
    loadingIndicator.style.zIndex = '1001';
    loadingIndicator.style.backgroundColor = '#ffffff';
    loadingIndicator.style.border = '1px solid #ddd'; // ✅ FIX
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
      }`;
    document.head.appendChild(style);
    console.log('Loading-Indicator erstellt.');
  }

  function createOverlay(button) {
    console.log('Erstelle Overlay...');
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
      console.log('W-Frage hinzufügen angeklickt.');
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
      removeWFrageButton.onclick = () => { console.log('W-Frage entfernt.'); wFrageBox.remove(); };
      wFrageBox.appendChild(removeWFrageButton);

      wFragenContainer.appendChild(wFrageBox);
    };
    wFragenContainer.appendChild(addWFrageButton);

    inputContainer.appendChild(wFragenContainer);
    overlay.appendChild(content); // content hängt schon; nur zur Klarheit
    content.appendChild(inputContainer);

    const aTextButton = document.createElement('button');
    aTextButton.innerText = 'Premium-Text';
    aTextButton.style.width = '48%';
    aTextButton.style.padding = '10px';
    aTextButton.style.backgroundColor = '#333333';
    aTextButton.style.color = 'white';
    aTextButton.style.border = 'none';
    aTextButton.style.borderRadius = '5px';
    aTextButton.style.cursor = 'pointer';
    aTextButton.style.transition = 'background-color 0.3s';
    aTextButton.onmouseover = () => (aTextButton.style.backgroundColor = '#444444');
    aTextButton.onmouseout = () => (aTextButton.style.backgroundColor = '#333333');

    const bTextButton = document.createElement('button');
    bTextButton.innerText = 'Basis-Text';
    bTextButton.style.width = '48%';
    bTextButton.style.padding = '10px';
    bTextButton.style.backgroundColor = '#555555';
    bTextButton.style.color = 'white';
    bTextButton.style.border = 'none';
    bTextButton.style.borderRadius = '5px';
    bTextButton.style.cursor = 'pointer';
    bTextButton.style.transition = 'background-color 0.3s';
    bTextButton.onmouseover = () => (bTextButton.style.backgroundColor = '#666666');
    bTextButton.onmouseout = () => (bTextButton.style.backgroundColor = '#555555');

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.appendChild(aTextButton);
    buttonContainer.appendChild(bTextButton);
    content.appendChild(buttonContainer);

    // Premium-Text: Klassen-Wait (generisch) mit 25s-Fallback
    aTextButton.addEventListener('click', async () => {
      console.log('A-Text angefordert.');
      const hauptkeyword = mainKeywordInput.value.trim();
      const nebenkeywords = subKeywordInput.value.trim();
      const proofkeywords = proofKeywordInput.value.trim();
      const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input'))
        .map((input) => input.value.trim()).filter(Boolean).join(', ');

      if (hauptkeyword) {
        insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen);
        aTextButton.style.display = 'none';
        bTextButton.style.display = 'none';
        createLoadingIndicator(content);

        const FALLBACK_MS = 25000;
        try {
          await Promise.race([
            waitForLLMByClassChange({ appearTimeoutMs: 60000, finishTimeoutMs: 180000, stableForMs: 800 }),
            new Promise((res) => setTimeout(res, FALLBACK_MS)),
          ]);
        } catch (e) {
          console.warn('[Premium-Text] Class-Wait Fehler/Timeout:', e?.message || e);
        }

        if (firstTime) {
          if (loadingIndicator) loadingIndicator.remove();
          const outline = extractOutline();
          if (outline) {
            const ctn = document.querySelector('.text-buddy-content');
            if (ctn) createOutlineBoxes(outline, ctn);
          }
          firstTime = false;
        }
      }
    });

    bTextButton.addEventListener('click', () => {
      console.log('B-Text direkt generieren.');
      const hauptkeyword = mainKeywordInput.value.trim();
      const nebenkeywords = subKeywordInput.value.trim();
      const proofkeywords = proofKeywordInput.value.trim();
      const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input'))
        .map((input) => input.value.trim()).filter(Boolean).join(', ');

      if (hauptkeyword) {
        // Template window.promptBText via outlineFlag='bText'
        insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen, 'bText');
        setTimeout(() => createMetaDataButton(), 2000);
      }
    });

    return overlay;
  }

  /* ================================
   *   Haupt-Button & Init
   * ================================ */

  function createButton() {
    console.log('Erstelle Haupt-Button für ContentBuddy...');
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
    let overlay; // wird unten befüllt
    button.onmouseover = () => (button.style.backgroundColor = '#444444');
    button.onmouseout = () => (button.style.backgroundColor = '#333333');
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

    overlay = createOverlay(button);
    // overlay wird in createOverlay bereits an body angehängt -> kein zweites append
  }

  function monitorConsoleMessages() {
    const originalConsoleLog = console.log;
    originalConsoleLog('monitorConsoleMessages() gestartet.');

    console.log = function () {
      try {
        const msg = arguments[0];
        if (typeof msg === 'string' && msg.includes('llm generation stream closed')) {
          originalConsoleLog('[monitorConsoleMessages] - Intercepted:', msg);
          if (firstTime) {
            if (loadingIndicator) loadingIndicator.remove();
            const outline = extractOutline();
            if (outline) {
              const container = document.querySelector('.text-buddy-content');
              if (container) createOutlineBoxes(outline, container);
            }
            firstTime = false;
          }
        }
      } catch (e) { /* ignore */ }
      return Function.prototype.apply.call(originalConsoleLog, console, arguments);
    };
  }

  function initializeContentBuddy() {
    console.log('🚀 initializeContentBuddy() wird ausgeführt...');

    if (initialized) { console.log('⚠️ Abbruch: initializeContentBuddy() wurde bereits aufgerufen.'); return; }
    if (document.querySelector('#contentBuddyButton')) {
      console.log('⚠️ Abbruch: ContentBuddy-Button existiert bereits.'); return;
    }

    console.log('🛠️ Erstelle ContentBuddy-Button...');
    createButton();
    monitorConsoleMessages();
    monitorResetButton();

    console.log('✅ ContentBuddy erfolgreich initialisiert.');
    initialized = true;
  }

  const observer = new MutationObserver((mutations) => {
    let changesDetected = false;
    mutations.forEach((m) => {
      if (m.type === 'childList' && m.addedNodes.length > 0) changesDetected = true;
    });

    if (changesDetected) {
      console.log('🔄 MutationObserver hat Änderungen erkannt. Starte ContentBuddy...');
      observer.disconnect();
      setTimeout(() => initializeContentBuddy(), 500);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  initializeContentBuddy();
})();
