// ==UserScript==
// @name         ContentBuddy Loader
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Load and execute ContentBuddy script from GitHub with selection
// @author       Alex Eberhardt
// @match        https://oggpt.ottogroup.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      raw.githubusercontent.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Verfügbare Optionen mit entsprechenden Prompt-URLs
    const options = {
        'Witt': 'https://raw.githubusercontent.com/alxebhr/contentbuddy/main/prompts/witt.js',
        'Heine': 'https://raw.githubusercontent.com/alxebhr/contentbuddy/main/prompts/heine.js',
        'Sieh-an': 'https://raw.githubusercontent.com/alxebhr/contentbuddy/main/prompts/siehan.js'
    };

    // Aktuell ausgewählte Option abrufen oder 'Witt' als Standard setzen
    let selectedOption = GM_getValue('selectedOption', 'Witt');

    // Funktion zum Setzen der ausgewählten Option
    function setOption(option) {
        selectedOption = option;
        GM_setValue('selectedOption', selectedOption);
        console.log('Ausgewählte Option gesetzt auf:', selectedOption);
        location.reload(); // Seite neu laden, um die Änderung anzuwenden
    }

    // Menübefehle registrieren
    Object.keys(options).forEach(option => {
        GM_registerMenuCommand('Wähle ' + option, function() { setOption(option); });
    });

    console.log('Aktuell ausgewählte Option:', selectedOption);

    // URL des contentBuddy.js Skripts
    const scriptUrl = 'https://raw.githubusercontent.com/alxebhr/contentbuddy/main/contentBuddyTest.js';

    // URL des Prompt-Textes basierend auf der ausgewählten Option
    const promptUrl = options[selectedOption];

    // Funktion zum Laden des Prompt-Textes
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

    // Funktion zum Laden des contentBuddy.js Skripts
    function loadContentBuddyScript(promptText) {
        GM_xmlhttpRequest({
            method: "GET",
            url: scriptUrl,
            onload: function(response) {
                if (response.status === 200 && response.responseText) {
                    console.log('ContentBuddy-Skript erfolgreich geladen.');
                    // Skript in die Seite einfügen, um es im Seitenkontext auszuführen
                    const script = document.createElement('script');
                    // Füge die ausgewählte Option und den Prompt-Text dem Skript hinzu
                    const preScript = 'window.selectedOption = ' + JSON.stringify(selectedOption) + ';\n' + promptText + '\n';
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

    // Zuerst den Prompt-Text laden, dann das contentBuddy.js Skript
    loadPromptText(loadContentBuddyScript);

})();
