class CreateSpecTables < ActiveRecord::Migration
  def change
    create_table :layouts do |t|
      t.string :type
      t.belongs_to :game
    end

    create_table :dimensions do |t|
      t.string :type
      t.integer :min
      t.integer :max
      t.belongs_to :grid
    end

    create_table :play_specs do |t|
      t.integer :min
      t.integer :max
      t.belongs_to :game
    end

    create_table :comp_specs do |t|
      t.integer :min
      t.integer :max
      t.boolean :easy
      t.boolean :med
      t.boolean :hard
      t.belongs_to :game
    end
  end
end
