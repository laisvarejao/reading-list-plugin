chrome.browserAction.setBadgeBackgroundColor({ color: [255, 80, 80, 255] });
chrome.storage.local.get({urls: []}, function(result) {
  var unread = result.urls.filter(function (el) {
    return el.done == false;
   });
  chrome.browserAction.setBadgeText({text:unread.length.toString()});  
});