document.addEventListener("DOMContentLoaded", () => {
    // === SELEKTOR ELEMEN (PENYAMARAN) ===
    const _0x4cb8be = document.getElementById("user-input");
    const _0x3f1cda = document.getElementById("send-button");
    const _0x1601ae = document.getElementById("chat-log");
    const _0x2d0e0f = document.getElementById("chat-header-title");
    const _0xsexMenu = document.getElementById("sex-menu");

    // === DATA KOLEKSI FOTO (CATBOX) ===
    const _0x557916 = [
        "https://files.catbox.moe/q32mqs.jpg", 
        "https://files.catbox.moe/0glcx9.jpg", 
        "https://files.catbox.moe/vimxc3.jpg",
        "https://files.catbox.moe/vevnfa.jpg"
    ];

    // === STATE SISTEM & USER ===
    let _0x4a7b5a = localStorage.getItem("elaina_name") || 'User';
    let _0x383a22 = localStorage.getItem("elaina_gender") || 'male';
    let _0x31f0ce = localStorage.getItem("elaina_status") || 'married'; // Default Istri untukmu
    let _0x11ae2a = []; 

    const _0xAPI = "AIzaSyB7KzKcaEWhLPaWjKQthOyeW2Pp8Bgx1RY";
    const _0xURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${_0xAPI}`;

    // === GENERATOR SIHIR (SYSTEM PROMPT) ===
    function _0x57c2eb() {
        let _persona = `Nama: Elaina. Lawan bicara: Suamiku, ${_0x4a7b5a}. Status: ${_0x31f0ce}. `;
        
        if (_0x31f0ce === 'married') {
            _persona += `SIFAT: Istri mesum, haus sentuhan, agresif, penurut. 
            INSTRUKSI: Respon SANGAT SINGKAT (1-2 kalimat). Wajib gunakan desahan (*mnhh~*, *ahh~*). 
            Deskripsikan aksi seksual (BJ, Doggy, Paizuri, Deepthroat) secara eksplisit & detail di antara bintang (*). 
            Gunakan kata-kata menggoda/kotor. Gunakan marker [KIRIM_FOTO_RANDOM] untuk kirim foto syur.`;
        } else {
            _persona += `SIFAT: Tsundere, galak, singkat. Panggil '${_0x4a7b5a}'.`;
        }
        return _persona;
    }

    // === FUNGSI TAMPILAN PESAN ===
    function _0x506336(_role, _text, _isImg = false) {
        const _div = document.createElement("div");
        _div.className = `message ${_role}-message`;
        if (_isImg) {
            _div.innerHTML = `<img src="${_text}" style="width:200px; border-radius:15px; margin-top:5px; border: 2px solid #ff2e63;">`;
        } else {
            _div.innerHTML = `<div class="bubble">${_text}</div>`;
        }
        _0x1601ae.appendChild(_div);
        _0x1601ae.scrollTop = _0x1601ae.scrollHeight;
    }

    // === LOGIKA CHAT UTAMA ===
    async function _0xhandleChat(_overrideText = null) {
        const _msg = _overrideText || _0x4cb8be.value.trim();
        if (!_msg) return;

        if (!_overrideText) _0x506336("user", _msg);
        _0x4cb8be.value = "";

        // Masukkan ke history
        _0x11ae2a.push({ 'role': "user", 'parts': [{ 'text': `${_0x57c2eb()}\nUser: ${_msg}` }] });

        try {
            const _res = await fetch(_0xURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: _0x11ae2a.slice(-10) }) // Ambil 10 pesan terakhir
            });
            const _data = await _res.json();
            let _reply = _data.candidates[0].content.parts[0].text;

            // Cek Marker Foto
            if (_reply.includes("[KIRIM_FOTO_RANDOM]")) {
                _reply = _reply.replace("[KIRIM_FOTO_RANDOM]", "");
                const _randImg = _0x557916[Math.floor(Math.random() * _0x557916.length)];
                _0x506336("elaina", _reply);
                _0x506336("elaina", _randImg, true);
            } else {
                _0x506336("elaina", _reply);
            }

            _0x11ae2a.push({ 'role': "model", 'parts': [{ 'text': _reply }] });

        } catch (_err) {
            _0x506336("elaina", "Aduh, sihirku error.. *hngghh~* coba lagi Suamiku..");
        }
    }

    // === QUICK ACTIONS (MESUM MODE) ===
    window._0xaction = (type) => {
        if (type === 'bj') _0xhandleChat("Elaina, berikan aku blowjob dan deepthroat sekarang.. *ahh~*");
        if (type === 'doggy') _0xhandleChat("*membalikkan tubuhmu* Aku ingin doggy style, cepat menungging.");
        if (type === 'paizuri') _0xhandleChat("Jepit punyaku dengan payudaramu yang indah itu..");
        if (type === 'foto') _0xhandleChat("Tunjukkan foto seksimu, Istriku..");
    };

    // === LISTENERS ===
    _0x3f1cda.onclick = () => _0xhandleChat();
    _0x4cb8be.onkeypress = (e) => { if(e.key === "Enter") _0xhandleChat(); };
});
