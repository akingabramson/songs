# == Schema Information
#
# Table name: songs
#
#  id           :integer          not null, primary key
#  user_id      :integer
#  url          :string(255)
#  solved       :boolean          default(FALSE)
#  tough_points :integer          default(0)
#  hints        :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Song < ActiveRecord::Base
  attr_accessible :url, :user_id, :hints

  validates :url, :user_id, presence: true
  validates :url, uniqueness: true

  has_many :guesses
  has_many :votes, through: :guesses
  belongs_to :user

  def votes_for_user(user_id)
    self.votes.where("votes.voter_id = ?", user_id)
  end

end
