class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_filter :current_user, :set_game

  def current_user
    @_current_user ||= User.find_or_create_by(id: session[:current_user_id] ||= User.count + 1)
  end

  def set_game
    Game.current_user = @_current_user
    Game.saves_path = saves_path
  end
end
