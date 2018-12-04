FactoryBot.define do
  factory :climate_policy, class: 'ClimatePolicy::Policy' do
    category { 'Energy' }
    code { 'ECBC' }
    policy_type { 'Policy Instrument' }
    title { 'Energy Conservation Building Code' }
    authority { 'Bureau of Energy Efficiency and Ministry of Power' }
    description { 'description' }
    tracking { true }
    tracking_description { 'tracking description' }
  end
end
