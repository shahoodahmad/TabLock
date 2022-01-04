//TODO: error handling
//      only ask for password once we get a valid name
//      error check on password (some basic requirements)
//TODO: more intuitive ui
//      Color code on windows vs tab instances
//      better layout
//      better description of how to use the extension
//TODO: Tidy up code with comments

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
function instance(instance_name, url_list, pwd, slt){
    this.name = instance_name; //Name of instance to be displayed
    this.URLs = url_list; //list of encrypted URLs
    this.pin = pwd; //password for the instance
    this.salt = slt;
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
        //salt and hash attempted password
        pwd = prompt("Enter your password.");
        salt = tabInstance.salt;
        hashedPwd = CryptoJS.SHA256(pwd + salt).toString();

        if (hashedPwd == tabInstance.pin) {
            for (let i = 0; i < tabInstance.URLs.length; i++){
                let decryptedUrl = CryptoJS.AES.decrypt(tabInstance.URLs[i], pwd).toString(CryptoJS.enc.Utf8);
                chrome.tabs.create({url: decryptedUrl});
            }
        } else {
            alert("Incorrect password.");
        }

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

let createBtns = document.getElementsByClassName("create");
    //add click listener to each button
    for (let i = 0; i < createBtns.length; i++){
        createBtns[i].addEventListener("click", function(){
            let btnid = this.id;
            //Query focused window and get the active tab in that window
            chrome.windows.getLastFocused({populate: true}, function(wind){
                console.log(wind);
                let tabArray = wind.tabs;
                if (btnid == "tab") {
                    for (let i = 0; i < tabArray.length; i++){
                        if (tabArray[i].active == true){
                            tabArray = [tabArray[i]];
                        }
                    }
                }


                let insName = prompt("Enter a name");
                let pwd = prompt("Enter a password for your instance");

                //encrypt each url
                let encUrl = [];
                for (let i = 0; i < tabArray.length; i++){
                    encUrl.push(CryptoJS.AES.encrypt(tabArray[i].url, pwd));
                }

                //generate 256 bit salt and hash + store password
                let salt = CryptoJS.lib.WordArray.random(32).toString();
                pwd = CryptoJS.SHA256(pwd.concat(salt)).toString();
        
                let tabInstance = new instance(insName, encUrl, pwd, salt); 
        
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
                    tabInstance = new instance(insName, encUrl, pwd, salt);
                }

                if(insName != null){
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
                }



            }); //window query
        }); //event listener
    }//end for loop

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


//let iFr = document.getElementById("pad-frm");
//let elem = iFr.contentDocument.getElementById("1");
//elem.style.display = "none";

//window.frames['pad_frm'].document.getElementById('1').addEventListener("click", function(){
  //  alert("1 pressed");
//});
