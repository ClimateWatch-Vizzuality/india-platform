module Api
  module V1
    module ClimatePolicy
      class SourcesController < ApiController
        def index
          render json: ::ClimatePolicy::Source.all,
                 each_serializer: Api::V1::ClimatePolicy::SourceSerializer
        end
      end
    end
  end
end
