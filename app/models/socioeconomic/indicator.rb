module Socioeconomic
  class Indicator < ApplicationRecord
    validates_presence_of :name, :code, :unit
    validates :code, uniqueness: true
  end
end
