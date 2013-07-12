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
		submitGuess(button, guessText, event);
	}
}

submitGuess = function(button, guessText, event) {
	button.text("Submitting...");
	var songId = $("#song-id").data("id");

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
			var renderedNewVotes = JST["newblankvotes"]({guessId: guess.id});
			$("div.guess-score-votes:first").prepend(renderedNewVotes);
			console.log($("div.guess-score-votes:first").html());
			resetVoteEventHandlers();

		},
		error: function(guess) {
			fireModal("Could not save your guess! Make sure that you're logged in and haven't already guessed.")
			button.text("Guess!");
			console.log(event.currentTarget)
			event.currentTarget.disabled = false;
		}
	})
}

checkVote = function(event) {
	console.log("checking vote")
	var voteButton = $(event.currentTarget);
	var upvoteRequest = !!voteButton.hasClass("icon-thumbs-up");
	var upvoted = !!voteButton.hasClass("upvoted")
	var downvoted = !!voteButton.hasClass("downvoted")

	var guessId = voteButton.data("guess-id")


	var voteId = voteButton.data("id");

	if (!!voteId) {
		if ((upvoteRequest && upvoted) || (!upvoteRequest && downvoted)) {
			deleteVote(voteId, voteButton, upvoteRequest, guessId);
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
			var renderedVotes = JST["voted"]({vote: vote});
			updateScore(voteButton, upvoteRequest, 1);
			voteButton.closest("div.guess-votes").html(renderedVotes);
			resetVoteEventHandlers();
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
		success: function(vote) {
			var renderedVotes = JST["voted"]({vote: vote});
			updateScore(voteButton, upvoteRequest, 2);
			voteButton.closest("div.guess-votes").html(renderedVotes);
			$(".vote").on("click", checkVote)
		},
		error: function() {
			fireModal("Voting error.  What is this, the 2000 presidential election?  Make sure you're logged in.")
		}
	})
}

deleteVote = function(voteId, voteButton, upvoted, guessId) {
	$.ajax({
		url: "/votes/" + voteId,
		type: "delete",
		success: function() {
			console.log("vote deleted");
			var renderedVotes = JST["blankvotes"]({guessId: guessId});
			updateScore(voteButton, !upvoted, 1);
			voteButton.closest("div.guess-votes").html(renderedVotes);
			resetVoteEventHandlers();
			// so that we don't have multiple event handlers listening

		},
		error: function() {
			fireModal("Couldn't delete vote.");
		}
	})
}

resetVoteEventHandlers = function() {
	$(".vote").off("click", checkVote);
	$(".vote").on("click", checkVote);
}

updateScore = function(voteButton, upvoteRequest, multiplier) {
	var scoreDiv = voteButton.closest("div.guess-score-votes").find(".guess-score");
	var score = parseInt(scoreDiv.html());
	
	if (upvoteRequest) {
		score += 1*multiplier;
	} else {
		score -= 1*multiplier;
	}
	
	scoreDiv.html(score);
}

rate = function(event) {
	event.preventDefault();

	var button = $(event.currentTarget);
	var ratingId = button.data("id");
	var selected = button.hasClass("selected");

	// if rating exists
	if (!!ratingId && selected) {
		deleteRating(button, ratingId);
		// delete it
	} else {
		createOrEditRating(button, ratingId);
		// post
	}
}

createOrEditRating = function(button, ratingId) {
	$.ajax({
		url: "/ratings/",
		type: "post",
		data: { 
			rating: {
				song_id: button.data("song-id"),
				value: button.data("value"),
				id: ratingId
			}
		},
		success: function(rating) {
			var renderedRating = JST["rating"]({rating: rating, songId: button.data("song-id")});
			button.closest(".toughness-bar").html(renderedRating);
			resetRatingEventHandlers();
			// fill in parent html
		},
		error: function() {
			fireModal("You have to be logged in to rate!");
		}
	})
}

deleteRating = function(button, ratingId) {
	$.ajax({
		url: "/ratings/" + ratingId,
		type: "delete",
		success: function() {
			var renderedRating = JST["rating"]({rating: undefined,
																					songId: button.data("song-id")});
			button.closest(".toughness-bar").html(renderedRating);
			resetRatingEventHandlers();
		},
		error: function() {
			fireModal("Error deleting rating.");
		}
	})
}

resetRatingEventHandlers = function() {
$(".tough-number").off("click", rate);
$(".tough-number").on("click", rate);
}


fireModal = function(text) {
	$(".modal-body").html(text);
	$("#modal").modal();
}

$("#music-link").on("click", playOrStopSong);
$("#submit-guess").on("click", checkGuess);
$(".vote").on("click", checkVote)
$(".tough-number").on("click", rate)

