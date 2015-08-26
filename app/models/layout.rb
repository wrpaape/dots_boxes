class Layout < ActiveRecord::Base
  has_many :dimensions
  belongs_to :game
end
