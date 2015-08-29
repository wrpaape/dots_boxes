Rails.application.routes.draw do
  resource :saves
  root "games#index"
end
