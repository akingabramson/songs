class Vote < ActiveRecord::Base
  attr_accessible :guess_id, :upvote, :voter_id
  validates :guess_id, :voter_id, presence: true
  validates :upvote, inclusion: [true, false]
  validates_uniqueness_of :guess_id, scope: :voter_id

  belongs_to :voter, class_name: "User", foreign_key: :voter_id, inverse_of: :votes
  belongs_to :guess
end
