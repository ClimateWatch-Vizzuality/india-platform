# == Schema Information
#
# Table name: climate_policy_sources
#
#  id          :bigint(8)        not null, primary key
#  code        :string           not null
#  description :string
#  link        :text
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_climate_policy_sources_on_code  (code) UNIQUE
#

module ClimatePolicy
  class Source < ApplicationRecord
    has_and_belongs_to_many :instruments
    has_and_belongs_to_many :indicators
    has_and_belongs_to_many :policies
    has_many :milestones

    validates :code, presence: true, uniqueness: true
  end
end
