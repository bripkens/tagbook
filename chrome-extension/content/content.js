var searchVisible = false;

function showProposals(proposals) {
  var output = $(".tagbook ul");
  output.children().remove();

  proposals.forEach(function(proposal) {
    var li = document.createElement('li');

    if (proposal.description) {
      var descNode = document.createElement("span");
      descNode.classList.add("tagbook-description");
      $(descNode).text(proposal.description);
      li.appendChild(descNode);
    }

    var urlNode = document.createElement("span");
    urlNode.classList.add("tagbook-url");
    $(urlNode).text(proposal.url);
    li.appendChild(urlNode);

    $(li).click(function() {
      window.location.href = proposal.url;
    });

    output.append(li);
  });

  output.children().first().addClass("active");
};

function searchForProposals() {
  var query = encodeURIComponent($(".tagbook input").val());

  if (query.length < 3) {
    showProposals([]);
    return;
  }

  var url = "http://localhost:3000/search/" + query;
  $.ajax({
    contentType: "text/plain",
    data: { query: query },
    url: url,
    success: function(result) {
      showProposals(JSON.parse(result));
    }
  });
};

function searchBoxKeyUp(e) {
  var up = 38;
  var down = 40;
  var enter = 13;

  if (e.keyCode === up) {
    var prev = $(".tagbook li.active");
    var next = prev.prev();
    if (next.length > 0) {
      prev.removeClass("active");
      next.addClass("active");
    }
  } else if (e.keyCode === down) {
    var prev = $(".tagbook li.active");
    var next = prev.next();
    if (next.length > 0) {
      prev.removeClass("active");
      next.addClass("active");
    }
  } else if (e.keyCode === enter) {
    $(".tagbook li.active").click();
    return false;
  } else {
    searchForProposals();
  }
};

function showSearchBar() {
  searchVisible = true;

  var div = document.createElement("div");
  div.classList.add("tagbook");

  var input = document.createElement("input");
  input.type = "text";
  div.appendChild(input);

  var output = document.createElement("ul");
  div.appendChild(output);

  document.body.appendChild(div);
  var outerWidth = $(div).outerWidth();
  var windowWidth = $(window).width();
  $(div).css("left", (windowWidth - outerWidth) / 2);

  $(input).focus();
  $(input).keyup(searchBoxKeyUp);
};

function hideSearchBar() {
  $(".tagbook").remove();
  searchVisible = false;
};

$(function() {
  $(window).keydown(function(e) {
    if (e.metaKey && e.keyCode === 69 && !searchVisible) {
      showSearchBar();
      return false;
    } else if (e.keyCode === 27) {
      hideSearchBar();
    }
  });
});