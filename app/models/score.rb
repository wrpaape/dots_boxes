class Score < ActiveRecord::Base
  has_one :limit
  belongs_to :spec
end
