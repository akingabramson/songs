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

require 'test_helper'

class SongTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
