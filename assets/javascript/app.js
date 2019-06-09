var toggle = false;
var giphy = "https://api.giphy.com/v1/gifs/";
var search = "search?q=";
var limit = "&limit=12";
var key = "&api_key=olNnoonalFjTJ2xzZ9ovXi3RJQTHayOW";

var topics = ["fire emblem", "animal crossing", "paper mario", "pokemon", "splatoon", "bayonetta"];

function tagDisplay() {
    $(".tags").empty();
    for (var i = 0; i < topics.length; i++) {
        var buttonContainer = $("<div>").addClass("gif-tags");
        var tag = $("<p>").addClass("gif-button").attr("data-name", topics[i]).text(topics[i]);
        buttonContainer.append(tag);
        $(".tags").append(buttonContainer);
    }
}
tagDisplay();

function onLoadDisplay() {
    var activeElement = $("p[data-name='" + topics[1] + "']");
    tagActive(activeElement);
    ajaxCall(topics[1]);
}
onLoadDisplay();

function gifButton() {
    //get data-name for query url
    var button = $(this).attr("data-name");
    //clear previous active classes when clicking on a new button
    tagClear();
    //add new active classes
    tagActive(this);
    //call ajax for when button is clicked
    ajaxCall(button);
}

function tagClear() {
    $("p").removeClass("active");
    $(".selector").remove();
}

function tagActive(element) {
    var rightArrow = $("<div>").addClass("selector");
    $(element).addClass("active");
    $(element).parent().append(rightArrow);
}

$(".submit").on("click", function(event) {
    //prevent page from refreshing
    event.preventDefault();
    //get input word
    term = $(".input-bar").val().toLowerCase();
    //clear input
    $(".input-bar").val("");
    //select new tag
    var tagSelector = "p[data-name='" + term + "']";
    //if input is not empty
    if (term !== "") {
        //push search term into array if not in array already
        if (topics.indexOf(term) === -1) {
            topics.push(term);
        }
        //display new tag
        tagDisplay();
        //put active class on new tag
        tagActive(tagSelector);
        //display new gifs
        ajaxCall(term);
    }
})

function ajaxCall(input) {
    //clear gifs
    $(".gif-area").empty();
    var queryURL = giphy + search + input + limit + key;
    //making ajax call to get data
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
            var newGif = $("<div>").addClass("gif");
            var gifImage = $("<img/>");
            gifImage.addClass("gif-image").attr({
                "src": response.data[i].images.fixed_height_still.url,
                "data-animate": response.data[i].images.fixed_height.url,
                "data-still": response.data[i].images.fixed_height_still.url,
                "data-state": "still"
            });
            var rating = $("<div>").addClass("rating").text("Rated " + response.data[i].rating);
            var iconCenter = $("<div>").addClass("icon-center");
            var playContainer = $("<div>").addClass("play-container");
            var playIcon = $("<div>").addClass("play-icon");
            playContainer.append(playIcon);
            iconCenter.append(playContainer);
            newGif.append(gifImage).append(rating).append(iconCenter);
            $(".gif-area").append(newGif);
        }
    })
}

function checkWidth() {
    if ($(window).width() < 661) {
        if (toggle === false) {
            $(".tags").addClass("nav-active transition");
            $(".menu").addClass("slide-left transition");
            $(".gif-content").addClass("slide-left transition");
            $("body").css("position", "fixed");
            toggle = true;
        } else {
            $(".sidebar").removeClass("nav-active");
            $(".tags").removeClass("nav-active");
            $(".menu").removeClass("slide-left");
            $(".gif-content").removeClass("slide-left");
            $("body").css("position", "static");
            toggle = false;
        }
    } else {
        $(".tags").removeAttr("style");
        $(".menu").removeAttr("style");
        $(".gif-content").removeAttr("style");
        $("body").removeAttr("style");
    }
}

//display gifs with tags are clicked
$(".tags").on("click", ".gif-button", gifButton);

//toggle between static and animate
$(".gif-area").on("click", ".gif", function() {
    var thisImage = $(this).children("img");
    //if gif is static
    if (thisImage.attr("data-state") === "still") {
        //hide play button
        thisImage.siblings(".icon-center").hide();
        //thisImage.children(".icon-center").hide();
        //animate gif
        thisImage.attr({
            "src": thisImage.attr("data-animate"),
            "data-state": "animate"
        });
    //if gif is animate
    } else {
        //show play button
        thisImage.siblings(".icon-center").show();
        //make static
        thisImage.attr({
            "src": thisImage.attr("data-still"),
            "data-state": "still"
        });
    }
})

$(".toggle").on("click", function() {
    checkWidth();
    //runs only when window is resized so need to call function first
    $(window).resize(checkWidth);    
})