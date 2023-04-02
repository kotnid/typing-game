const typingText = document.querySelector(".typing-text p");
const inpField = document.querySelector(".wrapper .input-field");
const mistakeTag = document.querySelector(".mistake span");
const timeTag = document.querySelector(".time span b");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const tryAgainBtn = document.querySelector(".try-button");

let idx2 = 0;
let mistakes = 0;

let timer , 
maxTime = 60;
timeLeft = maxTime;

let playing = false;

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

// check typing
function initTyping(){
    const characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[idx2];

    if(timeLeft > 0 && idx2 < characters.length -1){
        if(!playing){
            timer = setInterval(initTimer , 1000);
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
        timeLeft--;
        timeTag.innerText = timeLeft;

        let wpm = Math.round(((idx2-mistakes)/5 )/ (maxTime-timeLeft)*60);
        wpm = wpm <0 || !wpm || wpm === Infinity ? 0 : wpm;
        
        cpmTag.innerText = idx2 - mistakes;
        wpmTag.innerText = wpm;
    }else{
        clearInterval(timer);
    }
}

function reset(){
    clearInterval(timer);
    randomParagraph();
    inpField.value = "";
    idx2 = 0;
    mistakes = 0;  
    timeLeft = maxTime;
    playing = false;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    timeTag.innerHTML = maxTime;
}

inpField.addEventListener("input",initTyping);
tryAgainBtn.addEventListener("click" ,reset);
randomParagraph();