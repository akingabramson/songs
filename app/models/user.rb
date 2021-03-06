# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  name            :string(255)
#  password_digest :string(255)
#  session_token   :string(255)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class User < ActiveRecord::Base
  attr_accessible :name, :password, :password_confirmation
  has_secure_password

  validates :name, presence: true, uniqueness: true

  has_many :songs
  has_many :song_toughness_ratings, through: :songs, source: :ratings
  
  has_many :submitted_ratings, class_name: "Rating", foreign_key: :rater_id
  has_many :guesses
  has_many :guess_votes, through: :guesses, source: :votes
  has_many :votes, foreign_key: :voter_id, inverse_of: :voter

  def toughness
    self.song_toughness_ratings.average(:value).to_s
  end
  
  def smarts
    upvotes = self.guess_votes.where(upvote: true)
    downvotes = self.guess_votes.where(upvote: false)

    upvotes.count - downvotes.count
  end

  def reset_session_token!
    self.session_token = SecureRandom.urlsafe_base64(16)
    self.save!
    return self.session_token
  end

end
