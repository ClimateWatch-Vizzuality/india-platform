require 'rails_helper'

RSpec.describe ImportClimatePolicies do
  def csv
    @csv ||= {
      policies: file_fixture('climate_policy/policies.csv').read,
      instruments: file_fixture('climate_policy/instruments.csv').read,
      indicators: file_fixture('climate_policy/indicators.csv').read,
      milestones: file_fixture('climate_policy/milestones.csv').read,
      sources: file_fixture('climate_policy/sources.csv').read
    }
  end

  def correct_files
    @correct_files ||= {
      ImportClimatePolicies::POLICIES_FILEPATH => csv[:policies],
      ImportClimatePolicies::INSTRUMENTS_FILEPATH => csv[:instruments],
      ImportClimatePolicies::INDICATORS_FILEPATH => csv[:indicators],
      ImportClimatePolicies::MILESTONES_FILEPATH => csv[:milestones],
      ImportClimatePolicies::SOURCES_FILEPATH => csv[:sources]
    }
  end

  def missing_headers
    @missing_headers ||= {
      ImportClimatePolicies::POLICIES_FILEPATH => remove_headers(csv[:policies], :category),
      ImportClimatePolicies::INSTRUMENTS_FILEPATH => remove_headers(csv[:instruments], :code),
      ImportClimatePolicies::INDICATORS_FILEPATH => remove_headers(csv[:indicators], :name, :type),
      ImportClimatePolicies::MILESTONES_FILEPATH => remove_headers(csv[:milestones], :name),
      ImportClimatePolicies::SOURCES_FILEPATH => remove_headers(csv[:sources], :name)
    }
  end

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

    it 'Creates new indicators' do
      expect { subject }.to change { ClimatePolicy::Indicator.count }.by(2)
    end

    it 'Creates new milestone' do
      expect { subject }.to change { ClimatePolicy::Milestone.count }.by(2)
    end

    it 'Creates new source' do
      expect { subject }.to change { ClimatePolicy::Source.count }.by(2)
    end

    describe 'Imported record' do
      before { ImportClimatePolicies.new.call }

      describe 'policy' do
        subject { ClimatePolicy::Policy.find_by!(sector: 'Buildings') }

        it 'has all attributes populated' do
          subject.attributes.each do |attr, value|
            expect(value).not_to be_nil, "#{attr} not to be nil"
          end
        end
      end

      describe 'instrument' do
        subject { ClimatePolicy::Instrument.find_by!(code: 'ECBC.1') }

        it 'has all attributes populated' do
          subject.attributes.each do |attr, value|
            expect(value).not_to be_nil, "#{attr} not to be nil"
          end
        end
      end

      describe 'indicator' do
        subject { ClimatePolicy::Indicator.first! }

        it 'has all attributes populated' do
          subject.attributes.each do |attr, value|
            expect(value).not_to be_nil, "#{attr} not to be nil"
          end
        end
      end

      describe 'milestone' do
        subject { ClimatePolicy::Milestone.first! }

        it 'has all attributes populated' do
          subject.attributes.each do |attr, value|
            expect(value).not_to be_nil, "#{attr} not to be nil"
          end
        end
      end

      describe 'source' do
        subject { ClimatePolicy::Source.first! }

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

    it 'does not create any indicator' do
      expect { subject.call }.to change { ClimatePolicy::Indicator.count }.by(0)
    end

    it 'does not create any milestone' do
      expect { subject.call }.to change { ClimatePolicy::Milestone.count }.by(0)
    end

    it 'does not create any source' do
      expect { subject.call }.to change { ClimatePolicy::Source.count }.by(0)
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

    it 'has missing headers for indicators file' do
      subject.call
      expected_error = {
        type: :missing_header,
        filename: File.basename(ImportClimatePolicies::INDICATORS_FILEPATH)
      }
      expect(subject.errors).to include(hash_including(expected_error))
    end

    it 'has missing headers for milestones file' do
      subject.call
      expected_error = {
        type: :missing_header,
        filename: File.basename(ImportClimatePolicies::MILESTONES_FILEPATH)
      }
      expect(subject.errors).to include(hash_including(expected_error))
    end

    it 'has missing headers for sources file' do
      subject.call
      expected_error = {
        type: :missing_header,
        filename: File.basename(ImportClimatePolicies::SOURCES_FILEPATH)
      }
      expect(subject.errors).to include(hash_including(expected_error))
    end
  end
end
