const typingText = document.querySelector(".typing-text p");
const inpField = document.querySelector(".wrapper .input-field");
const mistakeTag = document.querySelector(".mistake span");
const timeTag = document.querySelector(".time span b");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const tryAgainBtn = document.querySelector(".try-button");
const returnBtn = document.querySelector(".return-button");
const nameField = document.querySelector(".name-field");
const popup = document.querySelector(".popup")

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

const paragraph_api = "http://metaphorpsum.com/sentences/25"

let idx2 = 0;
let mistakes = 0;

let timer , 
maxTime = 60;
timeLeft = maxTime;

let playing = false;

let nxtline = 0;

function getRandomParagraph(){
    return fetch(paragraph_api)
    .then(response => response.text())
    .then(data => {return data;})
}


// generate pharagraph
function randomParagraph(){
    const url = new URL(window.location);
    const mode = url.searchParams.get('mode');

    typingText.innerHTML = "";
    let idx = Math.floor(Math.random() * pharagraphs.length);
    pharagraphs[idx].split("").forEach(span => {
        if(mode == "rotate"){
            if(span == " "){
                let spanTag = `<span class="space">${span}</span>`;
                typingText.innerHTML += spanTag;
            }else{
                let spanTag = `<span class="span-rotate">${span}</span>`;
                typingText.innerHTML += spanTag;
            }   
        }else{
            let spanTag = `<span>${span}</span>`;
            typingText.innerHTML += spanTag;
        }
    })

    document.addEventListener("keydown" , () => inpField.focus());
    typingText.addEventListener("click" , () => inpField.focus());
    typingText.querySelectorAll("span")[0].classList.add("active");
}

//generate paragraph by api
async function randomParagraph2(){
    typingText.innerHTML = "";
    const pharagraph = await getRandomParagraph();
    pharagraph.split("").forEach(span => {
        let spanTag = `<span class="span-rotate">${span}</span>`;
        typingText.innerHTML += spanTag;
    })

    document.addEventListener("keydown" , () => inpField.focus());
    typingText.addEventListener("click" , () => inpField.focus());
    typingText.querySelectorAll("span")[0].classList.add("active");
}

// check typing
function initTyping(){
    const characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[idx2];

    if(timeLeft > 0 && idx2 < characters.length -1){
        if(!playing){
            timer = setInterval(initTimer , 100);
            playing = true;
        }

        if(typedChar != null){
            if(characters[idx2].innerText == typedChar){
                characters[idx2].classList.add("correct");
                characters[idx2].classList.remove("active");
            }else{
                mistakes++;
                characters[idx2].classList.add("incorrect");
                characters[idx2].classList.remove("active");
            }

            idx2++;
        }else{
            characters[idx2].classList.remove("active");
            idx2--;
            if(characters[idx2].classList.contains("incorrect")){
                mistakes--;
            }
            characters[idx2].classList.remove("correct" , "incorrect");
        }

        if(idx2 != 0){
            const Rect1 = characters[idx2-1].getBoundingClientRect();
            const Rect2 = characters[idx2].getBoundingClientRect();

            if(Math.abs((Rect1.top+Rect1.bottom)/2 - (Rect2.top+Rect2.bottom)/2) > Rect1.height/2){
                nxtline++;
                console.log(nxtline);
            }
        }
        
        // if (idx2 != 0 && characters[idx2-1].offsetTop !== characters[idx2].offsetTop) {
        //     nxtline++;
        // }

        if(nxtline == 3){
            nxtline--;
            const lineHeight = parseInt(getComputedStyle(typingText).lineHeight);
            scrollTopAnimated(document.querySelector(".typing-text").scrollTop+lineHeight,500);
        }
        
        characters[idx2].classList.add("active");
        mistakeTag.innerText = mistakes;
    }else{
        inpField.value = "";
        clearInterval();
    }
}

function initTimer(){
    if(timeLeft > 0){
        timeLeft -=0.1;
        timeTag.innerText = Math.floor(timeLeft);

        let wpm = Math.round(((idx2-mistakes)/5 )/ (maxTime-timeLeft)*60);
        wpm = wpm <0 || !wpm || wpm === Infinity ? 0 : wpm;
        
        cpmTag.innerText = idx2 - mistakes;
        wpmTag.innerText = wpm;
    }else{
        clearInterval(timer);
        endGame();
    }
}

function reset(){
    clearInterval(timer);
    randomParagraph();
    document.addEventListener("keydown" , () => inpField.focus());
    inpField.addEventListener("input",initTyping);
    typingText.addEventListener("click" , () => inpField.focus());
    inpField.value = "";
    idx2 = 0;
    mistakes = 0;  
    timeLeft = maxTime;
    playing = false;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
    nxtline = 0;
    mistakeTag.innerText = 0;
    timeTag.innerHTML = maxTime;
    scrollTopAnimated(0,1000);
}

function endGame(){
    document.removeEventListener("keydown" , () => inpField.focus());
    inpField.removeEventListener("input",initTyping);
    typingText.removeEventListener("click" , () => inpField.focus());
    document.addEventListener("keydown" , () => nameField.focus());
    popup.classList.add("open-popup");
    document.querySelector(".popup-content").classList.add("open-popup-content");
    
    document.querySelector(".mistake2 span").innerText = mistakes;
    let wpm = Math.round(((idx2-mistakes)/5 )/ (maxTime-timeLeft)*60);
    wpm = wpm <0 || !wpm || wpm === Infinity ? 0 : wpm;
    
    document.querySelector(".cpm2 span").innerText = idx2 - mistakes;
    document.querySelector(".wpm2 span").innerText = wpm;
}

function reset2(){
    let wpm = Math.round(((idx2-mistakes)/5 )/ (maxTime-timeLeft)*60);
    wpm = wpm <0 || !wpm || wpm === Infinity ? 0 : wpm;

    db.collection("test2").add({
        name : nameField.value,
        wpm : wpm,
        cpm : idx2-mistakes,
        mistakes : mistakes,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.removeEventListener("keydown" , () => nameField.focus());
    reset();
    document.querySelector(".popup-content").classList.remove("open-popup-content");
    popup.classList.remove("open-popup");
    nameField.value = "";
}

function result2(){
    let wpm = Math.round(((idx2-mistakes)/5 )/ (maxTime-timeLeft)*60);
    wpm = wpm <0 || !wpm || wpm === Infinity ? 0 : wpm;

    db.collection("test2").add({
        name : nameField.value,
        wpm : wpm,
        cpm : idx2-mistakes,
        mistakes : mistakes,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(()=>{window.location.href = "board.html";});
}

function result(){
    window.location.href = "board.html";
}

function test2(){
    if(nameField.value == ""){
        nameField.style.borderColor = "#cb3439";
    }else{
        nameField.style.borderColor = "#ccc";
        result2();
    }
}

function test1(){
    if(nameField.value == ""){
        nameField.style.borderColor = "#cb3439";
    }else{
        nameField.style.borderColor = "#ccc";
        reset2();
    }
}

inpField.addEventListener("input",initTyping);
tryAgainBtn.addEventListener("click" ,reset);
returnBtn.addEventListener("click" ,test1);

randomParagraph();
timeTag.innerHTML = maxTime;
//randomParagraph2();

function scrollTopAnimated(dist,dura) {
    $(".typing-text").animate(
        { scrollTop: dist }, dura);
};

function getRandomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
};

document.querySelector(".title h1").addEventListener("click", function() {
    const randomColor = getRandomColor();
    document.querySelector(".title h1").style.color = randomColor;
});

document.querySelector(".rotate-button").addEventListener("click", function() {
    window.location.href = "index.html?mode=rotate";
});