class Game < ActiveRecord::Base
  mattr_accessor :current_user, :saves_path
  has_many :saves
  has_many :users, through: :saves
  has_one :current_save, ->(current_user) { where(user_id: current_user.id) }, class_name: "Save"
  has_one :spec

  def self.all_as_json
    includes(spec: [{ score: :limit }, :total, :player, :computer, { layout: :dims }]).as_json(
      include: {
        spec: {
          include: [
            {
              score: {
                include: {
                  limit: {
                    include: {
                      args: {
                        only: :name,
                        methods: :path
                      }
                    },
                    except: [
                      :id,
                      :score_id
                    ]
                  }
                },
                except: [
                  :id,
                  :spec_id
                ]
              }
            },
            {
              total: {
                except: [
                  :id,
                  :spec_id,
                  :default,
                  :levels
                ]
              }
            },
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
            :game_id,
            :min,
            :max
          ]
        }
      },
      methods: [
        :state,
        :saveURL
      ]
    )
  end

  def state
    current_save ? current_save.state : saves.create(user_id: current_user.id).state
  end

  def saveURL
    saves_path
  end
end
