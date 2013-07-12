class Guess < ActiveRecord::Base
  attr_accessible :user_id, :song_id, :text

  validates :user_id, :song_id, :text, presence: true
  validates_uniqueness_of :user_id, scope: :song_id

  belongs_to :user
  belongs_to :song
  has_many :votes

  def score
    votes = self.votes
    upvotes = votes.select {|vote| vote.upvote == true}
    downvotes = votes.count - upvotes.count

    upvotes.count - downvotes
  end
end
