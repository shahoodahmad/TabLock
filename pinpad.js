let input = document.getElementById("pad");

function clicked(string){
  let len = input.value.length;
  if (string != "back" && len<6){
    input.value += string;
  } else if(string == "back"){
    input.value = input.value.substring(0, len-1);
  }
}
