# coding: utf-8
require 'rails_helper'

correct_files = {
  ImportSocioeconomics::INDICATORS_FILEPATH => <<~END_OF_CSV,
    Ind_code,Indicator,category,Unit,Definition
    Export,Exports of Goods and Services At Constant Prices,,₹ Billion,1990-2011; Base Year : 2004; 2012-2017, Base Year : 2034
    Import,Import of Goods and Services At Constant Prices,,₹ Billion,1990-2011; Base Year : 2004; 2012-2017, Base Year : 2035
    energy_consumption,Energy consumption,,PJ,
    energy_consumption_cap,Per capita energy consumption,,MJ,
  END_OF_CSV
  ImportSocioeconomics::VALUES_FILEPATH => <<~END_OF_CSV,
    Source,ind_code,iso_code3,2015,2016,2017
    CSO,Export,IND,25121.75766607,23786.87407749,24860.07,
    CSO,Import,IND,26676.57553265,25107.52859992,25686.80,
  END_OF_CSV
  ImportSocioeconomics::SECTORAL_INFO_FILEPATH => <<~END_OF_CSV,
    Source,iso_code3,ind_code,category,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018
    PEC,IND,energy_consumption,,,,,,,16571,17878,18936,21408,22458,23872,25128,25755,27589,28258,,
    PEC,IND,energy_consumption_cap,,,,,,,14612,15577,16303,18212,18998,19567,20347,20588,21775,22042,,
  END_OF_CSV
}
missing_headers_files = correct_files.merge(
  ImportSocioeconomics::INDICATORS_FILEPATH => <<~END_OF_CSV,
    Indicator,category,Unit,Definition
    Export,Exports of Goods and Services At Constant Prices,₹ Billion,1990-2011; Base Year : 2004; 2012-2017, Base Year : 2034
    Import,Import of Goods and Services At Constant Prices,₹ Billion,1990-2011; Base Year : 2004; 2012-2017, Base Year : 2035
  END_OF_CSV
)
missing_locations_files = correct_files.merge(
  ImportSocioeconomics::VALUES_FILEPATH => <<~END_OF_CSV,
    Source,ind_code,iso_code3,2015,2016,2017
    CSO,Export,ID.AA,25121.75766607,23786.87407749,24860.07,
    CSO,Import,IND,26676.57553265,25107.52859992,25686.80,
  END_OF_CSV
)

RSpec.describe ImportSocioeconomics do
  let(:importer) { ImportSocioeconomics.new }

  before :each do
    FactoryBot.create(:location, iso_code3: 'IND')
  end

  after :all do
    Aws.config[:s3] = {
      stub_responses: nil
    }
  end

  context 'when file is correct' do
    subject { importer.call }

    before :all do
      stub_with_files(correct_files)
    end

    it 'importer has no errors' do
      subject
      expect(importer.errors).to be_empty
    end

    it 'Creates new indicators' do
      expect { subject }.to change { Socioeconomic::Indicator.count }.by(4)
    end

    it 'Creates new indicator values' do
      expect { subject }.to change { Socioeconomic::Value.count }.by(4)
    end
  end

  context 'when headers are missing' do
    before :all do
      stub_with_files(missing_headers_files)
    end

    it 'does not create any indicator' do
      expect { importer.call }.to change { Socioeconomic::Indicator.count }.by(0)
    end

    it 'does not create any indicator value' do
      expect { importer.call }.to change { Socioeconomic::Value.count }.by(0)
    end

    it 'has missing headers errors' do
      importer.call
      expect(importer.errors.length).to eq(1)
      expect(importer.errors.first).to include(type: :missing_header)
    end
  end

  context 'when location is missing for one row' do
    before :all do
      stub_with_files(missing_locations_files)
    end

    it 'does not create any indicator value with missing location' do
      # missing location in sectoral info file
      expect { importer.call }.to change { Socioeconomic::Value.count }.by(3)
    end

    it 'has errors on row' do
      importer.call
      expect(importer.errors.length).to eq(1)
      expect(importer.errors.first).to include(type: :invalid_row)
    end
  end
end
