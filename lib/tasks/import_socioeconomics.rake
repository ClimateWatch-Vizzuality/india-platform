namespace :socioeconomic do
  desc 'Imports Socioeconomic'
  task import: :environment do
    TimedLogger.log('import socioeconomic') do
      ImportSocioeconomics.new.call
    end
  end
end
