const translations = {
    en: {
        title: "Ocr2mp3",
        description: "Queries YouTube for OCR output(s) and downloads as MP3(s)",
        outputLabel: "OCR Output or YT queries",
        logLabel: "yt-dlp Output",
        flag: "🇬🇧"
    },
    cz: {
        title: "Ocr2mp3",
        description: "Vyhledá výstup(y) OCR na YouTube a stáhne jako soubor(y) MP3",
        outputLabel: "OCR Výstup k vyhledání na YouTube",
        logLabel: "Výstup stahování (yt-dlp)",
        flag: "🇨🇿"
    }
};

let currentLang = 'en';

const langToggle = document.getElementById('langToggle');

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'cz' : 'en';

    const t = translations[currentLang];
    document.getElementById('title').textContent = t.title;
    document.getElementById('description').textContent = t.description;
    document.getElementById('outputLabel').textContent = t.outputLabel;
    document.getElementById('logLabel').textContent = t.logLabel;

    langToggle.textContent = t.flag;
});