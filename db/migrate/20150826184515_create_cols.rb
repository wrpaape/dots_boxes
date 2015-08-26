class CreateCols < ActiveRecord::Migration
  def change
    create_table :cols do |t|

      t.timestamps null: false
    end
  end
end
