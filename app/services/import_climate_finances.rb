class ImportClimateFinances
  include ClimateWatchEngine::CSVImporter

  headers :source, :year, :unit, :value

  DATA_FILEPATH = "#{CW_FILES_PREFIX}climate_finance/climate_finance.csv".freeze

  def call
    return unless all_headers_valid?

    ActiveRecord::Base.transaction do
      cleanup
      import_data
    end
  end

  private

  def all_headers_valid?
    valid_headers?(csv, DATA_FILEPATH, headers)
  end

  def cleanup
    ClimateFinance.delete_all
  end

  def import_data
    import_each_with_logging(csv, DATA_FILEPATH) do |row|
      ClimateFinance.create!(climate_finance_attributes(row))
    end
  end

  def climate_finance_attributes(row)
    {
      source: row[:source],
      year: row[:year]&.to_i,
      unit: row[:unit],
      value: row[:value]&.to_f
    }
  end

  def csv
    @csv ||= S3CSVReader.read(DATA_FILEPATH)
  end
end
