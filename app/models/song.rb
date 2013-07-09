class Song < ActiveRecord::Base
  attr_accessible :solved, :tough_points, :url, :user_id, :hints

  belongs_to :user

end
