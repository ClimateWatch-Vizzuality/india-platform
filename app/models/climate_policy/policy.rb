# == Schema Information
#
# Table name: climate_policy_policies
#
#  id                   :bigint(8)        not null, primary key
#  authority            :text
#  code                 :string           not null
#  description          :text
#  policy_type          :string           not null
#  sector               :string           not null
#  title                :text             not null
#  tracking             :boolean
#  tracking_description :text
#
# Indexes
#
#  index_climate_policy_policies_on_code  (code) UNIQUE
#

module ClimatePolicy
  class Policy < ApplicationRecord
    has_many :instruments
    has_many :indicators
    has_many :milestones

    validates_presence_of :sector, :code, :policy_type, :title
    validates :code, uniqueness: true
  end
end
