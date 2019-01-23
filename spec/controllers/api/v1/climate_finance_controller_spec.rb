require 'rails_helper'

describe Api::V1::ClimateFinanceController, type: :controller do
  context do
    let!(:climate_finance) {
      FactoryBot.create_list(:climate_finance, 3)
    }

    describe 'GET index' do
      it 'returns a successful 200 response' do
        get :index, format: :json
        expect(response).to be_successful
      end

      it 'lists all climate finances' do
        get :index, format: :json
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(3)
      end
    end
  end
end
