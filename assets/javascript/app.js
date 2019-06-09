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

$(".submit").on("click touchstart", function(event) {
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

//side nav toggle
$(".toggle").on("click", function() {
    //side nav is not open
    if (toggle === false) {
        //add class to go from 0px to 250px width
        $(".tags").addClass("nav-active transition");
        $(".menu").addClass("slide-left transition");
        //add class to push to right
        $(".gif-content").addClass("slide-left transition");
        //prevent body from scrolling when side nav is open
        $("body").css("position", "fixed");
        //allow for side nav to close when clicked next time
        toggle = true;
    //side nav is open
    } else {
        //set width back to 0
        $(".tags").removeClass("nav-active");
        //set margin back to 0
        $("div").removeClass("slide-left");
        //allow body to scroll again
        $("body").removeAttr("style");
        //allow for side nav to open on next click
        toggle = false;
    }
    navTransition();
    $(window).resize(navTransition); 
})

function navTransition() {
    //if side nav is open
    if (toggle === true) {
        //if width is more than 661px and matches the media query
        //using window.matchMedia because $(window).width() is not accurate
        //side nav uncollapsed state
        if (window.matchMedia("(min-width: 661px)").matches) {
            //remove transitions to prevent unnecessary animations between
            //collapsed and uncollapsed navigation
            $("div").removeClass("transition");
            //change body to static
            $("body").removeAttr("style");
        //side nav collapsed state
        } else {
            //return body to fixed to prevent scroll since side nav will be open
            $("body").css("position", "fixed");
        }
    //if side nav is not open
    } else {
        //if width is less than 660px and matches the media query
        //side nav collapsed state
        if (window.matchMedia("(max-width: 660px)").matches) {
            //add transitions to ease in to closed state
            $(".tags").addClass("transition");
            $(".menu").addClass("transition");
            $(".gif-content").addClass("transition");
            //change body to static
            $("body").removeAttr("style");
        //side nav uncollapsed state
        } else {
            //remove transition to prevent animation between states
            $("div").removeClass("transition");
        }
    }
}
//BUGS TO FIX
//need to create an error screen when no gifs are found
//need to fix responsiveness on mobile - search bar & sidenav
//need to fix width of sidebar on mobile - maybe make width a percent instead of px
//need to fix mobile searches - searches end up refreshing the page