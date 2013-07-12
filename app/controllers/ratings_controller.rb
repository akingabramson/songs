class RatingsController < ApplicationController
  before_filter :require_json_login
# find_or_create
  def create
    @rating = Rating.find_or_create(current_user.id, params[:rating])
    # @rating = current_user.submitted_ratings.build(params[:rating])
    if @rating.save
      Song.find(@rating.song_id).delay.update_toughness
      render json: @rating
    else
      p @rating.errors.full_messages
      render json: {}, status: 422
    end

  end

  def update
    @rating = current_user.submitted_ratings.find(params[:id])
    if @rating
      if @rating.update_attributes(params[:rating])
        Song.find(@rating.song_id).delay.update_toughness
        render json: @rating
      else
        render json: {}, status: 422
      end
    else
      render json: {}, status: 403
    end
  end

  def destroy
    @rating = current_user.submitted_ratings.find(params[:id])
    if @rating
      song = Song.find(@rating.song_id)
      @rating.destroy
      song.delay.update_toughness
      render json: {message: "rating destroyed!"}
    else
      render json: {}, status: 422
    end
  end
end
