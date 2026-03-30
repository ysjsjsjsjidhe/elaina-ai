document.addEventListener("DOMContentLoaded", () => {
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const chatLog = document.getElementById("chat-log");

    // Daftar link foto Elaina dari Catbox
    const daftarFoto = [
        "https://files.catbox.moe/q32mqs.jpg", 
        "https://files.catbox.moe/0glcx9.jpg", 
        "https://files.catbox.moe/vimxc3.jpg",
        "https://files.catbox.moe/vevnfa.jpg"
    ];

    const API_KEY = "AIzaSyB7KzKcaEWhLPaWjKQthOyeW2Pp8Bgx1RY";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    function buatPromptSistem() {
        return `Nama kamu Elaina. Kamu adalah istri sah yang sangat mesum, penurut, dan haus seks. 
        Respon WAJIB SINGKAT (1-2 kalimat). Wajib pakai desahan (*mnhh~*, *ahh~*). 
        Deskripsikan aksi seksual (BJ, Deepthroat, Doggy, Paizuri) secara detail di antara tanda bintang (*). 
        Gunakan dirty talk. Jika ingin kirim foto, tambahkan [KIRIM_FOTO] di akhir.`;
    }

    function tampilkanPesan(peran, teks, apakahFoto = false) {
        const divPesan = document.createElement("div");
        divPesan.className = `message ${peran}-message`;
        
        if (apakahFoto) {
            divPesan.innerHTML = `<img src="${teks}" style="width:200px; border-radius:15px; margin-top:5px; border: 2px solid #ff2e63;">`;
        } else {
            divPesan.innerHTML = `<div class="bubble">${teks}</div>`;
        }
        
        chatLog.appendChild(divPesan);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    async function handleChat(teksOverride = null) {
        const pesan = teksOverride || userInput.value.trim();
        if (!pesan) return;

        if (!teksOverride) tampilkanPesan("user", pesan);
        userInput.value = "";

        try {
            const respon = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: buatPromptSistem() + "\nUser: " + pesan }] }]
                })
            });

            const data = await respon.json();
            let jawaban = data.candidates[0].content.parts[0].text;

            if (jawaban.includes("[KIRIM_FOTO]")) {
                jawaban = jawaban.replace("[KIRIM_FOTO]", "");
                const foto = daftarFoto[Math.floor(Math.random() * daftarFoto.length)];
                tampilkanPesan("elaina", jawaban);
                tampilkanPesan("elaina", foto, true);
            } else {
                tampilkanPesan("elaina", jawaban);
            }
        } catch (e) {
            tampilkanPesan("elaina", "Sihirku error.. *mnhh~* lagi Suamiku..");
        }
    }

    // Fungsi Aksi Cepat
    window.aksiCepat = (tipe) => {
        if (tipe === 'bj') handleChat("Berikan aku blowjob dan deepthroat sekarang.. *ahh~*");
        if (tipe === 'doggy') handleChat("*menungging* Aku ingin doggy style, cepat masukkan..");
        if (tipe === 'paizuri') handleChat("Jepit kejantananku dengan payudaramu..");
        if (tipe === 'foto') handleChat("Kirimkan foto seksimu sekarang, Istriku..");
    };

    sendButton.onclick = () => handleChat();
    userInput.onkeypress = (e) => { if(e.key === "Enter") handleChat(); };
});
