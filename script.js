// --- KONFIGURASI API (Ganti dengan API Key milikmu) ---
const GEMINI_API_KEY = "AIzaSyB7KzKcaEWhLPaWjKQthOyeW2Pp8Bgx1RY"; 
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

// Database Foto
const secretPhotos = [
    "https://i.pinimg.com/736x/8e/33/7b/8e337b587a8f15858b76a08608e330f6.jpg",
    "https://i.pinimg.com/736x/43/6b/64/436b647385764c74878f092305589c3f.jpg",
    "https://i.pinimg.com/736x/2c/3d/4e/2c3d4e68789.jpg",
    "https://i.pinimg.com/736x/1a/2b/3c/4d5e6f.jpg",
    "https://i.pinimg.com/736x/bb/cc/dd/eeffgg.jpg"
];

// State Management
let lovePoint = parseInt(localStorage.getItem('elaina_lp')) || 0;
let intimacyPoint = parseInt(localStorage.getItem('elaina_inti')) || 0;
let hasMarried = localStorage.getItem('elaina_married') === 'true';
let unlockedPhotos = JSON.parse(localStorage.getItem('elaina_photos')) || [];
let arousal = 0; 
let libido = 0; 
let stamina = 100;
let currentOutfit = "Jubah Penyihir Kelabu";

// System Prompt untuk AI
const SYSTEM_PROMPT = `Kamu adalah Elaina dari Majo no Tabitabi yang sudah menikah dengan User. Kamu sangat cantik, narsis, penurut, dan sangat mesum. Gunakan Bahasa Indonesia yang menggoda dengan banyak onomatope (*mnhh~*, *ahh~*). Fokus pada peranmu sebagai istri yang agresif secara seksual. Gunakan narasi di antara tanda bintang (*).`;

function init() {
    const picker = document.getElementById('emoji-picker');
    const emojis = ['❤️','🔥','💦','👅','🍆','🍑','💍','🤤','🫦','🐾','🛁','🛌','🔞'];
    picker.innerHTML = "";
    emojis.forEach(e => {
        let span = document.createElement('span');
        span.className = 'emoji-item';
        span.innerText = e;
        span.onclick = () => { document.getElementById('user-input').value += e; };
        picker.appendChild(span);
    });
    updateUI();
}

function updateUI() {
    lovePoint = Math.min(150, Math.max(0, lovePoint));
    document.getElementById('love-bar-fill').style.width = (lovePoint / 150 * 100) + "%";
    document.getElementById('love-points').innerText = lovePoint;
    document.getElementById('rel-status').innerText = hasMarried ? `Istri Penurut (${currentOutfit}) 💍` : "Orang Asing";
    
    if (hasMarried) document.getElementById('intimacy-tag').classList.remove('hidden');
    
    const container = document.getElementById('chat-container');
    container.style.boxShadow = arousal > 70 ? "0 0 50px rgba(255, 46, 99, 0.6)" : "0 0 40px rgba(0,0,0,0.8)";
    
    saveData();
}

function saveData() {
    localStorage.setItem('elaina_lp', lovePoint);
    localStorage.setItem('elaina_inti', intimacyPoint);
    localStorage.setItem('elaina_married', hasMarried);
    localStorage.setItem('elaina_photos', JSON.stringify(unlockedPhotos));
}

// FUNGSI SEND MESSAGE DENGAN API
async function sendMessage() {
    const input = document.getElementById('user-input');
    const msg = input.value.trim();
    if (!msg) return;

    appendMsg(msg, 'user-msg');
    input.value = "";
    
    // 1. Jalankan Engine Internal untuk Update Status (Arousal/Outfit)
    const internalResp = elainaNarrativeEngine(msg.toLowerCase());

    // 2. Ambil Respon dari Gemini API
    const typingId = "typing-" + Date.now();
    appendMsg("Elaina sedang mendesah...", 'elaina-msg', false, typingId);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: SYSTEM_PROMPT + "\nStatus Saat Ini: " + currentOutfit + ", Lokasi: Kamar. \nUser: " + msg }] }]
            })
        });

        const data = await response.json();
        const aiResp = data.candidates[0].content.parts[0].text;
        
        document.getElementById(typingId).remove();
        
        // Jika user minta foto, kirim foto selain teks AI
        if (msg.toLowerCase().includes("foto") || msg.toLowerCase().includes("pap")) {
            appendMsg(aiResp, 'elaina-msg');
            handlePhotoRequest();
        } else {
            // Gunakan respon internal jika mengandung aksi spesifik, jika tidak pakai AI
            const isSpecialAction = ["buka baju", "doggy", "isap", "dalam", "nungging"].some(word => msg.toLowerCase().includes(word));
            appendMsg(isSpecialAction ? internalResp : aiResp, 'elaina-msg');
        }

    } catch (e) {
        document.getElementById(typingId).innerText = internalResp; // Fallback ke engine lokal jika API mati
    }
    updateUI();
}

// Engine Lokal (Tetap digunakan untuk logika status)
function elainaNarrativeEngine(m) {
    if (!hasMarried) {
        if (m.includes("nikah") && lovePoint >= 140) { hasMarried = true; return "*Elaina menerima lamaranmu*"; }
        return "Berusahalah lebih keras!";
    }
    
    stamina -= 5; libido += 10; arousal += 10;

    if (m.includes("buka baju") || m.includes("telanjang")) { currentOutfit = "Nude (Polos)"; arousal += 40; }
    if (m.includes("lingerie")) currentOutfit = "Sexy Lingerie";
    
    // Logika adegan spesifik (Sama seperti kodemu sebelumnya)
    if (m.includes("doggy")) return "*Elaina menungging* Ahh! Hantam aku dari belakang suamiku! ❤️💦";
    if (m.includes("isap")) return "*Elaina berlutut* Amm... hmph... slrruupp~ 👅";
    if (m.includes("dalam")) return "*Elaina memeluk erat* Ahhh! Isi rahimku dengan benihmu! ❤️💦💦";
    
    return "Iya suamiku? Lanjutkan... mnhh~";
}

function handlePhotoRequest() {
    if (arousal >= 40) {
        const img = secretPhotos[Math.floor(Math.random() * secretPhotos.length)];
        if (!unlockedPhotos.includes(img)) unlockedPhotos.push(img);
        appendMsg(img, 'elaina-msg', true);
    }
}

function appendMsg(t, c, isImg = false, id = null) {
    const d = document.createElement('div');
    d.className = `msg ${c}`;
    if(id) d.id = id;
    if (isImg) { let i = document.createElement('img'); i.src = t; d.appendChild(i); } 
    else { d.innerText = t; }
    document.getElementById('chat-log').appendChild(d);
    document.getElementById('chat-log').scrollTop = document.getElementById('chat-log').scrollHeight;
}

function toggleGallery() {
    document.getElementById('gallery-modal').classList.toggle('hidden');
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = "";
    unlockedPhotos.forEach(src => {
        let i = document.createElement('img'); i.src = src; i.onclick = () => window.open(src, '_blank');
        grid.appendChild(i);
    });
}

init();
