class Game < ActiveRecord::Base
  has_many :saves
  has_many :users, through: :saves
  has_one :spec

  def self.all_as_json
    all.as_json(
      include: [
        {
          spec: {
            include: [
              {
                player: {
                  except: [
                    :id,
                    :spec_id,
                    :levels
                  ]
                }
              },
              {
                computer: {
                  except: [
                    :id,
                    :spec_id
                  ]
                }
              },
              {
                layout: {
                  methods: [
                    :type,
                    :dimensions
                  ],
                  except: [
                    :id,
                    :spec_id
                  ]
                }
              }
            ],
            except: [
              :id,
              :game_id
            ]
          }
        },
        {

        }
      ]
    )
  end
end
