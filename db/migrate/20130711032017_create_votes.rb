class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.integer :voter_id
      t.integer :guess_id
      t.boolean :upvote

      t.timestamps
    end
  end
end
