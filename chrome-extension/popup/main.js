function createNotification(title, body) {
  var notification = webkitNotifications.createNotification(
    null,
    title,
    body
  );

  notification.show();
};

function saveBookmark() {
  var scrollTop = 0;
  if ($("#inDoSaveScrollPosition").is(":checked")) {
    scrollTop = parseInt($("#inScrollTop").val(), 10);
  }

  var bookmark = {
    tags: $("#inTags").val().split(/[ ,]+/),
    description: $("#inDescription").val(),
    url: $("#inUrl").val(),
    scrollTop: scrollTop
  };

  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/bookmark',
    data: JSON.stringify(bookmark),
    success: function(data, textStatus) {
      createNotification("Added Bookmark", "");
      window.close();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      createNotification("Failed to add bookmark", errorThrown);
    }
  });

  return false;
};

$(function() {
  $("button").click(saveBookmark);

  chrome.tabs.getSelected(null, function(tab) {
    $("#inUrl").val(tab.url);
    $("#inDescription").val(tab.title);

    chrome.tabs.sendMessage(tab.id, "getScrollTop", function(response) {
      $("#inScrollTop").val(response.scrollTop);
    });

    // chrome.tabs.executeScript(tab.id, {code: "return window.scrollY;"}, function() {
    //   console.log('arguments: ', arguments);
    // })
  });
});