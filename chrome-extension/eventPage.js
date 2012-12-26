chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action !== "search") {
    // unknown action
    return;
  }
  var query = request.query;
  var url = localStorage.getItem("tagbook-url") || null;
  var username = localStorage.getItem("tagbook-username") || null;
  var password = localStorage.getItem("tagbook-password") || null;

  if (!query || !username || !password) {
    sendResponse({error: "Tagbook server not configured!", data: null});
  } else {
    jQuery.ajax({
      url: url + "/search/" + encodeURIComponent(query),
      dataType: "json",
      success: function(result) {
        sendResponse({error: null, data: result});
      },
      error: function(jqXHR, textStatus, errorThrown) {
        sendResponse({error: errorThrown, data: null});
      }
    });
    // Asynchronous response
    return true;
  }
});