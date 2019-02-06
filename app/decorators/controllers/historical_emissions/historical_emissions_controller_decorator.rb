HistoricalEmissions::HistoricalEmissionsController.class_eval do
  def download
    data_sources = DataSource.where(short_title: sources)
    filter = HistoricalEmissions::Filter.new({})
    emissions_csv_content = HistoricalEmissions::CsvContent.new(filter).call

    render zip: {
      'historical_emissions.csv' => emissions_csv_content,
      'data_sources.csv' => data_sources.to_csv
    }
  end

  private

  def sources
    params[:source]&.split(',')
  end
end
