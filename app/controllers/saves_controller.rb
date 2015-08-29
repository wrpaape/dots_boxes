class SavesController < ApplicationController
  def update
    save_query = { user_id: current_user.id, game_id: params[:id] }
    if save = Save.find_by(save_query)
      save.update(state: params[:state])
      message = " save updated"
    else
      Save.create(save_query, params[:state])
      message = " saved"
    end

    render json: { message: message }
  end
end
