class Game < ActiveRecord::Base
  has_one :spec

  def self.include_all_as_json
    all.as_json(
      include: {
        spec: {
          include: [
            :players,
            :computers,
            layout: {
              include: {
                dimensions: {
                  root: true
                }
              },
              methods: :type
            }
          ]
        }
      }
    )
  end
end
