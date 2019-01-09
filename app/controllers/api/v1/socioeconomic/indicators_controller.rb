module Api
  module V1
    module Socioeconomic
      class IndicatorsController < ApiController
        def index
          indicators = ::Socioeconomic::Indicator.all
          indicators = indicators.where(code: codes) if codes

          values = ::Socioeconomic::Value.includes(:location, :indicator)
          values = values.where(locations: {iso_code3: locations}) if locations
          values = values.where(socioeconomic_indicators: {code: codes}) if codes

          respond_to do |format|
            format.json do
              render json: {
                values: ActiveModelSerializers::SerializableResource.new(
                  values,
                  each_serializer: Api::V1::Socioeconomic::ValueSerializer
                ).as_json,
                indicators: ActiveModelSerializers::SerializableResource.new(
                  indicators,
                  each_serializer: Api::V1::Socioeconomic::IndicatorSerializer
                ).as_json
              }
            end
            format.csv do
              render csv: values,
                     serializer: Api::V1::Socioeconomic::ValueCSVSerializer
            end
          end
        end

        private

        def locations
          params[:location].presence && params[:location].split(',')
        end

        def codes
          params[:code].presence && params[:code].split(',')
        end
      end
    end
  end
end
