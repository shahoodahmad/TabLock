let input = document.getElementById("pad");
let lPin = null; //password
let aPin = null; //attempted pin
let status = false; //true if tab is locked, false otherwise
//let swap = false;

for (let i = 0; i < 11; i++){
  document.getElementById(`${i}`).addEventListener("click", function() {
    clicked(`${i}`);
  });
}

function clicked(string){
  let len = input.value.length;
  if (string != "10" && len<6){
    input.value += string;
  } else if(string == "10"){
    input.value = input.value.substring(0, len-1);
  }
}

document.getElementById("pinpad").addEventListener("submit", function(){
  aPin = input.value;
  status = (localStorage.getItem("status") == "true"); //retrieve status from storage
  lPin = localStorage.getItem("pin");
  if (status == null){
     status = false;
  }


  if (!status){
    //tab is unlocked on submit
    lPin = aPin;
    localStorage.setItem("pin", lPin);
    localStorage.setItem("status", true);
    //toggle_lock(true);
    alert("New pin set");
    //swap = true;


  } else if ((status) && (lPin == aPin)){
    //tab is locked on submit and correct pin entered

    alert("Correct pin");
    localStorage.setItem("status", false);
    //swap = true
    //toggle_lock(false);

  } else {
    //tab is locked on submit and incorrect pin entered
    alert("Incorrect pin");
  }
  window.location.replace("instance.html");
});

function swap(){
    alert("yes");
    window.location.replace("instance.html");
  }

//function toggle_lock(bool){
//}
