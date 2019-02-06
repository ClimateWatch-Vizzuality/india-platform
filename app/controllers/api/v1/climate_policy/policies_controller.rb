module Api
  module V1
    module ClimatePolicy
      class PoliciesController < ApiController
        def index
          render json: ::ClimatePolicy::Policy.all,
                 each_serializer: Api::V1::ClimatePolicy::PolicySerializer
        end

        def show
          policy = ::ClimatePolicy::Policy.
            includes(
              instruments: [:sources],
              indicators: [:sources, :progress_records],
              milestones: [:source]
            ).
            find_by!(code: params[:code])

          render json: policy,
                 serializer: Api::V1::ClimatePolicy::PolicyFullSerializer,
                 include: '**' # well this is weird but to get more than two levels...
        end
      end
    end
  end
end
