function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

function getPageContent(url, errorCallback) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.send(null); //why is this needed?

  request.onload = function() {
    var response = request.responseText;
    if (!response) {
      errorCallback('No response from the page!');
      return;
    }
    alert(response);
    //Parse obj: image and title ! on the callback, saved the obj in local storage
  };

  request.onerror = function() {
    errorCallback('Network error.');
  };
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    renderStatus('Saved the page!');
    getPageContent(url, function(message){
      renderStatus(message);
    });
  });
});
