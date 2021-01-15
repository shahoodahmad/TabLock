let input = document.getElementById("pad");
let lPin = null; //password
let aPin = null; //attempted pin
let status = false; //true if tab is locked, false otherwise

for (let i = 0; i < 11; i++){
  document.getElementById(`${i}`).addEventListener("click", function() {
    clicked(`${i}`);
  });
}

let form = document.getElementById("pinpad");
form.addEventListener("submit", function(){
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
    toggle_lock(true);
    alert("new pin set");
  
  } else if ((status) && (lPin == aPin)){
    //tab is locked on submit and correct pin entered

    alert("correct pin");
    localStorage.setItem("status", false);
    toggle_lock(false);

  } else {
    //tab is locked on submit and incorrect pin entered

    alert("incorrect pin");
  }

});

function clicked(string){
  let len = input.value.length;
  if (string != "10" && len<6){
    input.value += string;
  } else if(string == "10"){
    input.value = input.value.substring(0, len-1);
  }
}

function toggle_lock(bool){
  
}
