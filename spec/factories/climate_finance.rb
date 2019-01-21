FactoryBot.define do
  factory :climate_finance do
    source { 'CIFs' }
    year { 2014 }
    value { 1000 }
    unit { 'USD million' }
  end
end
