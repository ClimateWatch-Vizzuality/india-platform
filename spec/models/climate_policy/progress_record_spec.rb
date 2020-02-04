require 'rails_helper'

RSpec.describe ClimatePolicy::ProgressRecord, type: :model do
  subject { FactoryBot.build(:climate_policy_progress_record) }

  it 'should be invalid when indicator not present' do
    subject.indicator = nil
    expect(subject).to have(1).errors_on(:indicator)
  end

  it 'should be invalid when value not present' do
    subject.value = nil
    expect(subject).to have(1).errors_on(:value)
  end

  it 'should be valid' do
    expect(subject).to be_valid
  end
end
