class SpecSerializer < ActiveModel::Serializer
  attributes :min, :max

  has_one :player
  has_one :computer
  has_one :layout
  has_one :game
end
