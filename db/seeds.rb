class Hash
  def assign_children
    model = keys.first.constantize
    attributes = values.first
    children = attributes.delete(:children) || []
    parent = model.create(attributes)
    children.each do |child_hash|
      child = child_hash.assign_children
      foreign_key = child.class.column_names.grep(/_id/).first
      child.update({ foreign_key => parent.id })
    end
    parent
  end
end

games = [
  {
    "Game" => {
      title: "Dots and Boxes",
      rules:
  """
  Starting with an empty grid of dots, players take turns, adding a single horizontal or vertical line between two unjoined adjacent dots.
  A player who completes the fourth side of a 1×1 box earns one point and takes another turn.
  The game ends when no more lines can be placed.
  The winner of the game is the player with the most points.
  """[1..-1].gsub!("\n", "  "),
      component: "DotsBoxes",
      children: [
        {
          "Spec" => {
            min: 2,
            max: 20,
            children: [
              {
                "Player" => {
                  min: 0,
                  max: 10
                }
              },
              {
                "Computer" => {
                  min: 0,
                  max: 10,
                  easy: true,
                  medium: true,
                  hard: true
                }
              },
              {
                "Grid" => {
                  children: [
                    {
                      "Row" => {
                        min: 1,
                        max: 10
                      }
                    },
                    {
                      "Column" => {
                        min: 1,
                        max: 10
                      },
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
]

games.each(&:assign_children)
