class GamesController < ApplicationController
  def index
    @games = Game.include_all_as_json
  end

  def save
    cache = ActiveSupport::Cache::MemoryStore.new
  end
end
