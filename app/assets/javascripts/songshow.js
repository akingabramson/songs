
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
			// reassign AUTH_TOKEN?

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

checkVote = function(event) {
	var voteButton = $(event.currentTarget);
	var upvoteRequest = !!voteButton.hasClass("icon-thumbs-up");
	var upvoted = !!voteButton.hasClass("upvoted")
	var downvoted = !!voteButton.hasClass("downvoted")

	var guessId = voteButton.data("guess-id")


	var voteId = voteButton.data("id");
	console.log(voteId);

	if (!!voteId) {
		if ((upvoteRequest && upvoted) || (!upvoteRequest && downvoted)) {
			deleteVote(voteId, voteButton, upvoteRequest);
		} else {
			editVote(voteId, voteButton, upvoteRequest, guessId);
		}		// test here console
	} else {
		createVote(upvoted, guessId, upvoteRequest, voteButton)
	}
}

createVote = function(upvoted, guessId, upvoteRequest, voteButton) {
	$.ajax({
		url: "/votes",
		type: "post",
		data: {
			vote: {
				upvote: upvoteRequest,
				guess_id: guessId
			}
		},
		success: function(vote) {
			if (upvoteRequest) {
				voteButton.toggleClass("upvoted");
			} else {
				voteButton.toggleClass("downvoted");
			}
			voteButton.data("id", vote.id);
		},
		error: function() {
			fireModal("Voting error.  What is this, the 2000 presidential campaign?")
		}
	})
}

editVote = function(voteId, voteButton, upvoteRequest, guessId) {
	$.ajax({
		url: "/votes/" + voteId,
		type: "put",
		data: {
			vote: {
				upvote: upvoteRequest,
				guess_id: guessId
			}
		},
		success: function() {
				voteButton.toggleClass("upvoted");
				voteButton.toggleClass("downvoted");
		},
		error: function() {
			fireModal("Voting error.  What is this, the 2000 presidential campaign?")
		}
	})
}

deleteVote = function(voteId, voteButton, upvoted) {
	$.ajax({
		url: "/votes/" + voteId,
		type: "delete",
		success: function() {
			console.log("vote deleted");
			if (upvoted) {
				voteButton.toggleClass("upvoted");
			} else {
				voteButton.toggleClass("downvoted");
			}
			voteButton.data("id", undefined);
		},
		error: function() {
			fireModal("Couldn't delete vote.");
		}
	})
}

fireModal = function(text) {
	$(".modal-body").html(text);
	$("#modal").modal();
}

$("#music-link").on("click", playOrStopSong);
$("#submit-guess").on("click", checkGuess);
$(".vote").on("click", checkVote)

// $(function(){


	

	

// })