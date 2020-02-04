# == Schema Information
#
# Table name: climate_policy_milestones
#
#  id                    :bigint(8)        not null, primary key
#  date                  :string
#  name                  :string
#  responsible_authority :text
#  status                :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  policy_id             :bigint(8)
#  source_id             :bigint(8)
#
# Indexes
#
#  index_climate_policy_milestones_on_policy_id  (policy_id)
#  index_climate_policy_milestones_on_source_id  (source_id)
#
# Foreign Keys
#
#  fk_rails_...  (policy_id => climate_policy_policies.id) ON DELETE => cascade
#  fk_rails_...  (source_id => climate_policy_sources.id) ON DELETE => cascade
#

module ClimatePolicy
  class Milestone < ApplicationRecord
    belongs_to :policy
    belongs_to :source, optional: true
  end
end
