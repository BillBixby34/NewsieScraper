// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class=headline-news>" + "<h2 class=head-title>" + data[i].title + "</h2>" + "<h3 class=head-link>" + data[i].link + "</h3>" + "</div>");
}
});