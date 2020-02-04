require 'rails_helper'

RSpec.describe Socioeconomic::Value, type: :model do
  it 'should be valid' do
    expect(FactoryBot.build(:socioeconomic_value)).to be_valid
  end
end
