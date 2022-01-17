// TODO: finalize readme

//Global variable for storing all the instances
let instances = [];
let reservedKeywords = ['logoimg', 'header', 'tablock', 'hdr-text', 'container', 'mainDiv', 'tabBtn', 'windowBtn', 'tabContainer', 'windowContainer', 'divider'];

//retrieve instances array from storage and add buttons for each instance
chrome.storage.local.get("key", function(obj){
  instances = obj.key;

  //initialize array if it has not been previously initialized
  if (typeof instances == "undefined") {
      instances = [];
  }

  if (instances.length > 0){

    //putting instance buttons on screen
    for (let i = 0; i < instances.length; i++){
      setupInstance(instances[i]);
    }
  }

});  


//tab instance object constructor
function instance(instance_name, url_list, pwd, slt, isWindow){
    this.name = instance_name; //Name of instance to be displayed
    this.URLs = url_list; //list of encrypted URLs
    this.pin = pwd; //password for the instance
    this.salt = slt; //generated salt
    this.isWindow = isWindow; //true if the instance is a window
}

//function that handles populating the instance buttons onto the screen and aditional setup
function setupInstance(tabInstance){
    let delClicked = false; //flag var
    let containerType;

    //decides to add the button to the window container or tab container
    if (tabInstance.isWindow) {
        containerType = "windowContainer";
    } else {
        containerType = "tabContainer";
    }

    //find objects to be modified
    let container = document.getElementById(containerType);
    let btn = document.createElement("button");
    let delBtn = document.createElement("span");

    //setup new instance button
    btn.appendChild(document.createTextNode(tabInstance.name));
    btn.setAttribute("class", "instance");
    btn.setAttribute("id", tabInstance.name); //TODO: possible vulnerability here
                                              //if they name it after one of the preset ids, bad

    //setup delete button
    delBtn.appendChild(document.createTextNode("X"));
    delBtn.setAttribute("class", "close");

    //loads tabs from instance
    btn.addEventListener("click", function(){
      //prevents the button from being clicked if the close button is clicked
      if(!delClicked){
        //salt and hash attempted password
        pwd = prompt("Enter your password.");
        salt = tabInstance.salt;
        hashedPwd = CryptoJS.SHA256(pwd + salt).toString();

        //checks if entered password hash matches stored hash
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
      container.removeChild(document.getElementById(tabInstance.name));
      let pos = binSearch(instances, tabInstance.name);

      //remove from array and update storage
      instances.splice(pos, 1);
      chrome.storage.local.set({key: instances});
      delClicked = true;
    });

    container.append(btn);
    btn.appendChild(delBtn);
}

let createBtns = document.getElementsByClassName("create");
    //add click listener to each button
    for (let i = 0; i < createBtns.length; i++){
        createBtns[i].addEventListener("click", function(){
            let btnid = this.id;
            //Query focused window and get the active tab in that window
            chrome.windows.getCurrent({populate: true}, function(wind){
                let tabArray = wind.tabs;

                var isWindow = true;
                if (btnid == "tabBtn") {
                  isWindow = false;
                    for (let i = 0; i < tabArray.length; i++){
                        if (tabArray[i].active == true){
                            tabArray = [tabArray[i]];
                        }
                    }
                }

                let insName = prompt("Enter a name");           
                
                //only proceed if the user entered a name
                if (insName == null){
                    return;
                }

                //error check name
                insName = nameCheck(insName);
                
                //user may have cancelled during error checking
                if (insName == null){
                    return;
                }

                let pwd = prompt("Enter a password for your instance");
                
                let tabInstance = generateInstance(insName, pwd, tabArray, isWindow);

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
                 chrome.storage.local.set({key: instances});

            }); //window query
        }); //event listener
    }//end for loop

//crypto and creation of instance
function generateInstance(insName, pwd, tabArray, isWindow){

        //encrypt each url
        let encUrl = [];
        for (let i = 0; i < tabArray.length; i++){
            encUrl.push(CryptoJS.AES.encrypt(tabArray[i].url, pwd));
        }

        //generate 256 bit salt and hash + store password
        let salt = CryptoJS.lib.WordArray.random(32).toString();
        pwd = CryptoJS.SHA256(pwd.concat(salt)).toString();
        let tabInstance = new instance(insName, encUrl, pwd, salt, isWindow);
        return tabInstance;
}

//error checking for invalid names
function nameCheck(insName){

    while (insName == "" || insName.length > 10 || inGroup(instances, insName)){
        if(insName == ""){
            insName = prompt("Invalid entry: Enter another name");
        } else if (insName.length > 10){
            insName = prompt("Name cannot exceed 10 characters: Enter another name");
        }
        else {
            insName = prompt("Name already in use, enter a new name");
        }  
        if (insName == null){
            break;
        }
    }
    return insName;
}

//checks if instance is already in instance array or if the name is a reserved keyword
function inGroup(instances, elem){
  if (binSearch(instances, elem) == -1){
    if (reservedKeywords.includes(elem)){
        return true;
    }
    return false;
  } else {
    return true;
  }
}

//compares instance objects by name
function compare(x, y){
  if (x.name > y){
    return 1;
  } else if (x.name == y){
    return 0;
  } else {
    return -1;
  }
}

//binary search for searching through instance array
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

// event listeners to display tooltip on functional buttons
document.getElementById("tabBtn").addEventListener("mouseover", function(){
    document.getElementById("tooltip_tab").style.display="block";
});

document.getElementById("tabBtn").addEventListener("mouseleave", function(){
  document.getElementById("tooltip_tab").style.display="none";
});

document.getElementById("windowBtn").addEventListener("mouseover", function(){
    document.getElementById("tooltip_window").style.display="block";
});

document.getElementById("windowBtn").addEventListener("mouseleave", function(){
  document.getElementById("tooltip_window").style.display="none";
});


