class CreateGuesses < ActiveRecord::Migration
  def change
    create_table :guesses do |t|
      t.integer :user_id, null: false
      t.text :text, null: false
      t.integer :song_id, null: false
      t.integer :score, default: 1

      t.timestamps
    end
  end
end
