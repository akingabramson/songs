class Rating < ActiveRecord::Base
  attr_accessible :rater_id, :song_id, :value

  validates :rater_id, :song_id, :value, presence: true
  validates :value, :inclusion => 1..10
  validates_uniqueness_of :song_id, scope: :rater_id


  belongs_to :rater, class_name: "User", foreign_key: :rater_id
  belongs_to :song

  def self.find_or_create(user_id, params)
    if params[:id]
      rating = Rating.find(params[:id])
    end

    rating ||= Rating.new
    rating.update_attributes(params)
    rating.rater_id = user_id
    rating
  end

  def self.get_for_song(song_id, user_id)
    Rating.where("song_id = ? AND rater_id = ?", song_id, user_id)[0]
  end
end
