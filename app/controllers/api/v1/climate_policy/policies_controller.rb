module Api
  module V1
    module ClimatePolicy
      class PoliciesController < ApiController
        def index
          render json: ::ClimatePolicy::Policy.all,
                 each_serializer: Api::V1::ClimatePolicy::PolicySerializer
        end
      end
    end
  end
end
