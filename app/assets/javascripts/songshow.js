
playOrStopSong = function(event) {
	event.preventDefault();
	
	var button = $(event.currentTarget);
	var song = document.getElementById('song');
	if (button.hasClass("stop-link")) {
		stopsong(button, song);
	} else {
		playsong(button, song);
	}
	button.toggleClass("stop-link");
}

playsong = function(button, song) {

	console.log("playing song");
	song.play();
	button.html('<span class="icon-stop music-button"></span>');
}

stopsong = function(button, song) {
	console.log("stopping song")
	song.pause();
	song.currentTime = 0;
	button.html('<span class="icon-play-circled music-button"></span>')
}

checkGuess = function(event) {
	event.currentTarget.disabled = true;
	var button = $(event.currentTarget);
	var guessText = $("#guess-text").val();

	if (guessText === "") {
		fireModal("You forgot to write your text!");
		event.currentTarget.disabled = false;
	} else {
		submitGuess(button, guessText);
	}
}

submitGuess = function(button, guessText) {
	button.text("Submitting...");
	var songId = $("#song-id").data("id");

	console.log(songId)
	$.ajax({
		url: "/guesses",
		type: "post",
		data: {guess: {
				text: guessText,
				song_id: songId
			}
		},
		success: function(guess) {
			var renderedGuess = JST["guess"]({guess: guess});
			button.text("Submitted!");
			button.addClass("btn-success");
			$(".guess-list").prepend(renderedGuess);
		},
		error: function(guess) {
			fireModal("Could not save your guess! Maybe you already made one?")
			event.currentTarget.disabled = false;
		}
	})
}

fireModal = function(text) {
	$(".modal-body").html(text);
	$("#modal").modal();
}

$("#music-link").on("click", playOrStopSong);
$("#submit-guess").on("click", checkGuess);

// $(function(){


	

	

// })