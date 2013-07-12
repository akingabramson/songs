class CreateRatings < ActiveRecord::Migration
  def change
    create_table :ratings do |t|
      t.integer :rater_id
      t.integer :song_id
      t.integer :value

      t.timestamps
    end
  end
end
