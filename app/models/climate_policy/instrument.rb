module ClimatePolicy
  class Instrument < ApplicationRecord
    belongs_to :policy

    validates_presence_of :code, :name
    validates :code, uniqueness: true
  end
end
