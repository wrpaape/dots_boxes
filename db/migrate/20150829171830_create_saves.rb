class CreateSaves < ActiveRecord::Migration
  def change
    create_table :saves do |t|
      t.text :state
      t.belongs_to :user
      t.belongs_to :game

      t.timestamps null: false
    end
  end
end
