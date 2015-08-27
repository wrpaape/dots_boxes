class PlayerSerializer < ActiveModel::Serializer
  attributes :min, :max

  has_one :spec
end
