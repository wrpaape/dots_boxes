Rails.application.routes.draw do
  put "/:id", to: "games#save"
  root "games#index"
end
