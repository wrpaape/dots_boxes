class Layout < ActiveRecord::Base
  has_many :dims, class_name: "Dimension"
  belongs_to :game

  def dimensions
    Hash[dims.as_json(root: true).map{ |h| h.shift.map{ |x| x.try(:pluralize) || x } }]
  end
end
