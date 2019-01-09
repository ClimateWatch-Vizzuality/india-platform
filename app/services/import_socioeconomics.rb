class ImportSocioeconomics
  include ClimateWatchEngine::CSVImporter

  headers indicators: [:ind_code, :indicator, :category, :unit, :definition],
          values: [:iso_code3, :ind_code, :source]

  INDICATORS_FILEPATH = "#{CW_FILES_PREFIX}socioeconomic/indicators.csv".freeze
  VALUES_FILEPATH = "#{CW_FILES_PREFIX}socioeconomic/values.csv".freeze
  SECTORAL_INFO_FILEPATH = "#{CW_FILES_PREFIX}socioeconomic/sectoral_info.csv".freeze

  def call
    return unless all_headers_valid?

    ActiveRecord::Base.transaction do
      cleanup

      import_indicators
      import_values(values_csv, VALUES_FILEPATH)
      import_values(sectoral_info_csv, SECTORAL_INFO_FILEPATH)
    end
  end

  private

  def cleanup
    Socioeconomic::Value.delete_all
    Socioeconomic::Indicator.delete_all
  end

  def all_headers_valid?
    [
      valid_headers?(indicators_csv, INDICATORS_FILEPATH, headers[:indicators]),
      valid_headers?(values_csv, VALUES_FILEPATH, headers[:values]),
      valid_headers?(sectoral_info_csv, SECTORAL_INFO_FILEPATH, headers[:values])
    ].all?(true)
  end

  def indicators_csv
    @indicators_csv ||= S3CSVReader.read(INDICATORS_FILEPATH)
  end

  def values_csv
    @values_csv ||= S3CSVReader.read(VALUES_FILEPATH)
  end

  def sectoral_info_csv
    @sectoral_info_csv ||= S3CSVReader.read(SECTORAL_INFO_FILEPATH)
  end

  def import_indicators
    import_each_with_logging(indicators_csv, INDICATORS_FILEPATH) do |row|
      Socioeconomic::Indicator.create!(
        code: row[:ind_code],
        category: row[:category],
        name: row[:indicator],
        unit: row[:unit],
        definition: row[:definition]
      )
    end
  end

  def import_values(csv, filepath)
    import_each_with_logging(csv, filepath) do |row|
      Socioeconomic::Value.create!(
        location: Location.find_by(iso_code3: row[:iso_code3]),
        indicator: Socioeconomic::Indicator.find_by(code: row[:ind_code]),
        category: row[:category],
        source: row[:source],
        values: values(row)
      )
    end
  end

  def values(row)
    to_year_value = ->(year) { {year: year.to_s, value: row[year]&.delete('%,', ',')&.to_f} }
    row.headers.grep(/\d{4}/).map(&to_year_value).reject { |v| v[:value].blank? }
  end
end
