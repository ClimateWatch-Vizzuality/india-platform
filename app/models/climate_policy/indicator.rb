module ClimatePolicy
  class Indicator < ApplicationRecord
    belongs_to :policy
  end
end
