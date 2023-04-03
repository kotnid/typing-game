// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

var ref = db.collection("data1");

function getBoard(){
    let rank = 1;
    const url = new URL(window.location);
    const sortby = url.searchParams.get('sortby');
    const type = url.searchParams.get('type');
    
    if(type == "rotate"){
        ref = db.collection("data2");
        document.querySelector(".rotate-text").style.display = "block";
    }

    if(sortby == null){
        ref.orderBy("wpm","desc").orderBy("cpm","desc").orderBy("mistakes","asc").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {  
                var new_row = document.createElement('div');
                new_row.className = "row";

                var d = doc.data()["createdAt"].toDate().toLocaleString();
                // console.log(Date(d));

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
                new_name.textContent = doc.data()["name"];
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
            })
        });
    }else{
        ref.orderBy(sortby,"desc").get().then(querySnapshot => {
            querySnapshot.forEach(doc => {  
                var new_row = document.createElement('div');
                new_row.className = "row";
                
                var d = doc.data()["createdAt"].toDate().toLocaleString();

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
                new_name.textContent = doc.data()["name"];
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
            })
        });
    }
}

function back(){
    window.location.href = "index.html";
}
getBoard();


const wpm = document.querySelector(".Wpm");
const cpm = document.querySelector(".Cpm");
const mistake = document.querySelector(".Mistake");
const user = document.querySelector(".User");
const rank = document.querySelector(".Rank");

wpm.addEventListener("click", function() {
    const url = new URL(window.location);
    const type = url.searchParams.get('type');
    if(type == "rotate"){
        window.location.href = "board.html?sortby=wpm&type=rotate";
    }else{
        window.location.href = "board.html?sortby=wpm";
    }
});

cpm.addEventListener("click", function() {
    const url = new URL(window.location);
    const type = url.searchParams.get('type');
    if(type == "rotate"){
        window.location.href = "board.html?sortby=cpm&type=rotate";
    }else{
        window.location.href = "board.html?sortby=cpm";
    }
});

mistake.addEventListener("click", function() {
    const url = new URL(window.location);
    const type = url.searchParams.get('type');
    if(type == "rotate"){
        window.location.href = "board.html?sortby=mistakes&type=rotate";
    }else{
        window.location.href = "board.html?sortby=mistakes";
    }
});

user.addEventListener("click", function() {
    const url = new URL(window.location);
    const type = url.searchParams.get('type');
    if(type == "rotate"){
        window.location.href = "board.html?sortby=createdAt&type=rotate";
    }else{
        window.location.href = "board.html?sortby=createdAt";
    }
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
        window.location.href = "board.html";
    }else{
        window.location.href = "board.html?type=rotate";
    }
});