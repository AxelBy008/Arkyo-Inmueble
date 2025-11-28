// Traductor de Google (movido desde el HTML)
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'es',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        includedLanguages: 'es,en,fr,it,de,ar'  // Limita idiomas para reducir tamaño
    }, 'google_translate_element');
}

// Cargar el script de Google Translate dinámicamente
const script = document.createElement('script');
script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
document.head.appendChild(script);

// JavaScript para el botón de modo lectura
const btnModoLectura = document.getElementById('modo-lectura-btn');
const body = document.body;

btnModoLectura.addEventListener('click', () => {
    body.classList.toggle('modo-lectura');
    btnModoLectura.textContent = body.classList.contains('modo-lectura') ? 'Desactivar Modo Lectura' : 'Modo Lectura';
});

// =========================================================
// === PARTICULAS CON UN SOLO VIDEO (GIF ANIMADO) CAYENDO ===
// =========================================================

const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');

// --- CONFIGURACIÓN ---
const NUM_PARTICULAS = 100;
const TAMAÑO_PARTICULA = 130;
const RADIO_REPULSION = 90;
const FUERZA_REPULSION = 7;

// === CARGAR EL VIDEO (GIF convertido a .webm) ===
const VIDEO = document.createElement("video");
VIDEO.src = "cartoon.webm"; // <--- reemplaza por tu archivo convertido
VIDEO.loop = true;
VIDEO.muted = true;
VIDEO.play(); // necesario para que funcione en canvas

// Mouse
let mouse = { x: null, y: null };

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Ajustar canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ---------------------------------------------------------
// Clase Particula (todas usan el mismo video)
// ---------------------------------------------------------
class Particula {
    constructor(x, y, tamaño) {
        this.x = x;
        this.y = y;
        this.tamaño = tamaño;
        this.viva = true; // Nueva propiedad para marcar si la partícula sigue activa

        this.velocidadY = Math.random() * 0.6 + 0.3;
        this.velocidadX = (Math.random() - 0.5) * 0.4;
    }

    actualizar() {
        if (!this.viva) return; // Si no está viva, no actualizar

        this.y += this.velocidadY;
        this.x += this.velocidadX;

        if (mouse.x !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia < RADIO_REPULSION) {
                const fuerza = FUERZA_REPULSION / distancia;
                this.x += dx * fuerza;
                this.y += dy * fuerza;
            }
        }

        if (this.y > canvas.height + 50 || this.x < -60 || this.x > canvas.width + 60) {
            this.viva = false; // Marcar como no viva en lugar de reiniciar
        }
    }

    dibujar() {
        if (this.viva && VIDEO.readyState >= 2) { // Verificar que el video esté listo para dibujar
            ctx.drawImage(VIDEO, this.x, this.y, this.tamaño, this.tamaño);
        }
    }
}

// ---------------------------------------------------------
let particulas = [];

// Función para crear partículas cayendo desde arriba
function crearParticulasDesdeArriba() {
    for (let i = 0; i < NUM_PARTICULAS; i++) {
        const x = Math.random() * canvas.width; // Posición x aleatoria
        const y = -TAMAÑO_PARTICULA; // Empezar desde arriba, fuera del canvas
        particulas.push(new Particula(x, y, TAMAÑO_PARTICULA));
    }
}

// Event listener para el botón (nota: en el HTML no veo un botón con id="botonCaer", así que esto fallará si no lo agregas)
const botonCaer = document.getElementById('botonCaer');
botonCaer.addEventListener('click', crearParticulasDesdeArriba);

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Filtrar solo las partículas vivas (optimización)
    particulas = particulas.filter(p => p.viva);

    particulas.forEach(p => {
        p.actualizar();
        p.dibujar();
    });

    requestAnimationFrame(animar);
}

// INICIO
animar(); // Solo iniciar la animación, sin crear partículas inicialmente

/* Reconocimiento de voz */
