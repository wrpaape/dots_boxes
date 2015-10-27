class GamesController < ApplicationController
  def index
    puts current_user
    @games = Game.all_as_json
  end
end
