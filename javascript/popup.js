window.onload = function() {
  document.querySelector("#save-btn").addEventListener("click", saveCurrentPage);
};

function saveCurrentPage() {
  getCurrentTabUrl(function(url) {
    getPageContent(url, savePage, renderStatus);
  });
}

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

// Callback requires 3 parameters: a url, a title and an image
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

    var titleNode = doc.querySelector("title");
    var title = titleNode.childNodes[0].textContent;

    var image;
    try {
      var imageNode = doc.querySelector("img");
      image = imageNode.src;
    } catch(err){}

    callback(url, title, image);
  };

  request.onerror = function() {
    errorCallback('Network error.');
  };
}

function renderStatus(statusText) {
  document.querySelector('#status').textContent = statusText;
}

function savedAlready(urls, url) {
  var filteredUrls = urls.filter(function (el) {
    return el.url === url;
  });
  return filteredUrls.length > 0;
}

function savePage(url, title, image) {
  chrome.storage.local.get({urls: []}, function(result) {
    var urls = result.urls;
    if (!savedAlready(urls, url)) {
      urls.push({url: url, title: title, image: image, done: false});
      chrome.storage.local.set({urls: urls});
      chrome.extension.sendRequest({});
      renderStatus('Saving page ' + url);
    } else {
      renderStatus('You already saved this');
    }
  });
}
