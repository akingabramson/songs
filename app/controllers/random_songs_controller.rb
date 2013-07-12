class RandomSongsController < ApplicationController
  def show
    last_id = Song.last.id
    random_id = rand(1..last_id)
    redirect_to song_url(random_id)
  end
end
