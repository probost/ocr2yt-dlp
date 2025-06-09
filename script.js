const imageInput = document.getElementById('imageInput');
const output = document.getElementById('output');
const log = document.getElementById('log');
const downloadBtn = document.getElementById('downloadBtn');

imageInput.addEventListener('change', async () => {
    const file = imageInput.files[0];
    if (!file) return;

    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    output.value = text;
});

downloadBtn.addEventListener('click', async () => {
    const lines = output.value.split('\n').filter(Boolean);

    for (const line of lines) {
        log.value += `\n[${line}] Searching and downloading...\n`;
        log.scrollTop = log.scrollHeight;
        const response = await fetch('/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: line })
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${line}.mp3`;
            a.click();
            window.URL.revokeObjectURL(url);
            log.value += `\n[${line}] Response OK \n`;
            log.scrollTop = log.scrollHeight;

        } else {
            const errorText = await response.text();
            log.value += `Error for "${line}": ${errorText}\n`;
            log.scrollTop = log.scrollHeight;
        }
    }
});