$(function() {
  $("table tbody tr:not(.example)").click(function() {
    console.log("click");
    var row = $(this);
    var next = row.next();
    if (next.is(".example")) {
      next.toggle();
    };
  });
});