# == Schema Information
#
# Table name: socioeconomic_values
#
#  id           :bigint(8)        not null, primary key
#  category     :string
#  source       :string
#  values       :jsonb
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  indicator_id :bigint(8)
#  location_id  :bigint(8)
#
# Indexes
#
#  index_socioeconomic_values_on_indicator_id  (indicator_id)
#  index_socioeconomic_values_on_location_id   (location_id)
#
# Foreign Keys
#
#  fk_rails_...  (indicator_id => socioeconomic_indicators.id) ON DELETE => cascade
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#

module Socioeconomic
  class Value < ApplicationRecord
    include ClimateWatchEngine::GenericToCsv

    belongs_to :location
    belongs_to :indicator
  end
end
