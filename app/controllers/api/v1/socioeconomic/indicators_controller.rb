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

            format.zip do
              data_sources = DataSource.all
              data_sources = data_sources.where(short_title: sources) if sources

              render zip: {
                'indicators.csv' => Api::V1::Socioeconomic::ValueCSVSerializer.new(values).to_csv,
                'data_sources.csv' => data_sources.to_csv
              }
            end
          end
        end

        private

        def locations
          params[:location]&.split(',')
        end

        def sections
          params[:section]&.split(',')
        end

        def codes
          params[:code]&.split(',')
        end

        def sources
          params[:source]&.split(',')
        end
      end
    end
  end
end
