class Spec < ActiveRecord::Base
  has_one :player
  has_one :computer
  has_one :layout
end
