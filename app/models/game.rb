class Game < ActiveRecord::Base
  mattr_accessor :current_user
  has_many :saves
  has_many :users, through: :saves
  has_one :current_save, ->(current_user) { where(user_id: current_user.id) }, class_name: "Save"
  has_one :spec

  def self.all_as_json
    all.as_json(
      include: {
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
      methods: :state
    )
  end

  def state
    current_save.state
  end
end
