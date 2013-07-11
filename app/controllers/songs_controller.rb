class SongsController < ApplicationController
  before_filter :require_login, only: [:create]

  def new
    @song = Song.new
  end

  def create
    @song = current_user.songs.build(params[:song])
    if @song.save!
      flash[:error] = "Song saved!"
      redirect_to song_url(@song.id)
    else
      flash[:error] = @song.errors
      render :new
    end
  end

  def show
    @song = Song.find(params[:id])
    if @song
      @guesses = @song.guesses
      if logged_in?
        @tough_rating = Rating.get_for_song(params[:id], current_user.id)
        @votes = @song.votes_for_user(current_user.id)
      else
        @tough_rating = nil
        @votes = []
      end
      render :show
    else
      render json: {}, status: 404
    end
  end
end
