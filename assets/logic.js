
$(document).ready(function () {
    var images = ["Joe Maddon", "Javier Baez", "Cubs", "Cubs Win", "Jason Heyward", "Jon Lester", "Addison Russell", "Anthony Rizzo", "Kris Bryant", "Kyle Hendricks", "Albert Almora", "Ben Zobrist", "Wilson Contreras", "Kyle Schwarber", "David Bote", "Wrigley Field"];
    var imagesOffset = [];

    for (var i = 0; i < images.length; i++) {
        imagesOffset[i] = 0;
    }

    function showButtons() {
        $("#buttons").empty();
        for (var i = 0; i < images.length; i++) {
            var newBtn = $("<button>");
            newBtn.text(images[i]);
            newBtn.attr("data-value", images[i]);
            newBtn.attr("data-offset", imagesOffset[i]);
            newBtn.attr("type", "button");
            newBtn.addClass("btn btn-primary");
            $("#buttons").append(newBtn);

        }
    }
    $("#submit").on("click", function () {

        var inputValue = $("#newButton").val();
        console.log(inputValue);
        images.push(inputValue);
        imagesOffset.push(0);
        $("#newButton").val(""); //Clear text from input.
        showButtons();
    })

    $("#buttons").on("click", ".btn", function () {
        var thisGif = $(this).attr("data-value");
        // var thisGifChecked = thisGif.trim(); we are going to add this to our button creation function
        var thisGifSpaceCheck = thisGif.replace(' ', '+');

        //This checks for spaces throughout the length of the gif word.
        for (var i = 0; i < thisGifSpaceCheck.length; i++) {
            thisGifSpaceCheck = thisGifSpaceCheck.replace(' ', '+');
        }
        console.log(thisGifSpaceCheck);

        thisGifOffset = $(this).attr("data-offset")
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=ppgor8xfGy45uEtL9KoAQO6LR4nayk7O&q=" + thisGif + "&limit=10&offset=" + thisGifOffset;

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



                    var $gifDiv = $("<div>");
                    var $gifCaption = $("<div>");
                    $gifCaption.addClass("card-body");
                    var $gifTitle = $("<h5>");
                    $gifTitle.text(thisGif);

                    var $gifRating = $("<p>")
                    $gifRating.addClass("card-text");
                    $gifRating.text("Rated: " + gifInfo.data[i].rating.toUpperCase());

                    $gifDiv.addClass("gifDiv card");
                    $gifDiv.prepend($image);
                    $gifCaption.html($gifTitle);
                    $gifCaption.append($gifRating);
                    $gifDiv.append($gifCaption);
                    $("#gifs").prepend($gifDiv);

                }
            })
    })

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

    showButtons();
})
