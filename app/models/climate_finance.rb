# == Schema Information
#
# Table name: climate_finances
#
#  id         :bigint(8)        not null, primary key
#  source     :string           not null
#  unit       :string           not null
#  value      :float            not null
#  year       :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class ClimateFinance < ApplicationRecord
  include ClimateWatchEngine::GenericToCsv

  validates_presence_of :source, :year, :unit, :value
end
