class Spec < ActiveRecord::Base
  has_many :players
  has_one :score
  has_one :total, -> { where(default: nil, levels: nil) }, class_name: "Player"
  has_one :player, -> { where(levels: nil).where.not(default: nil) }, class_name: "Player"
  has_one :computer, -> { where.not(levels: nil) }, class_name: "Player"
  has_one :layout
end
