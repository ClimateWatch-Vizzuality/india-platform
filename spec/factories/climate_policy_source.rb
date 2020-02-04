FactoryBot.define do
  factory :climate_policy_source, class: 'ClimatePolicy::Source' do
    sequence(:code) { |n| "code_#{n}" }
    name { 'source name' }
    description { 'source description' }
    link { 'https://example.com' }
  end
end
