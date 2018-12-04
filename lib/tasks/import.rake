namespace :db do
  desc 'Imports everything'
  task import: :environment do
    # TODO: Files not ready yet in S3, importers not checked against actual data
    # Rake::Task['locations:import'].invoke
    # Rake::Task['location_members:import'].invoke
    # Rake::Task['historical_emissions:import'].invoke
    Rake::Task['climate_policies:import'].invoke
    puts 'All done!'
  end
end
