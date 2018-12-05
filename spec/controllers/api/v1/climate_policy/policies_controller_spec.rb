require 'rails_helper'

describe Api::V1::ClimatePolicy::PoliciesController, type: :controller do
  context do
    let!(:policies) {
      FactoryBot.create_list(:climate_policy, 3)
    }

    describe 'GET index' do
      it 'returns a successful 200 response' do
        get :index, format: :json
        expect(response).to be_successful
      end

      it 'lists all policies' do
        get :index, format: :json
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(3)
      end
    end

    describe 'GET show' do
      let!(:policy) {
        FactoryBot.create(:climate_policy, code: 'ECBC')
      }

      it 'returns a successful 200 response' do
        get :show, params: {code: 'ECBC'}, format: :json
        expect(response).to be_successful
      end

      it 'list policy by code' do
        get :show, params: {code: 'ECBC'}, format: :json
        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to include('code' => 'ECBC')
      end
    end
  end
end
