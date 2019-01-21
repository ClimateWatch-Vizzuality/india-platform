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
          format.csv { render csv: finances }
        end
      end
    end
  end
end
