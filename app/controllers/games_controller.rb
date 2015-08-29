class GamesController < ApplicationController
  def index
    puts "current_user: " + (current_user || "nil")
    @games = Game.include_all_as_json
  end

  def save
    cache = ActiveSupport::Cache::MemoryStore.new
  end
end
