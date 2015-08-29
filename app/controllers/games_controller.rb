class GamesController < ApplicationController
  def index
    @games = Game.all_as_json
  end
end
