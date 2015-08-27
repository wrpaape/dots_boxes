class LayoutSerializer < ActiveModel::Serializer
  attributes :type, :dimensions

  has_one :spec
end
