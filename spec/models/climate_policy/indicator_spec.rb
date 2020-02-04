require 'rails_helper'

RSpec.describe ClimatePolicy::Indicator, type: :model do
  subject { FactoryBot.build(:climate_policy_indicator) }

  it 'should be invalid when policy not present' do
    subject.policy = nil
    expect(subject).to have(1).errors_on(:policy)
  end

  it 'should be invalid when code is taken' do
    FactoryBot.create(:climate_policy_indicator, code: 'code')
    subject.code = 'code'
    expect(
      subject
    ).to have(1).errors_on(:code)
  end

  it 'should be valid' do
    expect(subject).to be_valid
  end
end
