class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception


  before_action :authorize_access

  def index
    @is_production = Rails.env.production?
  end

  private

  def authorize_access
    return true if Rails.env.development?
    if request.base_url == "https://india.climatewatchdata.org"
      authenticate_or_request_with_http_basic do |username, password|
        username == ENV['HTTP_AUTH_USERNAME'] &&
          password == ENV['HTTP_AUTH_PASSWORD']
      end
    elsif request.path != "/coming-soon"
      redirect_to "/coming-soon"
    else
      true
    end
  end
end
