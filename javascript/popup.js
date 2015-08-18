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

function getPageContent(url, callback, errorCallback) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.send(null); //why is this needed?

  request.onload = function() {
    var response = request.responseText;
    if (!response) {
      errorCallback('No response from the page!');
      return;
    }

    var parser = new DOMParser();
    var doc = parser.parseFromString(response, "text/html");

    //TODO
    var object = null;
    callback(object);
  };

  request.onerror = function() {
    errorCallback('Network error.');
  };
}

function saveArticle(object) {

}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(
    getPageContent(url, function() {
        saveArticle(object);
        renderStatus('Saved the Article.');
      }, function(message) { //why the encapsulation? 
      renderStatus(message);
    });
  });
});

// What's the limit of callbacks? when to know where to stop?
