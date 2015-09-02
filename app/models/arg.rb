class Arg < ActiveRecord::Base
  has_many :steps
  belongs_to :limit

  def path
    steps.pluck(:name)
  end
end
