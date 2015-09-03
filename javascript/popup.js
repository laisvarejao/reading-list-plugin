window.onload = function() {
  document.getElementById("save-btn").addEventListener("click", saveCurrentPage);
}

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

    var titleNode = doc.getElementsByTagName("title")[0];
    var title = titleNode.childNodes[0].textContent;

    try {
      var imageNode = doc.getElementsByTagName("img")[0];
      var image = imageNode.src;
    } catch(err){}

    callback(url, title, image);
  };

  request.onerror = function() {
    errorCallback('Network error.');
  };
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
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
      renderStatus('Saving page ' + url);
      chrome.extension.sendRequest({});
    } else {
      renderStatus('You already saved this');
    }
  });
}
