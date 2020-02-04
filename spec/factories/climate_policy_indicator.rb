FactoryBot.define do
  factory :climate_policy_indicator, class: 'ClimatePolicy::Indicator' do
    association :policy, factory: :climate_policy
    sequence(:code) { |n| "ind_code_#{n}" }
    category { 'Finance' }
    name { 'Funding for building institutional capacity' }
    attainment_date { '03/01/2016' }
    unit { 'USD' }
    responsible_authority { 'UNDP-GEF' }
    tracking_frequency { 'Annually' }
    tracking_notes { 'notes' }
    status { 'Attained' }

    sources { create_list(:climate_policy_source, 2) }
  end
end
