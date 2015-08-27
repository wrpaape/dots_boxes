class GameSerializer < ActiveModel::Serializer
  attributes :id, :title, :rules, :component

  has_one :spec
end
