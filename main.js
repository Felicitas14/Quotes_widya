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
        { text: "Jadikan hari ini begitu luar biasa sehingga hari kemarin merasa cemburu.", author: "Anonim", emoji: "💖", likes: 298 }
    ],
    Sad: [
        { text: "Terkadang, air mata adalah satu-satunya cara mata berbicara ketika mulut tak mampu menjelaskan rasa sakit.", author: "Hati Capek", emoji: "💔", likes: 345 },
        { text: "It's okay not to be okay. Sabar ya, badai pasti berlalu.", author: "Penenang Jiwa", emoji: "💧", likes: 512 },
        { text: "Aku tidak hilang, aku hanya lelah berjuang sendirian.", author: "Unknown", emoji: "🥀", likes: 278 },
        { text: "Some of the most painful scars are the ones that can't be seen.", author: "Unknown", emoji: "🖤", likes: 198 },
        { text: "Luka yang tak terlihat biasanya adalah yang paling dalam dan paling sulit disembuhkan.", author: "Anonim", emoji: "🌧️", likes: 234 },
        { text: "Kita adalah dua orang yang saling mendoakan, namun tidak ditakdirkan bersama.", author: "SadBoy", emoji: "💔", likes: 620 }
    ],
    Savage: [
        { text: "Pura-pura bodoh itu menyenangkan saat kita sedang menghadapi orang yang pura-pura pintar.", author: "Savage King", emoji: "😏", likes: 580 },
        { text: "If you treat me like an option, I'll leave you like a choice.", author: "Unknown", emoji: "🔥", likes: 492 },
        { text: "Kamu itu seperti koin, bermuka dua dan nilainya gak seberapa.", author: "Pedas Tapi Nyata", emoji: "🪙", likes: 712 },
        { text: "I'm not holding a grudge, I'm just remembering facts.", author: "Boss", emoji: "😎", likes: 389 },
        { text: "Jangan suka menilai orang dari masa lalunya, kamu bukan Google.", author: "Anonim", emoji: "🔍", likes: 445 },
        { text: "Some people are like clouds. When they disappear, it's a brighter day.", author: "Unknown", emoji: "☁️", likes: 520 }
    ]
};

// State Variables
let currentMood = 'Happy';
let currentQuoteIndex = 0;
let quotesDb = {};
let likedQuotes = new Set(); // Store indices/keys of liked quotes
let savedQuotes = new Set(); // Store indices/keys of saved quotes

// Load from LocalStorage or initialize with defaults
function initStorage() {
    // Quotes DB
    const savedDb = localStorage.getItem('quotes_db');
    if (savedDb) {
        quotesDb = JSON.parse(savedDb);
    } else {
        quotesDb = JSON.parse(JSON.stringify(DEFAULT_QUOTES)); // Deep copy
        localStorage.setItem('quotes_db', JSON.stringify(quotesDb));
    }

    // Likes
    const savedLikes = localStorage.getItem('liked_quotes');
    if (savedLikes) {
        likedQuotes = new Set(JSON.parse(savedLikes));
    }

    // Saves
    const savedSaves = localStorage.getItem('saved_quotes');
    if (savedSaves) {
        savedQuotes = new Set(JSON.parse(savedSaves));
    }
}

initStorage();

// --- 2. DOM ELEMENTS SELECTION ---
const loader = document.getElementById('loader');
const quoteText = document.querySelector('.quote-text');
const quoteAuthor = document.querySelector('.quote-author');
const quoteIcon = document.querySelector('.quote-icons');
const quoteCardInner = document.querySelector('.quote-card-inner');
const dotsContainer = document.querySelector('.dots');
const highlightText = document.querySelector('.highlight-text');

// Views
const carouselView = document.getElementById('quote-carousel-view');
const moodSelectionView = document.getElementById('mood-selection-view');

// Buttons & Actions
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

// Card action buttons
const cardActions = document.querySelector('.quote-actions');
const cardLikeBtn = cardActions?.children[0];
const cardSaveBtn = cardActions?.children[1];
const cardShareBtn = cardActions?.children[2];

// Bottom external buttons (lines 176+)
const externalLikeBtn = document.querySelector('.action-btn.like-btn');
const externalLikeCount = document.getElementById('like-count');
const externalSaveBtn = document.querySelector('.action-btn.save-btn');
const externalShareBtn = document.querySelector('.action-btn.share-btn');

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');

// --- 3. PRELOADER HIDE ---
window.addEventListener('load', () => {
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }
});

// Fallback in case load event already fired or is slow
setTimeout(() => {
    if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }
}, 3000);

// --- 4. DYNAMIC THEME TOGGLE (DARK MODE) ---
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
        
        // Add a cute little micro-animation to the toggle circle
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
    
    // Filter quotes by search query
    return list.filter(q => 
        q.text.toLowerCase().includes(query) || 
        q.author.toLowerCase().includes(query)
    );
}

function renderQuote() {
    const activeQuotes = getActiveQuotes();
    
    if (activeQuotes.length === 0) {
        // Show empty state
        quoteText.textContent = "Yah, ga ada quotes yang cocok sama pencarianmu... 🥺";
        quoteAuthor.textContent = "- Coba cari kata kunci lain";
        quoteIcon.textContent = "🔍";
        
        // Disable action buttons
        updateButtonStates(null);
        renderDots(0);
        return;
    }

    // Wrap around index safety
    if (currentQuoteIndex >= activeQuotes.length) {
        currentQuoteIndex = 0;
    } else if (currentQuoteIndex < 0) {
        currentQuoteIndex = activeQuotes.length - 1;
    }

    const quote = activeQuotes[currentQuoteIndex];

    // Trigger smooth slide/fade animation
    if (quoteCardInner) {
        quoteCardInner.classList.add('animate');
    }

    setTimeout(() => {
        // Update content during transition (invisible to user)
        if (quoteText) quoteText.textContent = quote.text;
        if (quoteAuthor) quoteAuthor.textContent = `- ${quote.author}`;
        if (quoteIcon) quoteIcon.textContent = quote.emoji || "✨";

        // Update active dots
        renderDots(activeQuotes.length);

        // Update button states (likes, saves)
        updateButtonStates(quote);

        // Fade back in
        if (quoteCardInner) {
            quoteCardInner.classList.remove('animate');
        }
    }, 250);
}

function renderDots(total) {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    
    // Cap dots at 10 to keep UI clean, but let carousel hold more
    const maxDots = Math.min(total, 10);
    
    for (let i = 0; i < maxDots; i++) {
        const dot = document.createElement('span');
        dot.className = `dot ${i === currentQuoteIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            currentQuoteIndex = i;
            renderQuote();
        });
        dotsContainer.appendChild(dot);
    }
}

function updateButtonStates(quote) {
    if (!quote) {
        // Disable actions if no quote exists
        if (cardLikeBtn) cardLikeBtn.style.opacity = '0.5';
        if (cardSaveBtn) cardSaveBtn.style.opacity = '0.5';
        if (externalLikeBtn) externalLikeBtn.style.opacity = '0.5';
        if (externalSaveBtn) externalSaveBtn.style.opacity = '0.5';
        return;
    }

    // Reset opacities
    if (cardLikeBtn) cardLikeBtn.style.opacity = '1';
    if (cardSaveBtn) cardSaveBtn.style.opacity = '1';
    if (externalLikeBtn) externalLikeBtn.style.opacity = '1';
    if (externalSaveBtn) externalSaveBtn.style.opacity = '1';

    const quoteId = `${currentMood}_${quote.text.substring(0, 15)}`;
    const isLiked = likedQuotes.has(quoteId);
    const isSaved = savedQuotes.has(quoteId);

    // Get current likes count
    const totalLikes = quote.likes || 0;

    // 1. Card Like Button
    if (cardLikeBtn) {
        cardLikeBtn.className = `action-btn ${isLiked ? 'active' : ''}`;
        cardLikeBtn.innerHTML = `<i class="${isLiked ? 'fas' : 'far'} fa-heart"></i> ${totalLikes}`;
    }

    // 2. Card Save Button
    if (cardSaveBtn) {
        cardSaveBtn.className = `action-btn ${isSaved ? 'active' : ''}`;
        cardSaveBtn.innerHTML = `<i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i> ${isSaved ? 'Saved' : 'Save'}`;
    }

    // 3. External Like Button (Bottom of page)
    if (externalLikeBtn) {
        externalLikeBtn.classList.toggle('liked', isLiked);
    }
    if (externalLikeCount) {
        externalLikeCount.textContent = totalLikes;
    }

    // 4. External Save Button (Bottom of page)
    if (externalSaveBtn) {
        externalSaveBtn.classList.toggle('active', isSaved);
        externalSaveBtn.innerHTML = `<i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i> ${isSaved ? 'Saved' : 'Save'}`;
    }
}

// --- 6. NAVIGATION & TRANSITION CONTROLS ---
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

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return; // Ignore when user is typing
    }
    if (e.key === 'ArrowRight') {
        nextQuote();
    } else if (e.key === 'ArrowLeft') {
        prevQuote();
    }
});

// Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;
document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);
document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
        nextQuote(); // Swipe left -> next
    }
    if (touchEndX - touchStartX > 50) {
        prevQuote(); // Swipe right -> prev
    }
}

// --- 7. MOOD SELECTION VIEW CONTROLLER ---
function selectMood(mood) {
    currentMood = mood;
    currentQuoteIndex = 0;
    document.body.classList.remove(
    "happy-bg",
    "sad-bg",
    "savage-bg"
    );
    
    if (mood === "Happy") {
        document.body.classList.add("happy-bg");
    }
    
    if (mood === "Sad") {
        document.body.classList.add("sad-bg");
    }
    
    if (mood === "Savage") {
        document.body.classList.add("savage-bg");
    }
        
    // Update active class on nav or highlight
    if (highlightText) {
        const moodEmojis = { Happy: 'Happy 😉', Sad: 'Sad 💔', Savage: 'Savage 🔥' };
        highlightText.textContent = moodEmojis[mood] || mood;
    }

    // Switch views smoothly
    if (moodSelectionView) {
        moodSelectionView.classList.add('hidden');
        moodSelectionView.classList.remove('active');
    }
    if (carouselView) {
        carouselView.classList.remove('hidden');
        carouselView.classList.add('active');
    }

    // Render new set of quotes
    renderQuote();
    renderTopQuotes();    
        
    // Show a small beautiful alert
    showToast(`Mood diganti ke ${mood}! ✨`);
}

// Bind to window so inline onclick works
window.selectMood = selectMood;

if (btnChangeMood) {
    btnChangeMood.addEventListener('click', () => {
        if (carouselView) {
            carouselView.classList.add('hidden');
            carouselView.classList.remove('active');
        }
        if (moodSelectionView) {
            moodSelectionView.classList.remove('hidden');
            moodSelectionView.classList.add('active');
        }
    });
}

if (btnBackFromMood) {
    btnBackFromMood.addEventListener('click', () => {
        if (moodSelectionView) {
            moodSelectionView.classList.add('hidden');
            moodSelectionView.classList.remove('active');
        }
        if (carouselView) {
            carouselView.classList.remove('hidden');
            carouselView.classList.add('active');
        }
    });
}

// --- 8. LIKE & SAVE INTERACTION ---
function handleLikeToggle() {
    const activeQuotes = getActiveQuotes();
    if (activeQuotes.length === 0) return;

    const quote = activeQuotes[currentQuoteIndex];
    const quoteId = `${currentMood}_${quote.text.substring(0, 15)}`;
    
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

    // Persist data
    localStorage.setItem('liked_quotes', JSON.stringify(Array.from(likedQuotes)));
    localStorage.setItem('quotes_db', JSON.stringify(quotesDb));

    // Update displays
    updateButtonStates(quote);
    renderTopQuotes();
}

function handleSaveToggle() {
    const activeQuotes = getActiveQuotes();
    if (activeQuotes.length === 0) return;

    const quote = activeQuotes[currentQuoteIndex];
    const quoteId = `${currentMood}_${quote.text.substring(0, 15)}`;

    if (savedQuotes.has(quoteId)) {
        savedQuotes.delete(quoteId);
        showToast("Quote dihapus dari simpanan 📂");
    } else {
        savedQuotes.add(quoteId);
        showToast("Quote disimpan ke favorit! 📁");
    }

    // Persist data
    localStorage.setItem('saved_quotes', JSON.stringify(Array.from(savedQuotes)));
    
    // Update displays
    updateButtonStates(quote);
}

// Bind both card action buttons and external bottom buttons
if (cardLikeBtn) cardLikeBtn.addEventListener('click', handleLikeToggle);
if (externalLikeBtn) externalLikeBtn.addEventListener('click', handleLikeToggle);

if (cardSaveBtn) cardSaveBtn.addEventListener('click', handleSaveToggle);
if (externalSaveBtn) externalSaveBtn.addEventListener('click', handleSaveToggle);

// --- 9. SHARE INTEGRATION ---
function handleShare() {
    const activeQuotes = getActiveQuotes();
    if (activeQuotes.length === 0) return;

    const quote = activeQuotes[currentQuoteIndex];
    const shareText = `"${quote.text}" - ${quote.author} (dibagikan lewat QuoteSpace ☁️)`;

    if (navigator.share) {
        navigator.share({
            title: 'QuoteSpace',
            text: shareText,
            url: window.location.href
        }).then(() => {
            showToast("Berhasil dibagikan! ✨");
        }).catch(err => {
            console.log("Share failed:", err);
        });
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showToast("Quote disalin ke papan klip! 📋");
        }).catch(err => {
            showToast("Gagal menyalin quote 🥺");
        });
    }
}

if (cardShareBtn) cardShareBtn.addEventListener('click', handleShare);
if (externalShareBtn) externalShareBtn.addEventListener('click', handleShare);

// --- 10. UPLOAD MODAL & CUSTOM QUOTE SUBMISSION ---
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
    uploadModal.addEventListener('click', (e) => {
        if (e.target === uploadModal) {
            closeModal();
        }
    });
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
            // Create new quote object
            const newQuote = {
                text: text,
                author: author,
                emoji: "✨",
                likes: 0
            };

            // Prepend new quote to selected mood database
            if (!quotesDb[mood]) {
                quotesDb[mood] = [];
            }
            quotesDb[mood].unshift(newQuote);

            // Persist to LocalStorage
            localStorage.setItem('quotes_db', JSON.stringify(quotesDb));

            // Reset form & close
            textarea.value = '';
            input.value = '';
            select.selectedIndex = 0;
            closeModal();

            // Set currentMood to the newly added quote's mood & navigate to it
            currentMood = mood;
            
            // Update the mood header highlight text
            if (highlightText) {
                const moodEmojis = { Happy: 'Happy 😉', Sad: 'Sad 💔', Savage: 'Savage 🔥' };
                highlightText.textContent = moodEmojis[mood] || mood;
            }

            // Set to index 0 (newly added) and render
            currentQuoteIndex = 0;
            renderQuote();

            // Notify user
            showToast(`Sukses! Quote baru diterbitkan di kategori ${mood} 💗`);
        }
    });
}

// --- 11. LIVE SEARCH FILTER ---
if (searchInput) {
    searchInput.addEventListener('input', () => {
        currentQuoteIndex = 0; // Reset index to avoid out-of-bound errors
        renderQuote();
    });
}

// --- 12. PREMIUM PREMIUM FEATURES (TOASTS & PARTICLE BUSTS) ---
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.bottom = '30px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '99999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'glass-card';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '50px';
    toast.style.background = 'rgba(255, 84, 156, 0.9)';
    toast.style.color = 'white';
    toast.style.fontSize = '0.95rem';
    toast.style.fontWeight = '500';
    toast.style.boxShadow = '0 10px 30px rgba(255, 84, 156, 0.4)';
    toast.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    toast.style.textAlign = 'center';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    toast.textContent = message;

    container.appendChild(toast);

    // Trigger visual reflow
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    // Auto dismiss
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 2800);
}

// Particle heart burst animation when liking
function createHeartBurst() {
    const colors = ['#ff549c', '#ff8cc0', '#ffa4d4', '#e8438b'];
    const origin = cardLikeBtn ? cardLikeBtn.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2 };
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '💗';
        particle.style.position = 'fixed';
        particle.style.left = `${origin.left + (origin.width || 0) / 2}px`;
        particle.style.top = `${origin.top + (origin.height || 0) / 2}px`;
        particle.style.fontSize = `${Math.random() * 15 + 10}px`;
        particle.style.color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        document.body.appendChild(particle);
        
        // Random velocity and direction
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 100 + 40;
        const x = Math.cos(angle) * speed;
        const y = Math.sin(angle) * speed - 50; // Bias upwards

        setTimeout(() => {
            particle.style.transform = `translate(${x}px, ${y}px) scale(0)`;
            particle.style.opacity = '0';
            setTimeout(() => {
                particle.remove();
            }, 800);
        }, 20);
    }
}

// Initial startup render
document.body.classList.add("happy-bg");
/* TOP QUOTES PER MOOD */
function renderTopQuotes() {

const container =
document.getElementById(
"topQuotesContainer"
);

if (!container) return;

const moodQuotes =
quotesDb[currentMood] || [];

const sortedQuotes =
[...moodQuotes].sort(
(a, b) =>
(b.likes || 0)
-
(a.likes || 0)
);

const topQuotes =
sortedQuotes.slice(0, 5);

container.innerHTML = "";

topQuotes.forEach((quote, index) => {

const crowns = [
"👑",
"🥈",
"🥉",
"",
""
];

container.innerHTML += `

<div class="top-quote-card glass-card">

<div class="top-quote-header">

<div class="rank-badge">
#${index + 1}
</div>

<div class="crown">
${crowns[index]}
</div>

</div>

<p class="top-quote-text">
"${quote.text}"
</p>

<p class="top-quote-author">
- ${quote.author}
</p>

<div class="top-quote-footer">

<div class="top-quote-actions">

<span
class="${
likedQuotes.has(
`${currentMood}_${quote.text.substring(0,15)}`
)
? 'like-btn liked-top'
: 'like-btn'
}"
onclick="topLikeQuote('${quote.text}')">

<i class="far fa-heart"></i>
${quote.likes || 0}

</span>

<span onclick="topSaveQuote('${quote.text}')">

<i class="far fa-bookmark"></i>
Save

</span>

<span onclick="topShareQuote('${quote.text}')">

<i class="fas fa-share"></i>
Share

</span>

</div>

</div>

</div>

`;

});

}

/* LIKE */
function topLikeQuote(text){

const quote =
quotesDb[currentMood]
.find(q => q.text === text);

if(!quote) return;

const quoteId =
`${currentMood}_${quote.text.substring(0,15)}`;

if(likedQuotes.has(quoteId)){

likedQuotes.delete(quoteId);

quote.likes =
Math.max(0,(quote.likes || 1)-1);

}else{

likedQuotes.add(quoteId);

quote.likes =
(quote.likes || 0)+1;

}

/* SAVE */
localStorage.setItem(
'liked_quotes',
JSON.stringify(
Array.from(likedQuotes)
)
);

localStorage.setItem(
'quotes_db',
JSON.stringify(quotesDb)
);

/* REFRESH */
renderTopQuotes();

}
/* SAVE */
function topSaveQuote(){

showToast("Quote disimpan 📌");

}

/* SHARE */
function topShareQuote(text){

navigator.clipboard.writeText(text);

showToast(
"Quote berhasil disalin 📋"
);

}

renderTopQuotes();
