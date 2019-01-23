require 'rails_helper'

correct_files = {
  ImportClimateFinances::DATA_FILEPATH => <<~END_OF_CSV,
    year,source,unit,value
    2013,CIFs,USD million,299.91
    2014,CIFs,USD million,25
  END_OF_CSV
}
missing_headers = correct_files.merge(
  ImportClimateFinances::DATA_FILEPATH => <<~END_OF_CSV,
    source,unit,value
    2013,CIFs,USD million,299.91
    2014,CIFs,USD million,25
  END_OF_CSV
)

RSpec.describe ImportClimateFinances do
  let(:importer) { ImportClimateFinances.new }

  after :all do
    Aws.config[:s3] = {
      stub_responses: nil
    }
  end

  context 'when file is correct' do
    before :all do
      stub_with_files(correct_files)
    end

    subject { importer.call }

    it 'Creates new climate finance records' do
      expect { subject }.to change { ClimateFinance.count }.by(2)
    end

    describe 'Imported record' do
      before { importer.call }

      subject { ClimateFinance.find_by(source: 'CIFs') }

      it 'has all attributes populated' do
        subject.attributes.each do |attr, value|
          expect(value).not_to be_nil, "attribute #{attr} expected to not be nil"
        end
      end
    end
  end

  context 'when headers are missing' do
    before :all do
      stub_with_files(missing_headers)
    end

    it 'does not create any record' do
      expect { importer.call }.to change { ClimateFinance.count }.by(0)
    end

    it 'has missing headers errors' do
      importer.call
      expect(importer.errors.length).to eq(1)
      expect(importer.errors.first).to include(type: :missing_header)
    end
  end
end
