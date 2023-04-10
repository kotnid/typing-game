// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

var ref = db.collection("data3");

function getBoard(){
    let rank = 1;
    const url = new URL(window.location);
    const sortby = url.searchParams.get('sortby');
    const type = url.searchParams.get('type');
    const filter = url.searchParams.get("filter");
    
    if(type == "rotate"){
        ref = db.collection("data4");
        document.querySelector(".rotate-text").style.display = "block";
    }

    if(sortby == null){
        ref.orderBy("wpm","desc").orderBy("cpm","desc").orderBy("mistakes","asc").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {  
                var new_row = document.createElement('div');
                new_row.className = "row";

                var d = doc.data()["createdAt"].toDate().toLocaleString();
                // console.log(Date(d));
                
                const tdy = new Date();
                // console.log(tdy.toDateString());
                if (filter == "true" && tdy.toDateString() != doc.data()["createdAt"].toDate().toDateString()){
                    //console.log(d);
                }else{

                    if (rank==1){
                        new_row.className += " no1";
                    }else if (rank==2){
                        new_row.className += " no2";
                    }else if (rank==3){
                        new_row.className += " no3";
                    }
                    
                    var new_rank = document.createElement('div');
                    new_rank.className = "Rank"
                    new_rank.textContent = rank;
                    new_row.appendChild(new_rank);

                    var new_user = document.createElement('div');
                    new_user.className = "User";

                    var new_date = document.createElement('div');
                    new_date.textContent = d;
                    new_date.className = "hid";
                    new_user.appendChild(new_date);

                    var new_name = document.createElement('div');
                    new_name.textContent = doc.data()["class"]+doc.data()["classno"].toString().padStart(2, '0');
                    new_user.appendChild(new_name);

                    new_row.appendChild(new_user);

                    var new_wpm = document.createElement('div');
                    new_wpm.className = "Wpm"
                    new_wpm.textContent = doc.data()["wpm"];
                    new_row.appendChild(new_wpm);

                    var new_cpm = document.createElement('div');
                    new_cpm.className = "Cpm"
                    new_cpm.textContent = doc.data()["cpm"];
                    new_row.appendChild(new_cpm);

                    var new_mistake = document.createElement('div');
                    new_mistake.className = "Mistake"
                    new_mistake.textContent = doc.data()["mistakes"];
                    new_row.appendChild(new_mistake);


                    document.querySelector(".content").appendChild(new_row);
                    rank++;
                };
            })
        });
    }else{
        ref.orderBy(sortby,"desc").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {  
                var new_row = document.createElement('div');
                new_row.className = "row";
                
                var d = doc.data()["createdAt"].toDate().toLocaleString();
                const tdy = new Date();
                if (filter == "true" && tdy.toDateString() != doc.data()["createdAt"].toDate().toDateString()){

                }else{
                    if (rank==1){
                        new_row.className += " no1";
                    }else if (rank==2){
                        new_row.className += " no2";
                    }else if (rank==3){
                        new_row.className += " no3";
                    }
                    
                    var new_rank = document.createElement('div');
                    new_rank.className = "Rank"
                    new_rank.textContent = rank;
                    new_row.appendChild(new_rank);

                    var new_user = document.createElement('div');
                    new_user.className = "User";

                    var new_date = document.createElement('div');
                    new_date.textContent = d;
                    new_date.className = "hid";
                    new_user.appendChild(new_date);

                    var new_name = document.createElement('div');
                    new_name.textContent = doc.data()["class"]+doc.data()["classno"].toString().padStart(2, '0');
                    new_user.appendChild(new_name);

                    new_row.appendChild(new_user);

                    var new_wpm = document.createElement('div');
                    new_wpm.className = "Wpm"
                    new_wpm.textContent = doc.data()["wpm"];
                    new_row.appendChild(new_wpm);

                    var new_cpm = document.createElement('div');
                    new_cpm.className = "Cpm"
                    new_cpm.textContent = doc.data()["cpm"];
                    new_row.appendChild(new_cpm);

                    var new_mistake = document.createElement('div');
                    new_mistake.className = "Mistake"
                    new_mistake.textContent = doc.data()["mistakes"];
                    new_row.appendChild(new_mistake);


                    document.querySelector(".content").appendChild(new_row);
                    rank++;
                }
            })
        });
    }
}

function init(){
    const url = new URL(window.location);
    const filter = url.searchParams.get("filter");

    if (filter == "true") {
        document.querySelector(".daily-button").textContent = "All time";
    } else {
        document.querySelector(".daily-button").textContent = "Daily";
    }
}

function back(){
    window.location.href = "index.html";
}
getBoard();
init();

const wpm = document.querySelector(".Wpm");
const cpm = document.querySelector(".Cpm");
const mistake = document.querySelector(".Mistake");
const user = document.querySelector(".User");
const rank = document.querySelector(".Rank");

wpm.addEventListener("click", function() {
    const url = new URL(window.location);
    
    url.searchParams.set("sortby", "wpm");
    const newUrl = url.toString();
    window.location.href = newUrl; 
});

cpm.addEventListener("click", function() {
    const url = new URL(window.location);
    
    url.searchParams.set("sortby", "cpm");
    const newUrl = url.toString();
    window.location.href = newUrl; 
});

mistake.addEventListener("click", function() {
    const url = new URL(window.location);
    
    url.searchParams.set("sortby", "mistakes");
    const newUrl = url.toString();
    window.location.href = newUrl; 
});

user.addEventListener("click", function() {
    const url = new URL(window.location);
  
    url.searchParams.set("sortby", "createdAt");
    const newUrl = url.toString();
    window.location.href = newUrl; 
    
});

rank.addEventListener("click", function() {
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
});

const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    button.disabled = true;

    setTimeout(() => {
      button.disabled = false;
    }, 1500); // enable the button after 2 seconds
  });
});

document.querySelector(".rotate-button").addEventListener("click", function() {
    const url = new URL(window.location);
    const mode = url.searchParams.get('type');

    if(mode == "rotate"){
        url.searchParams.set("type", null);
        const newUrl = url.toString();
        window.location.href = newUrl; 
    }else{
        url.searchParams.set("type", "rotate");
        const newUrl = url.toString();
        window.location.href = newUrl; 
    }
});

document.querySelector(".daily-button").addEventListener("click" , function(){
    const url = new URL(window.location);
    const filter = url.searchParams.get("filter");

    if (filter == "true") {
        url.searchParams.set("filter", null);
        const newUrl = url.toString();
        window.location.href = newUrl; 
    } else {
        url.searchParams.set("filter", true);
        const newUrl = url.toString();
        window.location.href = newUrl; 
    }
})

document.getElementById("github").addEventListener("click" , ()=>{
    window.location.href = "https://github.com/kotnid/typing-game";
});