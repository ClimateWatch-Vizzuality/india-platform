class ImportClimatePolicies
  include ClimateWatchEngine::CSVImporter

  # rubocop:disable Layout/IndentArray
  headers policies: [
            :category, :code, :type, :title, :authority,
            :description, :tracking, :tracking_description,
            :status, :progress, :is_a_key_policy
          ],
          instruments: [
            :policy_code, :policy_scheme, :name, :description,
            :scheme, :status, :key_milestones,
            :implementation_entities, :broader_context, :sources
          ],
          indicators: [
            :policy_code, :code, :type, :name, :attainment_date, :unit,
            :responsible_authority, :tracking_frequency, :tracking_notes, :status,
            :target_text, :target_numeric, :target_year, :progress_display, :sources
          ],
          progress: [
            :indicator_code, :axis_x, :category, :value
          ],
          milestones: [
            :policy_code, :name, :responsible_authority, :date, :status, :source
          ],
          sources: [:code, :name, :description, :link]
  # rubocop:enable Layout/IndentArray

  POLICIES_FILEPATH = "#{CW_FILES_PREFIX}climate_policies/policies.csv".freeze
  INSTRUMENTS_FILEPATH = "#{CW_FILES_PREFIX}climate_policies/instruments.csv".freeze
  INDICATORS_FILEPATH = "#{CW_FILES_PREFIX}climate_policies/indicators.csv".freeze
  PROGRESS_FILEPATH = "#{CW_FILES_PREFIX}climate_policies/snapshot_of_progress_records.csv".freeze
  MILESTONES_FILEPATH = "#{CW_FILES_PREFIX}climate_policies/milestones.csv".freeze
  SOURCES_FILEPATH = "#{CW_FILES_PREFIX}climate_policies/sources.csv".freeze

  def call
    return unless all_headers_valid?

    ActiveRecord::Base.transaction do
      cleanup
      import_sources
      import_policies
      import_instruments
      import_indicators
      import_milestones
      import_progress_records
    end
  end

  private

  def all_headers_valid?
    [
      valid_headers?(policies_csv, POLICIES_FILEPATH, headers[:policies]),
      valid_headers?(instruments_csv, INSTRUMENTS_FILEPATH, headers[:instruments]),
      valid_headers?(indicators_csv, INDICATORS_FILEPATH, headers[:indicators]),
      valid_headers?(progress_csv, PROGRESS_FILEPATH, headers[:progress]),
      valid_headers?(milestones_csv, MILESTONES_FILEPATH, headers[:milestones]),
      valid_headers?(sources_csv, SOURCES_FILEPATH, headers[:sources])
    ].all?(true)
  end

  def cleanup
    ClimatePolicy::Source.delete_all
    ClimatePolicy::Policy.delete_all
    ClimatePolicy::Instrument.delete_all
    ClimatePolicy::ProgressRecord.delete_all
    ClimatePolicy::Indicator.delete_all
    ClimatePolicy::Milestone.delete_all
  end

  def sources_csv
    @sources_csv ||= S3CSVReader.read(SOURCES_FILEPATH)
  end

  def policies_csv
    @policies_csv ||= S3CSVReader.read(POLICIES_FILEPATH)
  end

  def instruments_csv
    @instruments_csv ||= S3CSVReader.read(INSTRUMENTS_FILEPATH)
  end

  def indicators_csv
    @indicators_csv ||= S3CSVReader.read(INDICATORS_FILEPATH)
  end

  def milestones_csv
    @milestones_csv ||= S3CSVReader.read(MILESTONES_FILEPATH)
  end

  def progress_csv
    @progress_csv ||= S3CSVReader.read(PROGRESS_FILEPATH)
  end

  def import_sources
    import_each_with_logging(sources_csv, SOURCES_FILEPATH) do |row|
      ClimatePolicy::Source.create!(source_attributes(row))
    end
  end

  def source_attributes(row)
    {
      code: row[:code],
      name: row[:name],
      description: row[:description],
      link: row[:link]
    }
  end

  def import_policies
    import_each_with_logging(policies_csv, POLICIES_FILEPATH) do |row|
      ClimatePolicy::Policy.create!(climate_policy_attributes(row))
    end
  end

  def climate_policy_attributes(row)
    {
      code: row[:code],
      policy_type: row[:type],
      sector: normalize_policy_sector(row[:category]),
      title: row[:title],
      description: row[:description],
      authority: row[:authority],
      tracking: row[:tracking]&.downcase == 'yes',
      tracking_description: row[:tracking_description],
      status: row[:status],
      progress: row[:progress],
      key_policy: row[:is_a_key_policy]&.downcase == 'yes'
    }
  end

  def normalize_policy_sector(category)
    return 'Other' if category.nil? || category == '?'

    category
  end

  def import_instruments
    import_each_with_logging(instruments_csv, INSTRUMENTS_FILEPATH) do |row|
      ClimatePolicy::Instrument.create!(instrument_attributes(row)) do |i|
        assign_sources(i, row)
      end
    end
  end

  def instrument_attributes(row)
    {
      policy: find_policy!(row[:policy_code]),
      policy_scheme: row[:policy_scheme],
      name: row[:name],
      description: row[:description],
      scheme: row[:scheme],
      policy_status: row[:status],
      key_milestones: row[:key_milestones],
      implementation_entities: row[:implementation_entities],
      broader_context: row[:broader_context]
    }
  end

  def import_indicators
    import_each_with_logging(indicators_csv, INDICATORS_FILEPATH) do |row|
      ClimatePolicy::Indicator.create!(indicator_attributes(row)) do |i|
        assign_sources(i, row)
      end
    end
  end

  def indicator_attributes(row)
    {
      policy: find_policy!(row[:policy_code]),
      code: row[:code],
      category: row[:type]&.titleize,
      name: row[:name],
      attainment_date: normalize_date(row[:attainment_date]),
      unit: row[:unit],
      responsible_authority: row[:responsible_authority],
      tracking_frequency: row[:tracking_frequency],
      tracking_notes: row[:tracking_notes],
      target_text: row[:target_text],
      target_numeric: row[:target_numeric]&.delete('%,', ',')&.to_f,
      target_year: row[:target_year],
      progress_display: row[:progress_display],
      status: row[:status]
    }
  end

  def import_milestones
    import_each_with_logging(milestones_csv, MILESTONES_FILEPATH) do |row|
      ClimatePolicy::Milestone.create!(milestone_attributes(row))
    end
  end

  def milestone_attributes(row)
    {
      policy: find_policy!(row[:policy_code]),
      name: row[:name],
      responsible_authority: row[:responsible_authority],
      date: normalize_date(row[:date]),
      source: find_source!(row[:source]),
      status: row[:status]
    }
  end

  def import_progress_records
    import_each_with_logging(progress_csv, PROGRESS_FILEPATH) do |row|
      ClimatePolicy::ProgressRecord.create!(progress_attributes(row))
    end
  end

  def progress_attributes(row)
    {
      indicator: find_indicator!(row[:indicator_code]),
      axis_x: row[:axis_x],
      category: row[:category],
      value: row[:value]&.delete('%,', ',')&.to_f,
      target: parse_target(row[:target])
    }
  end

  # we want to raise an error when source is not found
  def assign_sources(record, row)
    sources = row[:sources]

    return unless sources.present?

    row[:sources].
      split(',').
      map(&:strip).
      map(&:squish).
      each { |source| record.sources << find_source!(source) }
  end

  def find_source!(code)
    return unless code.present?

    ClimatePolicy::Source.find_by!(code: code)
  rescue ActiveRecord::RecordNotFound
    raise "Couldn't find source: #{code}"
  end

  def find_policy!(code)
    return unless code.present?

    ClimatePolicy::Policy.find_by!(code: code)
  rescue ActiveRecord::RecordNotFound
    raise "Couldn't find policy: #{code}"
  end

  def find_indicator!(code)
    return unless code.present?

    ClimatePolicy::Indicator.find_by!(code: code)
  rescue ActiveRecord::RecordNotFound
    raise "Couldn't find indicator: #{code}"
  end

  def normalize_date(date)
    return if date.nil?

    expected_formats = ['%b-%y', '%b-%Y', '%B-%y', '%B-%Y',
                        '%y-%b', '%Y-%b', '%y-%B', '%Y-%B']

    expected_formats.map { |format| parse_date(date, format) }.compact.first || date
  end

  def parse_target(target)
    ignore = 'no specific target'
    target&.remove(ignore)
  end

  def parse_date(date, format)
    Date.strptime(date, format)
  rescue ArgumentError
    nil
  end
end
