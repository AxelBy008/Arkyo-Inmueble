const RECONOCIMIENTOVOZ = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!RECONOCIMIENTOVOZ) {
    alert('Tu navegador no soporta el reconocimiento de voz');
}

const recognition = new RECONOCIMIENTOVOZ();
recognition.lang = 'es-ES';
recognition.interimResults = true;
recognition.continuous = true;

const transcriptionElement = document.getElementById('transcription');
const startBtn = document.getElementById('start-btn');

let silenceTimer = null;
let isListening = false;

startBtn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
        return;
    }

    transcriptionElement.textContent = " Escuchando...";
    isListening = true;
    recognition.start();
});

recognition.addEventListener('result', (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
    }
    transcriptionElement.textContent = transcript.trim();

    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
        recognition.stop();
    }, 2000);
});

recognition.addEventListener('end', () => {
    clearTimeout(silenceTimer);
    isListening = false;
    transcriptionElement.textContent += ' (Reconocimiento terminado)';
});