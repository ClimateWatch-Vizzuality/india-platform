class ImportClimatePolicies
  include ClimateWatchEngine::CSVImporter

  # rubocop:disable Layout/IndentArray
  headers policies: [
            :category, :p_code, :type_policy, :title_policy, :authority_policy,
            :description_policy, :tracking, :tracking_description
          ],
          instruments: [
            :p_code, :p_scheme, :i_code, :s_name_instrument, :description_instrument,
            :scheme_instrument, :status_instrument, :milestone_instrument,
            :entities_instrument, :context_instrument, :source
          ]
  # rubocop:enable Layout/IndentArray

  POLICIES_FILEPATH = "#{CW_FILES_PREFIX}climate_policies/policies.csv".freeze
  INSTRUMENTS_FILEPATH = "#{CW_FILES_PREFIX}climate_policies/instruments.csv".freeze

  def call
    return unless all_headers_valid?

    ActiveRecord::Base.transaction do
      cleanup
      import_policies
      import_policy_instruments
    end
  end

  private

  def all_headers_valid?
    [
      valid_headers?(policies_csv, POLICIES_FILEPATH, headers[:policies]),
      valid_headers?(instruments_csv, INSTRUMENTS_FILEPATH, headers[:instruments])
    ].all?(true)
  end

  def cleanup
    ClimatePolicy::Policy.delete_all
    ClimatePolicy::Instrument.delete_all
  end

  def policies_csv
    @policies_csv ||= S3CSVReader.read(POLICIES_FILEPATH)
  end

  def instruments_csv
    @instruments_csv ||= S3CSVReader.read(INSTRUMENTS_FILEPATH)
  end

  def import_policies
    import_each_with_logging(policies_csv, POLICIES_FILEPATH) do |row|
      ClimatePolicy::Policy.create!(climate_policy_attributes(row))
    end
  end

  def climate_policy_attributes(row)
    {
      code: row[:p_code],
      policy_type: row[:type_policy],
      sector: row[:category],
      title: row[:title_policy],
      description: row[:description_policy],
      authority: row[:authority_policy],
      tracking: row[:tracking]&.downcase == 'yes',
      tracking_description: row[:tracking_description]
    }
  end

  def import_policy_instruments
    import_each_with_logging(instruments_csv, INSTRUMENTS_FILEPATH) do |row|
      ClimatePolicy::Instrument.create!(instrument_attributes(row))
    end
  end

  def instrument_attributes(row)
    {
      policy: ClimatePolicy::Policy.find_by(code: row[:p_code]),
      code: row[:i_code],
      name: row[:s_name_instrument],
      description: row[:description_instrument],
      policy_scheme: row[:p_scheme],
      scheme: row[:scheme_instrument],
      policy_status: row[:status_instrument],
      key_milestones: row[:milestone_instrument],
      implementation_entities: row[:entities_instrument],
      broader_context: row[:context_instrument],
      source: row[:source]
    }
  end
end
