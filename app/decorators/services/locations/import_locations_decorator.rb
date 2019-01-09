Locations::ImportLocations.class_eval do
  headers :wri_standard_name, :iso_code3, :location_type

  private

  def import_locations
    import_each_with_logging(csv, Locations.locations_filepath) do |row|
      create_or_update(location_attributes(row))
    end
  end

  def location_attributes(row)
    {
      iso_code3: iso_code3(row),
      iso_code2: iso_code3(row),
      wri_standard_name: row[:wri_standard_name],
      location_type: row[:location_type] || 'COUNTRY'
    }
  end
end
