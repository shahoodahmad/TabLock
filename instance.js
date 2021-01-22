let instances = [];

//retrieve instances array from storage and add buttons for each instance
chrome.storage.sync.get("key", function(obj){
  instances = obj.key;

  if (instances.length > 0){

    //putting instance buttons on screen
    for (let i = 0; i < instances.length; i++){
      setupInstance(instances[i]);
    }
  }

});




//tab instance object constructor
function instance(instance_name, url_list, id_list){
    this.name = instance_name; //Name of instance to be displayed
    this.URLs = url_list; //list of encrypted URLs
    this.IDs = id_list; //ids of tabs
    this.pin = null;
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


function setupInstance(tabInstance){
    let delClicked = false; //flag var

    let div = document.getElementById("div");
    let btn = document.createElement("button");
    let delBtn = document.createElement("span");

    //setup instance button
    btn.appendChild(document.createTextNode(tabInstance.name));
    btn.setAttribute("class", "instance");
    btn.setAttribute("id", tabInstance.name); //will replace count with the name of the

    //setup delete button
    delBtn.appendChild(document.createTextNode("X"));
    delBtn.setAttribute("class", "close");

    //loads tabs from instance
    btn.addEventListener("click", function(){
      if(!delClicked){
        chrome.tabs.create({url: tabInstance.URLs, active: false});
        localStorage.setItem("pin", tabInstance.pin);
        window.location.replace("pinpad.html");
      }
      else{
        delClicked = false;
      }
    });

    //deletes instance button and removes from array
    delBtn.addEventListener("click", function(){
      div.removeChild(document.getElementById(tabInstance.name));
      let pos = binSearch(instances, tabInstance);

      //remove from array and update storage
      instances.splice(pos, 1);
      chrome.storage.sync.set({key: instances});
      delClicked = true;
    });

    div.appendChild(btn);
    btn.appendChild(delBtn);
}

document.getElementById("tab").addEventListener("click", function(){
    chrome.tabs.query({active: true}, function(tabs){

        let insName = prompt("Enter a name");
        let tabInstance = new instance(insName, tabs[0].url, tabs[0].id);

        //error checking for invalid names
        while (insName == "" || insName.length > 10 || inGroup(instances, tabInstance)){
          if(insName == ""){
            insName = prompt("Invalid entry: Enter another name");
          } else if (insName.length > 10){
            insName = prompt("Name cannot exceed 10 characters: Enter another name");
          }
          else {
            insName = prompt("Name already in use, enter a new name");
          }
          tabInstance = new instance(insName, tabs[0].url, tabs[0].id);
        }

        if(insName != null){

          //switch to pinpad
          window.location.replace("pinpad.html");


          tabInstance.pin = localStorage.getItem("pin");

          setupInstance(tabInstance);
          instances.push(tabInstance);

          //sort instances alphabetically by name
          instances.sort(function(x, y){
            if (x.name > y.name){
              return 1;
            } else {
              return -1;
            }
          });
          chrome.storage.sync.set({key: instances});

          //TODO: remove tab after instance is created
          //chrome.tabs.remove(tabInstance.IDs);

        }

    });

});

//checks if instance is already in instance array
function inGroup(instances, elem){
  if (binSearch(instances, elem) == -1){
    return false;
  } else {
    return true;
  }
}

function compare(x, y){
  if (x.name > y.name){
    return 1;
  } else if (x.name == y.name){
    return 0;
  } else {
    return -1;
  }
}

function binSearch(instances, elem){
  let start = 0;
  let end = instances.length;

  while (start < end){
    let mid = Math.floor(start + (end - start)/2);
    if (compare(instances[mid], elem) == 0){//found
      return mid;
    }else if (compare(instances[mid], elem) == 1){ //mid > elem
      end = mid;
    } else {//mid < elem
      start = mid + 1;
    }

  }

  return -1;

}
