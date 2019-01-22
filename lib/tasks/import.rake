namespace :db do
  desc 'Imports everything'
  task import: :environment do
    Rake::Task['locations:import'].invoke
    Rake::Task['historical_emissions:import'].invoke
    Rake::Task['climate_policies:import'].invoke
    Rake::Task['data_sources:import'].invoke
    Rake::Task['socioeconomic:import'].invoke
    Rake::Task['climate_finance:import'].invoke
    puts 'All done!'
  end
end
