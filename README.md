# Content Buddy

Tampermonkey-Erweiterung für das native ogGPT-Frontend. Der Loader lädt die
markenspezifischen Prompts und `contentBuddy.js` aus dem Branch `main` auf GitHub.
Lokale Änderungen werden deshalb erst nach Übernahme auf GitHub im Loader aktiv.

## Gliederung ab Version 1.2.0

Der Premium-Text-Auftrag wird weiterhin über den nativen Editor gesendet.
Content Buddy beobachtet den passenden `POST /api/chat/stream/` anhand des
gesendeten Prompts und bindet die Verarbeitung an dessen Request und Chat-ID.
Die Antwort wird parallel an einem geklonten Stream gelesen; der native
Fetch-Aufrufer erhält seine ursprüngliche Promise und Response.

Nur die JSON-Strings aus SSE-`token`-Events werden zusammengesetzt. Nach dem
fehlerfreien Stream-Ende wird die vollständige Markdown-Gliederung einmalig in
editierbare Boxen übertragen. Tool-, Status- und Reasoning-Events werden nicht
als Gliederungstext verwendet. HTTP-/Stream-Fehler, Abbruch und Zeitüberschreitung
zeigen eine Meldung und geben die Generierungsbuttons wieder frei.

Ab Version 1.2.1 erkennt Content Buddy auch den neuen ogGPT-Composer mit
`.chat-footer`, `textarea[aria-label="Chat prompt"]` und dem Button
`aria-label="Send"`. Die schreibgeschützte Textarea für die Größenberechnung und
die eigenen Content-Buddy-Felder werden ausgeschlossen. Die Eingabe aktualisiert
den nativen Feldwert und löst Input-Events aus, damit der Senden-Button freigegeben
wird. Der Test enthält den relevanten Composer-Ausschnitt des bereitgestellten HTML.

## Lokale Prüfung

```powershell
python scripts/check-contentbuddy.py
```

Benötigt Python und Chrome oder Edge. Ein anderer Chromium-Pfad lässt sich mit
`--browser` angeben. Die Prüfung verwendet ein eigenes temporäres Browserprofil,
das vollständige Userscript und simulierte Fetch-/XHR-Antworten. Sie greift nicht
auf einen angemeldeten ogGPT-Chat zu und ersetzt keinen Live-Test.
