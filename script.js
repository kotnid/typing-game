const typingText = document.querySelector(".typing-text p");
const inpField = document.querySelector(".wrapper .input-field");
const mistakeTag = document.querySelector(".mistake span");
const timeTag = document.querySelector(".time span b");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const tryAgainBtn = document.querySelector(".try-button");
const returnBtn = document.querySelector(".return-button");
const nameField = document.querySelector(".name-field");
const popup = document.querySelector(".popup");
const chart = document.querySelector(".chart");

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

const paragraph_api = "http://metaphorpsum.com/sentences/25"

let idx2 = 0;
let mistakes = 0;

let timer , 
maxTime = 2;
timeLeft = maxTime;

let playing = false;

let nxtline = 0;

let xValues = [];
let yValues = [];

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
            const Rect1 = characters[idx2-1].getBoundingClientRect();
            const Rect2 = characters[idx2].getBoundingClientRect();
            
            if(Math.abs((Rect1.top+Rect1.bottom)/2 - (Rect2.top+Rect2.bottom)/2) > Rect1.height/2){
                nxtline++;
            }
            
            if(nxtline == 3){
                const lineHeight = parseInt(getComputedStyle(typingText).lineHeight);
                scrollTopAnimated(document.querySelector(".typing-text").scrollTop+lineHeight,500);
                nxtline--;
            }
        }else{
            characters[idx2].classList.remove("active");
            idx2--;
            if(characters[idx2].classList.contains("incorrect")){
                mistakes--;
            }
            characters[idx2].classList.remove("correct" , "incorrect");
            
            if(idx2 != 0){
                const Rect1 = characters[idx2-1].getBoundingClientRect();
                const Rect2 = characters[idx2].getBoundingClientRect();

                if(Math.abs((Rect1.top+Rect1.bottom)/2 - (Rect2.top+Rect2.bottom)/2) > Rect1.height/2){
                    if(nxtline == 2){
                        const lineHeight = parseInt(getComputedStyle(typingText).lineHeight);
                        scrollTopAnimated(document.querySelector(".typing-text").scrollTop-lineHeight,500);
                    }
                }
            }
        }        

        console.log(nxtline);
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
        // console.log(wpm);
        xValues.push((maxTime-timeLeft).toFixed(2));
        yValues.push(wpm);
    }else{
        timeTag.innerText = 0;
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
    xValues = [];
    yValues = [];
    timeTag.innerHTML = maxTime;
    scrollTopAnimated(0,1000);
}

function endGame(){
    chart_ele.data.datasets[0].data = yValues;
    chart_ele.data.labels = xValues;
    chart_ele.update();

    chart.classList.add("open-chart");

    document.querySelector(".chart").style.display = "block";
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
    chart.classList.remove("open-chart");
    popup.classList.remove("open-popup");
    document.querySelector(".chart").style.display = "none";
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
        document.querySelector(".valid").style.display = "block";
    }else{
        nameField.style.borderColor = "#ccc";
        document.querySelector(".valid").style.display = "none";
        result2();
    }
}

function test1(){
    if(nameField.value == ""){
        nameField.style.borderColor = "#cb3439";
        document.querySelector(".valid").style.display = "block";
    }else{
        nameField.style.borderColor = "#ccc";
        document.querySelector(".valid").style.display = "none";
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
    const url = new URL(window.location);
    const mode = url.searchParams.get('mode');

    if(mode == "rotate"){
        window.location.href = "index.html";
    }else{
        window.location.href = "index.html?mode=rotate";
    }
});


// Chart
let chart_ele = new  Chart("myChart",{
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        fill: false,
        lineTension: 0,
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: yValues
      }]
    },
    options: {
        legend: {display: false},
        maintainAspectRatio: false,
    }
});