
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
    let body = document.getElementById("body");
    let btn = document.createElement("button");
    btn.appendChild(document.createTextNode(tabInstance.name));
    btn.setAttribute("class", "instance");
    btn.setAttribute("id", count); //will replace count with the name of the instance
    let br = document.createElement("br");
    br.setAttribute("id", "br" + count);
    btn.addEventListener("click", function(){
        chrome.tabs.create({url: tabInstance.URLs, active: false});
    });

    body.appendChild(btn);
    body.appendChild(br);
}

document.getElementById("tab").addEventListener("click", function(){
    chrome.tabs.query({active: true}, function(tabs){
        
        let insName = prompt("Enter a name");
        let tabInstance = new instance(insName, tabs[0].url, tabs[0].id);
        setupInstance(tabInstance);
        //chrome.tabs.remove(tabInstance.IDs);

    });
    
});