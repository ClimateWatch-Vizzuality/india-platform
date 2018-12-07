require 'rails_helper'

RSpec.describe ClimatePolicy::Policy, type: :model do
  subject { FactoryBot.build(:climate_policy) }

  it 'should be invalid when sector not present' do
    subject.sector = nil
    expect(subject).to have(1).errors_on(:sector)
  end

  it 'should be invalid when code not present' do
    subject.code = nil
    expect(subject).to have(1).errors_on(:code)
  end

  it 'should be invalid when policy type not present' do
    subject.policy_type = nil
    expect(subject).to have(1).errors_on(:policy_type)
  end

  it 'should be invalid when title not present' do
    subject.title = nil
    expect(subject).to have(1).errors_on(:title)
  end

  it 'should be invalid when code is taken' do
    FactoryBot.create(:climate_policy, code: 'code')
    subject.code = 'code'
    expect(
      subject
    ).to have(1).errors_on(:code)
  end

  it 'should be valid' do
    expect(subject).to be_valid
  end
end
