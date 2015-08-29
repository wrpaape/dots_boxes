class SavesController < ApplicationController
  def update
    10.times { puts params.inspect }
    render json: { message: "saved" }
  end
end
