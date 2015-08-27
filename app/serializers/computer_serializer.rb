class ComputerSerializer < ActiveModel::Serializer
  attributes :min, :max, :easy, :med, :hard

  has_one :spec
end
