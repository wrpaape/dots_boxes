class CreateSpecTables < ActiveRecord::Migration
  def change
    create_table :specs do |t|
      t.integer :min
      t.integer :max
      t.belongs_to :game
    end

    create_table :players do |t|
      t.integer :min
      t.integer :max
      t.belongs_to :spec
    end

    create_table :computers do |t|
      t.integer :min
      t.integer :max
      t.boolean :easy
      t.boolean :medium
      t.boolean :hard
      t.belongs_to :spec
    end

    create_table :layouts do |t|
      t.string :type
      t.belongs_to :spec
    end

    create_table :dimensions do |t|
      t.string :type
      t.integer :min
      t.integer :max
      t.belongs_to :layout
    end
  end
end
