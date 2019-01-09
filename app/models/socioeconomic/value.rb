module Socioeconomic
  class Value < ApplicationRecord
    include ClimateWatchEngine::GenericToCsv

    belongs_to :location
    belongs_to :indicator
  end
end
