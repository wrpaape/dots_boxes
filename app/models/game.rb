class Game < ActiveRecord::Base
  has_one :spec

  def self.include_all_as_json
    all.as_json(
      include: {
        spec: {
          include: [
            :player,
            :computer,
            layout: {
              methods: [:type, :dimensions]
            }
          ]
        }
      }
    )
  end
end
