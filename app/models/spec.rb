class Spec < ActiveRecord::Base
  has_many :players
  has_many :computers
  has_one :layout
end
