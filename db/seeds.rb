# max_int = 32767
max_int = 10

games = [
  {
    title: "Dots and Boxes",
    rules:
"""
Starting with an empty grid of dots, players take turns, adding a single horizontal or vertical line between two unjoined adjacent dots.
A player who completes the fourth side of a 1×1 box earns one point and takes another turn.
The game ends when no more lines can be placed.
The winner of the game is the player with the most points.
"""[1..-1].gsub!("\n", "  "),
    size: { rows: [1, max_int], cols: [1, max_int] }.to_json,
    players: [2, max_int],
    difficulties: ["easy", "medium", "hard"],
    component: "DotsBoxes"
  }
]

games.each { |game| Game.create(game) }
