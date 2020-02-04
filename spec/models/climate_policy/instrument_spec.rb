require 'rails_helper'

RSpec.describe ClimatePolicy::Instrument, type: :model do
  subject { FactoryBot.build(:climate_policy_instrument) }

  it 'should be invalid when policy not present' do
    subject.policy = nil
    expect(subject).to have(1).errors_on(:policy)
  end

  it 'should be invalid when name not present' do
    subject.name = nil
    expect(subject).to have(1).errors_on(:name)
  end

  it 'should be valid' do
    expect(subject).to be_valid
  end
end
