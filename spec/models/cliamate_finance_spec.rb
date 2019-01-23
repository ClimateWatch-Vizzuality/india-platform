require 'rails_helper'

RSpec.describe ClimateFinance, type: :model do
  it 'should be invalid when source not present' do
    expect(
      FactoryBot.build(:climate_finance, source: nil)
    ).to have(1).errors_on(:source)
  end

  it 'should be invalid when year not present' do
    expect(
      FactoryBot.build(:climate_finance, year: nil)
    ).to have(1).errors_on(:year)
  end

  it 'should be invalid when unit not present' do
    expect(
      FactoryBot.build(:climate_finance, unit: nil)
    ).to have(1).errors_on(:unit)
  end

  it 'should be invalid when value not present' do
    expect(
      FactoryBot.build(:climate_finance, value: nil)
    ).to have(1).errors_on(:value)
  end

  it 'should be valid' do
    expect(FactoryBot.build(:climate_finance)).to be_valid
  end
end
