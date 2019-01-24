# == Schema Information
#
# Table name: climate_policy_indicators
#
#  id                    :bigint(8)        not null, primary key
#  attainment_date       :string
#  category              :string
#  code                  :string
#  name                  :text
#  responsible_authority :text
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
#  index_climate_policy_indicators_on_code       (code) UNIQUE
#  index_climate_policy_indicators_on_policy_id  (policy_id)
#
# Foreign Keys
#
#  fk_rails_...  (policy_id => climate_policy_policies.id) ON DELETE => cascade
#

module ClimatePolicy
  class Indicator < ApplicationRecord
    belongs_to :policy
    has_and_belongs_to_many :sources

    validates :code, uniqueness: true
  end
end
