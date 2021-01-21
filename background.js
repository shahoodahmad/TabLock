
//Installation setup
chrome.runtime.onInstalled.addListener(function() {
    
    //on installation (or reload), setup empty tab instance array and store
    let instances = [];
    chrome.storage.sync.set({key: instances});
});