FactoryBot.define do
  factory :climate_policy_instrument, class: 'ClimatePolicy::Instrument' do
    association :policy, factory: :climate_policy
    sequence(:code) { |n| "code_#{n}" }
    policy_scheme { 'Energy Conservation Building Code' }
    name { 'ECBC' }
    description { 'policy instrument description' }
    scheme { 'policy instrument scheme' }
    policy_status { 'Launched' }
    key_milestones { 'Key milestones' }
    implementation_entities { 'Implementation entities' }
    broader_context { 'Some context here' }
    source { 'IER2017' }
  end
end
