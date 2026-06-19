/**
 * QuoteSpace - Ruang Beken Application logic
 * Features:
 * - Preloader transition & hide
 * - Theme Toggle (Dark & Light Mode) with LocalStorage persistence
 * - Interactive Mood-Based Quote Carousel (Happy, Sad, Savage)
 * - Quote Navigation (Next, Previous, dots indicator)
 * - Slide Animations with transitions
 * - Dynamic Likes, Saves & Share integration (Web Share API & fallback Clipboard copy)
 * - User Uploaded Quotes stored in LocalStorage
 * - Search filter functionality
 */

// --- 1. QUOTES DATABASE & STORAGE INITIALIZATION ---
const DEFAULT_QUOTES = {
    Happy: [
        { text: "Everything you need will come at the right time.", author: "Unknown", emoji: "💕", likes: 245 },
        { text: "Bahagia itu sederhana, cukup bersyukur dengan apa yang kita miliki saat ini.", author: "Anonim", emoji: "😊", likes: 189 },
        { text: "Smile, because your smile can be the reason someone else smiles today.", author: "Unknown", emoji: "☀️", likes: 312 },
        { text: "Hari ini adalah hari yang baik untuk memiliki hari yang luar biasa!", author: "Semangat", emoji: "✨", likes: 154 },
        { text: "Believe in yourself, and you will be unstoppable.", author: "Dinda ✨", emoji: "🌟", likes: 421 },
        { text: "Jadikan hari ini begitu luar biasa sehingga hari kemarin merasa cemburu.", author: "Anonim", emoji: "💖", likes: 298 },
        { text: "Kamu lebih kuat dari yang kamu kira.", author: "Motivasi", emoji: "💪", likes: 332 },
        { text: "Matahari selalu terbit setelah malam yang panjang.", author: "Unknown", emoji: "🌅", likes: 267 },
        { text: "Hal-hal baik sedang menuju kepadamu.", author: "Hope", emoji: "🎀", likes: 198 },
        { text: "Bersyukur mengubah apa yang kita miliki menjadi cukup.", author: "Anonim", emoji: "🙏", likes: 290 },
        { text: "Jangan takut memulai lagi. Itu kesempatan untuk membangun sesuatu yang lebih baik.", author: "Unknown", emoji: "🌈", likes: 351 },
        { text: "Kebahagiaan dimulai dari hati yang menerima.", author: "Anonim", emoji: "💗", likes: 284 },
        { text: "Hari yang indah dimulai dengan pikiran yang positif.", author: "Sunshine", emoji: "☀️", likes: 223 },
        { text: "Tetap tersenyum, dunia lebih indah karenanya.", author: "Unknown", emoji: "😊", likes: 315 },
        { text: "Mimpi besar dimulai dari langkah kecil.", author: "Dreamer", emoji: "⭐", likes: 401 }
    ],
    Sad: [
        { text: "Terkadang, air mata adalah satu-satunya cara mata berbicara ketika mulut tak mampu menjelaskan rasa sakit.", author: "Hati Capek", emoji: "💔", likes: 345 },
        { text: "It's okay not to be okay. Sabar ya, badai pasti berlalu.", author: "Penenang Jiwa", emoji: "💧", likes: 512 },
        { text: "Aku tidak hilang, aku hanya lelah berjuang sendirian.", author: "Unknown", emoji: "🥀", likes: 278 },
        { text: "Some of the most painful scars are the ones that can't be seen.", author: "Unknown", emoji: "🖤", likes: 198 },
        { text: "Luka yang tak terlihat biasanya adalah yang paling dalam dan paling sulit disembuhkan.", author: "Anonim", emoji: "🌧️", likes: 234 },
        { text: "Kita adalah dua orang yang saling mendoakan, namun tidak ditakdirkan bersama.", author: "SadBoy", emoji: "💔", likes: 620 },
        { text: "Tidak semua kehilangan datang untuk kembali.", author: "Unknown", emoji: "🥀", likes: 311 },
        { text: "Kadang yang paling menyakitkan adalah kenangan yang indah.", author: "Anonim", emoji: "🌙", likes: 420 },
        { text: "Aku baik-baik saja, hanya saja hatiku belum.", author: "Unknown", emoji: "🖤", likes: 389 },
        { text: "Rindu adalah luka yang tidak terlihat.", author: "Anonim", emoji: "💭", likes: 280 },
        { text: "Beberapa orang hadir hanya untuk menjadi pelajaran.", author: "Unknown", emoji: "🍂", likes: 333 },
        { text: "Yang paling berat adalah melepaskan sesuatu yang masih dicintai.", author: "Anonim", emoji: "💔", likes: 500 },
        { text: "Tidak semua cerita memiliki akhir yang bahagia.", author: "Unknown", emoji: "🌧️", likes: 271 },
        { text: "Aku belajar tersenyum meski hati sedang menangis.", author: "Strong Heart", emoji: "🥺", likes: 395 },
        { text: "Kesepian terkadang terasa lebih bising daripada keramaian.", author: "Unknown", emoji: "🌌", likes: 344 }
    ],
    Savage: [
        { text: "Hidup adalah permainan maka jadilah pemain bukan mainan.", author: "Drean resink", emoji: "😮‍💨", likes: 1410 },
        { text: "Pura-pura bodoh itu menyenangkan saat kita sedang menghadapi orang yang pura-pura pintar.", author: "Savage King", emoji: "😏", likes: 580 },
        { text: "If you treat me like an option, I'll leave you like a choice.", author: "Unknown", emoji: "🔥", likes: 492 },
        { text: "Kamu itu seperti koin, bermuka dua dan nilainya gak seberapa.", author: "Pedas Tapi Nyata", emoji: "🪙", likes: 712 },
        { text: "I'm not holding a grudge, I'm just remembering facts.", author: "Boss", emoji: "😎", likes: 389 },
        { text: "Jangan suka menilai orang dari masa lalunya, kamu bukan Google.", author: "Anonim", emoji: "🔍", likes: 445 },
        { text: "Some people are like clouds. When they disappear, it's a brighter day.", author: "Unknown", emoji: "☁️", likes: 520 },
        { text: "Aku bukan berubah, aku hanya berhenti mentoleransi omong kosong.", author: "Savage Girl", emoji: "💅", likes: 633 },
        { text: "Kalau iri bilang, jangan muter-muter.", author: "Anonim", emoji: "😏", likes: 501 },
        { text: "Aku tidak bersaing dengan siapa pun, kamu sudah kalah dari awal.", author: "Boss Energy", emoji: "👑", likes: 710 },
        { text: "Tetaplah menjadi dirimu sendiri. Orang palsu sudah terlalu banyak.", author: "Unknown", emoji: "🎭", likes: 432 },
        { text: "Kelas tidak perlu teriak untuk terlihat mahal.", author: "Elegant Savage", emoji: "💎", likes: 588 },
        { text: "Aku diam bukan berarti kalah, aku cuma malas.", author: "Unknown", emoji: "😴", likes: 475 },
        { text: "Jangan khawatir tentangku, khawatirlah tentang dirimu.", author: "Savage Queen", emoji: "🔥", likes: 650 },
        { text: "Aku tidak jahat, aku hanya tidak mudah dibohongi.", author: "Unknown", emoji: "🖤", likes: 538 },
        { text: "Kesuksesanku adalah balasan terbaik.", author: "Winner", emoji: "🏆", likes: 500 }
    ],
    Romantic: [
        { text: "Jika aku bisa memilih lagi, aku tetap memilih kamu.", author: "Unknown", emoji: "💖", likes: 1200 },
        { text: "Rumah bukan tempat, rumah adalah kamu.", author: "Unknown", emoji: "🏡💕", likes: 980 },
        { text: "Jatuh cinta padamu adalah hal favoritku.", author: "Love", emoji: "🥰", likes: 870 },
        { text: "Aku tidak butuh seribu alasan untuk mencintaimu, cukup satu hati untuk memilihmu setiap hari.", author: "Romantic Soul", emoji: "🌹", likes: 940 },
        { text: "Terima kasih telah hadir dan membuat dunia terasa lebih indah.", author: "Unknown", emoji: "💞", likes: 760 },
        { text: "Aku menemukan bagian terbaik dari diriku saat bersamamu.", author: "Unknown", emoji: "❤️", likes: 850 },
        { text: "Cinta bukan tentang menemukan seseorang yang sempurna, tetapi melihat seseorang dengan sempurna.", author: "Love Story", emoji: "💘", likes: 910 },
        { text: "Namamu adalah notifikasi favoritku.", author: "Unknown", emoji: "📱💕", likes: 1030 },
        { text: "Aku ingin menjadi alasan senyummu setiap hari.", author: "Romantic Soul", emoji: "😊💗", likes: 890 },
        { text: "Di antara miliaran manusia, hatiku memilihmu.", author: "Unknown", emoji: "🌎❤️", likes: 950 },
        { text: "Aku tidak tahu masa depan seperti apa, tapi aku berharap ada kamu di dalamnya.", author: "Love", emoji: "✨💞", likes: 1100 },
        { text: "Setiap lagu cinta mengingatkanku padamu.", author: "Unknown", emoji: "🎵💕", likes: 780 },
        { text: "Jika cinta adalah perjalanan, aku ingin berjalan bersamamu selamanya.", author: "Dream Love", emoji: "🚶‍♂️💖", likes: 920 },
        { text: "Pelukmu adalah tempat ternyaman yang pernah kutemukan.", author: "Unknown", emoji: "🤗❤️", likes: 1250 },
        { text: "Aku jatuh cinta padamu berkali-kali, setiap hari.", author: "Romantic Soul", emoji: "🥰", likes: 1080 },
        { text: "Mungkin aku tidak sempurna, tapi cintaku untukmu selalu tulus.", author: "Unknown", emoji: "💗", likes: 860 },
        { text: "Kamu adalah doa yang akhirnya dijawab oleh Tuhan.", author: "Love Hope", emoji: "🙏💞", likes: 1350 },
        { text: "Aku suka semua hal tentangmu, bahkan hal-hal kecil yang tidak kamu sadari.", author: "Unknown", emoji: "🌷", likes: 820 },
        { text: "Bersamamu, hari biasa terasa istimewa.", author: "Love", emoji: "✨❤️", likes: 930 },
        { text: "Aku tidak mencari yang sempurna, aku hanya mencari kamu.", author: "Unknown", emoji: "💕", likes: 1400 }
    ]
};

// State Variables
let currentMood = 'Happy';
let currentQuoteIndex = 0;
let quotesDb = {};
let likedQuotes = new Set();
let savedQuotes = new Set();
let isAdmin = false;

// Load from LocalStorage or initialize with defaults
function initStorage() {
    const savedDb = localStorage.getItem('quotes_db');
    if (savedDb) {
        quotesDb = JSON.parse(savedDb);
    } else {
        quotesDb = JSON.parse(JSON.stringify(DEFAULT_QUOTES));
        localStorage.setItem('quotes_db', JSON.stringify(quotesDb));
    }

    const savedLikes = localStorage.getItem('liked_quotes');
    if (savedLikes) likedQuotes = new Set(JSON.parse(savedLikes));

    const savedSaves = localStorage.getItem('saved_quotes');
    if (savedSaves) savedQuotes = new Set(JSON.parse(savedSaves));
}

initStorage();

let currentUserId = localStorage.getItem('quotespace_user_id');
if (!currentUserId) {
    currentUserId = 'usr_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('quotespace_user_id', currentUserId);
}

// --- 2. DOM ELEMENTS SELECTION ---
const loader = document.getElementById('loader');
const quoteText = document.querySelector('.quote-text');
const quoteAuthor = document.querySelector('.quote-author');
const quoteIcon = document.querySelector('.quote-icons');
const quoteCardInner = document.querySelector('.quote-card-inner');
const dotsContainer = document.querySelector('.dots');
const highlightText = document.querySelector('.highlight-text');

const carouselView = document.getElementById('quote-carousel-view');
const moodSelectionView = document.getElementById('mood-selection-view');

const btnChangeMood = document.getElementById('btn-change-mood');
const btnBackFromMood = document.getElementById('btn-back-from-mood');
const btnNextQuote = document.getElementById('btn-next-quote');
const btnOpenUpload = document.getElementById('btn-open-upload');
const btnCloseModal = document.getElementById('btn-close-modal');
const uploadModal = document.getElementById('upload-modal');
const uploadForm = document.getElementById('upload-form');
const navLeft = document.querySelector('.nav-arrow.left');
const navRight = document.querySelector('.nav-arrow.right');
const searchInput = document.querySelector('.search-bar input');

const cardActions = document.querySelector('.quote-actions');
const cardLikeBtn = cardActions?.children[0];
const cardSaveBtn = cardActions?.children[1];
const cardShareBtn = cardActions?.children[2];

const externalLikeBtn = document.querySelector('.action-btn.like-btn');
const externalLikeCount = document.getElementById('like-count');
const externalSaveBtn = document.querySelector('.action-btn.save-btn');
const externalShareBtn = document.querySelector('.action-btn.share-btn');

const themeToggle = document.querySelector('.theme-toggle');

// Edit modal elements
const editModal         = document.getElementById('edit-modal');
const btnCloseEdit      = document.getElementById('btn-close-edit-modal');
const editForm          = document.getElementById('edit-form');
const editQuoteTextarea = document.getElementById('edit-quote-text');
const editAuthorInput   = document.getElementById('edit-author-input');
const editMoodSelect    = document.getElementById('edit-mood-select');
const editEmojiInput    = document.getElementById('edit-emoji-input');
const emojiPreview      = document.getElementById('emoji-preview');
const editOrigText      = document.getElementById('edit-quote-original-text');
const editOrigMood      = document.getElementById('edit-quote-original-mood');

// --- 3. PRELOADER HIDE ---
document.addEventListener('DOMContentLoaded', () => {
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 800);
    }
});

setTimeout(() => {
    if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 800);
    }
}, 3000);

// --- 4. THEME TOGGLE ---
function initTheme() {
    const isDark = localStorage.getItem('theme_dark') === 'true';
    if (isDark) {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.classList.add('active');
    } else {
        document.body.classList.remove('dark-theme');
        if (themeToggle) themeToggle.classList.remove('active');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        themeToggle.classList.toggle('active', isDark);
        localStorage.setItem('theme_dark', isDark);
        const circle = themeToggle.querySelector('.toggle-circle');
        if (circle) {
            circle.style.transform = isDark ? 'translateX(20px) scale(1.1)' : 'translateX(0px) scale(1.1)';
            setTimeout(() => {
                circle.style.transform = isDark ? 'translateX(20px)' : 'translateX(0px)';
            }, 150);
        }
    });
}
initTheme();

// --- 5. CAROUSEL & RENDERING ENGINE ---
function getActiveQuotes() {
    const query = searchInput?.value.trim().toLowerCase() || "";
    const list = quotesDb[currentMood] || [];
    if (query === "") return list;
    return list.filter(q =>
        q.text.toLowerCase().includes(query) ||
        q.author.toLowerCase().includes(query)
    );
}

function renderQuote() {
    const activeQuotes = getActiveQuotes();

    if (activeQuotes.length === 0) {
        quoteText.textContent = "Yah, ga ada quotes yang cocok sama pencarianmu... 🥺";
        quoteAuthor.textContent = "- Coba cari kata kunci lain";
        quoteIcon.textContent = "🔍";
        updateButtonStates(null);
        renderDots(0);
        return;
    }

    if (currentQuoteIndex >= activeQuotes.length) currentQuoteIndex = 0;
    else if (currentQuoteIndex < 0) currentQuoteIndex = activeQuotes.length - 1;

    const quote = activeQuotes[currentQuoteIndex];

    if (quoteCardInner) quoteCardInner.classList.add('animate');

    setTimeout(() => {
        if (quoteText) quoteText.textContent = quote.text;
        if (quoteAuthor) quoteAuthor.textContent = `- ${quote.author}`;
        if (quoteIcon) quoteIcon.textContent = quote.emoji || "✨";
        renderDots(activeQuotes.length);
        updateButtonStates(quote);
        if (quoteCardInner) quoteCardInner.classList.remove('animate');
    }, 250);
}

function renderDots(total) {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxDots = Math.min(total, 10);
    for (let i = 0; i < maxDots; i++) {
        const dot = document.createElement('span');
        dot.className = `dot ${i === currentQuoteIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => { currentQuoteIndex = i; renderQuote(); });
        dotsContainer.appendChild(dot);
    }
}

function updateButtonStates(quote) {
    if (!quote) {
        if (cardLikeBtn) cardLikeBtn.style.opacity = '0.5';
        if (cardSaveBtn) cardSaveBtn.style.opacity = '0.5';
        return;
    }
    if (cardLikeBtn) cardLikeBtn.style.opacity = '1';
    if (cardSaveBtn) cardSaveBtn.style.opacity = '1';

    const quoteId = `${currentMood}_${btoa(unescape(encodeURIComponent(quote.text)))}`;
    const isLiked = likedQuotes.has(quoteId);
    const isSaved = savedQuotes.has(quoteId);
    const totalLikes = quote.likes || 0;

    if (cardLikeBtn) {
        cardLikeBtn.className = `action-btn ${isLiked ? 'active' : ''}`;
        cardLikeBtn.innerHTML = `<i class="${isLiked ? 'fas' : 'far'} fa-heart"></i> ${totalLikes}`;
    }
    if (cardSaveBtn) {
        cardSaveBtn.className = `action-btn ${isSaved ? 'active' : ''}`;
        cardSaveBtn.innerHTML = `<i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i> ${isSaved ? 'Saved' : 'Save'}`;
    }
    if (externalLikeBtn) externalLikeBtn.classList.toggle('liked', isLiked);
    if (externalLikeCount) externalLikeCount.textContent = totalLikes;
    if (externalSaveBtn) {
        externalSaveBtn.classList.toggle('active', isSaved);
        externalSaveBtn.innerHTML = `<i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i> ${isSaved ? 'Saved' : 'Save'}`;
    }
}

// --- 6. NAVIGATION ---
function nextQuote() {
    const activeQuotes = getActiveQuotes();
    if (activeQuotes.length > 0) {
        currentQuoteIndex = (currentQuoteIndex + 1) % activeQuotes.length;
        renderQuote();
    }
}

function prevQuote() {
    const activeQuotes = getActiveQuotes();
    if (activeQuotes.length > 0) {
        currentQuoteIndex = (currentQuoteIndex - 1 + activeQuotes.length) % activeQuotes.length;
        renderQuote();
    }
}

if (btnNextQuote) btnNextQuote.addEventListener('click', nextQuote);
if (navRight) navRight.addEventListener('click', nextQuote);
if (navLeft) navLeft.addEventListener('click', prevQuote);

document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight') nextQuote();
    else if (e.key === 'ArrowLeft') prevQuote();
});

let touchStartX = 0;
let touchEndX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, false);
document.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, false);

function handleSwipe() {
    if (touchStartX - touchEndX > 50) nextQuote();
    if (touchEndX - touchStartX > 50) prevQuote();
}

// --- 7. MOOD SELECTION ---
function selectMood(mood) {
    currentMood = mood;
    currentQuoteIndex = 0;
    document.body.classList.remove("happy-bg", "sad-bg", "savage-bg", "romantic-bg");
    if (mood === "Happy") document.body.classList.add("happy-bg");
    if (mood === "Sad") document.body.classList.add("sad-bg");
    if (mood === "Savage") document.body.classList.add("savage-bg");
    if (mood === "Romantic") document.body.classList.add("romantic-bg");

    if (highlightText) {
        const moodEmojis = { Happy: 'Happy 😉', Sad: 'Sad 💔', Savage: 'Savage 🔥', Romantic: 'Romantic 💖' };
        highlightText.textContent = moodEmojis[mood] || mood;
    }

    if (moodSelectionView) { moodSelectionView.classList.add('hidden'); moodSelectionView.classList.remove('active'); }
    if (carouselView) { carouselView.classList.remove('hidden'); carouselView.classList.add('active'); }

    renderQuote();
    renderTopQuotes();
    showToast(`Mood diganti ke ${mood}! ✨`);
}
window.selectMood = selectMood;

if (btnChangeMood) {
    btnChangeMood.addEventListener('click', () => {
        if (carouselView) { carouselView.classList.add('hidden'); carouselView.classList.remove('active'); }
        if (moodSelectionView) { moodSelectionView.classList.remove('hidden'); moodSelectionView.classList.add('active'); }
    });
}

if (btnBackFromMood) {
    btnBackFromMood.addEventListener('click', () => {
        if (moodSelectionView) { moodSelectionView.classList.add('hidden'); moodSelectionView.classList.remove('active'); }
        if (carouselView) { carouselView.classList.remove('hidden'); carouselView.classList.add('active'); }
    });
}

// --- 8. LIKE & SAVE ---
function safeB64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function handleLikeToggle() {
    const activeQuotes = getActiveQuotes();
    if (activeQuotes.length === 0) return;
    const quote = activeQuotes[currentQuoteIndex];
    const quoteId = `${currentMood}_${safeB64(quote.text)}`;

    if (likedQuotes.has(quoteId)) {
        likedQuotes.delete(quoteId);
        quote.likes = Math.max(0, (quote.likes || 1) - 1);
        showToast("Batal menyukai quote 💔");
    } else {
        likedQuotes.add(quoteId);
        quote.likes = (quote.likes || 0) + 1;
        showToast("Quote disukai! 💗");
        createHeartBurst();
    }

    localStorage.setItem('liked_quotes', JSON.stringify(Array.from(likedQuotes)));
    localStorage.setItem('quotes_db', JSON.stringify(quotesDb));
    updateButtonStates(quote);
    renderTopQuotes();
}

function handleSaveToggle() {
    const activeQuotes = getActiveQuotes();
    if (activeQuotes.length === 0) return;
    const quote = activeQuotes[currentQuoteIndex];
    const quoteId = `${currentMood}_${safeB64(quote.text)}`;

    if (savedQuotes.has(quoteId)) {
        savedQuotes.delete(quoteId);
        showToast("Quote dihapus dari simpanan 📂");
    } else {
        savedQuotes.add(quoteId);
        showToast("Quote disimpan ke favorit! 📁");
    }

    localStorage.setItem('saved_quotes', JSON.stringify(Array.from(savedQuotes)));
    updateButtonStates(quote);
}

if (cardLikeBtn) cardLikeBtn.addEventListener('click', handleLikeToggle);
if (externalLikeBtn) externalLikeBtn.addEventListener('click', handleLikeToggle);
if (cardSaveBtn) cardSaveBtn.addEventListener('click', handleSaveToggle);
if (externalSaveBtn) externalSaveBtn.addEventListener('click', handleSaveToggle);

// --- 9. SHARE ---
function handleShare() {
    const activeQuotes = getActiveQuotes();
    if (activeQuotes.length === 0) return;
    const quote = activeQuotes[currentQuoteIndex];
    const shareText = `"${quote.text}" - ${quote.author} (dibagikan lewat QuoteSpace ☁️)`;

    if (navigator.share) {
        navigator.share({ title: 'QuoteSpace', text: shareText, url: window.location.href })
            .then(() => showToast("Berhasil dibagikan! ✨"))
            .catch(err => console.log("Share failed:", err));
    } else {
        navigator.clipboard.writeText(shareText)
            .then(() => showToast("Quote disalin ke papan klip! 📋"))
            .catch(() => showToast("Gagal menyalin quote 🥺"));
    }
}

if (cardShareBtn) cardShareBtn.addEventListener('click', handleShare);
if (externalShareBtn) externalShareBtn.addEventListener('click', handleShare);

// --- 10. UPLOAD MODAL ---
if (btnOpenUpload) {
    btnOpenUpload.addEventListener('click', () => {
        if (uploadModal) uploadModal.classList.remove('hidden');
    });
}

function closeModal() {
    if (uploadModal) uploadModal.classList.add('hidden');
}

if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
if (uploadModal) {
    uploadModal.addEventListener('click', (e) => { if (e.target === uploadModal) closeModal(); });
}

if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const textarea = uploadForm.querySelector('textarea');
        const input = uploadForm.querySelector('input[type="text"]');
        const select = document.getElementById('upload-mood-select');
        if (!textarea || !input || !select) return;

        const text = textarea.value.trim();
        const author = input.value.trim();
        const mood = select.value;

        if (text && author && mood) {
            const newQuote = {
                text, author,
                emoji: "✨",
                likes: 0,
                isUserQuote: true,
                ownerId: currentUserId
            };
            if (!quotesDb[mood]) quotesDb[mood] = [];
            quotesDb[mood].unshift(newQuote);
            localStorage.setItem('quotes_db', JSON.stringify(quotesDb));

            textarea.value = '';
            input.value = '';
            select.selectedIndex = 0;
            closeModal();

            currentMood = mood;
            if (highlightText) {
                const moodEmojis = { Happy: 'Happy 😉', Sad: 'Sad 💔', Savage: 'Savage 🔥', Romantic: 'Romantic 💖' };
                highlightText.textContent = moodEmojis[mood] || mood;
            }
            currentQuoteIndex = 0;
            renderQuote();
            renderTopQuotes();
            showToast(`Sukses! Quote baru diterbitkan di kategori ${mood} 💗`);
        }
    });
}

// --- 11. SEARCH ---
if (searchInput) {
    searchInput.addEventListener('input', () => {
        currentQuoteIndex = 0;
        renderQuote();
    });
}

// --- 12. EDIT MODAL ---
function openEditModal(text, mood) {
    const quote = quotesDb[mood]?.find(q => q.text === text);
    if (!quote) return;

    if (quote.ownerId !== currentUserId) {
        showToast('Kamu tidak bisa mengedit quote ini 🚫');
        return;
    }

    editQuoteTextarea.value     = quote.text;
    editAuthorInput.value       = quote.author;
    editMoodSelect.value        = mood;
    editEmojiInput.value        = quote.emoji || '✨';
    emojiPreview.textContent    = quote.emoji || '✨';
    editOrigText.value          = quote.text;
    editOrigMood.value          = mood;

    editModal.classList.remove('hidden');
}
window.openEditModal = openEditModal;

function closeEditModal() {
    editModal?.classList.add('hidden');
}

btnCloseEdit?.addEventListener('click', closeEditModal);
editModal?.addEventListener('click', (e) => { if (e.target === editModal) closeEditModal(); });

editEmojiInput?.addEventListener('input', () => {
    emojiPreview.textContent = editEmojiInput.value.trim() || '✨';
});

editForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const originalText = editOrigText.value;
    const originalMood = editOrigMood.value;
    const newText      = editQuoteTextarea.value.trim();
    const newAuthor    = editAuthorInput.value.trim();
    const newMood      = editMoodSelect.value;
    const newEmoji     = editEmojiInput.value.trim() || '✨';

    if (!newText || !newAuthor || !newMood) {
        showToast('Semua field harus diisi ya 🥺');
        return;
    }

    const idx = quotesDb[originalMood]?.findIndex(q => q.text === originalText);
    if (idx === -1 || idx === undefined) {
        showToast('Quote tidak ditemukan 😢');
        return;
    }

    const quote = quotesDb[originalMood][idx];

    if (quote.ownerId !== currentUserId) {
        showToast('Kamu tidak bisa mengedit quote ini 🚫');
        return;
    }

    const updatedQuote = { ...quote, text: newText, author: newAuthor, emoji: newEmoji };

    quotesDb[originalMood].splice(idx, 1);
    if (!quotesDb[newMood]) quotesDb[newMood] = [];
    quotesDb[newMood].unshift(updatedQuote);

    localStorage.setItem('quotes_db', JSON.stringify(quotesDb));

    if (newMood !== originalMood) {
        currentMood = newMood;
        if (highlightText) {
            const moodEmojis = { Happy: 'Happy 😉', Sad: 'Sad 💔', Savage: 'Savage 🔥', Romantic: 'Romantic 💖' };
            highlightText.textContent = moodEmojis[newMood] || newMood;
        }
    }

    currentQuoteIndex = 0;
    closeEditModal();
    renderQuote();
    renderTopQuotes();
    showToast('Quote berhasil diperbarui! ✨');
});

// --- 13. DELETE ---
function deleteUserQuote(text) {
    const quote = quotesDb[currentMood]?.find(q => q.text === text);
    if (!quote) return;

    if (!isAdmin && quote.ownerId !== currentUserId) {
        showToast('Kamu tidak bisa menghapus quote ini 🚫');
        return;
    }

    if (!confirm('Hapus quote ini?')) return;

    quotesDb[currentMood] = quotesDb[currentMood].filter(q => q.text !== text);
    localStorage.setItem('quotes_db', JSON.stringify(quotesDb));
    renderQuote();
    renderTopQuotes();
    showToast('Quote berhasil dihapus 🗑️');
}
window.deleteUserQuote = deleteUserQuote;

// --- 14. TOP QUOTES ---
function renderTopQuotes() {
    const container = document.getElementById("topQuotesContainer");
    if (!container) return;

    const moodQuotes = quotesDb[currentMood] || [];
    const sortedQuotes = [...moodQuotes].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    const topQuotes = sortedQuotes.slice(0, 5);

    container.innerHTML = "";

    const crowns = ["👑", "🥈", "🥉", "", ""];

    topQuotes.forEach((quote, index) => {
        const quoteId = `${currentMood}_${safeB64(quote.text)}`;
        const isLiked = likedQuotes.has(quoteId);
        const isOwner = quote.isUserQuote && quote.ownerId === currentUserId;

        // Escape teks untuk inline onclick attribute
        const safeText = quote.text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');

        container.innerHTML += `
        <div class="top-quote-card glass-card">
            <div class="top-quote-header">
                <div class="rank-badge">#${index + 1}</div>
                <div class="crown">${crowns[index]}</div>
            </div>
            <p class="top-quote-text">"${quote.text}"</p>
            <p class="top-quote-author">- ${quote.author}</p>
            <div class="top-quote-footer">
                <div class="top-quote-actions">
                    <span class="like-btn ${isLiked ? 'liked-top' : ''}"
                        onclick="topLikeQuote(this)"
                        data-text="${safeText}"
                        data-mood="${currentMood}">
                        <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                        ${quote.likes || 0}
                    </span>
                    <span onclick='topSaveQuote()'>
                        <i class="far fa-bookmark"></i> Save
                    </span>
                    <span onclick='topShareQuote(${JSON.stringify(quote.text)})'>
                        <i class="fas fa-share"></i> Share
                    </span>
                    ${isOwner ? `
                    <span class="edit-btn"
                        onclick='openEditModal(${JSON.stringify(quote.text)}, "${currentMood}")'>
                        <i class="fas fa-pen"></i> Edit
                    </span>
                    <span class="delete-btn"
                        onclick='deleteUserQuote(${JSON.stringify(quote.text)})'>
                        <i class="fas fa-trash"></i> Delete
                    </span>
                    ` : ''}
                </div>
            </div>
        </div>`;
    });
}

// --- 15. TOP QUOTE ACTIONS ---
function topLikeQuote(el) {
    const text = el.dataset.text;
    const mood = el.dataset.mood || currentMood;

    const quote = quotesDb[mood]?.find(q => q.text === text);
    if (!quote) return;

    const quoteId = `${mood}_${safeB64(quote.text)}`;

    if (likedQuotes.has(quoteId)) {
        likedQuotes.delete(quoteId);
        quote.likes = Math.max(0, (quote.likes || 1) - 1);
    } else {
        likedQuotes.add(quoteId);
        quote.likes = (quote.likes || 0) + 1;
    }

    localStorage.setItem('liked_quotes', JSON.stringify(Array.from(likedQuotes)));
    localStorage.setItem('quotes_db', JSON.stringify(quotesDb));
    renderTopQuotes();
}
window.topLikeQuote = topLikeQuote;

function topSaveQuote() {
    showToast("Quote disimpan 📌");
}
window.topSaveQuote = topSaveQuote;

function topShareQuote(text) {
    navigator.clipboard.writeText(text);
    showToast("Quote berhasil disalin 📋");
}
window.topShareQuote = topShareQuote;

// --- 16. TOAST & EFFECTS ---
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'glass-card';
    toast.style.cssText = 'padding:12px 24px;border-radius:50px;background:rgba(255,84,156,0.9);color:white;font-size:0.95rem;font-weight:500;box-shadow:0 10px 30px rgba(255,84,156,0.4);border:1px solid rgba(255,255,255,0.3);text-align:center;opacity:0;transform:translateY(20px);transition:all 0.4s cubic-bezier(0.175,0.885,0.32,1.275);';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 400);
    }, 2800);
}

function createHeartBurst() {
    const origin = cardLikeBtn ? cardLikeBtn.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2 };
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '💗';
        particle.style.cssText = `position:fixed;left:${origin.left + (origin.width || 0) / 2}px;top:${origin.top + (origin.height || 0) / 2}px;font-size:${Math.random() * 15 + 10}px;pointer-events:none;z-index:9999;transition:all 0.8s cubic-bezier(0.25,0.46,0.45,0.94);`;
        document.body.appendChild(particle);
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 100 + 40;
        const x = Math.cos(angle) * speed;
        const y = Math.sin(angle) * speed - 50;
        setTimeout(() => {
            particle.style.transform = `translate(${x}px,${y}px) scale(0)`;
            particle.style.opacity = '0';
            setTimeout(() => particle.remove(), 800);
        }, 20);
    }
}

// --- 17. NAVIGATION MENU ---
document.getElementById("nav-home")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("quote-carousel-view")?.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("nav-categories")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("mood-selection-view")?.classList.remove("hidden");
    document.getElementById("mood-selection-view")?.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("nav-favorites")?.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Fitur Favorites segera hadir 💗");
});

document.getElementById("nav-about")?.addEventListener("click", (e) => {
    e.preventDefault();
    alert(`QuoteSpace ☁️\n\nQuoteSpace adalah tempat untuk menemukan, menyimpan, dan membagikan quote favoritmu.\nTemukan kata-kata yang cocok dengan suasana hatimu setiap hari.\n\nDibuat oleh Ferizz🥴`);
});

// --- INIT ---
document.body.classList.add("happy-bg");
renderQuote();
renderTopQuotes();
