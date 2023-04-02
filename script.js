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

const paragraph_api = "http://metaphorpsum.com/sentences/25"

let idx2 = 0;
let mistakes = 0;

let timer , 
maxTime = 2;
timeLeft = maxTime;

let playing = false;

function getRandomParagraph(){
    return fetch(paragraph_api)
    .then(response => response.text())
    .then(data => {return data;})
}


// generate pharagraph
function randomParagraph(){
    typingText.innerHTML = "";
    let idx = Math.floor(Math.random() * pharagraphs.length);
    pharagraphs[idx].split("").forEach(span => {
        let spanTag = `<span>${span}</span>`;
        typingText.innerHTML += spanTag;
    })

    document.addEventListener("keydown" , () => inpField.focus());
    typingText.addEventListener("click" , () => inpField.focus());
    typingText.querySelectorAll("span")[0].classList.add("active");
}

//generate paragraph by api
async function randomParagraph2(){
    typingText.innerHTML = "";
    const pharagraph = await getRandomParagraph();
    console.log(pharagraph)
    pharagraph.split("").forEach(span => {
        let spanTag = `<span>${span}</span>`;
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
    mistakeTag.innerText = 0;
    timeTag.innerHTML = maxTime;
    document.querySelector(".typing-text").scrollTop = 0;
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
    document.removeEventListener("keydown" , () => nameField.focus());
    reset();
    document.querySelector(".popup-content").classList.remove("open-popup-content");
    popup.classList.remove("open-popup");
}

inpField.addEventListener("input",initTyping);
tryAgainBtn.addEventListener("click" ,reset);
returnBtn.addEventListener("click" ,reset2);
randomParagraph();

//randomParagraph2();