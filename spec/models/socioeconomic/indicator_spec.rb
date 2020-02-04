require 'rails_helper'

RSpec.describe Socioeconomic::Indicator, type: :model do
  it 'should be invalid when name not present' do
    expect(
      FactoryBot.build(:socioeconomic_indicator, name: nil)
    ).to have(1).errors_on(:name)
  end

  it 'should be invalid when code not present' do
    expect(
      FactoryBot.build(:socioeconomic_indicator, code: nil)
    ).to have(1).errors_on(:code)
  end

  it 'should be invalid when code is taken' do
    FactoryBot.create(:socioeconomic_indicator, code: 'code')
    expect(
      FactoryBot.build(:socioeconomic_indicator, code: 'code')
    ).to have(1).errors_on(:code)
  end

  it 'should be valid' do
    expect(FactoryBot.build(:socioeconomic_indicator)).to be_valid
  end
end
