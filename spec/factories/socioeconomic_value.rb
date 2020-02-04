FactoryBot.define do
  factory :socioeconomic_value, class: 'Socioeconomic::Value' do
    association :indicator, factory: :socioeconomic_indicator
    location
    values {
      [
        {year: '2014', value: '22'},
        {year: '2015', value: '25'}
      ]
    }
  end
end
