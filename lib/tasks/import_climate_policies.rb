namespace :climate_policies do
  desc 'Imports climate policies'
  task import: :environment do
    TimedLogger.log('import climate policies') do
      ImportClimatePolicies.new.call
    end
  end
end
