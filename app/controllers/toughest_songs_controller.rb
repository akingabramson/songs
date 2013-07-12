class ToughestSongsController < ApplicationController
  def index
    @page = "toughest"
    @songs = Song.order("tough_points DESC").limit(10)
  end
end
