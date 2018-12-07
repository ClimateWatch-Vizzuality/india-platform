# == Schema Information
#
# Table name: climate_policy_indicators
#
#  id                    :bigint(8)        not null, primary key
#  attainment_date       :string
#  category              :string
#  data_source_link      :text
#  name                  :text
#  responsible_authority :text
#  sources               :text
#  status                :text
#  tracking_frequency    :string
#  tracking_notes        :text
#  value                 :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  policy_id             :bigint(8)
#
# Indexes
#
#  index_climate_policy_indicators_on_policy_id  (policy_id)
#
# Foreign Keys
#
#  fk_rails_...  (policy_id => climate_policy_policies.id) ON DELETE => cascade
#

module ClimatePolicy
  class Indicator < ApplicationRecord
    belongs_to :policy
  end
end
