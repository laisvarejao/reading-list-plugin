window.onload = function() {
  loadList(false);
  document.getElementById('read-btn').addEventListener('click', function(){
    loadList(true);
  });
  document.getElementById('to-read-btn').addEventListener('click', function(){
    loadList(false);
  });
};

function loadList(done) {
  loadListTitle(done);
  loadReadingList(done);
}

function loadListTitle(done) {
  var listTitle = document.getElementById('list-title');
  listTitle.innerHTML = '';

  var title;
  if (!done) {
    title = document.createTextNode("THINGS YOU NEED TO READ");
  } else {
    title = document.createTextNode("THINGS YOU'VE READ ALREADY");
  }
  listTitle.appendChild(title);
}

function loadReadingList(done) {
  var readingList = document.getElementById('reading-list');
  readingList.innerHTML = '';

  chrome.storage.local.get({urls: []}, function(result) {
    result.urls.forEach(function(el) {
      if (el.done == done) {
        var div = document.createElement('div');
        div.className = 'thumbnail col-md-3 col-xs-6';

        var deleteLink = document.createElement('a');
        deleteLink.className = 'close';
        deleteLink.innerHTML = 'x';
        deleteLink.addEventListener('click', function() {
          removeUrl(el.url, function() {
            loadList(done);
          });
        });

        var title = document.createElement('div');
        title.className = 'thumbnail-title';
        title.innerHTML = el.title;

        var image = document.createElement('img');
        image.src = el.image;

        var link = document.createElement('a');
        link.href = el.url;
        link.appendChild(title);
        link.appendChild(image);
        
        var doneDiv = document.createElement('div'); 
        doneDiv.className = 'done-checkbox';
        
        var doneCheckbox = document.createElement('input');
        doneCheckbox.type = 'checkbox';
        doneCheckbox.checked = done;
        doneCheckbox.addEventListener('click', function() {
          updateDone(el.url, !done, function() {
            loadList(done);
          });
        });
        
        var doneLabel = document.createElement('label');
        doneLabel.innerHTML = 'Just read it ';

        doneLabel.appendChild(doneCheckbox);
        doneDiv.appendChild(doneLabel);

        div.appendChild(deleteLink);
        div.appendChild(link);
        div.appendChild(doneDiv);
        readingList.appendChild(div);
      }
    });
  });
}

function updateDone(url, done, callback) {
  chrome.storage.local.get({urls: []}, function(result) {
    var urls = result.urls;
    urls.forEach(function(el) {
      if (el.url == url) {
        el.done = done;
        chrome.storage.local.set({urls: urls});
        callback();
      }
    });
  });
}

function removeUrl(url, callback) {
  chrome.storage.local.get({urls: []}, function(result) {
    var urls = result.urls.filter(function (el) {
      return el.url !== url;
    });
    chrome.storage.local.set({urls: urls});
    callback();
  });
}