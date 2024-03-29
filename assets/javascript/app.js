//global variables
//parts of the queryurl
var giphy = "https://api.giphy.com/v1/gifs/";
var search = "search?q=";
var limit = "&limit=12";
var key = "&api_key=olNnoonalFjTJ2xzZ9ovXi3RJQTHayOW";
//conditionals
var toggle = false;
var found = false;

//array of preset gif tabs
var topics = ["fire emblem", "animal crossing", "paper mario", "pokemon", "splatoon", "bayonetta"];

$(document).ready(function() {
    //display initial gif tabs
    function tabDisplay() {
        //clear tabs section
        $(".tabs").empty();
        //loop through topics array
        for (var i = 0; i < topics.length; i++) {
            //add div for tabs
            var buttonContainer = $("<div>").addClass("gif-tabs");
            //add individual tabs
            var tab = $("<p>").addClass("gif-button").attr("data-name", topics[i]).text(topics[i]);
            //place tabs into div
            buttonContainer.append(tab);
            //place div on the side nav
            $(".tabs").append(buttonContainer);
        }
    }
    tabDisplay();

    //display gifs on load so screen won't be empty
    function onLoadDisplay() {
        //select the p element by data name from array
        var activeElement = $("p[data-name='" + topics[1] + "']");
        //place selector on active gif tab
        tabActive(activeElement);
        //ajax call to pull data and display gifs
        ajaxCall(topics[1]);
    }
    onLoadDisplay();

    //display gifs when tab is clicked on
    function gifTab() {
        //get data-name of tab clicked for query url
        var button = $(this).attr("data-name");
        //clear previous active classes when clicking on a new button
        tabClear();
        //add new active classes
        tabActive(this);
        //ajax call for when button is clicked
        ajaxCall(button);
    }

    //remove active classes on buttons
    function tabClear() {
        $("p").removeClass("active");
        $(".selector").remove();
    }

    //add active classes on buttons
    function tabActive(element) {
        var rightArrow = $("<div>").addClass("selector");
        //change text color from gray to white
        $(element).addClass("active");
        //add pointer to active element
        $(element).parent().append(rightArrow);
    }

    //submit listener on form instead of input for it to work on mobile
    //search for gifs once form is submitted
    $(".search-bar").on("submit", function(event) {
        //prevent page from refreshing
        event.preventDefault();
        //get input word, trim white space from sides, set to lowercase compared to array
        term = $(".input-bar").val().trim().toLowerCase();
        //clear input
        $(".input-bar").val("");
        //select new tab
        var tabSelector = "p[data-name='" + term + "']";
        //if input is not empty
        if (term !== "") {
            //display new gifs first to see if results are found or not
            //wait for ajax to finish loading to get boolean from found variable
            //if no promise is made, the wrong boolean will be called due to asynchronicity
            ajaxCall(term).then(function() {
                //if results are found
                if (found === true) {
                    //push search term into array if not in array already
                    if (topics.indexOf(term) === -1) {
                        topics.push(term);
                    }
                    //display new list of tabs
                    tabDisplay();
                    //put active class on new tab
                    tabActive(tabSelector);
                //no results found
                } else {
                    //clear current active class so no classes are active when error page is shown
                    tabClear();
                }
            });
        }
        //prevent page from refreshing on submit
        return false;
    })

    //making ajax call to get data to get gifs
    function ajaxCall(input) {
        //clear gifs
        $(".gif-area").empty();
        //piece together queryurl
        var queryURL = giphy + search + input + limit + key;
        //return ajax to get the boolean from the found variable
        return $.ajax({
            url: queryURL,
            method: "GET"
        //once data has been retrieved, run function
        }).then(function(response) {
            console.log(response);
            //if there is more than one result
            if (response.data.length !== 0) {
                //loop through data array
                for (var i = 0; i < response.data.length; i++) {
                    //create gif container
                    var newGif = $("<div>").addClass("gif");
                    //place gif in image element and add animate and still states
                    var gifImage = $("<img/>");
                    gifImage.addClass("gif-image").attr({
                        "src": response.data[i].images.fixed_height_still.url,
                        "data-animate": response.data[i].images.fixed_height.url,
                        "data-still": response.data[i].images.fixed_height_still.url,
                        "data-state": "still"
                    });
                    //create rating element
                    var rating = $("<div>").addClass("rating").text("Rated " + response.data[i].rating);
                    //create play button in center of gif
                    var iconCenter = $("<div>").addClass("icon-center");
                    var playContainer = $("<div>").addClass("play-container");
                    var playIcon = $("<div>").addClass("play-icon");
                    playContainer.append(playIcon);
                    iconCenter.append(playContainer);
                    //append elements to gif container
                    newGif.append(gifImage).append(rating).append(iconCenter);
                    //append gif container to webpage
                    $(".gif-area").append(newGif);
                }
                //result found
                found = true;
            }
            //if returning zero search results
            else {
                //create error message
                var errorMessage = $("<div>").addClass("error-message");
                var errorTitle = $("<h1>").append("Uh-oh, there's nothing here.");
                var errorSubtitle = $("<p>").append("We're very sorry for the inconvenience. It looks like you're trying to search for GIFs that aren't available. Please select one of the following tabs on the side menu bar or start a new search instead.");
                //back to homepage button
                var goBack = $("<div>").addClass("go-back");
                var homeLink = $("<a>").attr("href", "index.html").append("Go Back");
                goBack.append(homeLink);
                errorMessage.append(errorTitle).append(errorSubtitle).append(goBack);
                $(".gif-area").append(errorMessage);
                //result not found
                found = false;
            }
        })
    }

    //display gifs when tabs are clicked
    $(".tabs").on("click", ".gif-button", gifTab);

    //toggle between static and animate gifs
    //click handler on the gif div holding the image instead of image because placement of the
    //play button is covering the whole image, so clicking the image won't work
    $(".gif-area").on("click", ".gif", function() {
        //current image clicked
        var thisImage = $(this).children("img");
        //if gif is static
        if (thisImage.attr("data-state") === "still") {
            //hide play button
            thisImage.siblings(".icon-center").hide();
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

    //side nav toggle on mobile
    $(".toggle").on("click", function() {
        //side nav is not open
        if (toggle === false) {
            //add class to go from 0px to 250px width
            $(".tabs").addClass("nav-active transition");
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
            $(".tabs").removeClass("nav-active");
            //set margin back to 0
            $("div").removeClass("slide-left");
            //allow body to scroll again
            $("body").removeAttr("style");
            //allow for side nav to open on next click
            toggle = false;
        }
        //add side nav transitions
        navTransition();
        //active transitions upon window resize
        $(window).resize(navTransition); 
    })

    //adding and removing transitions inbetween collapsed and uncollapsed states of the side nav
    function navTransition() {
        //if side nav is open
        if (toggle === true) {
            //if width is more than 661px and matches the media query
            //using window.matchMedia because $(window).width() is not accurate
            //side nav uncollapsed state
            if (window.matchMedia("(min-width: 661px)").matches) {
                //remove transitions to prevent unnecessary animations between
                //collapsed and uncollapsed state
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
                $(".tabs").addClass("transition");
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
})