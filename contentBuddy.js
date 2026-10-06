// ==UserScript==
// @name         ContentBuddy – robust send & outline flow
// @namespace    contentbuddy.witt
// @version      1.2.1
// @description  Fügt Prompts ein, sendet sie zuverlässig und verhindert Re-Insert nach dem Absenden. Erstellt Outline-UI und Meta-Button.
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  if (window.__cbRuntimeInstalled) return;
  window.__cbRuntimeInstalled = true;

  console.log('ContentBuddy script is running');

  /* ==========================================================
   *   Globale Guards / Signatur-Tools (gegen Re-Insert)
   * ========================================================== */
  let isSending = false;   // verhindert Inserts während Send
  let sendAttempt = 0;
  let lastInsertError = '';
  const sentChatPrompts = new Map();

  const normalizeText = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const sigOf = (s) => {
    const t = normalizeText(s);
    let h = 0;
    for (let i = 0; i < t.length; i++) h = ((h << 5) - h) + t.charCodeAt(i) | 0;
    return String(h) + ':' + t.length;
  };

  /* ==========================================================
   *   Netzwerk-Sniffer: erkennt echte Chat-Requests
   * ========================================================== */
  function isChatStreamRequest(input, options = {}) {
    try {
      const url = new URL(input instanceof Request ? input.url : String(input), location.href);
      const method = String(options.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
      return method === 'POST' && /\/api\/chat\/stream\/?$/.test(url.pathname);
    } catch { return false; }
  }

  async function readChatStreamPayload(input, options = {}) {
    let body = options.body;
    if (body === undefined && input instanceof Request) body = await input.clone().text();
    if (typeof body !== 'string') return null;
    try { return JSON.parse(body); } catch { return null; }
  }

  function getChatStreamPrompt(payload) {
    const parts = payload?.conversation?.message;
    if (!Array.isArray(parts)) return '';
    return parts.filter((part) => part && part.type === 'text' && typeof part.content === 'string')
      .map((part) => part.content).join('\n');
  }

  function recordChatStreamPrompt(payload, sequence) {
    const prompt = getChatStreamPrompt(payload);
    if (!prompt) return;
    sentChatPrompts.set(sigOf(prompt), sequence);
    if (sentChatPrompts.size > 20) sentChatPrompts.delete(sentChatPrompts.keys().next().value);
  }

  function claimOutlineRequest(job, payload) {
    if (!job || activeOutlineJob !== job || job.started || !payload?.chat_id) return false;
    const prompt = getChatStreamPrompt(payload);
    if (normalizeText(prompt) !== job.prompt) return false;

    job.started = true;
    job.chatId = String(payload.chat_id);
    clearTimeout(job.timeout);
    job.timeout = setTimeout(() => failOutlineExtraction(job,
      'Die Gliederung wurde nicht rechtzeitig abgeschlossen. Bitte prüfe den Chat und versuche es erneut.'), 300000);
    return true;
  }

  function cancelOutlineReader(reader) {
    // Ein geklonter Stream-Zweig darf den nativen Leser nicht blockieren.
    if (reader) { try { reader.cancel().catch(() => {}); } catch {} }
  }

  (function setupCbNetSniffer() {
    window.__cbChatRequestSequence = 0;
    const originalFetch = window.fetch;
    window.fetch = function(input, options = {}) {
      const isStream = isChatStreamRequest(input, options);
      const job = isStream ? activeOutlineJob : null;
      const sequence = isStream ? ++window.__cbChatRequestSequence : 0;
      const matches = isStream ? readChatStreamPayload(input, options).then((payload) => {
        recordChatStreamPrompt(payload, sequence);
        return claimOutlineRequest(job, payload);
      }, () => false) : null;

      let result;
      try { result = Reflect.apply(originalFetch, this, arguments); }
      catch (error) {
        if (job && matches) matches.then((matched) => {
          if (matched) failOutlineExtraction(job, 'Die Gliederung konnte nicht angefordert werden. Bitte versuche es erneut.');
        });
        throw error;
      }

      if (job && matches) Promise.resolve(result).then((response) => {
        // Vor dem nativen Consumer klonen; niemals auf den Antworttext warten.
        let clone;
        try { clone = response.clone(); }
        catch {
          matches.then((matched) => {
            if (matched) failOutlineExtraction(job, 'Die Chat-Antwort konnte nicht gelesen werden. Bitte lade ogGPT neu.');
          });
          return;
        }
        matches.then((matched) => {
          if (matched && activeOutlineJob === job) observeOutlineResponse(clone, job);
          else if (clone.body) cancelOutlineReader(clone.body.getReader());
        });
      }, () => matches.then((matched) => {
        if (matched) failOutlineExtraction(job, 'Die Generierung wurde abgebrochen oder die Verbindung unterbrochen. Bitte versuche es erneut.');
      }));
      return result;
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this.__cbIsChatStream = isChatStreamRequest(url, { method });
      return originalOpen.call(this, method, url, ...rest);
    };
    XMLHttpRequest.prototype.send = function(body) {
      let watchedJob = null;
      if (this.__cbIsChatStream) {
        window.__cbChatRequestSequence += 1;
        let payload;
        try { payload = JSON.parse(body); } catch {}
        recordChatStreamPrompt(payload, window.__cbChatRequestSequence);
        const job = activeOutlineJob;
        if (claimOutlineRequest(job, payload)) {
          watchedJob = job;
          const finish = () => {
            if (activeOutlineJob !== job) return;
            if (this.status < 200 || this.status >= 300) {
              failOutlineExtraction(job, 'Die Generierung ist fehlgeschlagen oder wurde abgebrochen. Bitte versuche es erneut.');
              return;
            }
            try {
              const response = new Response(this.responseText, {
                status: this.status, headers: { 'Content-Type': this.getResponseHeader('Content-Type') || '' },
              });
              observeOutlineResponse(response, job);
            } catch {
              failOutlineExtraction(job, 'Die Chat-Antwort konnte nicht gelesen werden. Bitte lade ogGPT neu.');
            }
          };
          this.addEventListener('loadend', finish, { once: true });
        }
      }
      try { return originalSend.apply(this, arguments); }
      catch (error) {
        if (watchedJob) {
          failOutlineExtraction(watchedJob, 'Die Gliederung konnte nicht angefordert werden. Bitte versuche es erneut.');
        }
        throw error;
      }
    };
  })();

  /* ==========================================================
   *   NUR nach erkanntem Request räumen (Fix)
   * ========================================================== */
  function postSendCleanup(editorEl, sig, { windowMs = 3000, requestSequence = 0, attempt = sendAttempt } = {}) {
    if (window.CB_DISABLE_CLEANUP) { isSending = false; return; }

    const deadline = Date.now() + windowMs;
    let cleared = false;
    // requestAnimationFrame pausiert in Hintergrund-Tabs; der Guard muss trotzdem enden.
    setTimeout(() => { if (attempt === sendAttempt) isSending = false; }, windowMs);

    const step = () => {
      if (attempt !== sendAttempt) return;
      if (cleared || Date.now() > deadline) { isSending = false; return; }

      // Erst räumen, wenn wirklich ein Chat-Request abging
      const requestHappened = (sentChatPrompts.get(sig) || 0) > requestSequence;
      if (!requestHappened) {
        requestAnimationFrame(step);
        return;
      }

      const cur = normalizeText(getEditorText(editorEl));
      if (cur && sigOf(cur) === sig) {
        if (isValueEditor(editorEl)) setEditorValue(editorEl, '');
        else editorEl.replaceChildren();
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

  function isValueEditor(el) {
    return el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement;
  }

  function getEditorText(el) {
    return isValueEditor(el) ? el.value : (el.innerText || el.textContent || '');
  }

  function isVisibleNativeElement(el) {
    if (!el?.isConnected || el.closest('#contentBuddyOverlay, .text-buddy-content, [hidden], [inert], [aria-hidden="true"]')) return false;
    const style = getComputedStyle(el);
    return el.getClientRects().length > 0 && style.visibility !== 'hidden' && style.visibility !== 'collapse';
  }

  // Das native UI kann textarea, Rich-Text-Editor oder plaintext-only verwenden.
  function getEditorEl() {
    const selectors = [
      '.chat-footer .prompt-input textarea[aria-label="Chat prompt"]',
      '.chat-footer textarea, .chat-footer [contenteditable]',
      '#editor',
      '#chat-footer textarea, #chat-footer [contenteditable], #chat-footer input[role="textbox"]',
      '[data-testid="chat-input"] textarea, textarea[data-testid="chat-input"], [data-testid="chat-input"][contenteditable]',
      '[data-testid="chat-composer"] textarea, [data-testid="chat-composer"] [contenteditable]',
      '.ProseMirror[contenteditable], .tiptap[contenteditable]',
      'textarea, [role="textbox"][contenteditable], input[role="textbox"], [contenteditable]',
    ];
    for (const selector of selectors) {
      const candidate = Array.from(document.querySelectorAll(selector)).find((el) => {
        if (!isVisibleNativeElement(el) || el.disabled || el.readOnly || el.getAttribute('aria-disabled') === 'true') return false;
        if (el instanceof HTMLInputElement && el.type !== 'text') return false;
        if (!isValueEditor(el) && !el.isContentEditable) return false;
        const label = [el.getAttribute('placeholder'), el.getAttribute('aria-label'), el.getAttribute('type')].join(' ');
        return !/search|suche|suchen|filter/i.test(label);
      });
      if (candidate) return candidate;
    }
    return null;
  }

  function setEditorValue(el, text) {
    if (el instanceof HTMLInputElement) text = text.replace(/\r\n?|\n/g, ' ');
    const prototype = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    if (setter) setter.call(el, text);
    else el.value = text;
  }

  // Als Text einfügen; die nativen Input-Events aktualisieren den Frontend-State.
  function setContentEditable(el, text) {
    if (!el) return false;
    if (isSending) {
      lastInsertError = 'Eine Nachricht wird gerade gesendet. Bitte warte kurz und versuche es erneut.';
      console.warn('[ContentBuddy] ' + lastInsertError);
      return false;
    }

    el.focus();

    if (isValueEditor(el)) {
      setEditorValue(el, text);
      try { el.setSelectionRange(text.length, text.length); } catch {}
    } else {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
      // Bevorzugt die native Editieroperation, damit Rich-Text-Editoren sie mitbekommen.
      try { document.execCommand('insertText', false, text); } catch {}
      if (normalizeText(getEditorText(el)) !== normalizeText(text)) {
        range.selectNodeContents(el);
        range.deleteContents();
        const fragment = document.createDocumentFragment();
        text.split('\n').forEach((line, index) => {
          if (index) fragment.appendChild(document.createElement('br'));
          fragment.appendChild(document.createTextNode(line));
        });
        range.insertNode(fragment);
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    try {
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste', data: text }));
    } catch {
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Unidentified' }));
    if (normalizeText(getEditorText(el)) !== normalizeText(text)) {
      lastInsertError = 'Der Prompt wurde vom Chat-Eingabefeld nicht übernommen. Bitte lade ogGPT neu und versuche es erneut.';
      return false;
    }
    return true;
  }

  // Den Senden-Button beim gefundenen Editor suchen, auch ohne alten Footer.
  function findSendButton(editorEl = getEditorEl()) {
    const scopes = [];
    const composer = editorEl?.closest('.prompt-input, .chat-prompt-input, [data-testid="chat-composer"], form');
    if (composer) scopes.push(composer);
    const footer = editorEl?.closest('#chat-footer, .chat-footer');
    if (footer && editorEl && footer.contains(editorEl)) scopes.push(footer);
    for (let el = editorEl?.parentElement; el && el !== document.body && scopes.length < 6; el = el.parentElement) {
      scopes.push(el);
    }
    for (const scope of scopes) {
      const buttons = Array.from(scope.querySelectorAll('button')).filter(isVisibleNativeElement);
      const send = buttons.find((button) => {
        const label = [button.textContent, button.getAttribute('aria-label'), button.getAttribute('title')].join(' ');
        return /senden|send|abschicken|absenden/i.test(label) || button.querySelector('.mdi-send, [data-testid="send-icon"]');
      });
      if (send) return send;
      const submit = buttons.find((button) => button.getAttribute('type') === 'submit');
      if (submit) return submit;
    }
    return null;
  }

  // Enter-Fallback, wenn Button-Klick nicht verdrahtet ist
  function sendViaEnter(editorEl){
    if (!editorEl) return false;
    let ok = false;
    ['keydown','keypress','keyup'].forEach((type)=>{
      const evt = new KeyboardEvent(type, {bubbles:true, cancelable:true, key:'Enter', code:'Enter'});
      const res = editorEl.dispatchEvent(evt);
      ok = ok || res;
    });
    return ok;
  }

  // Senden mit Klick + Enter-Fallback + Request-Erkennung
  function sendMessage(attempt, sig) {
    const btn = findSendButton();
    if (btn?.disabled || btn?.getAttribute('aria-disabled') === 'true') return false;
    const requestSequence = window.__cbChatRequestSequence;
    isSending = true;

    // 1) Versuche Button-Klick
    if (btn) {
      btn.click();
    } else {
      console.warn('Send-Button nicht gefunden – versuche Enter auf dem Editor.');
    }

    // 2) Prüfe kurz, ob ein Chat-POST losging; wenn nicht → Enter-Fallback
    const editorEl = getEditorEl();
    let triedEnter = false;

    const started = () => (sentChatPrompts.get(sig) || 0) > requestSequence;
    const t0 = Date.now();

    function decideNext(){
      if (attempt !== sendAttempt) return;
      if (started()) return true; // Request erkannt
      if (!triedEnter) {
        if (btn?.disabled) return;
        triedEnter = true;
        sendViaEnter(editorEl);
        setTimeout(decideNext, 300);
        return;
      }
      // nach Button & Enter immer noch kein Request → melden
      if (!started() && Date.now() - t0 > 1200) {
        console.warn('Kein Chat-Request erkannt (Button & Enter wirkten nicht).');
      }
    }
    setTimeout(decideNext, 1000);
    return true;
  }

  /* ================================
   *   State / Flags
   * ================================ */
  let loadingIndicator;
  let firstTime = true;
  let initialized = false;
  let activeOutlineJob = null;
  let outlineActionButtons = [];

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
    lastInsertError = '';
    // Template wählen
    let text =
      outlineFlag === 'bText'    ? window.promptBText :
      outlineFlag === 'metaText' ? window.promptMetas :
      outlineFlag === true       ? window.promptTextOutline :
                                   window.promptTextDefault;

    if (!text) {
      lastInsertError = 'Die Prompt-Vorlage fehlt. Bitte starte Content Buddy über den Loader und lade die Seite neu.';
      console.error('Prompt-Template fehlt (window.prompt*).');
      return false;
    }

    // Platzhalter ersetzen
    text = text
      .replace(/\$\{hauptkeyword\}/g, hauptkeyword || '')
      .replace(/\$\{keyword\}/g,      keyword || '')
      .replace(/\$\{nebenkeywords\}/g, nebenkeywords || '')
      .replace(/\$\{proofkeywords\}/g, proofkeywords || '')
      .replace(/\$\{w_fragen\}/g,     w_fragen || '');

    console.log('Text, der eingefügt werden soll:', text);

    const editorEl = getEditorEl();
    if (!editorEl) {
      lastInsertError = 'Das Chat-Eingabefeld wurde nicht gefunden. Bitte öffne einen normalen ogGPT-Chat und versuche es erneut.';
      console.error('[ContentBuddy] ' + lastInsertError);
      return false;
    }

    if (!setContentEditable(editorEl, text)) return false;

    if (autoSend) {
      const job = firstTime && outlineFlag === '' ? startOutlineExtraction(text) : null;
      const sig = sigOf(text);
      const attempt = ++sendAttempt;
      isSending = true;
      setTimeout(() => {
        if (attempt !== sendAttempt) return;
        if (job && activeOutlineJob !== job) return;
        const requestSequence = window.__cbChatRequestSequence;
        if (sendMessage(attempt, sig)) postSendCleanup(editorEl, sig, { windowMs: 3000, requestSequence, attempt });
        else if (job) failOutlineExtraction(job, 'Der Chat ist noch beschäftigt. Bitte warte auf die laufende Antwort und versuche es erneut.');
        else isSending = false;
      }, 50);
    }
    return true;
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

  function stopOutlineExtraction() {
    const job = activeOutlineJob;
    activeOutlineJob = null;
    if (!job) return;
    clearTimeout(job.timeout);
    cancelOutlineReader(job.reader);
  }

  function showOutlineError(message) {
    if (loadingIndicator) { loadingIndicator.remove(); loadingIndicator = null; }
    const container = document.querySelector('.text-buddy-content');
    if (container) {
      container.querySelector('.cb-outline-error')?.remove();
      const error = document.createElement('div');
      error.className = 'cb-outline-error';
      error.setAttribute('role', 'alert');
      error.textContent = message;
      error.style.padding = '12px';
      error.style.marginBottom = '10px';
      error.style.backgroundColor = '#fff0f0';
      error.style.color = '#8a1c1c';
      container.appendChild(error);
    }
    outlineActionButtons.forEach((button) => { button.style.display = ''; });
  }

  function failOutlineExtraction(job, message) {
    if (activeOutlineJob !== job) return;
    stopOutlineExtraction();
    isSending = false;
    showOutlineError(message);
    console.warn('[ContentBuddy] ' + message);
  }

  function startOutlineExtraction(prompt) {
    stopOutlineExtraction();
    document.querySelector('.cb-outline-error')?.remove();
    const job = { prompt: normalizeText(prompt), started: false, chatId: null, reader: null, timeout: null };
    activeOutlineJob = job;
    job.timeout = setTimeout(() => failOutlineExtraction(job,
      'Es wurde keine passende Chat-Antwort gestartet. Bitte prüfe, ob der Prompt gesendet wurde, und versuche es erneut.'), 15000);
    return job;
  }

  function plainMarkdown(text) {
    return normalizeText(text
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\\([\\`*_{}\[\]()#+.!>\-])/g, '$1'));
  }

  function extractOutlineFromMarkdown(markdown) {
    let text = String(markdown || '').replace(/\r\n?/g, '\n').trim();
    // Manche Modelle liefern die gesamte Gliederung in einem Markdown-Codeblock.
    const fenced = /^(`{3,}|~{3,})(?:markdown|md)?\s*\n([\s\S]*?)\n\1\s*$/i.exec(text);
    if (fenced) text = fenced[2];
    const lines = text.split('\n');
    const outline = [];
    let point = null, paragraphBreak = true, codeFence = null;

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      const fence = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
      if (fence) {
        if (!codeFence) codeFence = fence[1];
        else if (fence[1][0] === codeFence[0] && fence[1].length >= codeFence.length) codeFence = null;
        continue;
      }
      if (codeFence) continue;
      let heading = /^\s{0,3}#{1,6}[ \t]+(.+)$/.exec(line)?.[1]?.replace(/[ \t]+#+[ \t]*$/, '').trim();
      if (!heading && line.trim() && !/^\s*(?:[-+*]|\d+[.)])\s+/.test(line) &&
        /^\s{0,3}(?:=+|-+)\s*$/.test(lines[index + 1] || '')) {
        heading = line.trim();
        index += 1;
      }
      if (!heading) heading = /^\s*(?:\d+[.)]\s+)?\*\*(.+?)\*\*\s*$/.exec(line)?.[1];
      if (heading) {
        point = { title: plainMarkdown(heading), content: [] };
        outline.push(point);
        paragraphBreak = true;
        continue;
      }
      if (!line.trim()) { paragraphBreak = true; continue; }
      if (!point || /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) continue;
      const bullet = /^\s*(?:[-+*]|\d+[.)])\s+(.+)$/.exec(line);
      const content = plainMarkdown(bullet ? bullet[1] : line.trim());
      if (!content) continue;
      if (bullet || paragraphBreak || !point.content.length) point.content.push(content);
      else point.content[point.content.length - 1] += ' ' + content;
      paragraphBreak = false;
    }
    return outline.filter((item) => item.title && item.content.length);
  }

  function finishOutlineExtraction(job, markdown) {
    if (activeOutlineJob !== job || !firstTime) return;
    const outline = extractOutlineFromMarkdown(markdown);
    if (!outline.length) {
      failOutlineExtraction(job, 'Die Antwort enthält keine lesbare Gliederung. Bitte prüfe die Antwort im Chat und versuche es erneut.');
      return;
    }
    const container = document.querySelector('.text-buddy-content');
    if (!container) {
      failOutlineExtraction(job, 'Das Content-Buddy-Fenster wurde nicht gefunden. Bitte lade die Seite neu.');
      return;
    }
    createOutlineBoxes(outline, container);
    firstTime = false;
    stopOutlineExtraction();
    if (loadingIndicator) { loadingIndicator.remove(); loadingIndicator = null; }
    console.log('[ContentBuddy] Vollständige Gliederung aus dem Chat-Stream übernommen.', { points: outline.length });
  }

  async function observeOutlineResponse(response, job) {
    let reader = null, reachedEnd = false;
    try {
      if (!response.ok) throw new Error('Die Generierung ist fehlgeschlagen (HTTP ' + response.status + '). Bitte versuche es erneut.');
      if (!response.body || !/text\/event-stream/i.test(response.headers.get('Content-Type') || '')) {
        throw new Error('Die Chat-Antwort hat ein unerwartetes Format. Bitte lade ogGPT neu.');
      }
      if (activeOutlineJob !== job) return;
      reader = response.body.getReader();
      job.reader = reader;
      const decoder = new TextDecoder();
      let buffer = '', markdown = '', bytes = 0;
      const failed = (value) => /(^|[._-])(error|failed|failure|cancelled|canceled|aborted)([._-]|$)/i.test(String(value || ''));
      const processFrame = (frame) => {
        let event = 'message';
        const data = [];
        frame.split(/\r\n|\n|\r/).forEach((line) => {
          if (line.startsWith('event:')) event = line.slice(6).trim().toLowerCase();
          if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''));
        });
        if (!data.length) return;
        const raw = data.join('\n');
        if (raw.trim() === '[DONE]') return;
        let payload;
        try { payload = JSON.parse(raw); }
        catch {
          if (event === 'token' || failed(event)) throw new Error('Die Chat-Antwort konnte nicht vollständig verarbeitet werden. Bitte versuche es erneut.');
          return;
        }
        if (failed(event) || (event !== 'token' && payload && typeof payload === 'object' &&
          (payload.error || failed(payload.kind) || failed(payload.type) || failed(payload.status)))) {
          throw new Error('Die Generierung ist fehlgeschlagen oder wurde abgebrochen. Bitte versuche es erneut.');
        }
        // Tool-, Status- und Reasoning-Events gehören nicht zum Antworttext.
        if (event !== 'token') return;
        if (typeof payload !== 'string') throw new Error('Die Chat-Antwort hat ein unerwartetes Textformat. Bitte versuche es erneut.');
        markdown += payload;
      };

      while (activeOutlineJob === job) {
        const { done, value } = await reader.read();
        if (activeOutlineJob !== job) return;
        bytes += value?.byteLength || 0;
        if (bytes > 2 * 1024 * 1024) throw new Error('Die Chat-Antwort ist zu groß. Bitte versuche es mit einer kürzeren Gliederung erneut.');
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        let separator;
        while ((separator = /\r\n\r\n|\n\n|\r\r/.exec(buffer))) {
          processFrame(buffer.slice(0, separator.index));
          buffer = buffer.slice(separator.index + separator[0].length);
        }
        if (done) {
          if (buffer.trim()) processFrame(buffer);
          reachedEnd = true;
          job.reader = null;
          finishOutlineExtraction(job, markdown);
          break;
        }
      }
    } catch (error) {
      const message = error.name === 'AbortError' || error instanceof TypeError
        ? 'Die Generierung wurde abgebrochen oder die Verbindung unterbrochen. Bitte versuche es erneut.'
        : error.message;
      failOutlineExtraction(job, message);
    } finally {
      if (job.reader === reader) job.reader = null;
      if (reader) {
        if (!reachedEnd) cancelOutlineReader(reader);
        try { reader.releaseLock(); } catch {}
      }
    }
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
      }`;
    document.head.appendChild(style);
    console.log('Loading-Indicator erstellt.');
  }

  function createOverlay(button) {
    console.log('Erstelle Overlay...');
    const overlay = document.createElement('div');
    overlay.id = 'contentBuddyOverlay';
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

    outlineActionButtons = [aTextButton, bTextButton];

    // Premium-Text: Den passenden BFF-Stream bis zum Abschluss lesen.
    aTextButton.addEventListener('click', () => {
      console.log('A-Text angefordert.');
      const hauptkeyword = mainKeywordInput.value.trim();
      const nebenkeywords = subKeywordInput.value.trim();
      const proofkeywords = proofKeywordInput.value.trim();
      const w_fragen = Array.from(document.querySelectorAll('.w-frage-box input'))
        .map((input) => input.value.trim()).filter(Boolean).join(', ');

      if (hauptkeyword) {
        createLoadingIndicator(content);
        if (insertTextAndSend(hauptkeyword, hauptkeyword, nebenkeywords, proofkeywords, w_fragen)) {
          aTextButton.style.display = 'none';
          bTextButton.style.display = 'none';
        } else {
          showOutlineError(lastInsertError || 'Der Prompt konnte nicht eingefügt werden. Bitte lade ogGPT neu und versuche es erneut.');
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

  function initializeContentBuddy() {
    console.log('🚀 initializeContentBuddy() wird ausgeführt...');

    if (initialized) { console.log('⚠️ Abbruch: initializeContentBuddy() wurde bereits aufgerufen.'); return; }
    if (document.querySelector('#contentBuddyButton')) {
      console.log('⚠️ Abbruch: ContentBuddy-Button existiert bereits.'); return; }
    console.log('🛠️ Erstelle ContentBuddy-Button...');
    createButton();
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
