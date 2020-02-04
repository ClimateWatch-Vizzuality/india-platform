FactoryBot.define do
  factory :socioeconomic_indicator, class: 'Socioeconomic::Indicator' do
    code { 'GDP_price' }
    name { 'GDP at current price' }
    unit { 'MW' }
  end
end
