module ClimatePolicy
  class Source < ApplicationRecord
    validates :code, presence: true, uniqueness: true
  end
end
