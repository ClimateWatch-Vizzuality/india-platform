FactoryBot.define do
  factory :climate_policy_indicator, class: 'ClimatePolicy::Indicator' do
    association :policy, factory: :climate_policy
    category { 'Finance' }
    name { 'Funding for building institutional capacity' }
    value { '1,475,000 (USD)' }
    attainment_date { '03/01/2016' }
    responsible_authority { 'UNDP-GEF' }
    tracking_frequency { 'Annually' }
    tracking_notes { 'notes' }
    status { 'Attained' }

    sources { create_list(:climate_policy_source, 2) }
  end
end
