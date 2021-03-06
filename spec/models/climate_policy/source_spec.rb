require 'rails_helper'

RSpec.describe ClimatePolicy::Source, type: :model do
  subject { FactoryBot.build(:climate_policy_source) }

  it 'should be invalid when code not present' do
    subject.code = nil
    expect(subject).to have(1).errors_on(:code)
  end

  it 'should be invalid when code is taken' do
    FactoryBot.create(:climate_policy_source, code: 'code')
    subject.code = 'code'
    expect(
      subject
    ).to have(1).errors_on(:code)
  end

  it 'should be valid' do
    expect(subject).to be_valid
  end
end
