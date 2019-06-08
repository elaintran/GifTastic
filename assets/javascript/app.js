var giphy = "https://api.giphy.com/v1/gifs/";
var search = "search?q=";
var limit = "&limit=10";
var key = "&api_key=olNnoonalFjTJ2xzZ9ovXi3RJQTHayOW";

var topics = ["Fire Emblem", "Animal Crossing", "Super Mario", "Pokemon", "Splatoon", "Bayonetta"];

function tagDisplay() {
    $(".tags").empty();
    for (var i = 0; i < topics.length; i++) {
        var tag = $("<p>").attr("data-name", topics[i]).text(topics[i]);
        $(".tags").append(tag);
    }
}
tagDisplay();

$(".search").on("click", function(event) {
    //prevent page from refreshing
    event.preventDefault();
    //get input word
    term = $(".input-bar").val();
    $(".input-bar").val("");
    //push search term into array
    topics.push(term);
    //making ajax call to get data
    $.ajax({
        url: giphy + search + term + limit + key,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
            var newGameTag = $("<div>").addClass("gif").append("<img src='" + response.data[i].images.fixed_height.url + "'>");
            $(".gif-area").append(newGameTag);
        }
    })
    tagDisplay();
})