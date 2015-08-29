class SessionsController < ApplicationController
  def new
  end

  def create
  end

  def destroy
    session[:current_user_id] = nil
  end
end
