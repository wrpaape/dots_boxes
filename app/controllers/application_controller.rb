class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_filter :current_user

  def current_user
    Game.current_user = @_current_user ||= User.find_or_create_by(id: session[:current_user_id] ||= User.count + 1)
  end
end
