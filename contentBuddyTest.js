function extractOutline() {
    console.log("extractOutline() wurde aufgerufen. Versuche die Gliederung zu extrahieren...");
    const elements = document.querySelectorAll('div[data-v-1780e672].v-col-md-10.v-col-12.px-0.pt-0.content');
    console.log(`Gefundene Elemente data-v-1780e672: ${elements.length}`);

    let sourceElement;
    // Auswahl des richtigen Elements
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

    // Verarbeitung der Überschriften
    headings.forEach((heading, index) => {
        const point = { title: '', content: [] };
        point.title = heading.innerText.trim();
        // Hier wird der Inhalt unter der Überschrift verarbeitet
        // ...
        outline.push(point);
    });

    console.log("Extrahierte Gliederung:", outline);
    return outline;
}
