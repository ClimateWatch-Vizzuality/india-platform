# == Schema Information
#
# Table name: socioeconomic_indicators
#
#  id         :bigint(8)        not null, primary key
#  category   :string
#  code       :string           not null
#  definition :string
#  name       :string           not null
#  unit       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_socioeconomic_indicators_on_code  (code) UNIQUE
#

module Socioeconomic
  class Indicator < ApplicationRecord
    validates_presence_of :name, :code, :unit
    validates :code, uniqueness: true
  end
end
