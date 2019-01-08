FactoryBot.define do
  factory :socioeconomic_value, class: 'Socioeconomic::Value' do
    association :indicator, factory: :socioeconomic_indicator
    location
  end
end
