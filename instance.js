
//tab instance object constructor
function instance(instance_name, url_list, id_list){
    this.name = instance_name; //Name of instance to be displayed
    this.URLs = url_list; //list of encrypted URLs
    this.IDs = id_list; //ids of tabs
    this.encrypt = encryptUrl(); //maybe don't need as part of the object
    this.decrypt = decryptUrl();
}

//method to get list of URLs for instance
function getUrls(){

}

//method to encrypt a URL
function encryptUrl(){

}

//method to decrypt a URL
function decryptUrl(){

}

function unpackInstance(){

}


/*let test = document.getElementById("test");
test.addEventListener("click", function(){
    let body = document.getElementById("body");
    body.removeChild(document.getElementById(count));
    body.removeChild(document.getElementById("br" + count));
    count--;
});*/

let count = 0;

function setupInstance(tabInstance){
    let delClicked = false;
    let div = document.getElementById("div");
    let btn = document.createElement("button");
    let delBtn = document.createElement("span");
    btn.appendChild(document.createTextNode(tabInstance.name));
    btn.setAttribute("class", "instance");
    btn.setAttribute("id", tabInstance.name); //will replace count with the name of the
    delBtn.appendChild(document.createTextNode("X"));
    //let br = document.createElement("span");
    delBtn.setAttribute("class", "close");
    //br.setAttribute("id", "br" + count);
    btn.addEventListener("click", function(){
      if(!delClicked){
        chrome.tabs.create({url: tabInstance.URLs, active: false});
      }
      else{
        delClicked = false;
      }
    });
    delBtn.addEventListener("click", function(){
      div.removeChild(document.getElementById(tabInstance.name));
      //div.removeChild(document.getElementById("br" + count));
      count--;
      delClicked = true;
    });

    div.appendChild(btn);
    btn.appendChild(delBtn);
    //div.appendChild(br);
}

document.getElementById("tab").addEventListener("click", function(){
    chrome.tabs.query({active: true}, function(tabs){

        let insName = prompt("Enter a name");
        while (insName == "" || insName.length > 10 || inGroup(insName)){
          if(insName == ""){
            insName = prompt("Invalid entry: Enter another name");
          } else if (insName.length > 10){
            insName = prompt("Name cannot exceed 10 characters: Enter another name");
          }
          else {
            insName = prompt("Name already in use, enter a new name");
          }
        }

        if(insName != null){
          let tabInstance = new instance(insName, tabs[0].url, tabs[0].id);
          setupInstance(tabInstance);
          //chrome.tabs.remove(tabInstance.IDs);
        }

    });

});

function inGroup(){
  return false;
}

let store = document.getElementById("storage");
store.addEventListener("click", function(){

  let ins = new instance("bruh", "http://www.google.com", "abcde");
  let ins2 = new instance("yeet", "http://www.github.com", "defgh");
  let insArr = [ins, ins2];

  chrome.storage.sync.set({key: insArr}, function(){
    alert("saved");
  });

  chrome.storage.sync.get("key", function(obj){
    console.log(obj);
  });

  chrome.storage.sync.clear();

});
