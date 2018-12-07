FactoryBot.define do
  factory :climate_policy, class: 'ClimatePolicy::Policy' do
    sector { 'Energy' }
    sequence(:code) { |n| "code_#{n}" }
    policy_type { 'Policy Instrument' }
    title { 'Energy Conservation Building Code' }
    authority { 'Bureau of Energy Efficiency and Ministry of Power' }
    description { 'description' }
    tracking { true }
    tracking_description { 'tracking description' }

    trait :with_indicators do
      after(:create) do |policy|
        create_list :climate_policy_indicator, 2, policy: policy
      end
    end

    trait :with_instruments do
      after(:create) do |policy|
        create_list :climate_policy_instrument, 2, policy: policy
      end
    end
  end
end
