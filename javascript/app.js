angular.module('readingListApp', [])
  .controller('ReadingListController', function() {
    var toReadList = this;
    toReadList.urls = [{url:"google.com"}];

    chrome.storage.local.get({urls: []}, function(result) {
      //toReadList.urls = result.urls;
      toReadList.urls.push({url:"yahoo.com"});
      toReadList.urls.concat(console.log(result.urls.length));
    });

    //console.log(toReadList.urls);

    // [
    //   {text:'learn angular', done:true},
    //   {text:'build an angular app', done:false}];
 
    // toReadList.addTodo = function() {
    //   toReadList.todos.push({text:toReadList.todoText, done:false});
    //   toReadList.todoText = '';
    // };
 
    // toReadList.remaining = function() {
    //   var count = 0;
    //   angular.forEach(toReadList.todos, function(todo) {
    //     count += todo.done ? 0 : 1;
    //   });
    //   return count;
    // };
  });