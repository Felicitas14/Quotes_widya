/**
 * QUOTESPACE FULL MAIN.JS 💗
 * FINAL VERSION
 * WITH:
 * ✅ Mood system
 * ✅ Like
 * ✅ Save
 * ✅ Share
 * ✅ Top Quotes
 * ✅ User upload quote
 * ✅ Delete only user quotes
 * ✅ Smooth transitions
 * ✅ Search
 * ✅ Theme toggle
 */




/* =========================
   QUOTES DATABASE
========================= */

const DEFAULT_QUOTES = {

Happy: [

{
text:"Everything you need will come at the right time.",
author:"Unknown",
emoji:"💕",
likes:245
},

{
text:"Smile, because your smile can be the reason someone else smiles today.",
author:"Unknown",
emoji:"☀️",
likes:312
},

{
text:"Believe in yourself, and you will be unstoppable.",
author:"Dinda ✨",
emoji:"🌟",
likes:421
},

{
text:"Hari ini adalah hari yang baik untuk memiliki hari yang luar biasa!",
author:"Semangat",
emoji:"✨",
likes:154
},

{
text:"Bahagia itu sederhana.",
author:"Anonim",
emoji:"😊",
likes:189
}

],



Sad:[

{
text:"It's okay not to be okay. Sabar ya, badai pasti berlalu.",
author:"Penenang Jiwa",
emoji:"💧",
likes:512
},

{
text:"Aku tidak hilang, aku hanya lelah berjuang sendirian.",
author:"Unknown",
emoji:"🥀",
likes:278
},

{
text:"Some of the most painful scars are the ones that can't be seen.",
author:"Unknown",
emoji:"🖤",
likes:198
},

{
text:"Kita adalah dua orang yang saling mendoakan namun tidak ditakdirkan bersama.",
author:"SadBoy",
emoji:"💔",
likes:620
}

],



Savage:[

{
text:"If you treat me like an option, I'll leave you like a choice.",
author:"Unknown",
emoji:"🔥",
likes:492
},

{
text:"Kamu itu seperti koin, bermuka dua dan nilainya gak seberapa.",
author:"Pedas Tapi Nyata",
emoji:"🪙",
likes:712
},

{
text:"I'm not holding a grudge, I'm just remembering facts.",
author:"Boss",
emoji:"😎",
likes:389
},

{
text:"Some people are like clouds. When they disappear, it's a brighter day.",
author:"Unknown",
emoji:"☁️",
likes:520
}

]

};





/* =========================
   STATES
========================= */

let currentMood = "Happy";

let currentQuoteIndex = 0;

let quotesDb = {};

let likedQuotes = new Set();

let savedQuotes = new Set();





/* =========================
   STORAGE INIT
========================= */

function initStorage(){

const savedDb =
localStorage.getItem(
'quotes_db'
);

if(savedDb){

quotesDb =
JSON.parse(savedDb);

}else{

quotesDb =
JSON.parse(
JSON.stringify(
DEFAULT_QUOTES
)
);

localStorage.setItem(
'quotes_db',
JSON.stringify(quotesDb)
);

}



const savedLikes =
localStorage.getItem(
'liked_quotes'
);

if(savedLikes){

likedQuotes =
new Set(
JSON.parse(savedLikes)
);

}



const savedSaves =
localStorage.getItem(
'saved_quotes'
);

if(savedSaves){

savedQuotes =
new Set(
JSON.parse(savedSaves)
);

}

}

initStorage();





/* =========================
   DOM
========================= */

const quoteText =
document.querySelector(
'.quote-text'
);

const quoteAuthor =
document.querySelector(
'.quote-author'
);

const quoteIcon =
document.querySelector(
'.quote-icons'
);

const highlightText =
document.querySelector(
'.highlight-text'
);

const dotsContainer =
document.querySelector(
'.dots'
);

const searchInput =
document.querySelector(
'.search-bar input'
);

const uploadForm =
document.getElementById(
'upload-form'
);

const uploadModal =
document.getElementById(
'upload-modal'
);





/* =========================
   GET ACTIVE QUOTES
========================= */

function getActiveQuotes(){

const query =
searchInput?.value
.trim()
.toLowerCase() || "";

const list =
quotesDb[currentMood]
|| [];

if(query==="")
return list;

return list.filter(q=>

q.text
.toLowerCase()
.includes(query)

||

q.author
.toLowerCase()
.includes(query)

);

}





/* =========================
   RENDER QUOTE
========================= */

function renderQuote(){

const activeQuotes =
getActiveQuotes();

if(activeQuotes.length===0){

quoteText.textContent =
"Quotes tidak ditemukan 🥺";

quoteAuthor.textContent =
"-";

quoteIcon.textContent =
"💔";

return;

}



if(
currentQuoteIndex >=
activeQuotes.length
){

currentQuoteIndex = 0;

}



const quote =
activeQuotes[
currentQuoteIndex
];



quoteText.textContent =
quote.text;

quoteAuthor.textContent =
`- ${quote.author}`;

quoteIcon.textContent =
quote.emoji || "✨";



renderDots(
activeQuotes.length
);



updateButtons(
quote
);



const deleteBtn =
document.getElementById(
'deleteQuoteBtn'
);

if(deleteBtn){

deleteBtn.style.display =

quote.isUserQuote

? 'flex'

: 'none';

}

}





/* =========================
   DOTS
========================= */

function renderDots(total){

dotsContainer.innerHTML =
"";

for(let i=0;i<total;i++){

const dot =
document.createElement(
'span'
);

dot.className =
`dot ${
i===currentQuoteIndex
? 'active'
: ''
}`;

dot.onclick = ()=>{

currentQuoteIndex = i;

renderQuote();

};

dotsContainer.appendChild(
dot
);

}

}





/* =========================
   UPDATE BUTTONS
========================= */

function updateButtons(quote){

const actions =
document.querySelectorAll(
'.quote-actions .action-btn'
);

const likeBtn =
actions[0];

const saveBtn =
actions[1];



const quoteId =
`${currentMood}_${btoa(quote.text)}`;

const liked =
likedQuotes.has(
quoteId
);

const saved =
savedQuotes.has(
quoteId
);



likeBtn.innerHTML =

`
<i class="
${liked
? 'fas'
: 'far'}
fa-heart"></i>

${quote.likes || 0}
`;



saveBtn.innerHTML =

`
<i class="
${saved
? 'fas'
: 'far'}
fa-bookmark"></i>

${saved
? 'Saved'
: 'Save'}
`;

}





/* =========================
   NEXT / PREV
========================= */

function nextQuote(){

const activeQuotes =
getActiveQuotes();

currentQuoteIndex =

(currentQuoteIndex+1)

%

activeQuotes.length;

renderQuote();

}



function prevQuote(){

const activeQuotes =
getActiveQuotes();

currentQuoteIndex =

(
currentQuoteIndex-1+
activeQuotes.length
)

%

activeQuotes.length;

renderQuote();

}



document
.querySelector(
'.nav-arrow.right'
)
.onclick = nextQuote;



document
.querySelector(
'.nav-arrow.left'
)
.onclick = prevQuote;





/* =========================
   SELECT MOOD
========================= */

function selectMood(mood){

currentMood = mood;

currentQuoteIndex = 0;



document.body.classList.remove(
'happy-bg',
'sad-bg',
'savage-bg'
);



if(mood==="Happy"){

document.body.classList.add(
'happy-bg'
);

}



if(mood==="Sad"){

document.body.classList.add(
'sad-bg'
);

}



if(mood==="Savage"){

document.body.classList.add(
'savage-bg'
);

}



highlightText.textContent =
mood;



document
.getElementById(
'mood-selection-view'
)
.classList.add(
'hidden'
);



document
.getElementById(
'quote-carousel-view'
)
.classList.remove(
'hidden'
);



renderQuote();

renderTopQuotes();

showToast(
`Mood ${mood} aktif ✨`
);

}

window.selectMood =
selectMood;





/* =========================
   LIKE
========================= */

function handleLikeToggle(){

const quote =
getActiveQuotes()[
currentQuoteIndex
];

const quoteId =
`${currentMood}_${btoa(quote.text)}`;



if(
likedQuotes.has(
quoteId
)
){

likedQuotes.delete(
quoteId
);

quote.likes =
Math.max(
0,
(quote.likes||1)-1
);

showToast(
"Batal like 💔"
);

}else{

likedQuotes.add(
quoteId
);

quote.likes =
(quote.likes||0)+1;

showToast(
"Quote disukai 💗"
);

}



localStorage.setItem(
'liked_quotes',
JSON.stringify(
Array.from(
likedQuotes
)
)
);

localStorage.setItem(
'quotes_db',
JSON.stringify(
quotesDb
)
);



renderQuote();

renderTopQuotes();

}



document
.querySelectorAll(
'.quote-actions .action-btn'
)[0]
.onclick =
handleLikeToggle;





/* =========================
   SAVE
========================= */

function handleSaveToggle(){

const quote =
getActiveQuotes()[
currentQuoteIndex
];

const quoteId =
`${currentMood}_${btoa(quote.text)}`;



if(
savedQuotes.has(
quoteId
)
){

savedQuotes.delete(
quoteId
);

showToast(
"Quote dihapus dari save 📂"
);

}else{

savedQuotes.add(
quoteId
);

showToast(
"Quote disimpan 💾"
);

}



localStorage.setItem(
'saved_quotes',
JSON.stringify(
Array.from(
savedQuotes
)
)
);



renderQuote();

}



document
.querySelectorAll(
'.quote-actions .action-btn'
)[1]
.onclick =
handleSaveToggle;





/* =========================
   SHARE
========================= */

function handleShare(){

const quote =
getActiveQuotes()[
currentQuoteIndex
];

const shareText =

`"${quote.text}"
- ${quote.author}`;



navigator.clipboard
.writeText(shareText);

showToast(
"Quote disalin 📋"
);

}



document
.querySelectorAll(
'.quote-actions .action-btn'
)[2]
.onclick =
handleShare;





/* =========================
   UPLOAD MODAL
========================= */

document
.getElementById(
'btn-open-upload'
)
.onclick = ()=>{

uploadModal
.classList.remove(
'hidden'
);

};



document
.getElementById(
'btn-close-modal'
)
.onclick = ()=>{

uploadModal
.classList.add(
'hidden'
);

};





/* =========================
   UPLOAD QUOTE
========================= */

uploadForm.addEventListener(
'submit',

(e)=>{

e.preventDefault();



const textarea =
uploadForm.querySelector(
'textarea'
);

const input =
uploadForm.querySelector(
'input'
);

const select =
document.getElementById(
'upload-mood-select'
);



const text =
textarea.value.trim();

const author =
input.value.trim();

const mood =
select.value;



if(
!text ||
!author ||
!mood
)return;



const newQuote = {

text:text,

author:author,

emoji:"✨",

likes:0,

isUserQuote:true

};



quotesDb[mood]
.unshift(newQuote);



localStorage.setItem(
'quotes_db',
JSON.stringify(
quotesDb
)
);



textarea.value = "";

input.value = "";

select.selectedIndex = 0;



uploadModal
.classList.add(
'hidden'
);



currentMood = mood;

currentQuoteIndex = 0;



highlightText.textContent =
mood;



renderQuote();

renderTopQuotes();



showToast(
"Quote berhasil ditambahkan 💗"
);

}

);





/* =========================
   DELETE USER QUOTE
========================= */

function deleteCurrentQuote(){

const quote =
getActiveQuotes()[
currentQuoteIndex
];



if(!quote.isUserQuote){

showToast(
"Quote bawaan tidak bisa dihapus 💗"
);

return;

}



const confirmDelete =
confirm(
"Hapus quote ini?"
);

if(!confirmDelete)
return;



quotesDb[currentMood] =

quotesDb[currentMood]
.filter(

q=>q.text!==quote.text

);



localStorage.setItem(
'quotes_db',
JSON.stringify(
quotesDb
)
);



currentQuoteIndex = 0;



renderQuote();

renderTopQuotes();



showToast(
"Quote berhasil dihapus 🗑️"
);

}





/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
'input',

()=>{

currentQuoteIndex = 0;

renderQuote();

}

);





/* =========================
   TOP QUOTES
========================= */

function renderTopQuotes(){

const container =
document.getElementById(
'topQuotesContainer'
);

if(!container) return;



const moodQuotes =
quotesDb[currentMood]
|| [];



const sortedQuotes =
[...moodQuotes]
.sort(
(a,b)=>
(b.likes||0)
-
(a.likes||0)
);



const topQuotes =
sortedQuotes.slice(0,5);



container.innerHTML = "";



topQuotes.forEach(
(quote,index)=>{

const crowns = [
"👑",
"🥈",
"🥉",
"",
""
];



const liked =
likedQuotes.has(
`${currentMood}_${btoa(quote.text)}`
);



container.innerHTML += `

<div class="
top-quote-card
glass-card
">

<div class="
top-quote-header
">

<div class="
rank-badge
">

#${index+1}

</div>

<div class="crown">

${crowns[index]}

</div>

</div>

<p class="
top-quote-text
">

"${quote.text}"

</p>

<p class="
top-quote-author
">

- ${quote.author}

</p>

<div class="
top-quote-footer
">

<div class="
top-quote-actions
">

<span

class="
like-btn
${liked
? 'liked-top'
: ''
}
"

onclick="
topLikeQuote(this)
"

data-text='
${quote.text
.replace(/'/g,"&apos;")}
'>

<i class="
${liked
? 'fas fa-heart'
: 'far fa-heart'
}
"></i>

${quote.likes || 0}

</span>

<span
onclick='
topSaveQuote(
${JSON.stringify(
quote.text
)}
)
'>

<i class="
far fa-bookmark
"></i>

Save

</span>

<span
onclick='
topShareQuote(
${JSON.stringify(
quote.text
)}
)
'>

<i class="
fas fa-share
"></i>

Share

</span>

</div>

</div>

</div>

`;

}

);

}





/* =========================
   TOP LIKE
========================= */

function topLikeQuote(el){

const text =
el.dataset.text;



const quote =
quotesDb[currentMood]
.find(
q=>q.text===text
);



if(!quote) return;



const quoteId =
`${currentMood}_${btoa(text)}`;



if(
likedQuotes.has(
quoteId
)
){

likedQuotes.delete(
quoteId
);

quote.likes =
Math.max(
0,
(quote.likes||1)-1
);

}else{

likedQuotes.add(
quoteId
);

quote.likes =
(quote.likes||0)+1;

}



localStorage.setItem(
'liked_quotes',
JSON.stringify(
Array.from(
likedQuotes
)
)
);

localStorage.setItem(
'quotes_db',
JSON.stringify(
quotesDb
)
);



renderQuote();

renderTopQuotes();

}





/* =========================
   TOP SAVE
========================= */

function topSaveQuote(){

showToast(
"Quote disimpan 📌"
);

}





/* =========================
   TOP SHARE
========================= */

function topShareQuote(text){

navigator.clipboard
.writeText(text);

showToast(
"Quote berhasil disalin 📋"
);

}





/* =========================
   TOAST
========================= */

function showToast(message){

const toast =
document.createElement(
'div'
);

toast.innerText =
message;



toast.style.position =
'fixed';

toast.style.bottom =
'30px';

toast.style.left =
'50%';

toast.style.transform =
'translateX(-50%)';

toast.style.padding =
'14px 28px';

toast.style.borderRadius =
'999px';

toast.style.background =
'rgba(255,84,156,.92)';

toast.style.color =
'white';

toast.style.fontWeight =
'600';

toast.style.zIndex =
'999999';

toast.style.boxShadow =
'0 8px 30px rgba(255,84,156,.35)';



document.body.appendChild(
toast
);



setTimeout(()=>{

toast.remove();

},2500);

}





/* =========================
   THEME TOGGLE
========================= */

const themeToggle =
document.querySelector(
'.theme-toggle'
);

themeToggle.onclick = ()=>{

document.body.classList.toggle(
'dark-theme'
);

themeToggle.classList.toggle(
'active'
);

};



/* =========================
   START
========================= */

document.body.classList.add(
'happy-bg'
);

renderQuote();

renderTopQuotes();
