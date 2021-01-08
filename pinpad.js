let input = document.getElementById("pad");

function clicked(string){
  if (string != "back"){
    input.value += string;
  } else {
    let len = input.value.length;
    input.value = input.value.substring(0, len-1);
  }
}
