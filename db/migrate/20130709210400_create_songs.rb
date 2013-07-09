class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.integer :user_id
      t.string :url
      t.boolean :solved, default: false
      t.integer :tough_points, default: 0
      t.text :hints

      t.timestamps
    end
  end
end
