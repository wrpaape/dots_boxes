class DimensionSerializer < ActiveModel::Serializer
  attributes :min, :max

  has_one :layout
end
