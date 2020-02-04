module Api
  module V1
    class ClimateFinanceController < ApiController
      def index
        finances = ClimateFinance.all

        respond_to do |format|
          format.json do
            render json: finances,
                   each_serializer: Api::V1::ClimateFinanceSerializer
          end
          format.zip do
            data_sources = DataSource.where(short_title: finances.map(&:source))

            render zip: {
              'climate_finances.csv' => finances.to_csv,
              'sources.csv' => data_sources.to_csv
            }
          end
        end
      end
    end
  end
end
