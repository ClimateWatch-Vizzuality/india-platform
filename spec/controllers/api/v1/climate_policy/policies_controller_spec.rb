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
        FactoryBot.create(
          :climate_policy,
          :with_instruments,
          :with_indicators,
          :with_milestones,
          code: 'ECBC'
        )
      }

      it 'returns a successful 200 response' do
        get :show, params: {code: 'ECBC'}, format: :json
        expect(response).to be_successful
      end

      it 'list policy by code' do
        get :show, params: {code: 'ECBC'}, format: :json
        policy_json = JSON.parse(response.body)
        expect(policy_json).to include('code' => 'ECBC')
        expect(policy_json['instruments'].length).to eq(2)
        expect(policy_json['indicators'].length).to eq(2)
        expect(policy_json['milestones'].length).to eq(2)
      end
    end
  end
end
