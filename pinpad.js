let input = document.getElementById("pad");


for (let i = 0; i < 11; i++){
  document.getElementById(`${i}`).addEventListener("click", function() {
    clicked(`${i}`)
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
