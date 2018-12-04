require 'rails_helper'

correct_files = {
  ImportClimatePolicies::DATA_FILEPATH => <<~END_OF_CSV,
    Category,p_code,Type_policy,Title_policy,Authority_policy,Description_policy,tracking,tracking_description
    Buildings,ECBC,Policy Instrument,Energy Conservation Building Code,Bureau of Energy Efficiency and Ministry of Power,description,Yes,tracking description
    Energy,NSM,Policy,Jawaharlal Nehru National Solar Mission,Ministry of New and Renewable Energy (MNRE),description,No,tracking description
  END_OF_CSV
}
missing_headers = {
  ImportClimatePolicies::DATA_FILEPATH => <<~END_OF_CSV,
    Category,Type_policy,Title_policy,Authority_policy,Description_policy,tracking,tracking_description
    Buildings,ECBC,Policy Instrument,Energy Conservation Building Code,Bureau of Energy Efficiency and Ministry of Power,description,Yes,tracking description
    Energy,NSM,Policy,Jawaharlal Nehru National Solar Mission,Ministry of New and Renewable Energy (MNRE),description,No,tracking description
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

    it 'Creates new data source records' do
      expect { subject }.to change { ClimatePolicy::Policy.count }.by(2)
    end

    describe 'Imported record' do
      before { subject }

      let(:imported_record) { ClimatePolicy::Policy.find_by(sector: 'Buildings') }

      it 'has all attributes populated' do
        expect(imported_record.attributes.values).to all(be_truthy)
      end

      it 'has tracking set to true' do
        expect(imported_record.tracking).to be(true)
      end
    end
  end

  context 'when headers are missing' do
    before :all do
      stub_with_files(missing_headers)
    end

    subject { ImportClimatePolicies.new }

    it 'does not create any record' do
      expect { subject.call }.to change { ClimatePolicy::Policy.count }.by(0)
    end

    it 'has missing headers errors' do
      subject.call
      expect(subject.errors.length).to be(1)
      expect(subject.errors.first).to include(type: :missing_header)
    end
  end
end
