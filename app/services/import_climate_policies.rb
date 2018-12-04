class ImportClimatePolicies
  include ClimateWatchEngine::CSVImporter

  headers :category, :p_code, :type_policy, :title_policy, :authority_policy,
          :description_policy, :tracking, :tracking_description

  DATA_FILEPATH = "#{CW_FILES_PREFIX}climate_policies/policies.csv".freeze

  def call
    return unless valid_headers?(csv, DATA_FILEPATH, headers)

    ActiveRecord::Base.transaction do
      cleanup
      import_data
    end
  end

  private

  def cleanup
    ClimatePolicy::Policy.delete_all
  end

  def csv
    @csv ||= S3CSVReader.read(DATA_FILEPATH)
  end

  def import_data
    import_each_with_logging(csv, DATA_FILEPATH) do |row|
      ClimatePolicy::Policy.create!(climate_policy_attributes(row))
    end
  end

  def climate_policy_attributes(row)
    {
      policy_type: row[:type_policy],
      category: row[:category],
      code: row[:p_code],
      title: row[:title_policy],
      description: row[:description_policy],
      authority: row[:authority_policy],
      tracking: row[:tracking]&.downcase == 'yes',
      tracking_description: row[:tracking_description]
    }
  end
end
