namespace :climate_finance do
  desc 'Imports climate finance data'
  task import: :environment do
    TimedLogger.log('import climate finance data') do
      ImportClimateFinances.new.call
    end
  end
end
