class CreateComputers < ActiveRecord::Migration
  def change
    create_table :computers do |t|

      t.timestamps null: false
    end
  end
end
