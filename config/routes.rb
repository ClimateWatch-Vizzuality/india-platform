Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  mount Locations::Engine => 'api/v1/locations'
  mount HistoricalEmissions::Engine => 'api/v1'

  namespace :api do
    namespace :v1, defaults: { format: :json } do
      namespace :climate_policy do
        resources :policies, only: [:index, :show], param: :code
        resources :sources, only: [:index]
      end
    end
  end

  root 'application#index'
  get '(*frontend)', to: 'application#index'
end
