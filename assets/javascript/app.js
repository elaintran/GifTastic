var giphy = "http://api.giphy.com/v1/gifs/";
var search = "search?q=";
var limit = "&limit=10";
var key = "&api_key=olNnoonalFjTJ2xzZ9ovXi3RJQTHayOW";

var gameArr = ["Fire Emblem", "Animal Crossing", "Super Mario", "Pokemon", "Splatoon", "Bayonetta"];

$("#input-bar").on("click", function(event) {
    //prevent page from refreshing
    event.preventDefault();
    term = $("#input-bar").val();

    //making ajax call to get data
    $.ajax({
        url: giphy + search + term + limit + key,
        method: "GET"
    }).then(function(response) {
        console.log(response);
    })
})