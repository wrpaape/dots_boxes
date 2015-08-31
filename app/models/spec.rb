class Spec < ActiveRecord::Base
  has_many :players
  has_one :player, -> { where(levels: nil) }, class_name: "Player"
  has_one :computer, -> { where("levels > 0") }, class_name: "Player"
  has_one :layout

  def total
    {
      min: min,
      max: max
    }
  end
end
