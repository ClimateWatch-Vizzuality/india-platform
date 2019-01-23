# == Schema Information
#
# Table name: climate_policy_instruments
#
#  id                      :bigint(8)        not null, primary key
#  broader_context         :text
#  code                    :string           not null
#  description             :text
#  implementation_entities :text
#  key_milestones          :text
#  name                    :string           not null
#  policy_scheme           :string
#  policy_status           :text
#  scheme                  :text
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  policy_id               :bigint(8)
#
# Indexes
#
#  index_climate_policy_instruments_on_code       (code) UNIQUE
#  index_climate_policy_instruments_on_policy_id  (policy_id)
#
# Foreign Keys
#
#  fk_rails_...  (policy_id => climate_policy_policies.id) ON DELETE => cascade
#

module ClimatePolicy
  class Instrument < ApplicationRecord
    belongs_to :policy
    has_and_belongs_to_many :sources

    validates_presence_of :code, :name
    validates :code, uniqueness: true
  end
end
