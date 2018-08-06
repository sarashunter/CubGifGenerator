
$(document).ready(function () {
    var topics = ["Joe Maddon", "Javier Baez", "Cubs", "Cubs Win", "Jason Heyward", "Jon Lester", "Addison Russell", "Anthony Rizzo", "Kris Bryant", "Kyle Hendricks", "Albert Almora", "Ben Zobrist", "Wilson Contreras", "Kyle Schwarber", "David Bote", "Wrigley Field", "Yu Darvish", "Tyler Chatwood", "Ian Happ", "Brandon Morrow", "Pedro Strop", "Carl Edwards Jr", "Jose Quintana", "Victor Caratini", "Tommy La Stella", "Randy Rosario"];
    var topicsOffset = [];
    var favorites = [];

    //Get JSON object from local storage.
    storedObject = localStorage.getItem("cubsGifs");

    //Check if there is a JSON object in local storage.
    if (storedObject !== null) {

        storedObjectParsed = JSON.parse(storedObject);
        //Get topics from local storage.

        topics = storedObjectParsed.buttons;
        // favorites = storedObjectParsed.favorites;

    }

    for (var i = 0; i < topics.length; i++) {

        //Create an array that keeps track of how many times a topic has been requested so you can get the next 10 instead of getting the same ones again.
        topicsOffset[i] = 0;

    }

    //Creates a button for each topic.
    function showButtons() {
        $("#buttons").empty();

        for (var i = 0; i < topics.length; i++) {

            var newBtn = $("<button>");
            newBtn.text(topics[i]);
            newBtn.attr("data-value", topics[i]);
            newBtn.attr("data-offset", topicsOffset[i]);
            newBtn.attr("type", "button");
            newBtn.addClass("btn btn-primary");
            $("#buttons").append(newBtn);

        }

    }

    //Handles when a user adds a new topic.
    $("#submit").on("click", function () {

        var inputValue = $("#newButton").val().trim();
        console.log(inputValue);
        topics.push(inputValue);

        //Add item in offset array
        topicsOffset.push(0); 

        //Store new JSON object in localStorage.
        storeIt(); 

        //Clear text from input box.
        $("#newButton").val(""); 

        //Show buttons with new topic.
        showButtons(); 
    })

    //This function uses Ajax call to generate the gifs.
    $("#buttons").on("click", ".btn", function () {

        var thisGif = $(this).attr("data-value");

        var thisGifSpaceCheck = thisGif.replace(' ', '+');

        //This checks for spaces throughout the length of the gif word.
        for (var i = 0; i < thisGifSpaceCheck.length; i++) {

            thisGifSpaceCheck = thisGifSpaceCheck.replace(' ', '+');

        }

        thisGifOffset = $(this).attr("data-offset")
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=ppgor8xfGy45uEtL9KoAQO6LR4nayk7O&q=" + thisGif + "&limit=10&offset=" + thisGifOffset;

        //Increase offset
        $(this).attr("data-offset", parseInt(thisGifOffset) + 10);

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (gifInfo) {
                console.log(gifInfo);

                for (var i = 0; i < 10; i++) {
                    var movingImageURL = gifInfo.data[i].images.fixed_height.url;
                    var fixedImageURL = gifInfo.data[i].images.fixed_height_still.url;


                    var $image = $("<img>");
                    $image.attr("data-state", "fixed");
                    $image.attr("data-fixed-url", fixedImageURL);
                    $image.attr("data-moving-url", movingImageURL);
                    $image.attr("src", fixedImageURL);
                    $image.addClass("card-img-top");
                    $image.attr("alt", "Gif of " + thisGif);

                    var $gifDiv = $("<div>");
                    $gifDiv.addClass("gifDiv card");

                    var $gifCaption = $("<div>");
                    $gifCaption.addClass("card-body");

                    var $gifTitle = $("<h5>");
                    $gifTitle.text(thisGif);

                    var $gifRating = $("<p>")
                    $gifRating.addClass("card-text");
                    $gifRating.text("Rated: " + gifInfo.data[i].rating.toUpperCase());

                    var $favButton = $("<button>");
                    $favButton.addClass("btn btn-secondary fav");
                    $favButton.text("Add to favorites");

                    $gifDiv.prepend($image);
                    $gifCaption.html($gifTitle);
                    $gifCaption.append($gifRating);
                    $gifCaption.append($favButton);
                    $gifDiv.append($gifCaption);
                    $("#gifs").prepend($gifDiv);

                }
            })

    })

    //This doesn't work with local storage currently.  It's just favorites from this session.
    $("#showFavs").on("click", function () {
        $("#gifs").empty();
        favorites.forEach(function (element) {
            $("#gifs").append(element);
        })
    })

    //Add to favorites array when button is pressed.
    $("#gifs").on("click", ".fav", function () {
        favorites.push($(this).parent().parent());
        console.log(favorites);
        storeIt();


    })

    //Function that allows gifs to "pause"
    $("#gifs").on("click", "img", function () {
        var currentState = $(this).attr("data-state");

        if (currentState === "fixed") {
            $(this).attr("src", $(this).attr("data-moving-url"));
            $(this).attr("data-state", "moving");
        } else {
            $(this).attr("src", $(this).attr("data-fixed-url"));
            $(this).attr("data-state", "fixed");
        }
    })

    //Function used to add JSON to local storage.
    function storeIt() {
        
        var jsonobject = {
            buttons: topics,
            favorites: favorites
        }
        localStorage.setItem("cubsGifs", JSON.stringify(jsonobject));

    }

    showButtons();

})
