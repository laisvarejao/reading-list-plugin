function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    
    chrome.storage.local.get({urls: []}, function(result) {
      var urls = result.urls;
      urls.push({url: url, done: false});
      chrome.storage.local.set({urls: urls});
      callback(url);
    });
  });
}

// function getPageContent(url, callback, errorCallback) {
//   var request = new XMLHttpRequest();
//   request.open("GET", url, true);
//   request.send(null); //why is this needed?

//   request.onload = function() {
//     var response = request.responseText;
//     if (!response) {
//       errorCallback('No response from the page!');
//       return;
//     }

//     var parser = new DOMParser();
//     var doc = parser.parseFromString(response, "text/html");

//     //TODO
//     var object = null;
//     callback(object);
//   };

//   request.onerror = function() {
//     errorCallback('Network error.');
//   };
// }

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    renderStatus('Saving... ' + url);
  });
});

// What's the limit of callbacks? when to know where to stop?
