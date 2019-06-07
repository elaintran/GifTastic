var giphy = "http://api.giphy.com/v1/gifs/";
var search = "search?q=";
var limit = "&limit=10";
var key = "&api_key=olNnoonalFjTJ2xzZ9ovXi3RJQTHayOW";

var gameArr = ["Fire Emblem", "Animal Crossing", "Super Mario", "Pokemon", "Splatoon", "Bayonetta"];

function tagDisplay() {
    $(".tags").empty();
    for (var i = 0; i < gameArr.length; i++) {
        var tag = $("<p>").attr("data-name", gameArr[i]).text(gameArr[i]);
        $(".tags").append(tag);
    }
}
tagDisplay();

$(".search").on("click", function(event) {
    //prevent page from refreshing
    event.preventDefault();
    //get input word
    term = $(".input-bar").val();
    //push search term into array
    gameArr.push(term);
    //making ajax call to get data
    $.ajax({
        url: giphy + search + term + limit + key,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        //var newGameTag = $("<div>").
    })
    tagDisplay();
})