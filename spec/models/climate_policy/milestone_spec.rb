require 'rails_helper'

RSpec.describe ClimatePolicy::Milestone, type: :model do
  subject { FactoryBot.build(:climate_policy_milestone) }

  it 'should be invalid when policy not present' do
    subject.policy = nil
    expect(subject).to have(1).errors_on(:policy)
  end

  it 'should be valid' do
    expect(subject).to be_valid
  end
end
