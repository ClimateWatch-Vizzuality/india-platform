require 'rails_helper'

correct_files = {
  ImportClimatePolicies::POLICIES_FILEPATH => <<~END_OF_CSV,
    Category,p_code,Type_policy,Title_policy,Authority_policy,Description_policy,tracking,tracking_description
    Buildings,ECBC,Policy Instrument,Energy Conservation Building Code,Bureau of Energy Efficiency and Ministry of Power,description,Yes,tracking description
    Energy,NSM,Policy,Jawaharlal Nehru National Solar Mission,Ministry of New and Renewable Energy (MNRE),description,No,tracking description
  END_OF_CSV
  ImportClimatePolicies::INSTRUMENTS_FILEPATH => <<~END_OF_CSV,
    p_code,p_scheme,i_code,s_name_instrument,description_instrument,Scheme_instrument,status_instrument,milestone_instrument,entities_instrument,context_instrument,source
    ECBC,Energy Conservation Building Code,ECBC.1,ECBC,description of the instrument, scheme for the instrument, instrument status,key milestones,entities description,broader context description,source
  END_OF_CSV
}
missing_headers = {
  ImportClimatePolicies::POLICIES_FILEPATH => <<~END_OF_CSV,
    Category,Type_policy,Title_policy,Authority_policy,Description_policy,tracking,tracking_description
    Buildings,ECBC,Policy Instrument,Energy Conservation Building Code,Bureau of Energy Efficiency and Ministry of Power,description,Yes,tracking description
    Energy,NSM,Policy,Jawaharlal Nehru National Solar Mission,Ministry of New and Renewable Energy (MNRE),description,No,tracking description
  END_OF_CSV
  ImportClimatePolicies::INSTRUMENTS_FILEPATH => <<~END_OF_CSV,
    i_code,s_name_instrument,description_instrument,Scheme_instrument,status_instrument,milestone_instrument,entities_instrument,context_instrument,source
    ECBC,Energy Conservation Building Code,ECBC.1,ECBC,description of the instrument, scheme for the instrument, instrument status,key milestones,entities description,broader context description,source
  END_OF_CSV
}

RSpec.describe ImportClimatePolicies do
  subject { ImportClimatePolicies.new.call }

  after :all do
    Aws.config[:s3] = {
      stub_responses: nil
    }
  end

  context 'when file is correct' do
    before :all do
      stub_with_files(correct_files)
    end

    it 'Creates new policies' do
      expect { subject }.to change { ClimatePolicy::Policy.count }.by(2)
    end

    it 'Creates new instruments' do
      expect { subject }.to change { ClimatePolicy::Instrument.count }.by(1)
    end

    describe 'Imported record' do
      before { ImportClimatePolicies.new.call }

      describe 'policy' do
        subject { ClimatePolicy::Policy.find_by(sector: 'Buildings') }

        it 'has all attributes populated' do
          subject.attributes.each do |attr, value|
            expect(value).not_to be_nil, "#{attr} not to be nil"
          end
        end
      end

      describe 'instrument' do
        subject { ClimatePolicy::Instrument.find_by(code: 'ECBC.1') }

        it 'has all attributes populated' do
          subject.attributes.each do |attr, value|
            expect(value).not_to be_nil, "#{attr} not to be nil"
          end
        end
      end
    end
  end

  context 'when headers are missing' do
    before :all do
      stub_with_files(missing_headers)
    end

    subject { ImportClimatePolicies.new }

    it 'does not create any policy' do
      expect { subject.call }.to change { ClimatePolicy::Policy.count }.by(0)
    end

    it 'does not create any instrument' do
      expect { subject.call }.to change { ClimatePolicy::Instrument.count }.by(0)
    end

    it 'has missing headers for policy file' do
      subject.call
      expected_error = {
        type: :missing_header,
        filename: File.basename(ImportClimatePolicies::POLICIES_FILEPATH)
      }
      expect(subject.errors).to include(hash_including(expected_error))
    end

    it 'has missing headers for instruments file' do
      subject.call
      expected_error = {
        type: :missing_header,
        filename: File.basename(ImportClimatePolicies::INSTRUMENTS_FILEPATH)
      }
      expect(subject.errors).to include(hash_including(expected_error))
    end
  end
end
