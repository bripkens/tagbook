(function($) {
  var apiEndpoint = "http://localhost:3000/search/";

  var previousQuery = null;

  var overlay = null;
  var container = null;
  var message = null;
  var input = null;
  var output = null;
  var selectedItem = null;

  function removeAllChildren(parent) {
    var children = parent.childNodes;
    var count = children.length;
    for (var i = count - 1; i >= 0; i--) {
      parent.removeChild(children[i]);
    }
  };

  /*
   * ######################################################
   *          DOM content generation and visibility
   * ######################################################
   */
  function domReady() {
    overlay = document.createElement("div");
    overlay.classList.add("tagbook-overlay");
    document.body.appendChild(overlay);

    container = document.createElement("div");
    container.classList.add("tagbook");

    input = document.createElement("input");
    input.type = "text";
    container.appendChild(input);

    message = document.createElement("div");
    message.classList.add("tagbook-message");
    container.appendChild(message);

    output = document.createElement("ul");
    container.appendChild(output);

    document.body.appendChild(container);

    input.addEventListener("keyup", searchBoxKeyUp, false);
    overlay.addEventListener("click", hide, false);
    handleAutoScroll();
  };
  if (typeof document !== "undefined" && document.hasOwnProperty("body")) {
    domReady();
  } else {
    window.addEventListener("DOMContentLoaded", domReady, false);
  }


  function positionBoxes() {
    var outerWidth = container.offsetWidth;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    container.style.left = ((windowWidth - outerWidth) / 2) + "px";
    overlay.style.width = windowWidth + "px";
    overlay.style.height = windowHeight + "px";
  };
  window.addEventListener("resize", positionBoxes, false);

  function isSearchVisible() {
    return container.classList.contains("tagbook-visible");
  };

  function show() {
    removeAllChildren(output);
    hideMessage();
    positionBoxes();
    container.classList.add("tagbook-visible");
    overlay.classList.add("tagbook-visible");
    input.value = "";

    // command execution needs to be deferred in order for element visibility
    // to change
    setTimeout(function() {
      input.focus();
    }, 100);
  };

  function hide() {
    container.classList.remove("tagbook-visible");
    overlay.classList.remove("tagbook-visible");
    document.body.focus();
  };

  window.addEventListener("keydown", function(e) {
    if (e.metaKey && e.keyCode === 69) {
      if (!isSearchVisible()) {
        show();
      } else {
        hide();
      }
    } else if (e.keyCode === 27) {
      hide();
    }
    return false;
  }, false);

  function showMessage(text) {
    message.innerHTML = "";
    message.appendChild(document.createTextNode(text));
    message.classList.add("tagbook-visible");
  };

  function hideMessage() {
    message.classList.remove("tagbook-visible");
  };

  function handleAutoScroll() {
    var match = window.location.search.match(/[?&]tagbook-scroll-top=(\d+)/);
    if (match) {
      window.scrollTo(0, parseInt(match[1], 10));
    }
  };

  /*
   * ######################################################
   *                  Handling user input
   * ######################################################
   */
  function searchBoxKeyUp(e) {
    var up = 38;
    var down = 40;
    var enter = 13;

    if (e.keyCode === up) {
      var next = selectedItem.previousElementSibling;
      if (next) {
        selectedItem.classList.remove("tagbook-active");
        next.classList.add("tagbook-active");
        selectedItem = next;
      }
    } else if (e.keyCode === down) {
      var next = selectedItem.nextElementSibling;
      if (next) {
        selectedItem.classList.remove("tagbook-active");
        next.classList.add("tagbook-active");
        selectedItem = next;
      }
    } else if (e.keyCode === enter) {
      if (selectedItem) {
        var a = selectedItem.children[0];
        if (e.metaKey || e.ctrlKey) {
          a.target = "_blank";
        }
        a.click();
        hide();
      }
      return false;
    } else {
      searchForProposals();
    }
  };

  function searchForProposals() {
    var query = input.value;
    if (query === previousQuery) {
      return;
    } else if (!query) {
      hideMessage();
      return;
    }
    previousQuery = query;

    if (query.length < 3) {
      showMessage("The given query is too short.");
      return;
    }
    hideMessage();

    var url = apiEndpoint + encodeURIComponent(query);
    $.ajax({
      url: url,
      dataType: "json",
      success: function(result) {
        // make sure that we are displaying the results for the entered query.
        // Network latency is a bitch!
        if (query === input.value) {
          showProposals(result);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        showMessage("Damn, the server request resulted in an error!");
        console.log('textStatus: ', textStatus);
        console.log('errorThrown: ', errorThrown);
        previousQuery = null;
      }
    });
  };

  function showProposals(proposals) {
    removeAllChildren(output);

    if (proposals.length === 0) {
      showMessage("The matching bookmarks found for this query.");
      return;
    }

    proposals.forEach(function(proposal) {
      var bookmark = proposal.bookmark;
      var li = document.createElement("li");
      var a = document.createElement("a");
      var href = bookmark.url;
      var queryParam = "tagbook-scroll-top=" + bookmark.scrollTop;
      if (href.indexOf("?") !== -1) {
        href = href.replace("?", "?" + queryParam + "&");
      } else if (href.indexOf("#") !== -1) {
        href = href.replace("#", "?" + queryParam + "#");
      } else {
        href += "?" + queryParam;
      }
      a.href = href;
      a.title = bookmark.description;
      li.appendChild(a);

      var description = bookmark.description || "No description defined";
      var descNode = document.createElement("span");
      descNode.classList.add("tagbook-description");
      descNode.appendChild(document.createTextNode(bookmark.description));
      a.appendChild(descNode);

      var urlNode = document.createElement("span");
      urlNode.classList.add("tagbook-url");
      urlNode.appendChild(document.createTextNode(bookmark.url));
      a.appendChild(urlNode);

      output.appendChild(li);
    });

    selectedItem = output.childNodes[0];
    selectedItem.classList.add("tagbook-active");
  };

  /*
   * ######################################################
   *     Providing additional information to the popup
   * ######################################################
   */
  chrome.extension.onMessage.addListener(function(request,
      sender, sendResponse) {
    if (request === "getScrollTop") {
      sendResponse({ scrollTop: window.scrollY });
    }
  });
})(jQuery);