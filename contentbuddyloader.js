// ==UserScript==
// @name     ContentBuddy Loader
// @namespace  http://tampermonkey.net/
// @version   1.6
// @description Load and execute ContentBuddy script from GitHub with selection
// @author    Alex Eberhardt
// @match    https://oggpt.ottogroup.com/*
// @grant    GM_registerMenuCommand
// @grant    GM_xmlhttpRequest
// @grant    GM_setValue
// @grant    GM_getValue
// @connect   raw.githubusercontent.com
// @run-at    document-end
// ==/UserScript==

(function() {
  'use strict';

  const options = {
    'Witt': 'https://raw.githubusercontent.com/alxebhr/contentbuddy/main/prompts/witt.js',
    'Heine': 'https://raw.githubusercontent.com/alxebhr/contentbuddy/main/prompts/heine.js',
    'Sieh-an': 'https://raw.githubusercontent.com/alxebhr/contentbuddy/main/prompts/siehan.js'
  };

  let selectedOption = GM_getValue('selectedOption', 'Witt');

  function setOption(option) {
    selectedOption = option;
    GM_setValue('selectedOption', selectedOption);
    console.log('Ausgewählte Option gesetzt auf:', selectedOption);
    location.reload();
  }

  Object.keys(options).forEach(option => {
    GM_registerMenuCommand('Wähle ' + option, function() { setOption(option); });
  });

  console.log('Aktuell ausgewählte Option:', selectedOption);

  const scriptUrl = 'https://raw.githubusercontent.com/alxebhr/contentbuddy/main/contentBuddy.js';
  const promptUrl = options[selectedOption];

  function loadPromptText(callback) {
    GM_xmlhttpRequest({
      method: "GET",
      url: promptUrl,
      onload: function(response) {
        if (response.status === 200 && response.responseText) {
          console.log('Prompt-Text erfolgreich geladen.');
          callback(response.responseText);
        } else {
          console.error('Prompt-Text konnte nicht geladen werden.');
        }
      },
      onerror: function(error) {
        console.error('Fehler beim Laden des Prompt-Textes:', error);
      }
    });
  }

  function loadMetaPromptText(callback) {
    const metaPromptUrl = 'https://raw.githubusercontent.com/alxebhr/contentbuddy/main/prompts/witt.js';
    GM_xmlhttpRequest({
      method: "GET",
      url: metaPromptUrl,
      onload: function(response) {
        if (response.status === 200 && response.responseText) {
          console.log('Meta-Prompt-Text erfolgreich geladen.');
          callback(response.responseText);
        } else {
          console.error('Meta-Prompt-Text konnte nicht geladen werden.');
        }
      },
      onerror: function(error) {
        console.error('Fehler beim Laden des Meta-Prompt-Texts:', error);
      }
    });
  }

  function loadContentBuddyScript(promptText, metaPromptText) {
    GM_xmlhttpRequest({
      method: "GET",
      url: scriptUrl,
      onload: function(response) {
        if (response.status === 200 && response.responseText) {
          console.log('ContentBuddy-Skript erfolgreich geladen.');
          const script = document.createElement('script');
          const preScript = 'window.selectedOption = ' + JSON.stringify(selectedOption) + ';\n' + 
            'window.promptMetas = ' + JSON.stringify(metaPromptText) + ';\n' + promptText + '\n';
          script.textContent = preScript + response.responseText;
          document.body.appendChild(script);
        } else {
          console.error('ContentBuddy-Skript konnte nicht geladen werden.');
        }
      },
      onerror: function(error) {
        console.error('Fehler beim Laden des ContentBuddy-Skripts:', error);
      }
    });
  }

  loadPromptText((promptText) => {
    loadMetaPromptText((metaPromptText) => {
      loadContentBuddyScript(promptText, metaPromptText);
    });
  });
})();
