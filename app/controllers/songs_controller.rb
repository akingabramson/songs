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
      @tough_rating = @song.rating
      if logged_in?
        @votes = @song.votes_for_user(current_user.id)
      else
        @votes = []
      end
      render :show
    else
      render json: {}, status: 404
    end
  end
end
