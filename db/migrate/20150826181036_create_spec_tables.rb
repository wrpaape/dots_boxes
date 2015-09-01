class CreateSpecTables < ActiveRecord::Migration
  def change
    create_table :specs do |t|
      t.belongs_to :game
    end

    create_table :scores do |t|
      t.integer :default
      t.belongs_to :spec
    end

    create_table :players do |t|
      t.integer :default
      t.integer :min
      t.integer :max
      t.integer :levels
      t.belongs_to :spec
    end

    create_table :layouts do |t|
      t.string :type
      t.belongs_to :spec
    end

    create_table :dimensions do |t|
      t.string :type
      t.integer :default
      t.integer :min
      t.integer :max
      t.belongs_to :layout
    end

    create_table :limits do |t|
      t.string :func
      t.belongs_to :score
    end

    create_table :args do |t|
      t.string :name
      t.belongs_to :limit
    end

    create_table :steps do |t|
      t.string :name
      t.belongs_to :arg
    end
  end
end
