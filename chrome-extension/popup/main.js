function createNotification(title, body) {
  var notification = webkitNotifications.createNotification(
    null,
    title,
    body
  );

  notification.show();
};

function saveBookmark() {
  var bookmark = {
    tags: $("#inTags").val().split(/[ ,]+/),
    description: $("#inDescription").val(),
    url: $("#inUrl").val()
  };

  console.log('bookmark: ', bookmark);
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
  });
});