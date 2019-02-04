# == Schema Information
#
# Table name: climate_policy_progress_records
#
#  id           :bigint(8)        not null, primary key
#  axis_x       :string
#  category     :string
#  target       :string
#  value        :float            not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  indicator_id :bigint(8)
#
# Indexes
#
#  index_climate_policy_progress_records_on_indicator_id  (indicator_id)
#
# Foreign Keys
#
#  fk_rails_...  (indicator_id => climate_policy_indicators.id) ON DELETE => cascade
#

module ClimatePolicy
  class ProgressRecord < ApplicationRecord
    belongs_to :indicator

    validates_presence_of :value
  end
end
