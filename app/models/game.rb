class Game < ActiveRecord::Base
  has_one :layout
  has_one :comp_spec
  has_one :play_spec
end
