class Guess < ActiveRecord::Base
  attr_accessible :user_id, :song_id, :text

  validates :user_id, :song_id, :text, presence: true
  validates_uniqueness_of :user_id, scope: :song_id

  belongs_to :user
  belongs_to :song

  def upvote
    self.score += 1
  end
end
