class Limit < ActiveRecord::Base
  has_many :args
  belongs_to :score
end
