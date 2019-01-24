FactoryBot.define do
  factory :climate_policy_progress_record, class: 'ClimatePolicy::ProgressRecord' do
    association :indicator, factory: :climate_policy_indicator
    axis_x { '2013' }
    category { 'Category' }
    value { 222 }
  end
end
