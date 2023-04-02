// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

const ref = db.collection("test");

function getBoard(){
    let rank = 1;
    const url = new URL(window.location);
    const sortby = url.searchParams.get('sortby');
    const rng = url.searchParams.get('timerng');
    let timerng;

    if(rng != null){
        const today = new Date();
        timerng = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }else{
        timerng = 0;
    }

    if(sortby == null){
        ref.orderBy("wpm","desc").orderBy("cpm","desc").orderBy("mistakes","asc").limit(10).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {  
                var new_row = document.createElement('div');
                new_row.className = "row";

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
                new_user.className = "User"
                new_user.textContent = doc.data()["name"];
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
        ref.orderBy(sortby,"desc").limit(10).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {  
                var new_row = document.createElement('div');
                new_row.className = "row";

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
                new_user.className = "User"
                new_user.textContent = doc.data()["name"];
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

wpm.addEventListener("click", function() {
    window.location.href = "board.html?sortby=wpm";
});

cpm.addEventListener("click", function() {
    window.location.href = "board.html?sortby=cpm";
});

mistake.addEventListener("click", function() {
    window.location.href = "board.html?sortby=mistakes";
});

user.addEventListener("click", function() {
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
});