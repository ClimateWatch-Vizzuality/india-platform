module Api
  module V1
    module ClimatePolicy
      class PoliciesController < ApiController
        def index
          render json: ::ClimatePolicy::Policy.all,
                 each_serializer: Api::V1::ClimatePolicy::PolicySerializer
        end

        def show
          policy = ::ClimatePolicy::Policy.find_by!(code: params[:code])

          render json: policy,
                 serializer: Api::V1::ClimatePolicy::PolicyFullSerializer
        end
      end
    end
  end
end
